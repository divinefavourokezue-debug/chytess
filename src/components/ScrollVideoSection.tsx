import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const MONOGRAM_LOGO_SRC = '/assets/aistudio/CHYTESS_Crowned_Couture_Monogram_57675c74.png';
const LOGO_DEPTH_LAYERS = 10;

const TOTAL_FRAMES = 480;
const PORTAL_COUNT = 18;
const PARTICLE_COUNT = 180;
const ECHO_COUNT = 3;
const DURATION_SECONDS = 20;

function frameSrc(index: number): string {
  const num = String(Math.min(TOTAL_FRAMES, Math.max(1, index + 1))).padStart(4, '0');
  return `/videos/frames/f-${num}.webp`;
}

function buildProgressiveOrder(): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (idx: number) => {
    if (idx >= 0 && idx < TOTAL_FRAMES && !seen.has(idx)) {
      seen.add(idx);
      order.push(idx);
    }
  };
  push(0);
  for (const step of [24, 8, 2, 1]) {
    for (let i = 0; i < TOTAL_FRAMES; i += step) {
      push(i);
    }
  }
  return order;
}

const PROGRESSIVE_ORDER = buildProgressiveOrder();

// Pre-allocated math helpers outside render loop (zero per-frame GC)
const _dummy = new THREE.Object3D();
const _mat4 = new THREE.Matrix4();
const _camForward = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _camUp = new THREE.Vector3();

export function ScrollVideoSection() {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const webglMountRef = useRef<HTMLDivElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: TOTAL_FRAMES }, () => null)
  );
  const loadedMaskRef = useRef<Uint8Array>(new Uint8Array(TOTAL_FRAMES));

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerSmoothRef = useRef({ x: 0, y: 0 });
  const shouldReduceMotionRef = useRef(false);
  const manualPlayingRef = useRef(false);

  const shouldReduceMotion = Boolean(useReducedMotion());
  shouldReduceMotionRef.current = shouldReduceMotion;

  const [hasStartedScroll, setHasStartedScroll] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [manualPlaying, setManualPlaying] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  manualPlayingRef.current = manualPlaying;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const fallbackLogoOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const fallbackLogoScale = useTransform(scrollYProgress, [0, 0.16], [1, 1.2]);
  const fallbackLogoY = useTransform(scrollYProgress, [0, 0.16], [0, -48]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    setHasStartedScroll(clamped > 0.012);
    const nextSec = Math.round(clamped * DURATION_SECONDS);
    setElapsedSeconds((prev) => (prev === nextSec ? prev : nextSec));
    if (!shouldReduceMotionRef.current) {
      targetProgressRef.current = clamped;
    }
  });

  // Progressive concurrent frame preloader
  useEffect(() => {
    let cancelled = false;
    let cursor = 0;
    const CONCURRENCY = 12;

    const loadNext = () => {
      if (cancelled || cursor >= PROGRESSIVE_ORDER.length) return;
      const idx = PROGRESSIVE_ORDER[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(idx);

      const markReady = () => {
        if (cancelled) return;
        framesRef.current[idx] = img;
        loadedMaskRef.current[idx] = 1;
        loadNext();
      };

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(markReady).catch(markReady);
        } else {
          markReady();
        }
      };
      img.onerror = () => loadNext();
    };

    for (let i = 0; i < CONCURRENCY; i++) {
      loadNext();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Pointer 3D camera & emblem parallax
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
      pointerTargetRef.current.x = nx;
      pointerTargetRef.current.y = ny;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  // Three.js Full-Bleed Architectural 3D Runway Descent + Floating Opening 3D Logo
  useEffect(() => {
    const mount = webglMountRef.current;
    if (!mount) return;

    const getClosestFrame = (idx: number): HTMLImageElement | null => {
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
      if (loadedMaskRef.current[clamped] && framesRef.current[clamped]) {
        return framesRef.current[clamped];
      }
      for (let off = 1; off < TOTAL_FRAMES; off++) {
        const b = clamped - off;
        if (b >= 0 && loadedMaskRef.current[b] && framesRef.current[b]) {
          return framesRef.current[b];
        }
        const f = clamped + off;
        if (f < TOTAL_FRAMES && loadedMaskRef.current[f] && framesRef.current[f]) {
          return framesRef.current[f];
        }
      }
      return null;
    };

    const startFallback2DLoop = () => {
      setWebglUnavailable(true);
      const fallbackCanvas = fallbackCanvasRef.current;
      const ctx = fallbackCanvas?.getContext('2d') || null;
      let raf = 0;
      let stopped = false;
      let prevTime = performance.now();
      let lastFrame = -1;
      let reducedFrame = 0;

      const sizeCanvas = () => {
        if (!fallbackCanvas) return;
        const w = Math.max(1, mount.clientWidth);
        const h = Math.max(1, mount.clientHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        fallbackCanvas.width = Math.round(w * dpr);
        fallbackCanvas.height = Math.round(h * dpr);
      };
      sizeCanvas();
      window.addEventListener('resize', sizeCanvas, { passive: true });

      const poster = new Image();
      poster.src = '/videos/hero-poster.jpg';
      const drawFrameImage = (img: HTMLImageElement) => {
        if (!fallbackCanvas || !ctx || img.naturalWidth <= 0) return;
        const cw = fallbackCanvas.width;
        const ch = fallbackCanvas.height;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = cw / Math.max(1, ch);
        let drawW = cw;
        let drawH = ch;
        let dx = 0;
        let dy = 0;
        if (canvasAspect > imgAspect) {
          drawH = cw / imgAspect;
          dy = (ch - drawH) * 0.5;
        } else {
          drawW = ch * imgAspect;
          dx = (cw - drawW) * 0.5;
        }
        ctx.drawImage(img, dx, dy, drawW, drawH);
      };
      poster.onload = () => {
        if (lastFrame < 0) drawFrameImage(poster);
      };

      const drawFallback = (now: number) => {
        if (stopped) return;
        const delta = Math.min(0.1, Math.max(0.001, (now - prevTime) / 1000));
        prevTime = now;
        if (shouldReduceMotionRef.current) {
          if (manualPlayingRef.current) {
            reducedFrame = (reducedFrame + delta * 24) % TOTAL_FRAMES;
            smoothProgressRef.current = reducedFrame / (TOTAL_FRAMES - 1);
          }
        } else {
          smoothProgressRef.current = THREE.MathUtils.damp(
            smoothProgressRef.current,
            targetProgressRef.current,
            7.5,
            delta
          );
        }
        const progress = smoothProgressRef.current;
        const frameIdx = Math.round(progress * (TOTAL_FRAMES - 1));
        if (frameIdx !== lastFrame) {
          const img = getClosestFrame(frameIdx);
          if (img && img.naturalWidth > 0) {
            drawFrameImage(img);
            lastFrame = frameIdx;
          }
        }
        raf = window.requestAnimationFrame(drawFallback);
      };
      raf = window.requestAnimationFrame(drawFallback);

      return () => {
        stopped = true;
        window.cancelAnimationFrame(raf);
        window.removeEventListener('resize', sizeCanvas);
      };
    };

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);
    const baseFov = 45;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return startFallback2DLoop();
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x130204);
    scene.fog = new THREE.FogExp2(0x130204, 0.042);

    const camera = new THREE.PerspectiveCamera(baseFov, width / height, 0.1, 160);
    camera.position.set(0, 0, 5.0);

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    // Studio reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Couture lighting rig
    const hemiLight = new THREE.HemisphereLight(0xfef7dc, 0x2b0407, 1.0);
    scene.add(hemiLight);
    const keyLight = new THREE.DirectionalLight(0xffe49c, 1.7);
    keyLight.position.set(5, 8, 9);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x9e1b24, 1.5);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    // Video frame texture
    const videoCanvas = document.createElement('canvas');
    videoCanvas.width = 640;
    videoCanvas.height = 360;
    const videoCtx = videoCanvas.getContext('2d');
    const posterImg = new Image();
    posterImg.src = '/videos/hero-poster.jpg';
    posterImg.onload = () => {
      if (videoCtx) {
        videoCtx.drawImage(posterImg, 0, 0, videoCanvas.width, videoCanvas.height);
        videoTexture.needsUpdate = true;
      }
    };

    const videoTexture = new THREE.CanvasTexture(videoCanvas);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;

    // 3D Stage Group (curved cinema monolith + metallic chassis + depth echo layers + floor reflection)
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const screenGeom = new THREE.PlaneGeometry(1, 1, 72, 48);
    const screenMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: videoTexture },
        uTexAspect: { value: 16 / 9 },
        uPlaneAspect: { value: width / height },
        uTexel: { value: new THREE.Vector2(1 / 640, 1 / 360) },
        uCurve: { value: 0 },
        uVelocity: { value: 0 },
        uTime: { value: 0 },
        uRelief: { value: 0.24 },
        uDescentGlow: { value: 0 },
      },
      vertexShader: `
        uniform float uCurve;
        uniform float uVelocity;
        uniform float uTime;
        uniform float uRelief;
        uniform sampler2D uMap;
        uniform float uTexAspect;
        uniform float uPlaneAspect;

        varying vec2 vUv;
        varying vec2 vCoverUv;
        varying float vDepthFactor;

        void main() {
          vUv = uv;

          vec2 coverUv = uv;
          if (uPlaneAspect > uTexAspect) {
            float scale = uTexAspect / uPlaneAspect;
            coverUv.y = (uv.y - 0.5) * scale + 0.5;
          } else {
            float scale = uPlaneAspect / uTexAspect;
            coverUv.x = (uv.x - 0.5) * scale + 0.5;
          }
          vCoverUv = coverUv;

          vec3 pos = position;
          vec3 tex = texture2D(uMap, clamp(coverUv, 0.0, 1.0)).rgb;
          float lum = dot(tex, vec3(0.299, 0.587, 0.114));

          float dx = (uv.x - 0.5) * 2.0;
          float dy = (uv.y - 0.5) * 2.0;

          float cylBow = -((dx * dx) * 0.52 + (dy * dy) * 0.22) * uCurve;
          float scrollWave = sin(uv.y * 4.5 - uVelocity * 3.0) * uVelocity * 0.22;
          float reliefZ = (lum - 0.42) * uRelief * (0.2 + 0.8 * uCurve);

          pos.z += cylBow + scrollWave + reliefZ;
          vDepthFactor = clamp(cylBow + reliefZ, -0.7, 0.7);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform vec2 uTexel;
        uniform float uVelocity;
        uniform float uCurve;
        uniform float uTime;
        uniform float uDescentGlow;

        varying vec2 vUv;
        varying vec2 vCoverUv;
        varying float vDepthFactor;

        float filmNoise(vec2 co) {
          return fract(sin(dot(co, vec2(12.9898, 78.233)) + uTime * 0.5) * 43758.5453);
        }

        void main() {
          vec2 uv = clamp(vCoverUv, 0.0, 1.0);
          float edge = length(vUv - 0.5);
          float shift = abs(uVelocity) * 0.007 * edge;

          vec3 c  = texture2D(uMap, uv).rgb;
          vec3 n  = texture2D(uMap, clamp(uv + vec2(0.0, uTexel.y), 0.0, 1.0)).rgb;
          vec3 s  = texture2D(uMap, clamp(uv - vec2(0.0, uTexel.y), 0.0, 1.0)).rgb;
          vec3 e  = texture2D(uMap, clamp(uv + vec2(uTexel.x, 0.0), 0.0, 1.0)).rgb;
          vec3 w  = texture2D(uMap, clamp(uv - vec2(uTexel.x, 0.0), 0.0, 1.0)).rgb;
          vec3 sharp = clamp(c * 1.48 - (n + s + e + w) * 0.12, 0.0, 1.0);

          float r = texture2D(uMap, clamp(uv + vec2(0.0, shift), 0.0, 1.0)).r;
          float b = texture2D(uMap, clamp(uv - vec2(0.0, shift), 0.0, 1.0)).b;
          vec3 col = mix(sharp, vec3(r, sharp.g, b), clamp(abs(uVelocity) * 1.1, 0.0, 0.65));

          col = smoothstep(vec3(-0.02), vec3(1.01), col);
          col *= (1.0 + vDepthFactor * 0.28);

          col += (filmNoise(vUv * 400.0) - 0.5) * 0.016;
          col *= 1.0 - smoothstep(0.42, 0.85, edge) * (0.12 + 0.14 * uCurve);

          float rim = smoothstep(0.42, 0.72, edge) * uCurve;
          col += vec3(0.96, 0.77, 0.09) * rim * 0.22 * uDescentGlow;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    stageGroup.add(screenMesh);

    // Metallic Gold & Crimson Bevel Chassis hugging the curved 3D cinema plane
    const frameGroup = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5c518,
      emissive: 0x452d00,
      emissiveIntensity: 0.35,
      metalness: 0.94,
      roughness: 0.14,
    });
    const crimsonMat = new THREE.MeshStandardMaterial({
      color: 0x8f141e,
      emissive: 0x260205,
      emissiveIntensity: 0.4,
      metalness: 0.72,
      roughness: 0.24,
    });

    const barGeom = new THREE.BoxGeometry(1, 1, 1);
    const topBar = new THREE.Mesh(barGeom, goldMat);
    const bottomBar = new THREE.Mesh(barGeom, goldMat);
    const leftBar = new THREE.Mesh(barGeom, crimsonMat);
    const rightBar = new THREE.Mesh(barGeom, crimsonMat);
    const backingGeom = new THREE.BoxGeometry(1, 1, 0.14);
    const backingMat = new THREE.MeshStandardMaterial({
      color: 0x240609,
      metalness: 0.82,
      roughness: 0.25,
    });
    const backingSlab = new THREE.Mesh(backingGeom, backingMat);
    frameGroup.add(topBar, bottomBar, leftBar, rightBar, backingSlab);
    stageGroup.add(frameGroup);

    // 3 Translucent Holographic Echo Frames trailing behind the curved 3D video plane
    const echoPlanes: THREE.Mesh[] = [];
    const echoMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMap: { value: videoTexture },
        uTexAspect: { value: 16 / 9 },
        uPlaneAspect: { value: width / height },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        uniform float uTexAspect;
        uniform float uPlaneAspect;
        varying vec2 vCoverUv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec2 coverUv = uv;
          if (uPlaneAspect > uTexAspect) {
            float scale = uTexAspect / uPlaneAspect;
            coverUv.y = (uv.y - 0.5) * scale + 0.5;
          } else {
            float scale = uPlaneAspect / uTexAspect;
            coverUv.x = (uv.x - 0.5) * scale + 0.5;
          }
          vCoverUv = coverUv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uOpacity;
        varying vec2 vCoverUv;
        varying vec2 vUv;
        void main() {
          vec3 tex = texture2D(uMap, clamp(vCoverUv, 0.0, 1.0)).rgb;
          float border = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x)
                       * smoothstep(0.0, 0.04, vUv.y) * smoothstep(1.0, 0.96, vUv.y);
          vec3 rimTint = mix(vec3(0.96, 0.77, 0.09), vec3(0.75, 0.12, 0.18), vUv.y);
          vec3 col = mix(rimTint, tex * rimTint, 0.55);
          float alpha = uOpacity * (0.28 + 0.72 * (1.0 - border));
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const echoGeom = new THREE.PlaneGeometry(1, 1);
    for (let i = 0; i < ECHO_COUNT; i++) {
      const echo = new THREE.Mesh(echoGeom, echoMat);
      echo.position.z = -0.55 * (i + 1);
      echo.scale.set(1 + (i + 1) * 0.06, 1 + (i + 1) * 0.06, 1);
      stageGroup.add(echo);
      echoPlanes.push(echo);
    }

    // Real-Time Mirrored Video Floor Reflection beneath the tilted 3D screen
    const reflectionMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMap: { value: videoTexture },
        uTexAspect: { value: 16 / 9 },
        uPlaneAspect: { value: width / height },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        uniform float uTexAspect;
        uniform float uPlaneAspect;
        varying vec2 vUv;
        varying vec2 vCoverUv;
        void main() {
          vUv = uv;
          vec2 flipped = vec2(uv.x, 1.0 - uv.y);
          if (uPlaneAspect > uTexAspect) {
            float scale = uTexAspect / uPlaneAspect;
            flipped.y = (flipped.y - 0.5) * scale + 0.5;
          } else {
            float scale = uPlaneAspect / uTexAspect;
            flipped.x = (flipped.x - 0.5) * scale + 0.5;
          }
          vCoverUv = flipped;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec2 vCoverUv;
        void main() {
          vec3 tex = texture2D(uMap, clamp(vCoverUv, 0.0, 1.0)).rgb;
          float fade = pow(smoothstep(0.05, 1.0, vUv.y), 1.8);
          float sideFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
          gl_FragColor = vec4(tex * vec3(1.0, 0.9, 0.82), uOpacity * fade * sideFade * 0.42);
        }
      `,
    });
    const reflectionMesh = new THREE.Mesh(echoGeom, reflectionMat);
    reflectionMesh.rotation.x = -Math.PI / 2;
    stageGroup.add(reflectionMesh);

    // Sloped Reflective Obsidian-Crimson Runway Floor running along the downward descent vector
    const floorSlopeAngle = Math.atan2(18.0, 14.0);
    const floorGeom = new THREE.PlaneGeometry(24, 52);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1b0306,
      metalness: 0.8,
      roughness: 0.22,
    });
    const runwayFloor = new THREE.Mesh(floorGeom, floorMat);
    runwayFloor.rotation.x = -Math.PI / 2 + floorSlopeAngle;
    runwayFloor.position.set(0, -12.0, -2.5);
    scene.add(runwayFloor);

    // Twin Brushed Gold Runway Guide Rails lining the descent corridor
    const railGeom = new THREE.BoxGeometry(0.055, 0.045, 42);
    const leftRail = new THREE.Mesh(railGeom, goldMat);
    const rightRail = new THREE.Mesh(railGeom, goldMat);
    leftRail.rotation.x = floorSlopeAngle;
    rightRail.rotation.x = floorSlopeAngle;
    scene.add(leftRail, rightRail);

    // Glowing Architectural Portals rushing past the camera along the descent corridor
    const portalGeom = new THREE.BoxGeometry(1, 0.055, 0.14);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0xf5c518,
      emissive: 0x6b4b00,
      emissiveIntensity: 0.65,
      metalness: 0.92,
      roughness: 0.16,
    });
    const portalHorizontal = new THREE.InstancedMesh(portalGeom, portalMat, PORTAL_COUNT * 2);
    const portalVerticalGeom = new THREE.BoxGeometry(0.055, 1, 0.14);
    const portalVertical = new THREE.InstancedMesh(
      portalVerticalGeom,
      crimsonMat,
      PORTAL_COUNT * 2
    );
    portalHorizontal.frustumCulled = false;
    portalVertical.frustumCulled = false;
    scene.add(portalHorizontal, portalVertical);

    // Atmospheric Gold Light Motes streaming through the 3D shaft
    const moteGeom = new THREE.OctahedronGeometry(0.036, 0);
    const moteMat = new THREE.MeshStandardMaterial({
      color: 0xfef7dc,
      emissive: 0xf5c518,
      emissiveIntensity: 1.0,
      metalness: 0.65,
      roughness: 0.2,
    });
    const motes = new THREE.InstancedMesh(moteGeom, moteMat, PARTICLE_COUNT);
    motes.frustumCulled = false;
    scene.add(motes);

    const moteSeeds = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const t = i / PARTICLE_COUNT;
      return {
        x: Math.sin(i * 17.3) * 6.5,
        yBase: -t * 21.0 + 2.0 + Math.cos(i * 9.7) * 2.4,
        z: 3.5 - t * 17.5 + Math.sin(i * 5.3) * 2.0,
        scale: 0.55 + ((i * 13) % 10) * 0.09,
        speed: 0.35 + ((i * 5) % 7) * 0.12,
      };
    });

    // 3D Opening Volumetric Monogram Crest + Soft Reveal Veil hovering over full-bleed video
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const logoTexLoader = new THREE.TextureLoader();
    const logoTexture = logoTexLoader.load(MONOGRAM_LOGO_SRC);
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.anisotropy = Math.min(8, Math.max(1, maxAniso));

    // Soft dark crimson scrim between full-bleed video & floating 3D monogram that clears on scroll
    const veilGeom = new THREE.PlaneGeometry(16, 10);
    const veilMat = new THREE.MeshBasicMaterial({
      color: 0x100204,
      transparent: true,
      opacity: 0.54,
      depthWrite: false,
      depthTest: false,
    });
    const veilMesh = new THREE.Mesh(veilGeom, veilMat);
    veilMesh.renderOrder = 10;
    scene.add(veilMesh);

    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    const logoGeom = new THREE.PlaneGeometry(2.7, 1.8, 24, 16);
    const logoHaloGeom = new THREE.PlaneGeometry(4.8, 3.6);
    const logoHaloMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uOpacity: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec2 d = (vUv - 0.5) * 2.0;
          float r = dot(d, d);
          float coreGlow = exp(-r * 3.1);
          float wideAura = exp(-r * 1.45);
          vec3 col = vec3(0.45, 0.06, 0.09) * wideAura * 0.52 + vec3(0.95, 0.75, 0.16) * coreGlow * 0.34;
          gl_FragColor = vec4(col, clamp((coreGlow + wideAura) * 0.55, 0.0, 1.0) * uOpacity);
        }
      `,
    });
    const logoHaloMesh = new THREE.Mesh(logoHaloGeom, logoHaloMat);
    logoHaloMesh.position.z = -0.25;
    logoHaloMesh.renderOrder = 12;
    logoGroup.add(logoHaloMesh);

    const logoBackMaterials: THREE.ShaderMaterial[] = [];
    for (let i = LOGO_DEPTH_LAYERS; i >= 1; i--) {
      const layerFrac = i / LOGO_DEPTH_LAYERS;
      const depthMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uMap: { value: logoTexture },
          uOpacity: { value: 1 },
          uLayer: { value: layerFrac },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          uniform float uOpacity;
          uniform float uLayer;
          varying vec2 vUv;
          void main() {
            vec4 tex = texture2D(uMap, vUv);
            float mask = smoothstep(0.18, 0.52, tex.a);
            if (mask < 0.02) discard;
            vec3 brightGold = vec3(0.86, 0.65, 0.11);
            vec3 deepBronze = vec3(0.24, 0.09, 0.02);
            vec3 metalCol = mix(brightGold, deepBronze, uLayer);
            gl_FragColor = vec4(metalCol, mask * uOpacity * (0.94 - uLayer * 0.32));
          }
        `,
      });
      const depthMesh = new THREE.Mesh(logoGeom, depthMat);
      depthMesh.position.z = -layerFrac * 0.14;
      depthMesh.scale.setScalar(1.0 + layerFrac * 0.012);
      depthMesh.renderOrder = 14 + (LOGO_DEPTH_LAYERS - i);
      logoGroup.add(depthMesh);
      logoBackMaterials.push(depthMat);
    }

    const logoFrontMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uMap: { value: logoTexture },
        uOpacity: { value: 1 },
        uTime: { value: 0 },
        uTilt: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uOpacity;
        uniform float uTime;
        uniform float uTilt;
        varying vec2 vUv;
        void main() {
          vec4 tex = texture2D(uMap, vUv);
          if (tex.a < 0.02) discard;
          float sweepPos = fract(uTime * 0.22) * 2.4 - 0.7 + uTilt * 0.35;
          float diag = (vUv.x * 0.75 + vUv.y * 0.55) - sweepPos;
          float sheen = exp(-diag * diag * 28.0) * 0.26;
          vec3 col = tex.rgb + vec3(1.0, 0.89, 0.55) * sheen;
          gl_FragColor = vec4(col, tex.a * uOpacity);
        }
      `,
    });
    const logoFrontMesh = new THREE.Mesh(logoGeom, logoFrontMat);
    logoFrontMesh.position.z = 0.01;
    logoFrontMesh.renderOrder = 30;
    logoGroup.add(logoFrontMesh);

    let currentFullWidth = 1;
    let currentFullHeight = 1;

    const updateScreenDimensions = (curW: number, curH: number) => {
      const fovRad = THREE.MathUtils.degToRad(baseFov);
      const camZ = 5.0;
      const fullHeight = 2 * Math.tan(fovRad * 0.5) * camZ;
      const aspect = curW / Math.max(1, curH);
      const fullWidth = fullHeight * aspect;

      currentFullWidth = fullWidth;
      currentFullHeight = fullHeight;

      screenMesh.scale.set(fullWidth, fullHeight, 1);
      screenMat.uniforms.uPlaneAspect.value = aspect;
      echoMat.uniforms.uPlaneAspect.value = aspect;
      reflectionMat.uniforms.uPlaneAspect.value = aspect;

      const t = 0.032;
      topBar.scale.set(fullWidth + t * 2, t, 0.16);
      topBar.position.set(0, fullHeight * 0.5 + t * 0.5, -0.06);
      bottomBar.scale.set(fullWidth + t * 2, t, 0.16);
      bottomBar.position.set(0, -fullHeight * 0.5 - t * 0.5, -0.06);
      leftBar.scale.set(t, fullHeight, 0.16);
      leftBar.position.set(-fullWidth * 0.5 - t * 0.5, 0, -0.06);
      rightBar.scale.set(t, fullHeight, 0.16);
      rightBar.position.set(fullWidth * 0.5 + t * 0.5, 0, -0.06);
      backingSlab.scale.set(fullWidth * 0.99, fullHeight * 0.99, 1);
      backingSlab.position.set(0, 0, -0.34);

      for (let i = 0; i < ECHO_COUNT; i++) {
        const factor = 1 + (i + 1) * 0.065;
        echoPlanes[i].scale.set(fullWidth * factor, fullHeight * factor, 1);
      }

      reflectionMesh.scale.set(fullWidth * 1.02, fullHeight * 0.72, 1);
      reflectionMesh.position.set(0, -fullHeight * 0.54, fullHeight * 0.34);

      const railSpan = Math.min(5.5, fullWidth * 0.65);
      leftRail.position.set(-railSpan, -9.2 - fullHeight * 0.58, -2.5);
      rightRail.position.set(railSpan, -9.2 - fullHeight * 0.58, -2.5);
      runwayFloor.position.set(0, -9.3 - fullHeight * 0.58, -2.5);

      const pw = fullWidth * 1.14;
      const ph = fullHeight * 1.12;
      for (let i = 0; i < PORTAL_COUNT; i++) {
        const stepT = (i + 0.5) / 11.5;
        const yStep = -stepT * 18.0;
        const zPos = 2.8 - stepT * 14.0;

        _dummy.position.set(0, yStep + ph * 0.5, zPos);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(pw, 1, 1);
        _dummy.updateMatrix();
        portalHorizontal.setMatrixAt(i * 2, _dummy.matrix);

        _dummy.position.set(0, yStep - ph * 0.5, zPos);
        _dummy.updateMatrix();
        portalHorizontal.setMatrixAt(i * 2 + 1, _dummy.matrix);

        _dummy.position.set(-pw * 0.5, yStep, zPos);
        _dummy.scale.set(1, ph, 1);
        _dummy.updateMatrix();
        portalVertical.setMatrixAt(i * 2, _dummy.matrix);

        _dummy.position.set(pw * 0.5, yStep, zPos);
        _dummy.updateMatrix();
        portalVertical.setMatrixAt(i * 2 + 1, _dummy.matrix);
      }
      portalHorizontal.instanceMatrix.needsUpdate = true;
      portalVertical.instanceMatrix.needsUpdate = true;
    };

    updateScreenDimensions(width, height);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      if (!mount) return;
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      updateScreenDimensions(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let rafId = 0;
    let timerId = 0;
    let disposed = false;
    let contextLost = false;
    let lastClockTime = performance.now();
    let lastDrawnFrame = -1;
    let reducedClockFrame = 0;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      setWebglUnavailable(true);
    };
    const handleContextRestored = () => {
      contextLost = false;
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext | null;
      if (!gl || typeof gl.fenceSync !== 'function' || contextLost) {
        timerId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        timerId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed || contextLost) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          timerId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          timerId = window.setTimeout(cb, 80);
        }
      };
      timerId = window.setTimeout(poll, 5);
    }

    const tick = (now: number) => {
      if (disposed) return;
      const delta = Math.min(0.1, Math.max(0.001, (now - lastClockTime) / 1000));
      lastClockTime = now;
      const elapsed = now * 0.001;

      const prevSmooth = smoothProgressRef.current;
      if (shouldReduceMotionRef.current) {
        if (manualPlayingRef.current) {
          reducedClockFrame = (reducedClockFrame + delta * 24) % TOTAL_FRAMES;
          smoothProgressRef.current = reducedFrameToProgress(reducedClockFrame);
        }
      } else {
        smoothProgressRef.current = THREE.MathUtils.damp(
          smoothProgressRef.current,
          targetProgressRef.current,
          7.5,
          delta
        );
      }

      const progress = smoothProgressRef.current;
      const velocity = THREE.MathUtils.clamp((progress - prevSmooth) / Math.max(delta, 0.008), -1.6, 1.6);

      pointerSmoothRef.current.x = THREE.MathUtils.damp(
        pointerSmoothRef.current.x,
        pointerTargetRef.current.x,
        5,
        delta
      );
      pointerSmoothRef.current.y = THREE.MathUtils.damp(
        pointerSmoothRef.current.y,
        pointerTargetRef.current.y,
        5,
        delta
      );

      const frameIdx = Math.round(progress * (TOTAL_FRAMES - 1));
      if (frameIdx !== lastDrawnFrame) {
        const img = getClosestFrame(frameIdx);
        if (img && img.naturalWidth > 0 && videoCtx) {
          videoCtx.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);
          videoTexture.needsUpdate = true;
          lastDrawnFrame = frameIdx;
        }
      }

      // Full-Bleed 3D Descent Envelope (flush 100% full-bleed -> deep 3D architectural dive -> flush exit)
      const envelope = Math.sin(Math.min(1, progress / 0.96) * Math.PI);
      const descentY = -progress * 18.0;
      const descentZ = -progress * 14.0;

      const nextFov = baseFov + envelope * 13.0;
      if (Math.abs(camera.fov - nextFov) > 0.02) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }

      stageGroup.position.set(
        pointerSmoothRef.current.x * 0.24 * envelope,
        descentY + envelope * (currentFullHeight * 0.06),
        descentZ - envelope * 2.15
      );
      stageGroup.rotation.set(
        -0.18 * envelope - velocity * 0.06 - pointerSmoothRef.current.y * 0.05 * envelope,
        Math.sin(progress * Math.PI * 2.0) * 0.26 * envelope +
          pointerSmoothRef.current.x * 0.08 * envelope,
        Math.sin(progress * Math.PI * 1.5) * -0.04 * envelope
      );
      stageGroup.scale.setScalar(1.0 - envelope * 0.14);

      camera.position.set(
        pointerSmoothRef.current.x * 0.45 * envelope,
        descentY + envelope * 1.05,
        5.0 + descentZ + envelope * 0.85
      );
      camera.lookAt(
        stageGroup.position.x * 0.35,
        descentY - envelope * 0.42,
        descentZ - 2.4
      );
      camera.updateMatrixWorld();

      const show3D = envelope > 0.015;
      frameGroup.visible = show3D;
      reflectionMesh.visible = show3D;
      echoMat.uniforms.uOpacity.value = envelope * 0.65;
      reflectionMat.uniforms.uOpacity.value = envelope;

      for (let i = 0; i < ECHO_COUNT; i++) {
        echoPlanes[i].visible = show3D;
        echoPlanes[i].rotation.y = Math.sin(progress * Math.PI * 2.0 + i * 0.4) * 0.04 * envelope;
      }

      screenMat.uniforms.uCurve.value = envelope;
      screenMat.uniforms.uVelocity.value = velocity * 0.55;
      screenMat.uniforms.uTime.value = elapsed;
      screenMat.uniforms.uDescentGlow.value = envelope;

      // Floating 3D Opening Monogram Crest & Unfold Veil (fades out cleanly as scroll unfolds video)
      const reduce = shouldReduceMotionRef.current;
      const unfoldRaw = reduce
        ? manualPlayingRef.current
          ? 1
          : 0
        : Math.min(1, progress / 0.16);
      const unfold = unfoldRaw * unfoldRaw * (3 - 2 * unfoldRaw);
      const logoOpacity = Math.max(0, 1 - unfold);

      if (logoOpacity > 0.005) {
        const aspect = Math.max(0.45, mount.clientWidth / Math.max(1, mount.clientHeight));
        camera.getWorldDirection(_camForward);
        _camRight.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
        _camUp.setFromMatrixColumn(camera.matrixWorld, 1).normalize();

        const heroLogoDist = aspect < 0.78 ? 4.3 : aspect < 1.15 ? 4.0 : 3.9;
        const floatY = reduce ? 0 : Math.sin(elapsed * 1.35) * 0.045;
        const liftOnScroll = unfold * 0.85;
        const pushDepthOnScroll = unfold * 0.95;

        veilMesh.visible = true;
        veilMesh.position
          .copy(camera.position)
          .addScaledVector(_camForward, heroLogoDist + 0.45);
        veilMesh.quaternion.copy(camera.quaternion);
        veilMat.opacity = 0.54 * logoOpacity;

        logoGroup.visible = true;
        logoGroup.position
          .copy(camera.position)
          .addScaledVector(_camForward, heroLogoDist - pushDepthOnScroll)
          .addScaledVector(_camUp, 0.08 + floatY + liftOnScroll)
          .addScaledVector(_camRight, -pointerSmoothRef.current.x * 0.05);

        logoGroup.quaternion.copy(camera.quaternion);
        logoGroup.rotateY(
          (reduce ? 0 : Math.sin(elapsed * 0.85) * 0.1) +
            pointerSmoothRef.current.x * 0.22 +
            unfold * 0.75
        );
        logoGroup.rotateX(
          (reduce ? 0 : Math.cos(elapsed * 0.7) * 0.04) -
            pointerSmoothRef.current.y * 0.14 -
            unfold * 0.22
        );

        const baseLogoScale = aspect < 0.78 ? 0.62 : aspect < 1.15 ? 0.84 : 0.96;
        logoGroup.scale.setScalar(baseLogoScale * (1 + unfold * 0.26));

        logoFrontMat.uniforms.uOpacity.value = logoOpacity;
        logoFrontMat.uniforms.uTime.value = elapsed;
        logoFrontMat.uniforms.uTilt.value = pointerSmoothRef.current.x;
        logoHaloMat.uniforms.uOpacity.value = logoOpacity;
        for (let i = 0; i < logoBackMaterials.length; i++) {
          logoBackMaterials[i].uniforms.uOpacity.value = logoOpacity;
        }
      } else {
        logoGroup.visible = false;
        veilMesh.visible = false;
      }

      void currentFullWidth;

      // Animate gold motes streaming past the descending camera
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const s = moteSeeds[i];
        const driftY = s.yBase + Math.sin(elapsed * s.speed + i) * 0.38;
        _dummy.position.set(s.x, driftY, s.z);
        _dummy.rotation.set(elapsed * s.speed, elapsed * 0.7, 0);
        _dummy.scale.setScalar(s.scale * (0.45 + 0.65 * envelope));
        _dummy.updateMatrix();
        _mat4.copy(_dummy.matrix);
        motes.setMatrixAt(i, _mat4);
      }
      motes.instanceMatrix.needsUpdate = true;

      if (!contextLost) {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(() => {
          if (!disposed) rafId = window.requestAnimationFrame(tick);
        });
      } else {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const reducedFrameToProgress = (frame: number) => frame / (TOTAL_FRAMES - 1);

    rafId = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      screenGeom.dispose();
      screenMat.dispose();
      barGeom.dispose();
      backingGeom.dispose();
      backingMat.dispose();
      echoGeom.dispose();
      echoMat.dispose();
      reflectionMat.dispose();
      floorGeom.dispose();
      floorMat.dispose();
      railGeom.dispose();
      goldMat.dispose();
      crimsonMat.dispose();
      portalGeom.dispose();
      portalVerticalGeom.dispose();
      portalMat.dispose();
      moteGeom.dispose();
      moteMat.dispose();
      logoGeom.dispose();
      logoFrontMat.dispose();
      logoHaloGeom.dispose();
      logoHaloMat.dispose();
      veilGeom.dispose();
      veilMat.dispose();
      for (const m of logoBackMaterials) m.dispose();
      logoTexture.dispose();
      videoTexture.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const formattedSec = String(elapsedSeconds).padStart(2, '0');

  return (
    <section
      ref={trackRef}
      aria-label={t.hero.ariaLabel}
      className="relative w-full h-[380vh] bg-[#46050B]"
    >
      {/* 100vw x 100dvh Sticky Full-Surface 3D WebGL Viewport */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {webglUnavailable && (
          <div className="absolute inset-0">
            <canvas ref={fallbackCanvasRef} className="w-full h-full object-cover" />
            <motion.div
              style={{
                opacity: fallbackLogoOpacity,
                scale: fallbackLogoScale,
                y: fallbackLogoY,
              }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#48050B]/60"
            >
              <img
                src={MONOGRAM_LOGO_SRC}
                alt="CHYTESS COLLECTION Monogram"
                className="w-[min(74vw,420px)] h-auto object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)]"
              />
            </motion.div>
          </div>
        )}
        <div ref={webglMountRef} className="absolute inset-0 w-full h-full" />

        {/* Subtle Crimson Top Scrim for Transparent Navbar Legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#4A060B]/70 via-[#4A060B]/25 to-transparent"
        />

        {/* Minimal Editorial Cinema Timecode + Scroll Cue */}
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 max-w-[1440px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-[0.26em] text-[#FEF7DC]/75 font-medium tabular-nums">
            00:{formattedSec} / 00:20
          </div>

          {shouldReduceMotion ? (
            <button
              type="button"
              onClick={() => setManualPlaying((prev) => !prev)}
              className="pointer-events-auto h-10 px-5 bg-[#24090B]/90 border border-[#F5C518]/80 text-[#F5C518] text-[11px] uppercase tracking-[0.2em] inline-flex items-center gap-2 hover:bg-[#24090B] transition-colors cursor-pointer"
            >
              {manualPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t.hero.pause}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.hero.playFilm}</span>
                </>
              )}
            </button>
          ) : (
            <div
              className={`transition-opacity duration-500 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] text-[#F5C518] font-medium ${
                hasStartedScroll ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <span>{t.hero.scrollToDescend}</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
          )}
        </div>

        {/* Hairline Saffron Scroll Progress Bar */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/15"
        >
          <motion.div
            style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
            className="h-full bg-[#F5C518]"
          />
        </div>
      </div>
    </section>
  );
}

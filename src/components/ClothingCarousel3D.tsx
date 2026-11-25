import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Gauge,
  Pause,
  Play,
} from 'lucide-react';
import type { Product } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { localizeProduct } from '../i18n/translations';
import { ImageWithFallback } from './ImageWithFallback';

interface ClothingCarousel3DProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

type SpeedLevel = 1 | 2 | 3;

function createRoundedProductTexture(
  img: HTMLImageElement,
  anisotropy: number
): THREE.CanvasTexture {
  const width = 768;
  const height = 1024;
  const radius = 108;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(4, 4, width - 8, height - 8, radius);
    ctx.clip();

    // Cover-crop image inside curved capsule
    const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
    const targetRatio = width / height;
    let drawW = width;
    let drawH = height;
    let drawX = 0;
    let drawY = 0;

    if (imgRatio > targetRatio) {
      drawH = height;
      drawW = height * imgRatio;
      drawX = (width - drawW) / 2;
    } else {
      drawW = width;
      drawH = width / imgRatio;
      drawY = (height - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Subtle edge definition without washing out garment lighting
    ctx.strokeStyle = 'rgba(245, 197, 24, 0.42)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(6, 6, width - 12, height - 12, radius - 2);
    ctx.stroke();

    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, anisotropy);
  texture.needsUpdate = true;
  return texture;
}

function createSilhouetteAlphaTexture(): THREE.CanvasTexture {
  const width = 256;
  const height = 340;
  const radius = 36;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(2, 2, width - 4, height - 4, radius);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function buildCurvedGarmentGeometry(
  width: number,
  height: number,
  segX = 24,
  segY = 24
): { geometry: THREE.BufferGeometry; baseZ: Float32Array } {
  const geometry = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const baseZ = new Float32Array(pos.count);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (width * 0.5); // -1..1
    const ny = y / (height * 0.5); // -1..1

    // Sculpted 3D cylindrical curvature + gentle organic torso drape
    const cylCurve = (1 - nx * nx) * 0.34;
    const verticalDrape = Math.sin(((ny + 1) * 0.5) * Math.PI) * 0.08;
    const z = cylCurve + verticalDrape - 0.16;

    pos.setZ(i, z);
    baseZ[i] = z;
  }

  geometry.computeVertexNormals();
  return { geometry, baseZ };
}

export function ClothingCarousel3D({
  products,
  onSelectProduct,
}: ClothingCarousel3DProps) {
  const { lang, t } = useLanguage();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [speedLevel, setSpeedLevel] = useState<SpeedLevel>(1);
  const [colorSelection, setColorSelection] = useState<Record<string, number>>({});
  const [webglFailed, setWebglFailed] = useState(false);

  // Refs read by Three.js animation loop without re-creating scene
  const isPlayingRef = useRef(isPlaying);
  const speedLevelRef = useRef(speedLevel);
  const productsRef = useRef(products);
  const colorSelectionRef = useRef(colorSelection);
  const onSelectProductRef = useRef(onSelectProduct);
  const activeIndexRef = useRef(activeIndex);

  isPlayingRef.current = isPlaying;
  speedLevelRef.current = speedLevel;
  productsRef.current = products;
  colorSelectionRef.current = colorSelection;
  onSelectProductRef.current = onSelectProduct;

  // Imperative rotation controls shared with DOM buttons
  const currentAngleRef = useRef(0);
  const targetSnapAngleRef = useRef<number | null>(null);
  const impulseVelocityRef = useRef(0);
  const pointerTiltRef = useRef({ x: 0, y: 0 });
  const textureUpdateMapRef = useRef<
    Map<string, (imageUrl: string) => void>
  >(new Map());

  // Reset rotation & index when product list changes (e.g. tab switch)
  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
    currentAngleRef.current = 0;
    targetSnapAngleRef.current = null;
    impulseVelocityRef.current = 0;
  }, [products]);

  // Sync colourway swatch changes live onto the 3D garment texture
  useEffect(() => {
    for (const product of products) {
      const idx = colorSelection[product.id];
      if (idx === undefined) continue;
      const color = product.colors[idx];
      const updater = textureUpdateMapRef.current.get(product.id);
      if (color?.image && updater) {
        updater(color.image);
      }
    }
  }, [colorSelection, products]);

  // WebGL Three.js 3D Turntable Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container || products.length === 0 || webglFailed) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = Math.max(320, container.clientWidth);
    const height = Math.max(380, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfaf8f5, 0.016);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();

    const count = products.length;
    const radius = Math.max(3.4, (count * 2.38) / (Math.PI * 2));
    const stepAngle = (Math.PI * 2) / count;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    const baseCamZ = radius + 4.35;
    camera.position.set(0, 0.14, baseCamZ);
    camera.lookAt(0, -0.04, radius - 0.6);

    // Bright studio lighting for crisp white pedestals, gold rails & crimson backs
    const ambient = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff4d4, 1.05);
    keyLight.position.set(3.5, 4.8, radius + 7.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.65);
    fillLight.position.set(-4.5, 1.5, radius + 5.5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xb8121e, 1.8, 16);
    rimLight.position.set(0, 2.2, radius - 1.4);
    scene.add(rimLight);

    // Revolving Turntable Group
    const turntable = new THREE.Group();
    scene.add(turntable);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5c518,
      metalness: 0.86,
      roughness: 0.2,
    });

    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0xf7f4ef,
      metalness: 0.18,
      roughness: 0.35,
    });

    // Overhead & Floor Circular Carousel Rings
    const topRailGeo = new THREE.TorusGeometry(radius, 0.028, 16, 128);
    const topRail = new THREE.Mesh(topRailGeo, goldMat);
    topRail.rotation.x = Math.PI / 2;
    topRail.position.y = 1.62;
    turntable.add(topRail);

    const floorRingGeo = new THREE.TorusGeometry(radius, 0.045, 16, 128);
    const floorRing = new THREE.Mesh(floorRingGeo, goldMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.y = -1.52;
    turntable.add(floorRing);

    const floorOuterRingGeo = new THREE.TorusGeometry(radius + 0.65, 0.015, 12, 128);
    const floorOuterRing = new THREE.Mesh(floorOuterRingGeo, goldMat);
    floorOuterRing.rotation.x = Math.PI / 2;
    floorOuterRing.position.y = -1.55;
    turntable.add(floorOuterRing);

    // Subtle floating gold atelier shimmer particles around the carousel perimeter
    const particleCount = 110;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const ang = (i / particleCount) * Math.PI * 2 + Math.random() * 0.4;
      const r = radius + (Math.random() - 0.5) * 2.1;
      particlePos[i * 3] = Math.sin(ang) * r;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
      particlePos[i * 3 + 2] = Math.cos(ang) * r;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5c518,
      size: 0.045,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const alphaMaskTex = createSilhouetteAlphaTexture();
    const frontGeoData = buildCurvedGarmentGeometry(1.88, 2.52, 24, 24);
    const backGeoData = buildCurvedGarmentGeometry(1.9, 2.54, 18, 18);
    const collarGeo = new THREE.TorusGeometry(0.21, 0.022, 12, 36, Math.PI * 1.28);
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.34, 12);
    const plinthGeo = new THREE.CylinderGeometry(0.82, 0.94, 0.07, 42);
    const plinthRimGeo = new THREE.TorusGeometry(0.88, 0.018, 12, 48);

    const disposableTextures: THREE.Texture[] = [alphaMaskTex];
    const disposableMaterials: THREE.Material[] = [goldMat, obsidianMat, particleMat];

    const backShellMat = new THREE.MeshStandardMaterial({
      color: 0xb8121e,
      metalness: 0.55,
      roughness: 0.28,
      alphaMap: alphaMaskTex,
      transparent: true,
      alphaTest: 0.2,
    });
    disposableMaterials.push(backShellMat);

    interface GarmentEntry {
      index: number;
      product: Product;
      group: THREE.Group;
      frontMesh: THREE.Mesh;
      plinthMesh: THREE.Mesh;
      baseAngle: number;
    }

    const entries: GarmentEntry[] = [];
    textureUpdateMapRef.current.clear();

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    products.forEach((product, idx) => {
      const baseAngle = idx * stepAngle;
      const itemGroup = new THREE.Group();
      itemGroup.position.set(
        Math.sin(baseAngle) * radius,
        0,
        Math.cos(baseAngle) * radius
      );
      itemGroup.rotation.y = baseAngle;
      itemGroup.userData = { productIndex: idx };

      const colorIdx = colorSelectionRef.current[product.id] ?? 0;
      const initialImg =
        product.colors[colorIdx]?.image || product.images[0] || '';

      const frontMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        alphaTest: 0.06,
        toneMapped: false,
        side: THREE.FrontSide,
      });
      disposableMaterials.push(frontMat);

      const loadImageToMat = (url: string) => {
        if (!url) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.onload = () => {
          const tex = createRoundedProductTexture(img, maxAniso);
          disposableTextures.push(tex);
          frontMat.map = tex;
          frontMat.needsUpdate = true;
        };
        img.src = url;
      };

      loadImageToMat(initialImg);
      textureUpdateMapRef.current.set(product.id, loadImageToMat);

      const frontMesh = new THREE.Mesh(frontGeoData.geometry, frontMat);
      frontMesh.userData = { productIndex: idx };
      itemGroup.add(frontMesh);

      const backMesh = new THREE.Mesh(backGeoData.geometry, backShellMat);
      backMesh.position.z = -0.045;
      backMesh.rotation.y = Math.PI;
      backMesh.userData = { productIndex: idx };
      itemGroup.add(backMesh);

      // Sculpted Gold Mannequin Collar & Suspension Stem
      const collar = new THREE.Mesh(collarGeo, goldMat);
      collar.position.set(0, 1.32, 0.06);
      collar.rotation.z = Math.PI * 0.86;
      collar.rotation.x = 0.35;
      itemGroup.add(collar);

      const stem = new THREE.Mesh(stemGeo, goldMat);
      stem.position.set(0, 1.48, 0.0);
      itemGroup.add(stem);

      // Floating 3D Pedestal Disc Below Garment
      const plinthGroup = new THREE.Group();
      plinthGroup.position.set(0, -1.46, 0.02);

      const plinth = new THREE.Mesh(plinthGeo, obsidianMat);
      const plinthRim = new THREE.Mesh(plinthRimGeo, goldMat);
      plinthRim.rotation.x = Math.PI / 2;
      plinthRim.position.y = 0.032;
      plinthGroup.add(plinth, plinthRim);
      itemGroup.add(plinthGroup);

      turntable.add(itemGroup);
      entries.push({
        index: idx,
        product,
        group: itemGroup,
        frontMesh,
        plinthMesh: plinth,
        baseAngle,
      });
    });

    // Drag, Swipe, Click & Hover Raycasting
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let isDragging = false;
    let dragStartX = 0;
    let lastX = 0;
    let lastTime = performance.now();
    let dragVelocity = 0;
    let didMoveSignificantly = false;

    const canvasEl = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      lastX = e.clientX;
      lastTime = performance.now();
      dragVelocity = 0;
      didMoveSignificantly = false;
      targetSnapAngleRef.current = null;
      canvasEl.setPointerCapture(e.pointerId);
      canvasEl.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      pointerTiltRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerTiltRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (!isDragging) return;
      const now = performance.now();
      const dt = Math.max(8, now - lastTime) / 1000;
      const dx = e.clientX - lastX;
      if (Math.abs(e.clientX - dragStartX) > 7) {
        didMoveSignificantly = true;
      }

      const angleDelta = dx * 0.0055;
      currentAngleRef.current += angleDelta;
      dragVelocity = angleDelta / dt;
      lastX = e.clientX;
      lastTime = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      canvasEl.style.cursor = 'grab';
      try {
        canvasEl.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if already released
      }

      if (didMoveSignificantly) {
        // Transfer fling momentum to turntable velocity
        impulseVelocityRef.current = Math.max(-7, Math.min(7, dragVelocity * 0.85));
        return;
      }

      // Click hit-test on 3D garment models
      const rect = canvasEl.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);

      const hits = raycaster.intersectObjects(
        entries.map((entry) => entry.frontMesh),
        false
      );
      if (hits.length > 0) {
        const hitIdx = hits[0].object.userData?.productIndex as number | undefined;
        if (typeof hitIdx === 'number') {
          if (hitIdx === activeIndexRef.current) {
            onSelectProductRef.current(productsRef.current[hitIdx]);
          } else {
            // Rotate smoothly to clicked garment
            const desiredAngle = -hitIdx * stepAngle;
            const current = currentAngleRef.current;
            let delta = ((desiredAngle - current) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
            targetSnapAngleRef.current = current + delta;
            impulseVelocityRef.current = 0;
          }
        }
      }
    };

    const onPointerLeave = () => {
      pointerTiltRef.current.x = 0;
      pointerTiltRef.current.y = 0;
    };

    canvasEl.style.cursor = 'grab';
    canvasEl.addEventListener('pointerdown', onPointerDown);
    canvasEl.addEventListener('pointermove', onPointerMove);
    canvasEl.addEventListener('pointerup', onPointerUp);
    canvasEl.addEventListener('pointercancel', onPointerUp);
    canvasEl.addEventListener('pointerleave', onPointerLeave);

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    const onContextRestored = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    const onResize = () => {
      if (!container) return;
      const w = Math.max(320, container.clientWidth);
      const h = Math.max(380, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let rafId = 0;
    let prevTick = performance.now();
    const posAttr = frontGeoData.geometry.attributes.position as THREE.BufferAttribute;
    const baseZ = frontGeoData.baseZ;

    const animate = (now: number) => {
      rafId = window.requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - prevTick) / 1000);
      prevTick = now;
      const elapsed = now * 0.001;

      if (!isDragging) {
        if (targetSnapAngleRef.current !== null) {
          const diff = targetSnapAngleRef.current - currentAngleRef.current;
          currentAngleRef.current += diff * Math.min(1, dt * 6.5);
          if (Math.abs(diff) < 0.004) {
            currentAngleRef.current = targetSnapAngleRef.current;
            targetSnapAngleRef.current = null;
          }
        } else {
          // Gentle, calm luxury carousel glide (~2.6s per garment at 1x)
          const baseOmega = isPlayingRef.current
            ? -Math.min(0.36, Math.max(0.11, stepAngle / 2.6)) * speedLevelRef.current
            : 0;

          currentAngleRef.current += (baseOmega + impulseVelocityRef.current) * dt;
          impulseVelocityRef.current *= Math.exp(-2.4 * dt);
          if (Math.abs(impulseVelocityRef.current) < 0.002) {
            impulseVelocityRef.current = 0;
          }
        }
      }

      turntable.rotation.y = currentAngleRef.current;

      // Subtle living silk/wool ripple wave on curved cloth geometry
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const hemFactor = Math.max(0, (1.26 - y) / 2.52);
        const ripple =
          Math.sin(x * 2.4 + elapsed * 2.4) * 0.026 * hemFactor +
          Math.cos(y * 1.8 - elapsed * 1.8) * 0.012;
        posAttr.setZ(i, baseZ[i] + ripple);
      }
      posAttr.needsUpdate = true;

      // Subtle camera luxury parallax + determine active front-most garment
      const targetCamX = pointerTiltRef.current.x * 0.28;
      const targetCamY = 0.14 - pointerTiltRef.current.y * 0.16;
      camera.position.x += (targetCamX - camera.position.x) * Math.min(1, dt * 4.5);
      camera.position.y += (targetCamY - camera.position.y) * Math.min(1, dt * 4.5);
      camera.lookAt(0, -0.05, radius - 0.6);

      let closestIdx = 0;
      let closestAbs = Infinity;

      for (const entry of entries) {
        const worldAngle =
          ((currentAngleRef.current + entry.baseAngle) % (Math.PI * 2) + Math.PI * 3) %
            (Math.PI * 2) -
          Math.PI;
        const absAngle = Math.abs(worldAngle);
        if (absAngle < closestAbs) {
          closestAbs = absAngle;
          closestIdx = entry.index;
        }

        // Front hero gently elevates & scales up smoothly
        const frontFocus = Math.max(0, 1 - absAngle / 0.85);
        const floatBob = Math.sin(elapsed * 2.1 + entry.index * 1.1) * 0.04;
        entry.group.position.y = floatBob + frontFocus * 0.09;
        const s = 0.9 + frontFocus * 0.16;
        entry.group.scale.set(s, s, s);
      }

      if (closestIdx !== activeIndexRef.current) {
        activeIndexRef.current = closestIdx;
        setActiveIndex(closestIdx);
      }

      particles.rotation.y = elapsed * 0.045;
      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointermove', onPointerMove);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('pointercancel', onPointerUp);
      canvasEl.removeEventListener('pointerleave', onPointerLeave);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);

      frontGeoData.geometry.dispose();
      backGeoData.geometry.dispose();
      topRailGeo.dispose();
      floorRingGeo.dispose();
      floorOuterRingGeo.dispose();
      particleGeo.dispose();
      collarGeo.dispose();
      stemGeo.dispose();
      plinthGeo.dispose();
      plinthRimGeo.dispose();
      disposableTextures.forEach((t) => t.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [products, webglFailed]);

  const handleStep = useCallback(
    (dir: -1 | 1) => {
      if (products.length <= 1) return;
      const stepAngle = (Math.PI * 2) / products.length;
      const nextIdx =
        ((activeIndexRef.current + dir) % products.length + products.length) %
        products.length;
      const desiredAngle = -nextIdx * stepAngle;
      const current = currentAngleRef.current;
      const delta =
        ((desiredAngle - current) % (Math.PI * 2) + Math.PI * 3) %
          (Math.PI * 2) -
        Math.PI;
      targetSnapAngleRef.current = current + delta;
      impulseVelocityRef.current = 0;

      if (webglFailed) {
        setActiveIndex(nextIdx);
        activeIndexRef.current = nextIdx;
      }
    },
    [products.length, webglFailed]
  );

  const handlePushForward = useCallback(() => {
    setIsPlaying(true);
    impulseVelocityRef.current -= 1.45;
    if (webglFailed && products.length > 1) {
      const next = (activeIndexRef.current + 1) % products.length;
      setActiveIndex(next);
      activeIndexRef.current = next;
    }
  }, [products.length, webglFailed]);

  // Fallback auto-advance if WebGL is unavailable
  useEffect(() => {
    if (!webglFailed || !isPlaying || products.length <= 1) return;
    const intervalMs = speedLevel === 1 ? 2600 : speedLevel === 2 ? 1600 : 950;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % products.length;
        activeIndexRef.current = next;
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [isPlaying, products.length, speedLevel, webglFailed]);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-[#4A383A]">
        {t.carousel.empty}
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, products.length - 1);
  const activeProduct = products[safeIndex];
  const loc = localizeProduct(activeProduct, lang);
  const activeColorIdx = colorSelection[activeProduct.id] ?? 0;
  const activeColor = activeProduct.colors[activeColorIdx] || activeProduct.colors[0];

  return (
    <div className="relative select-none">
      {/* 3D Canvas Stage */}
      <div className="relative h-[440px] sm:h-[520px] w-full">
        {!webglFailed ? (
          <div
            ref={mountRef}
            data-cursor="stage"
            className="w-full h-full touch-pan-y"
            aria-label={t.carousel.ariaStage}
          />
        ) : (
          /* Graceful Curved-Edge Fallback Carousel */
          <div className="w-full h-full flex items-center justify-center overflow-hidden px-6">
            <div className="flex items-center justify-center gap-6">
              {[-1, 0, 1].map((offset) => {
                const idx =
                  ((safeIndex + offset) % products.length + products.length) %
                  products.length;
                const item = products[idx];
                const isCenter = offset === 0;
                const cIdx = colorSelection[item.id] ?? 0;
                const img = item.colors[cIdx]?.image || item.images[0] || '';
                return (
                  <button
                    key={`${item.id}-${offset}`}
                    type="button"
                    onClick={() =>
                      isCenter ? onSelectProduct(item) : handleStep(offset as -1 | 1)
                    }
                    className={`relative overflow-hidden rounded-[32px] transition-all duration-500 cursor-pointer shadow-xl bg-white ${
                      isCenter
                        ? 'w-[240px] sm:w-[290px] aspect-[3/4] scale-100 opacity-100 ring-2 ring-[#B8121E]'
                        : 'hidden sm:block w-[200px] aspect-[3/4] scale-90 opacity-60'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Side Navigation Controls */}
        {products.length > 1 && (
          <>
            <button
              type="button"
              data-cursor="link"
              onClick={() => handleStep(-1)}
              aria-label={t.carousel.prev}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 border border-[#B8121E]/25 text-[#B8121E] hover:bg-[#B8121E] hover:text-[#FFE169] hover:scale-105 flex items-center justify-center shadow-[0_10px_26px_rgba(28,7,9,0.12)] backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-cursor="link"
              onClick={() => handleStep(1)}
              aria-label={t.carousel.next}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 border border-[#B8121E]/25 text-[#B8121E] hover:bg-[#B8121E] hover:text-[#FFE169] hover:scale-105 flex items-center justify-center shadow-[0_10px_26px_rgba(28,7,9,0.12)] backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Motion & Velocity Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-1 mb-5 px-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-[#E6DFD5] px-2.5 py-1.5 backdrop-blur-md shadow-[0_10px_28px_rgba(28,7,9,0.08)]">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold text-[#1C0709] hover:text-[#B8121E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#B8121E]" />
                <span>{t.carousel.auto}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#B8121E]" />
                <span>{t.carousel.play}</span>
              </>
            )}
          </button>

          <span className="h-4 w-px bg-[#E6DFD5]" aria-hidden="true" />

          <div className="inline-flex items-center gap-1" role="group" aria-label={t.carousel.speedAria}>
            <Gauge className="w-3.5 h-3.5 text-[#B8121E] ml-1.5 mr-0.5 hidden sm:inline" />
            {([1, 2, 3] as SpeedLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => {
                  setSpeedLevel(level);
                  setIsPlaying(true);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold tabular-nums transition-colors cursor-pointer ${
                  speedLevel === level
                    ? 'bg-[#B8121E] text-[#FFE169]'
                    : 'text-[#4A383A] hover:text-[#B8121E]'
                }`}
              >
                {level}×
              </button>
            ))}
          </div>

          <span className="h-4 w-px bg-[#E6DFD5]" aria-hidden="true" />

          <button
            type="button"
            onClick={handlePushForward}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5C518] hover:bg-[#FFE169] text-[#48050B] text-[11px] uppercase tracking-[0.14em] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>{t.carousel.pushForward}</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Curved Couture Placard for Active 3D Garment */}
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="relative overflow-hidden rounded-[28px] bg-white/96 backdrop-blur-md border border-[#E6DFD5] px-6 sm:px-10 py-6 shadow-[0_24px_60px_rgba(28,7,9,0.1)]">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B8121E] via-[#F5C518] to-[#B8121E]"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${lang}-${activeProduct.id}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#B8121E] font-semibold mb-1.5">
                <span>{loc.gender}</span>
                <span aria-hidden="true" className="text-[#1C0709]/30">·</span>
                <span className="text-[#4A383A]">{loc.category}</span>
                <span aria-hidden="true" className="text-[#1C0709]/30">·</span>
                <span className="text-[#B8121E] font-bold tabular-nums">
                  {String(safeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
                </span>
              </div>

              <h3 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C0709] leading-tight">
                {loc.name}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-[#4A383A] max-w-lg mx-auto line-clamp-2 leading-relaxed">
                {loc.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 pt-4 border-t border-[#EAE3DB] flex flex-wrap items-center justify-center gap-6">
            {activeProduct.colors.length > 0 && (
              <div className="flex items-center gap-2.5">
                {activeProduct.colors.map((color, idx) => {
                  const colorLabel = loc.translateColor(color.name);
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() =>
                        setColorSelection((prev) => ({
                          ...prev,
                          [activeProduct.id]: idx,
                        }))
                      }
                      title={colorLabel}
                      aria-label={`${t.carousel.selectColor} ${colorLabel}`}
                      className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                        idx === activeColorIdx
                          ? 'ring-2 ring-[#B8121E] ring-offset-2 ring-offset-white scale-110'
                          : 'ring-1 ring-black/20 hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
                <span className="text-xs text-[#4A383A] ml-1">
                  {loc.translateColor(activeColor?.name)}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onSelectProduct(activeProduct)}
              className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#B8121E] hover:bg-[#8C0D16] text-[#FFE169] text-xs uppercase tracking-[0.18em] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-[0_8px_20px_rgba(184,18,30,0.22)]"
            >
              <span>{t.carousel.inspectGarment}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFE169] transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

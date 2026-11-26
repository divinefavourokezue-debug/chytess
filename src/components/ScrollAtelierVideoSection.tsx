import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 190;
const DURATION_SECONDS = 8;

function atelierFrameSrc(index: number): string {
  const num = String(Math.min(TOTAL_FRAMES, Math.max(1, index + 1))).padStart(4, '0');
  return `/videos/atelier-frames/f-${num}.webp`;
}

function buildProgressiveFrameOrder(): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (idx: number) => {
    if (idx >= 0 && idx < TOTAL_FRAMES && !seen.has(idx)) {
      seen.add(idx);
      order.push(idx);
    }
  };
  push(0);
  for (const step of [16, 4, 2, 1]) {
    for (let i = 0; i < TOTAL_FRAMES; i += step) {
      push(i);
    }
  }
  return order;
}

const PROGRESSIVE_ORDER = buildProgressiveFrameOrder();

export function ScrollAtelierVideoSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameShellRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: TOTAL_FRAMES }, () => null)
  );
  const loadedMaskRef = useRef<Uint8Array>(new Uint8Array(TOTAL_FRAMES));

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerSmoothRef = useRef({ x: 0, y: 0 });

  const shouldReduceMotion = Boolean(useReducedMotion());
  const shouldReduceMotionRef = useRef(shouldReduceMotion);
  shouldReduceMotionRef.current = shouldReduceMotion;

  const [activeBeatIdx, setActiveBeatIdx] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [hasScrolledIntoReel, setHasScrolledIntoReel] = useState(false);
  const [reducedPlaying, setReducedPlaying] = useState(false);
  const reducedPlayingRef = useRef(reducedPlaying);
  reducedPlayingRef.current = reducedPlaying;

  // Progressive concurrent frame preloader
  useEffect(() => {
    let cancelled = false;
    let cursor = 0;
    const CONCURRENCY = 10;

    const loadNext = () => {
      if (cancelled || cursor >= PROGRESSIVE_ORDER.length) return;
      const idx = PROGRESSIVE_ORDER[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.src = atelierFrameSrc(idx);

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

  // Subtle pointer depth tilt on cinema frame
  useEffect(() => {
    const shell = frameShellRef.current;
    if (!shell || shouldReduceMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerTargetRef.current.x = Math.max(-1, Math.min(1, nx));
      pointerTargetRef.current.y = Math.max(-1, Math.min(1, ny));
    };

    const onPointerLeave = () => {
      pointerTargetRef.current.x = 0;
      pointerTargetRef.current.y = 0;
    };

    shell.addEventListener('pointermove', onPointerMove, { passive: true });
    shell.addEventListener('pointerleave', onPointerLeave);
    return () => {
      shell.removeEventListener('pointermove', onPointerMove);
      shell.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [shouldReduceMotion]);

  // GSAP ScrollTrigger scrub: plays STRICTLY while scrolling, stops when scroll stops
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldReduceMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          targetProgressRef.current = p;

          const scrolled = p > 0.015;
          setHasScrolledIntoReel((prev) => (prev === scrolled ? prev : scrolled));

          const sec = Math.round(p * DURATION_SECONDS);
          setElapsedSec((prev) => (prev === sec ? prev : sec));

          const beat = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
          setActiveBeatIdx((prev) => (prev === beat ? prev : beat));
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  // Render loop drawing current scrolled frame cleanly onto Retina canvas + subtle 3D stage perspective
  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = frameShellRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const drawCoverImage = (img: HTMLImageElement) => {
      if (img.naturalWidth <= 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
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

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(640, Math.round(rect.width * dpr));
      const targetH = Math.max(360, Math.round(rect.height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    let rafId = 0;
    let prevTime = performance.now();
    let lastDrawnFrame = -1;
    let reducedFrame = 0;

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      const dt = Math.min(0.08, Math.max(0.001, (now - prevTime) / 1000));
      prevTime = now;

      if (shouldReduceMotionRef.current) {
        if (reducedPlayingRef.current) {
          reducedFrame = (reducedFrame + dt * 24) % TOTAL_FRAMES;
          smoothProgressRef.current = reducedFrame / (TOTAL_FRAMES - 1);
          const sec = Math.round(smoothProgressRef.current * DURATION_SECONDS);
          setElapsedSec((prev) => (prev === sec ? prev : sec));
        }
      } else {
        // Damped interpolation strictly toward current scroll position (stops completely when scroll stops)
        const lerpFactor = 1 - Math.exp(-11 * dt);
        smoothProgressRef.current +=
          (targetProgressRef.current - smoothProgressRef.current) * lerpFactor;
        if (Math.abs(targetProgressRef.current - smoothProgressRef.current) < 0.0002) {
          smoothProgressRef.current = targetProgressRef.current;
        }
      }

      const progress = Math.max(0, Math.min(1, smoothProgressRef.current));
      const frameIdx = Math.round(progress * (TOTAL_FRAMES - 1));

      if (frameIdx !== lastDrawnFrame || lastDrawnFrame < 0) {
        const img = getClosestFrame(frameIdx);
        if (img && img.naturalWidth > 0) {
          resizeCanvas();
          drawCoverImage(img);
          lastDrawnFrame = frameIdx;
        }
      }

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      if (shell && !shouldReduceMotionRef.current) {
        const tiltEase = 1 - Math.exp(-6.5 * dt);
        pointerSmoothRef.current.x +=
          (pointerTargetRef.current.x - pointerSmoothRef.current.x) * tiltEase;
        pointerSmoothRef.current.y +=
          (pointerTargetRef.current.y - pointerSmoothRef.current.y) * tiltEase;

        // Creative scroll unfold: scales up gently & straightens architectural tilt as reel engages
        const unfold = Math.min(1, progress / 0.22);
        const scrollScale = 0.92 + unfold * 0.08;
        const scrollPitch = (1 - unfold) * 7.5;
        const rotY = pointerSmoothRef.current.x * 2.2;
        const rotX = -pointerSmoothRef.current.y * 1.8 + scrollPitch;

        shell.style.transform = `perspective(1400px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scrollScale.toFixed(4)})`;
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const currentBeat = t.theatre.beats[activeBeatIdx] || t.theatre.beats[0];

  return (
    <section
      ref={sectionRef}
      id="lookbook-reel-section"
      aria-label={t.theatre.ariaSection}
      className={`relative w-full bg-[#FFFFFF] text-[#1C0709] border-b border-[#EAE3DB] ${
        shouldReduceMotion ? 'py-14 sm:py-20' : 'h-[190vh] sm:h-[250vh]'
      }`}
    >
      <div
        className={`${
          shouldReduceMotion ? 'relative' : 'sticky top-0 h-[100dvh]'
        } w-full overflow-hidden flex flex-col justify-center px-3 sm:px-10 pt-16 sm:pt-20 pb-5 sm:pb-8`}
      >
        {/* Soft white gallery lighting with delicate sunlit yellow & crimson studio glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(68% 55% at 50% 52%, rgba(245, 197, 24, 0.14) 0%, rgba(184, 18, 30, 0.05) 48%, rgba(255, 255, 255, 0.96) 100%)',
          }}
        />

        <div className="relative z-10 max-w-[1280px] w-full mx-auto flex flex-col gap-3.5 sm:gap-6">
          {/* Editorial Theatre Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">
            <div>
              <div className="inline-flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                <span className="h-0.5 w-5 sm:w-6 bg-[#F5C518]" aria-hidden="true" />
                <span className="text-[13px] sm:text-[15px] uppercase tracking-[0.16em] sm:tracking-[0.22em] text-[#B8121E] font-semibold">
                  {t.theatre.eyebrow}
                </span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-5xl font-bold text-[#1C0709] leading-tight">
                {t.theatre.titlePre}{' '}
                <span className="italic text-[#B8121E]">{t.theatre.titleItalic}</span>{' '}
                {t.theatre.titlePost}
              </h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-[13px] sm:text-[15px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#4A383A]">
              <span className="tabular-nums font-bold text-[#B8121E]">
                00:{String(elapsedSec).padStart(2, '0')} / 00:{String(DURATION_SECONDS).padStart(2, '0')}
              </span>
              {shouldReduceMotion && (
                <button
                  type="button"
                  onClick={() => setReducedPlaying((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#B8121E] text-[#FFE169] font-bold cursor-pointer"
                >
                  {reducedPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>{t.theatre.pause}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{t.theatre.play}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sculpted 3D Cinema Aperture Frame on Gallery White Mat */}
          <div
            ref={frameShellRef}
            className="relative w-full aspect-video max-h-[62dvh] mx-auto rounded-[20px] sm:rounded-[34px] bg-white p-1.5 sm:p-2 border-2 border-[#F5C518] shadow-[0_32px_80px_rgba(28,7,9,0.14)] will-change-transform"
          >
            <div className="relative w-full h-full rounded-[14px] sm:rounded-[26px] overflow-hidden bg-[#1C0709]">
              <canvas
                ref={canvasRef}
                aria-label={t.theatre.canvasAria}
                className="w-full h-full block"
              />

              {/* Subtle inner crimson hairline frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 sm:inset-3.5 rounded-[12px] sm:rounded-[20px] border border-[#F5C518]/35"
              />

              {/* Soft bottom gradient for legible caption overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-[#1C0709]/85 via-[#1C0709]/35 to-transparent"
              />

              {/* Scroll Cue overlay before scroll starts */}
              {!shouldReduceMotion && !hasScrolledIntoReel && (
                <div className="pointer-events-none absolute top-3 right-3.5 sm:top-5 sm:right-6 flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[14px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#FFE169] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  <span>{t.theatre.scrollToPlay}</span>
                  <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce" />
                </div>
              )}

              {/* Dynamic Scroll-Synced Narrative Caption */}
              <div className="pointer-events-none absolute bottom-3 left-3.5 right-3.5 sm:bottom-5 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2">
                <div>
                  <p className="text-[12px] sm:text-[14px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#F5C518] font-semibold">
                    {currentBeat.index} · {currentBeat.title}
                  </p>
                  <p className="text-[14px] sm:text-base text-white/95 mt-0.5 max-w-lg line-clamp-2">
                    {currentBeat.caption}
                  </p>
                </div>
                <span className="hidden sm:inline text-[13px] uppercase tracking-[0.18em] text-white/75 whitespace-nowrap">
                  {t.theatre.scrollHint}
                </span>
              </div>

              {/* Bottom Hairline Scrub Progress Bar */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[4px] bg-white/25"
              >
                <div
                  ref={progressBarRef}
                  className="h-full w-full bg-gradient-to-r from-[#B8121E] via-[#F5C518] to-[#B8121E] origin-left will-change-transform"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

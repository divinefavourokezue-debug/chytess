import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

type CursorVariant = 'hidden' | 'default' | 'link' | 'product' | 'stage';

const RING_SPRINGS = { stiffness: 320, damping: 28, mass: 0.45 };
const DOT_SPRINGS = { stiffness: 900, damping: 42, mass: 0.15 };

function resolveCursorVariant(target: EventTarget | null): CursorVariant {
  if (!(target instanceof Element)) return 'default';

  if (target.closest('input, textarea, select, [contenteditable="true"]')) {
    return 'hidden';
  }

  const tagged = target.closest<HTMLElement>('[data-cursor]');
  const attr = tagged?.dataset.cursor;
  if (attr === 'product') return 'product';
  if (attr === 'stage') return 'stage';
  if (attr === 'link') return 'link';

  if (target.closest('a, button, [role="button"], summary')) {
    return 'link';
  }

  return 'default';
}

export function EditorialCursor() {
  const { lang } = useLanguage();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');

  const variantRef = useRef<CursorVariant>('default');
  const visibleRef = useRef(false);

  const rawX = useMotionValue(-120);
  const rawY = useMotionValue(-120);

  const ringX = useSpring(rawX, RING_SPRINGS);
  const ringY = useSpring(rawY, RING_SPRINGS);
  const dotX = useSpring(rawX, DOT_SPRINGS);
  const dotY = useSpring(rawY, DOT_SPRINGS);

  useEffect(() => {
    if (shouldReduceMotion || typeof window === 'undefined') {
      setEnabled(false);
      return;
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateMedia = () => setEnabled(mediaQuery.matches);
    updateMedia();

    mediaQuery.addEventListener('change', updateMedia);
    return () => mediaQuery.removeEventListener('change', updateMedia);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;

      rawX.set(e.clientX);
      rawY.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const nextVariant = resolveCursorVariant(e.target);
      if (nextVariant !== variantRef.current) {
        variantRef.current = nextVariant;
        setVariant(nextVariant);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      setPressed(true);
    };

    const handlePointerUp = () => {
      setPressed(false);
    };

    const handleDocumentLeave = () => {
      visibleRef.current = false;
      setVisible(false);
      setPressed(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleDocumentLeave);
    window.addEventListener('blur', handleDocumentLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('mouseleave', handleDocumentLeave);
      window.removeEventListener('blur', handleDocumentLeave);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const isHidden = !visible || variant === 'hidden';
  const isProduct = variant === 'product';
  const isStage = variant === 'stage';
  const isLink = variant === 'link';

  const ringSize = isProduct ? 60 : isStage ? 54 : isLink ? 38 : 26;
  const pressFactor = pressed ? 0.84 : 1;

  const productBadge = lang === 'fr' ? 'VOIR' : 'VIEW';
  const stageBadge = '3D';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      {/* Spring-trailed Outer Editorial Reticle Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isHidden ? 0 : 1,
          scale: pressFactor,
          backgroundColor: isProduct
            ? 'rgba(245, 197, 24, 0.16)'
            : isStage
              ? 'rgba(184, 18, 30, 0.14)'
              : isLink
                ? 'rgba(245, 197, 24, 0.14)'
                : 'rgba(255, 255, 255, 0.04)',
          borderColor: isProduct
            ? 'rgba(184, 18, 30, 0.85)'
            : isStage
              ? 'rgba(245, 197, 24, 0.9)'
              : isLink
                ? 'rgba(184, 18, 30, 0.82)'
                : 'rgba(184, 18, 30, 0.42)',
        }}
        transition={{
          width: { type: 'spring', stiffness: 360, damping: 28 },
          height: { type: 'spring', stiffness: 360, damping: 28 },
          opacity: { duration: 0.18 },
          scale: { type: 'spring', stiffness: 450, damping: 26 },
          backgroundColor: { duration: 0.2 },
          borderColor: { duration: 0.2 },
        }}
        className="absolute top-0 left-0 rounded-full border-[1.5px] backdrop-blur-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(245,197,24,0.18)]"
      >
        {/* Subtle Gold Inner Orbit Accent on Product Cards & Links */}
        {(isProduct || isLink || isStage) && (
          <span
            className={`absolute inset-[3px] rounded-full border transition-opacity duration-200 ${
              isStage ? 'border-[#B8121E]/45' : 'border-[#F5C518]/65'
            }`}
          />
        )}

        {/* Micro Editorial Label on Product Cards / 3D Stage */}
        {(isProduct || isStage) && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.16 }}
            className={`relative z-10 px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.22em] font-bold leading-none ${
              isStage
                ? 'bg-[#B8121E]/90 text-[#FFE169]'
                : 'bg-[#FFFFFF]/92 text-[#B8121E] shadow-xs'
            }`}
          >
            {isStage ? stageBadge : productBadge}
          </motion.span>
        )}
      </motion.div>

      {/* Crisp Center Precision Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isHidden || isProduct || isStage ? 0 : 1,
          scale: pressed ? 0.6 : isLink ? 1.35 : 1,
          backgroundColor: isLink ? '#F5C518' : '#B8121E',
        }}
        transition={{
          opacity: { duration: 0.14 },
          scale: { type: 'spring', stiffness: 520, damping: 30 },
        }}
        className="absolute top-0 left-0 w-[6px] h-[6px] rounded-full ring-1 ring-white/80 shadow-xs"
      />
    </div>
  );
}

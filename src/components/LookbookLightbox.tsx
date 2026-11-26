import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import { localizeProduct } from '../i18n/translations';
import type { Product } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface LookbookLightboxProps {
  product: Product | null;
  onClose: () => void;
}

export function LookbookLightbox({ product, onClose }: LookbookLightboxProps) {
  const { lang, t } = useLanguage();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (!product) return;
    setSelectedColorIdx(0);
    setActiveImage(product.colors[0]?.image || product.images[0] || '');
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const loc = localizeProduct(product, lang);
  const galleryImages = Array.from(
    new Set([
      ...product.images,
      ...product.colors.map((c) => c.image).filter((img): img is string => Boolean(img)),
    ])
  );
  const currentImg = activeImage || galleryImages[0] || '';
  const currentImgIdx = Math.max(0, galleryImages.indexOf(currentImg));

  const stepGallery = (dir: -1 | 1) => {
    if (galleryImages.length <= 1) return;
    const nextIdx =
      ((currentImgIdx + dir) % galleryImages.length + galleryImages.length) %
      galleryImages.length;
    setActiveImage(galleryImages[nextIdx]);
  };

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const activeColorLabel = loc.translateColor(activeColor?.name);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={loc.name}
      className="fixed inset-0 z-50 bg-[#1C0709]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[24px] sm:rounded-[28px] bg-white border-2 border-[#F5C518] max-w-4xl w-full max-h-[92dvh] overflow-y-auto grid grid-cols-1 md:grid-cols-12 relative shadow-[0_32px_90px_rgba(28,7,9,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.lightbox.closeAria}
          className="sticky md:absolute top-3 right-3 sm:top-4 sm:right-4 ml-auto mt-3 mr-3 md:mt-0 md:mr-0 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#B8121E]/25 text-[#B8121E] hover:bg-[#B8121E] hover:text-[#FFE169] flex items-center justify-center transition-colors cursor-pointer shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Primary Sample Photo + Gallery Navigation */}
        <div className="md:col-span-7 bg-[#FAF8F5] p-4 sm:p-6 -mt-10 md:mt-0 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-[#EAE3DB]">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#E6DFD5] bg-white">
            <ImageWithFallback
              src={currentImg}
              alt={`${loc.name} — ${activeColorLabel}`}
              className="w-full h-full object-cover"
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => stepGallery(-1)}
                  aria-label={t.lightbox.prevPhotoAria}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E6DFD5] hover:border-[#B8121E] text-[#1C0709] hover:text-[#B8121E] flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepGallery(1)}
                  aria-label={t.lightbox.nextPhotoAria}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E6DFD5] hover:border-[#B8121E] text-[#1C0709] hover:text-[#B8121E] flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border transition-opacity cursor-pointer bg-white ${
                    currentImg === img
                      ? 'border-[#B8121E] opacity-100 ring-2 ring-[#F5C518]'
                      : 'border-[#E6DFD5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${loc.name} ${t.lightbox.viewWord} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Refined Boutique Product Dossier */}
        <div className="md:col-span-5 p-5 sm:p-9 flex flex-col justify-center space-y-5 text-[#1C0709] bg-white">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#B8121E] font-semibold mb-2">
              {loc.gender} · {loc.category}
            </p>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[#1C0709] leading-tight text-balance">
              {loc.name}
            </h2>
            <p className="text-sm uppercase tracking-[0.14em] text-[#5E4B4D] mt-2">
              {loc.collection}
            </p>
          </div>

          <p className="text-base text-[#4A383A] leading-relaxed">
            {loc.description}
          </p>

          {product.colors.length > 0 && (
            <div className="pt-3 border-t border-[#EAE3DB]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase tracking-[0.14em] text-[#4A383A]">
                  {t.lightbox.colourways}
                </span>
                <span className="text-sm font-semibold text-[#B8121E]">
                  {activeColorLabel}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => {
                  const colorLabel = loc.translateColor(color.name);
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setSelectedColorIdx(idx);
                        if (color.image) setActiveImage(color.image);
                      }}
                      aria-label={`${t.lightbox.selectColor} ${colorLabel}`}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        idx === selectedColorIdx
                          ? 'ring-2 ring-[#B8121E] ring-offset-2 ring-offset-white scale-105'
                          : 'ring-1 ring-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="pt-3 border-t border-[#EAE3DB] flex items-baseline justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.14em] text-[#4A383A] shrink-0">
                {t.lightbox.sizesLabel}
              </span>
              <span className="text-sm font-semibold text-[#1C0709] tracking-[0.1em] text-right">
                {product.sizes.join(' · ')}
              </span>
            </div>
          )}

          {loc.details.length > 0 && (
            <div className="pt-3 border-t border-[#EAE3DB]">
              <h3 className="text-xs uppercase tracking-[0.14em] text-[#B8121E] font-semibold mb-2">
                {t.lightbox.materialsCut}
              </h3>
              <ul className="space-y-1.5 text-base text-[#4A383A]">
                {loc.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <span className="text-[#F5C518] font-bold">—</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <a
              href={t.lightbox.whatsappProductMsg(
                activeColorLabel ? `${loc.name} (${activeColorLabel})` : loc.name
              )}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-[#B8121E] hover:bg-[#8C0D16] text-[#FFE169] text-sm uppercase tracking-[0.16em] font-bold shadow-[0_10px_24px_rgba(184,18,30,0.22)] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.lightbox.inquireWhatsapp}</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


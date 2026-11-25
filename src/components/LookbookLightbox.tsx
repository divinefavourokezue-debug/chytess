import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (!product) return;
    setSelectedColorIdx(0);
    setActiveImage(product.colors[0]?.image || product.images[0] || '');
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const loc = localizeProduct(product, lang);
  const galleryImages = Array.from(
    new Set([
      ...product.images,
      ...product.colors.map((c) => c.image).filter((img): img is string => Boolean(img)),
    ])
  );
  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const activeColorLabel = loc.translateColor(activeColor?.name);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={loc.name}
      className="fixed inset-0 z-50 bg-[#1C0709]/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="rounded-[28px] bg-white border-2 border-[#F5C518] max-w-4xl w-full max-h-[92dvh] overflow-y-auto grid grid-cols-1 md:grid-cols-12 relative shadow-[0_32px_90px_rgba(28,7,9,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.lightbox.closeAria}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white border border-[#B8121E]/25 text-[#B8121E] hover:bg-[#B8121E] hover:text-[#FFE169] flex items-center justify-center transition-colors cursor-pointer shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Primary Sample Photo + Angle Thumbnails */}
        <div className="md:col-span-7 bg-[#FAF8F5] p-4 sm:p-6 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-[#EAE3DB]">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#E6DFD5] bg-white">
            <ImageWithFallback
              src={activeImage || product.images[0] || ''}
              alt={`${loc.name} — ${activeColorLabel}`}
              className="w-full h-full object-cover"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border transition-opacity cursor-pointer bg-white ${
                    activeImage === img
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

        {/* Right: Clean Lookbook Information */}
        <div className="md:col-span-5 p-6 sm:p-10 flex flex-col justify-center space-y-6 text-[#1C0709] bg-white">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8121E] font-semibold mb-2">
              {loc.gender} · {loc.category}
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C0709] leading-tight">
              {loc.name}
            </h2>
            <p className="text-xs uppercase tracking-[0.16em] text-[#5E4B4D] mt-2">
              {loc.collection}
            </p>
          </div>

          <p className="text-sm text-[#4A383A] leading-relaxed">
            {loc.description}
          </p>

          {product.colors.length > 0 && (
            <div className="pt-3 border-t border-[#EAE3DB]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#4A383A]">
                  {t.lightbox.colourways}
                </span>
                <span className="text-xs font-semibold text-[#B8121E]">
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

          {loc.details.length > 0 && (
            <div className="pt-3 border-t border-[#EAE3DB]">
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-[#B8121E] font-semibold mb-2.5">
                {t.lightbox.materialsCut}
              </h3>
              <ul className="space-y-1.5 text-sm text-[#4A383A]">
                {loc.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <span className="text-[#F5C518] font-bold">—</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

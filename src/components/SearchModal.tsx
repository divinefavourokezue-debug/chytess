import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { localizeProduct } from '../i18n/translations';
import type { Product } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface SearchModalProps {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function SearchModal({
  open,
  products,
  onClose,
  onSelectProduct,
}: SearchModalProps) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
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
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed
    ? products.filter((p) => {
        const loc = localizeProduct(p, lang);
        return (
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.gender.toLowerCase().includes(trimmed) ||
          p.collection.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed) ||
          loc.name.toLowerCase().includes(trimmed) ||
          loc.category.toLowerCase().includes(trimmed) ||
          loc.gender.toLowerCase().includes(trimmed) ||
          loc.collection.toLowerCase().includes(trimmed) ||
          loc.description.toLowerCase().includes(trimmed)
        );
      })
    : products.slice(0, 4);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.searchAria}
      className="fixed inset-0 z-50 bg-[#1C0709]/50 backdrop-blur-sm flex flex-col"
    >
      <div className="bg-white border-b-4 border-[#F5C518] shadow-[0_24px_60px_rgba(28,7,9,0.18)] max-h-[88dvh] overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-3 border-b-2 border-[#B8121E] pb-3">
            <Search className="w-5 h-5 text-[#B8121E] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className="flex-1 bg-transparent text-base sm:text-lg text-[#1C0709] placeholder:text-[#8E7B7D] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs uppercase tracking-wider text-[#B8121E] hover:text-[#8C0D16] font-semibold cursor-pointer"
              >
                {t.search.clear}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t.search.closeAria}
              className="p-1.5 text-[#1C0709] hover:text-[#B8121E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Explore Functional Filter Controls */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs uppercase tracking-[0.12em] text-[#5E4B4D] font-semibold mr-1">
              {t.search.quickLabel}:
            </span>
            {t.search.quickTags.map((tag) => {
              const active = trimmed === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(active ? '' : tag)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#B8121E] text-[#FFE169]'
                      : 'bg-[#FAF8F5] text-[#4A383A] hover:text-[#B8121E] border border-[#E6DFD5]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-[0.14em] text-[#B8121E] font-semibold">
                {trimmed ? t.search.matchingPieces(matches.length) : t.search.highlights}
              </span>
            </div>

            {matches.length === 0 ? (
              <p className="text-sm text-[#4A383A] py-6">
                {t.search.empty(query)}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {matches.slice(0, 8).map((prod) => {
                  const loc = localizeProduct(prod, lang);
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(prod);
                      }}
                      className="text-left group cursor-pointer"
                    >
                      <div className="aspect-[3/4] rounded-2xl bg-[#FAF8F5] overflow-hidden mb-2 border border-[#E6DFD5] group-hover:border-[#B8121E] transition-colors">
                        <ImageWithFallback
                          src={prod.images[0]}
                          alt={loc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-[11px] uppercase tracking-wider text-[#B8121E] font-semibold truncate">
                        {loc.gender} · {loc.category}
                      </p>
                      <p className="text-sm font-medium text-[#1C0709] truncate group-hover:text-[#B8121E] transition-colors mt-0.5">
                        {loc.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}


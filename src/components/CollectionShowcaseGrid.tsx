import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { localizeProduct } from '../i18n/translations';
import type { Product } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

export type CollectionTab = 'ALL' | 'MEN' | 'WOMEN' | 'UNDERWEAR' | 'FOOTWEAR' | 'ACCESSORIES';

interface CollectionShowcaseGridProps {
  allProducts: Product[];
  visibleProducts: Product[];
  activeTab: CollectionTab;
  activeTabLabel: string;
  onSelectProduct: (product: Product) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface EditorialShelfCardProps {
  product: Product;
  index: number;
  activeColorIdx: number;
  shouldReduceMotion: boolean;
  onSelectColor: (productId: string, colorIdx: number) => void;
  onSelectProduct: (product: Product) => void;
}

function EditorialShelfCard({
  product,
  index,
  activeColorIdx,
  shouldReduceMotion,
  onSelectColor,
  onSelectProduct,
}: EditorialShelfCardProps) {
  const { lang, t } = useLanguage();

  const loc = localizeProduct(product, lang);
  const activeColor = product.colors[activeColorIdx] || product.colors[0];
  const cardImage =
    activeColor?.image || product.images[0] || product.colors[0]?.image || '';

  return (
    <motion.article
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -5,
              transition: { duration: 0.28, ease: EDITORIAL_EASE },
            }
      }
      className="group w-[47%] sm:w-[265px] lg:w-[295px] shrink-0 snap-start flex flex-col min-w-0 rounded-[16px] sm:rounded-[26px] bg-white border border-[#E6DFD5] hover:border-[#B8121E]/85 overflow-hidden shadow-[0_10px_26px_rgba(28,7,9,0.06)] sm:shadow-[0_16px_42px_rgba(28,7,9,0.06)] hover:shadow-[0_24px_54px_rgba(184,18,30,0.16)] editorial-card-lift"
    >
      {/* Garment Image */}
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        aria-label={`${t.grid.inspectAria} ${loc.name}`}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-[#F7F4F0] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8121E]"
      >
        <ImageWithFallback
          src={cardImage}
          alt={`${loc.name}${activeColor?.name ? ` ${t.grid.inColor} ${loc.translateColor(activeColor.name)}` : ''}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#1C0709]/76 via-[#1C0709]/26 to-transparent"
        />
        <span className="pointer-events-none absolute bottom-2 left-2.5 sm:bottom-3.5 sm:left-5 text-[11px] sm:text-[13px] uppercase tracking-[0.1em] sm:tracking-[0.16em] text-[#FFE169] font-bold tabular-nums">
          {t.grid.noPrefix} {String(index + 1).padStart(2, '0')}
        </span>
        {product.isNewArrival && (
          <span className="pointer-events-none absolute bottom-2 right-2.5 sm:bottom-3.5 sm:right-5 text-[11px] sm:text-[13px] uppercase tracking-[0.1em] sm:tracking-[0.16em] text-[#FFFFFF] font-bold">
            {t.grid.newArrival}
          </span>
        )}
      </button>

      {/* Hairline Crimson-Gold Accent */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-gradient-to-r from-[#F5C518] via-[#B8121E] to-transparent"
      />

      {/* Card Typography & Swatch Controls */}
      <div className="flex flex-col flex-1 min-w-0 p-2.5 sm:p-5 bg-white">
        <div className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[14px] uppercase tracking-[0.06em] sm:tracking-[0.14em] text-[#B8121E] font-semibold mb-1 sm:mb-1.5 min-w-0 truncate">
          <span className="shrink-0">{loc.gender}</span>
          <span aria-hidden="true" className="text-[#1C0709]/30 shrink-0">
            ·
          </span>
          <span className="text-[#4A383A] truncate">{loc.category}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left cursor-pointer group/title min-w-0"
        >
          <h4 className="font-editorial text-[19px] min-[375px]:text-[20px] sm:text-[24px] font-bold text-[#1C0709] group-hover/title:text-[#B8121E] transition-colors leading-snug text-balance break-words line-clamp-2">
            {loc.name}
          </h4>
        </button>

        <p className="mt-1 sm:mt-2 text-[14px] min-[375px]:text-[15px] sm:text-[17px] text-[#4A383A] line-clamp-2 leading-snug sm:leading-relaxed">
          {loc.description}
        </p>

        <div className="mt-auto pt-2.5 sm:pt-4 flex items-center justify-between gap-1.5 sm:gap-2 border-t border-[#EAE3DB]">
          {product.colors.length > 0 ? (
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              {product.colors.slice(0, 4).map((color, cIdx) => {
                const colorLabel = loc.translateColor(color.name);
                return (
                  <button
                    key={`${product.id}-${color.name}`}
                    type="button"
                    onClick={() => onSelectColor(product.id, cIdx)}
                    title={colorLabel}
                    aria-label={`${t.grid.previewColor} ${loc.name} ${t.grid.inColor} ${colorLabel}`}
                    className={`w-2.5 h-2.5 min-[375px]:w-3 min-[375px]:h-3 sm:w-4 sm:h-4 rounded-full transition-transform cursor-pointer shrink-0 ${
                      cIdx === activeColorIdx
                        ? 'ring-2 ring-[#B8121E] ring-offset-1 sm:ring-offset-2 ring-offset-white scale-110'
                        : 'ring-1 ring-black/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          ) : (
            <span className="text-[13px] sm:text-[15px] text-[#4A383A] truncate">
              {loc.collection}
            </span>
          )}

          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#F5C518] group-hover:bg-[#B8121E] text-[#48050B] group-hover:text-[#FFE169] text-[12px] sm:text-[14px] uppercase tracking-[0.06em] sm:tracking-[0.12em] font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>{t.grid.inspectBtn}</span>
            <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export interface HorizontalShelfSectionProps {
  eyebrow: string;
  verticalLabel: string;
  verticalCode: string;
  titlePre: string;
  titleItalic: string;
  subtitle: string;
  items: Product[];
  selectedColors?: Record<string, number>;
  shouldReduceMotion?: boolean;
  onSelectColor?: (productId: string, colorIdx: number) => void;
  onSelectProduct: (product: Product) => void;
  verticalTitleAside?: ReactNode;
}

export function HorizontalShelfSection({
  eyebrow,
  verticalLabel,
  verticalCode,
  titlePre,
  titleItalic,
  subtitle,
  items,
  selectedColors,
  shouldReduceMotion,
  onSelectColor,
  onSelectProduct,
  verticalTitleAside,
}: HorizontalShelfSectionProps) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const effectiveReduceMotion = shouldReduceMotion ?? Boolean(reducedMotion);
  const [internalColors, setInternalColors] = useState<Record<string, number>>({});
  const activeColors = selectedColors ?? internalColors;
  const handleColorPick =
    onSelectColor ??
    ((productId: string, colorIdx: number) => {
      setInternalColors((prev) => ({
        ...prev,
        [productId]: colorIdx,
      }));
    });

  const railRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateScrollArrows();
    window.addEventListener('resize', updateScrollArrows, { passive: true });
    return () => window.removeEventListener('resize', updateScrollArrows);
  }, [items, updateScrollArrows]);

  const scrollRailBy = (direction: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const distance = Math.max(260, Math.round(el.clientWidth * 0.78));
    el.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={
        effectiveReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: effectiveReduceMotion ? 0 : 0.65, ease: EDITORIAL_EASE }}
      className="space-y-4 sm:space-y-5"
    >
      {/* Row Editorial Header + Manual Left / Right Scroll Controls */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-3 rounded-2xl glass-atelier border border-[#E6DFD5] px-4 sm:px-6 py-3.5 sm:py-4 shadow-[0_12px_32px_rgba(28,7,9,0.08)]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#B8121E] via-[#F5C518] to-transparent"
        />
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-1">
            <span className="h-0.5 w-5 sm:w-6 bg-[#F5C518]" aria-hidden="true" />
            <span className="text-[13px] sm:text-[15px] uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#B8121E] font-semibold">
              {eyebrow}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-editorial text-2xl sm:text-4xl font-bold text-[#1C0709] tracking-tight">
              {titlePre}{' '}
              <span className="italic text-[#B8121E]">{titleItalic}</span>
            </h3>
            <span className="text-[13px] sm:text-[15px] uppercase tracking-[0.12em] text-[#B8121E] font-bold tabular-nums">
              ({String(items.length).padStart(2, '0')})
            </span>
          </div>
          <p className="text-[15px] sm:text-[17px] text-[#4A383A] mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-[13px] sm:text-[15px] uppercase tracking-[0.12em] text-[#4A383A] font-medium">
            {t.grid.swipeHint}
          </span>
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollRailBy(-1)}
              disabled={!canScrollLeft}
              aria-label={t.grid.scrollLeftAria}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E6DFD5] hover:border-[#B8121E] hover:bg-[#B8121E] text-[#1C0709] hover:text-[#FFE169] disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRailBy(1)}
              disabled={!canScrollRight}
              aria-label={t.grid.scrollRightAria}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F5C518] hover:bg-[#B8121E] text-[#48050B] hover:text-[#FFE169] disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stylish Vertical Division Spine Beside Manual Horizontal Scroll Rail */}
      <div className="flex items-stretch gap-2 sm:gap-4">
        {verticalTitleAside ?? (
          <aside
            aria-label={verticalLabel}
            className="relative w-8 sm:w-14 shrink-0 rounded-[14px] sm:rounded-[24px] bg-[#B8121E] bg-gradient-to-b from-[#B8121E] via-[#B8121E] to-[#8C0D16] border border-white/45 shadow-[0_14px_34px_rgba(184,18,30,0.28)] flex flex-col items-center justify-between py-3 sm:py-5 overflow-hidden select-none"
          >
            <span
              aria-hidden="true"
              className="w-full h-[3px] absolute top-0 inset-x-0 bg-gradient-to-r from-white/25 via-white to-white/25"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[3px] sm:inset-1 rounded-[11px] sm:rounded-[20px] border border-white/25"
            />
            <span className="relative z-10 text-[12px] sm:text-[14px] font-bold tabular-nums tracking-[0.12em] text-white/95 pt-1">
              {verticalCode}
            </span>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2 sm:gap-3 py-2 min-h-0">
              <span
                aria-hidden="true"
                className="w-[1.5px] h-4 sm:h-7 bg-gradient-to-b from-transparent via-white/85 to-white/30"
              />
              <span
                className="font-editorial text-[16px] sm:text-[23px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.3em] text-white whitespace-nowrap [writing-mode:vertical-rl] rotate-180 drop-shadow-[0_1px_2px_rgba(72,5,11,0.35)]"
              >
                {verticalLabel}
              </span>
              <span
                aria-hidden="true"
                className="w-[1.5px] h-4 sm:h-7 bg-gradient-to-b from-white/30 via-white/85 to-transparent"
              />
            </div>

            <span
              aria-hidden="true"
              className="relative z-10 w-3 sm:w-5 h-0.5 bg-white/90"
            />
          </aside>
        )}

        <div
          ref={railRef}
          onScroll={updateScrollArrows}
          className={`flex-1 min-w-0 flex flex-nowrap gap-2 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pt-1 editorial-rail-scroll ${
            canScrollLeft && canScrollRight
              ? 'rail-mask-both'
              : canScrollRight
                ? 'rail-mask-right'
                : canScrollLeft
                  ? 'rail-mask-left'
                  : ''
          }`}
        >
          {items.map((product, index) => (
            <EditorialShelfCard
              key={`${eyebrow}-${product.id}`}
              product={product}
              index={index}
              activeColorIdx={activeColors[product.id] ?? 0}
              shouldReduceMotion={effectiveReduceMotion}
              onSelectColor={handleColorPick}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function CollectionShowcaseGrid({
  allProducts,
  visibleProducts,
  activeTab,
  activeTabLabel,
  onSelectProduct,
}: CollectionShowcaseGridProps) {
  const { t } = useLanguage();
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const shouldReduceMotion = Boolean(useReducedMotion());

  const handleSelectColor = (productId: string, colorIdx: number) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: colorIdx,
    }));
  };

  // Line 1: Everything for Men (Menswear apparel first, then unisex footwear & accessories)
  const menItems = useMemo(() => {
    const menPrimary = allProducts.filter((p) => p.gender === 'Men');
    const unisexItems = allProducts.filter((p) => p.gender === 'Unisex');
    return [...menPrimary, ...unisexItems];
  }, [allProducts]);

  // Line 2: Everything concerning Women (Gowns, Feminine Dresses, Suits, Coats, Intimates, Bags & Heels, plus Unisex)
  const womenItems = useMemo(() => {
    const priorityOrder = [
      'prod-w8',
      'prod-w9',
      'prod-w10',
      'prod-w11',
      'prod-w5',
      'prod-w1',
      'prod-w2',
      'prod-w3',
      'prod-w4',
      'prod-w6',
      'prod-w7',
    ];
    const womenPrimary = allProducts
      .filter((p) => p.gender === 'Women')
      .sort((a, b) => {
        const idxA = priorityOrder.indexOf(a.id);
        const idxB = priorityOrder.indexOf(b.id);
        const rankA = idxA === -1 ? 999 : idxA;
        const rankB = idxB === -1 ? 999 : idxB;
        return rankA - rankB;
      });
    const unisexItems = allProducts.filter((p) => p.gender === 'Unisex');
    return [...womenPrimary, ...unisexItems];
  }, [allProducts]);

  // Line 3: Underwear Division (Pants/Briefs, Boxers, Brassiere, Singlet, Tights & Lingerie Sets)
  const underwearItems = useMemo(() => {
    const priorityOrder = ['prod-u1', 'prod-u2', 'prod-u3', 'prod-u4', 'prod-u5', 'prod-w6', 'prod-w7'];
    return allProducts
      .filter((p) => p.category === 'Intimates')
      .sort((a, b) => {
        const idxA = priorityOrder.indexOf(a.id);
        const idxB = priorityOrder.indexOf(b.id);
        const rankA = idxA === -1 ? 999 : idxA;
        const rankB = idxB === -1 ? 999 : idxB;
        return rankA - rankB;
      });
  }, [allProducts]);

  // Line 4: Accessories Division (Chains, Necklaces, Watches, Bangles, Perfumes, Bags & Headwear)
  const accessoriesItems = useMemo(() => {
    const priorityOrder = ['prod-a3', 'prod-a4', 'prod-a5', 'prod-a6', 'prod-a2', 'prod-10', 'prod-09'];
    return allProducts
      .filter((p) =>
        ['Accessories', 'Leather Goods', 'Caps', 'Jewellery', 'Fragrance'].includes(p.category)
      )
      .sort((a, b) => {
        const idxA = priorityOrder.indexOf(a.id);
        const idxB = priorityOrder.indexOf(b.id);
        const rankA = idxA === -1 ? 999 : idxA;
        const rankB = idxB === -1 ? 999 : idxB;
        return rankA - rankB;
      });
  }, [allProducts]);

  if (visibleProducts.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-20 pt-8 sm:pt-12 border-t border-white/60 space-y-8 sm:space-y-12">
      {activeTab === 'ALL' ? (
        <>
          <HorizontalShelfSection
            eyebrow={t.grid.menRowEyebrow}
            verticalLabel={t.grid.verticalMen}
            verticalCode="01"
            titlePre={t.grid.menRowTitle}
            titleItalic={t.grid.menRowTitleItalic}
            subtitle={t.grid.menRowSubtitle}
            items={menItems}
            selectedColors={selectedColors}
            shouldReduceMotion={shouldReduceMotion}
            onSelectColor={handleSelectColor}
            onSelectProduct={onSelectProduct}
          />

          <HorizontalShelfSection
            eyebrow={t.grid.womenRowEyebrow}
            verticalLabel={t.grid.verticalWomen}
            verticalCode="02"
            titlePre={t.grid.womenRowTitle}
            titleItalic={t.grid.womenRowTitleItalic}
            subtitle={t.grid.womenRowSubtitle}
            items={womenItems}
            selectedColors={selectedColors}
            shouldReduceMotion={shouldReduceMotion}
            onSelectColor={handleSelectColor}
            onSelectProduct={onSelectProduct}
          />

          <HorizontalShelfSection
            eyebrow={t.grid.underwearRowEyebrow}
            verticalLabel={t.grid.verticalUnderwear}
            verticalCode="03"
            titlePre={t.grid.underwearRowTitle}
            titleItalic={t.grid.underwearRowTitleItalic}
            subtitle={t.grid.underwearRowSubtitle}
            items={underwearItems}
            selectedColors={selectedColors}
            shouldReduceMotion={shouldReduceMotion}
            onSelectColor={handleSelectColor}
            onSelectProduct={onSelectProduct}
          />

          <HorizontalShelfSection
            eyebrow={t.grid.accessoriesRowEyebrow}
            verticalLabel={t.grid.verticalAccessories}
            verticalCode="04"
            titlePre={t.grid.accessoriesRowTitle}
            titleItalic={t.grid.accessoriesRowTitleItalic}
            subtitle={t.grid.accessoriesRowSubtitle}
            items={accessoriesItems}
            selectedColors={selectedColors}
            shouldReduceMotion={shouldReduceMotion}
            onSelectColor={handleSelectColor}
            onSelectProduct={onSelectProduct}
          />
        </>
      ) : (
        <HorizontalShelfSection
          eyebrow={`${t.grid.eyebrowPrefix} · ${activeTabLabel}`}
          verticalLabel={
            activeTab === 'MEN'
              ? t.grid.verticalMen
              : activeTab === 'WOMEN'
                ? t.grid.verticalWomen
                : activeTab === 'UNDERWEAR'
                  ? t.grid.verticalUnderwear
                  : activeTab === 'ACCESSORIES'
                    ? t.grid.verticalAccessories
                    : activeTabLabel
          }
          verticalCode={
            activeTab === 'MEN'
              ? '01'
              : activeTab === 'WOMEN'
                ? '02'
                : activeTab === 'UNDERWEAR'
                  ? '03'
                  : '04'
          }
          titlePre={
            activeTab === 'MEN'
              ? t.grid.menRowTitle
              : activeTab === 'WOMEN'
                ? t.grid.womenRowTitle
                : activeTab === 'UNDERWEAR'
                  ? t.grid.underwearRowTitle
                  : activeTab === 'FOOTWEAR'
                    ? t.grid.footwearRowTitle
                    : t.grid.accessoriesRowTitle
          }
          titleItalic={
            activeTab === 'MEN'
              ? t.grid.menRowTitleItalic
              : activeTab === 'WOMEN'
                ? t.grid.womenRowTitleItalic
                : activeTab === 'UNDERWEAR'
                  ? t.grid.underwearRowTitleItalic
                  : activeTab === 'FOOTWEAR'
                    ? t.grid.footwearRowTitleItalic
                    : t.grid.accessoriesRowTitleItalic
          }
          subtitle={
            activeTab === 'MEN'
              ? t.grid.menRowSubtitle
              : activeTab === 'WOMEN'
                ? t.grid.womenRowSubtitle
                : activeTab === 'UNDERWEAR'
                  ? t.grid.underwearRowSubtitle
                  : activeTab === 'FOOTWEAR'
                    ? t.grid.footwearRowSubtitle
                    : t.grid.accessoriesRowSubtitle
          }
          items={
            activeTab === 'WOMEN'
              ? womenItems
              : activeTab === 'UNDERWEAR'
                ? underwearItems
                : activeTab === 'ACCESSORIES'
                  ? accessoriesItems
                  : visibleProducts
          }
          selectedColors={selectedColors}
          shouldReduceMotion={shouldReduceMotion}
          onSelectColor={handleSelectColor}
          onSelectProduct={onSelectProduct}
        />
      )}
    </div>
  );
}

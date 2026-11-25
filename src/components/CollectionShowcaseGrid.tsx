import { useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { localizeProduct } from '../i18n/translations';
import type { Product } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface CollectionShowcaseGridProps {
  products: Product[];
  activeTabLabel: string;
  onSelectProduct: (product: Product) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CURTAIN_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

interface EditorialProductCardProps {
  product: Product;
  index: number;
  activeColorIdx: number;
  shouldReduceMotion: boolean;
  onSelectColor: (productId: string, colorIdx: number) => void;
  onSelectProduct: (product: Product) => void;
}

function EditorialProductCard({
  product,
  index,
  activeColorIdx,
  shouldReduceMotion,
  onSelectColor,
  onSelectProduct,
}: EditorialProductCardProps) {
  const { lang, t } = useLanguage();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const loc = localizeProduct(product, lang);
  const activeColor = product.colors[activeColorIdx] || product.colors[0];
  const cardImage =
    activeColor?.image || product.images[0] || product.colors[0]?.image || '';

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  const column = index % 3;
  const colRange: [number, number] = shouldReduceMotion
    ? [0, 0]
    : column === 0
      ? [14, -14]
      : column === 1
        ? [-8, 10]
        : [16, -16];

  const columnParallaxY = useTransform(smoothProgress, [0, 1], colRange);
  const imageParallaxY = useTransform(
    smoothProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['-4%', '4%']
  );

  const staggerDelay = shouldReduceMotion ? 0 : column * 0.1;

  return (
    <motion.div
      ref={cardRef}
      initial={
        shouldReduceMotion
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 52, scale: 0.96 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.85,
        delay: staggerDelay,
        ease: EDITORIAL_EASE,
      }}
      className="will-change-transform"
    >
      <motion.div
        style={{ y: columnParallaxY }}
        className="h-full will-change-transform"
      >
        <motion.article
          data-cursor="product"
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  y: -6,
                  transition: { duration: 0.34, ease: EDITORIAL_EASE },
                }
          }
          className="group flex flex-col h-full rounded-[28px] bg-white border border-[#E6DFD5] hover:border-[#B8121E] overflow-hidden shadow-[0_16px_42px_rgba(28,7,9,0.06)] hover:shadow-[0_26px_58px_rgba(184,18,30,0.14)] transition-[border-color,box-shadow] duration-300"
        >
          {/* Editorial Curtain-Revealed Garment Visual with Inner Scroll Parallax */}
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            aria-label={`${t.grid.inspectAria} ${loc.name}`}
            className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F4F0] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8121E]"
          >
            <motion.div
              initial={
                shouldReduceMotion
                  ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
                  : { clipPath: 'inset(14% 0% 0% 0%)', scale: 1.1 }
              }
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.95,
                delay: staggerDelay + 0.06,
                ease: CURTAIN_EASE,
              }}
              className="w-full h-full will-change-transform"
            >
              <motion.div
                style={{ y: imageParallaxY }}
                className="w-full h-[108%] -mt-[4%] will-change-transform"
              >
                <ImageWithFallback
                  src={cardImage}
                  alt={`${loc.name}${activeColor?.name ? ` ${t.grid.inColor} ${loc.translateColor(activeColor.name)}` : ''}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </motion.div>
            </motion.div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1C0709]/68 via-[#1C0709]/20 to-transparent"
            />
            <span className="pointer-events-none absolute bottom-3.5 left-5 text-[10px] uppercase tracking-[0.22em] text-[#FFE169] font-bold tabular-nums">
              {t.grid.noPrefix} {String(index + 1).padStart(2, '0')}
            </span>
            {product.isNewArrival && (
              <span className="pointer-events-none absolute bottom-3.5 right-5 text-[10px] uppercase tracking-[0.22em] text-[#FFFFFF] font-bold">
                {t.grid.newArrival}
              </span>
            )}
          </button>

          {/* Animated Editorial Hairline Divider */}
          <motion.div
            aria-hidden="true"
            initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.75,
              delay: staggerDelay + 0.18,
              ease: EDITORIAL_EASE,
            }}
            className="h-[2px] w-full origin-left bg-gradient-to-r from-[#F5C518] via-[#B8121E] to-transparent"
          />

          {/* Card Typography & Swatch Controls */}
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.65,
              delay: staggerDelay + 0.16,
              ease: EDITORIAL_EASE,
            }}
            className="flex flex-col flex-1 p-5 sm:p-6 bg-white"
          >
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#B8121E] font-semibold mb-1.5">
              <span>{loc.gender}</span>
              <span aria-hidden="true" className="text-[#1C0709]/30">
                ·
              </span>
              <span className="text-[#4A383A] truncate">{loc.category}</span>
            </div>

            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="text-left cursor-pointer group/title"
            >
              <h4 className="font-editorial text-2xl font-normal text-[#1C0709] group-hover/title:text-[#B8121E] transition-colors leading-snug text-balance">
                {loc.name}
              </h4>
            </button>

            <p className="mt-2 text-xs sm:text-sm text-[#4A383A] line-clamp-2 leading-relaxed">
              {loc.description}
            </p>

            <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-[#EAE3DB]">
              {product.colors.length > 0 ? (
                <div className="flex items-center gap-2 min-w-0">
                  {product.colors.slice(0, 4).map((color, cIdx) => {
                    const colorLabel = loc.translateColor(color.name);
                    return (
                      <button
                        key={`${product.id}-${color.name}`}
                        type="button"
                        data-cursor="link"
                        onClick={() => onSelectColor(product.id, cIdx)}
                        title={colorLabel}
                        aria-label={`${t.grid.previewColor} ${loc.name} ${t.grid.inColor} ${colorLabel}`}
                        className={`w-4 h-4 rounded-full transition-transform cursor-pointer shrink-0 ${
                          cIdx === activeColorIdx
                            ? 'ring-2 ring-[#B8121E] ring-offset-2 ring-offset-white scale-110'
                            : 'ring-1 ring-black/20 hover:scale-110'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              ) : (
                <span className="text-[11px] text-[#4A383A] truncate">
                  {loc.collection}
                </span>
              )}

              <button
                type="button"
                data-cursor="link"
                onClick={() => onSelectProduct(product)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5C518] group-hover:bg-[#B8121E] text-[#48050B] group-hover:text-[#FFE169] text-[11px] uppercase tracking-[0.18em] font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
              >
                <span>{t.grid.inspectBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </motion.article>
      </motion.div>
    </motion.div>
  );
}

export function CollectionShowcaseGrid({
  products,
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

  if (products.length === 0) return null;

  return (
    <div className="mt-16 sm:mt-24 pt-12 border-t border-white/60">
      {/* Sub-section Catalogue Header */}
      <motion.div
        initial={
          shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: EDITORIAL_EASE }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12 rounded-2xl bg-white/92 backdrop-blur-md border border-[#E6DFD5] px-6 py-5 shadow-[0_12px_32px_rgba(28,7,9,0.08)]"
      >
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="h-0.5 w-6 bg-[#F5C518]" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#B8121E] font-semibold">
              {t.grid.eyebrowPrefix} · {activeTabLabel}
            </span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-4xl font-normal text-[#1C0709] tracking-tight">
            {t.grid.titlePre}{' '}
            <span className="italic text-[#B8121E]">{t.grid.titleItalic}</span>
          </h3>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-[#4A383A] tabular-nums">
          {t.grid.piecesCount(products.length)}
        </p>
      </motion.div>

      {/* Responsive 3-Column Framer Motion Editorial Lookbook Grid */}
      <div
        key={activeTabLabel}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 py-2"
      >
        {products.map((product, index) => (
          <EditorialProductCard
            key={`${activeTabLabel}-${product.id}`}
            product={product}
            index={index}
            activeColorIdx={selectedColors[product.id] ?? 0}
            shouldReduceMotion={shouldReduceMotion}
            onSelectColor={handleSelectColor}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
}

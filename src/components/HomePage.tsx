import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import type { Product } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { ClothingCarousel3D } from './ClothingCarousel3D';
import { CollectionShowcaseGrid } from './CollectionShowcaseGrid';
import { ImageWithFallback } from './ImageWithFallback';
import { ScrollAtelierVideoSection } from './ScrollAtelierVideoSection';
import { ScrollVideoSection } from './ScrollVideoSection';

gsap.registerPlugin(ScrollTrigger);

const COLLECTION_WALLPAPER_URL =
  'https://i.pinimg.com/736x/ed/af/d0/edafd0b764f98c34ad82d92f9ccfdc8c.jpg';

const ABOUT_WALLPAPER_URL = '/assets/aistudio/image_6f66ab11.png';

const FOUNDER_WALLPAPER_URL = '/assets/aistudio/image_2a7462bc.png';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

type CollectionTab = 'ALL' | 'MEN' | 'WOMEN' | 'FOOTWEAR' | 'ACCESSORIES';

const COLLECTION_TAB_IDS: CollectionTab[] = [
  'ALL',
  'MEN',
  'WOMEN',
  'FOOTWEAR',
  'ACCESSORIES',
];

export function HomePage({ products, onSelectProduct }: HomePageProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<CollectionTab>('ALL');

  const collectionSectionRef = useRef<HTMLElement | null>(null);
  const collectionHeaderRef = useRef<HTMLDivElement | null>(null);
  const collectionStageRef = useRef<HTMLDivElement | null>(null);
  const collectionStageParallaxRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  const { scrollYProgress: collectionScroll } = useScroll({
    target: collectionSectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothCollectionScroll = useSpring(collectionScroll, {
    stiffness: 110,
    damping: 24,
    mass: 0.45,
  });

  const wallpaperY = useTransform(
    smoothCollectionScroll,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['-12%', '12%']
  );
  const wallpaperScale = useTransform(
    smoothCollectionScroll,
    [0, 0.5, 1],
    shouldReduceMotion ? [1, 1, 1] : [1.08, 1.2, 1.1]
  );
  const wallpaperRotate = useTransform(
    smoothCollectionScroll,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-1.25, 1.25]
  );
  const shimmerY = useTransform(
    smoothCollectionScroll,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['18%', '-18%']
  );
  const shimmerOpacity = useTransform(
    smoothCollectionScroll,
    [0, 0.5, 1],
    shouldReduceMotion ? [0.22, 0.22, 0.22] : [0.14, 0.34, 0.16]
  );

  const visibleProducts = useMemo(() => {
    switch (activeTab) {
      case 'MEN':
        return products.filter((p) => p.gender === 'Men' || p.gender === 'Unisex');
      case 'WOMEN':
        return products.filter((p) => p.gender === 'Women' || p.gender === 'Unisex');
      case 'FOOTWEAR':
        return products.filter(
          (p) =>
            p.category === 'Footwear' ||
            p.category === 'Sneakers' ||
            p.id === 'prod-w4'
        );
      case 'ACCESSORIES':
        return products.filter((p) =>
          ['Accessories', 'Leather Goods', 'Caps'].includes(p.category)
        );
      case 'ALL':
      default:
        return products;
    }
  }, [activeTab, products]);

  useEffect(() => {
    const section = collectionSectionRef.current;
    if (!section || shouldReduceMotion) return;

    const ctx = gsap.context(() => {
      if (collectionHeaderRef.current) {
        gsap.fromTo(
          collectionHeaderRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.78,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: collectionHeaderRef.current,
              start: 'top 86%',
              once: true,
            },
          }
        );
      }

      if (collectionStageRef.current) {
        gsap.fromTo(
          collectionStageRef.current,
          { opacity: 0, y: 38, scale: 0.975 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.88,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: collectionStageRef.current,
              start: 'top 84%',
              once: true,
            },
          }
        );
      }

      if (collectionStageParallaxRef.current && collectionStageRef.current) {
        gsap.fromTo(
          collectionStageParallaxRef.current,
          { y: 16 },
          {
            y: -16,
            ease: 'none',
            scrollTrigger: {
              trigger: collectionStageRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.15,
            },
          }
        );
      }
    }, collectionSectionRef);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  const collectionTabs = COLLECTION_TAB_IDS.map((id) => ({
    id,
    label: t.collection.tabs[id],
  }));

  const activeTabLabel =
    collectionTabs.find((tab) => tab.id === activeTab)?.label || t.collection.tabs.ALL;

  return (
    <main className="bg-transparent">
      {/* 1. EXISTING CINEMATIC VIDEO & 3D SCROLLING HERO */}
      <ScrollVideoSection />

      {/* 2. COLLECTION SECTION — GALLERY WHITE DOMINANT WITH LIVE WALLPAPER & RED/YELLOW ACCENTS */}
      <section
        ref={collectionSectionRef}
        id="collection-section"
        className="w-full scroll-mt-20 relative border-y border-[#EAE3DB] overflow-hidden bg-white"
      >
        <div className="relative w-full overflow-hidden">
          {/* Live Scroll-Reactive Couture Wallpaper Layer */}
          <motion.div
            aria-hidden="true"
            style={{
              y: wallpaperY,
              scale: wallpaperScale,
              rotate: wallpaperRotate,
            }}
            className="pointer-events-none select-none absolute -inset-x-[6%] -inset-y-[18%] will-change-transform"
          >
            <img
              src={COLLECTION_WALLPAPER_URL}
              referrerPolicy="no-referrer"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Subtle Atmospheric Sheen Letting Live Wallpaper Shine Through */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 253, 249, 0.12) 48%, rgba(255, 255, 255, 0.28) 100%)',
            }}
          />
          <motion.div
            aria-hidden="true"
            style={{
              y: shimmerY,
              opacity: shimmerOpacity,
              background:
                'radial-gradient(65% 50% at 50% 50%, rgba(245, 197, 24, 0.2) 0%, rgba(184, 18, 30, 0.08) 55%, rgba(255, 255, 255, 0) 100%)',
            }}
            className="pointer-events-none absolute -inset-x-10 -inset-y-16 will-change-transform"
          />

          <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-10 py-20 sm:py-28">
            <div
              ref={collectionHeaderRef}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 will-change-transform rounded-[30px] bg-white/90 backdrop-blur-md border border-[#E6DFD5] px-6 sm:px-10 py-7 shadow-[0_20px_50px_rgba(28,7,9,0.1)]"
            >
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="h-0.5 w-6 bg-[#F5C518]" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-[#B8121E] font-semibold">
                  {t.collection.eyebrow}
                </span>
                <span className="h-0.5 w-6 bg-[#F5C518]" aria-hidden="true" />
              </div>

              <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#1C0709] tracking-tight mb-6">
                {t.collection.titlePre}{' '}
                <span className="italic text-[#B8121E]">{t.collection.titleItalic}</span>
              </h2>

              {/* Dominant White & Sunlit Yellow / Crimson Segmented Category Bar */}
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#FAF8F5] border border-[#E6DFD5] px-2.5 py-1.5 shadow-xs">
                {collectionTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'text-[#48050B] font-bold'
                          : 'text-[#4A383A] hover:text-[#B8121E] font-semibold'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="collectionTabUnderline"
                          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F5C518] to-[#FFE169] shadow-[0_4px_14px_rgba(245,197,24,0.35)]"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div ref={collectionStageRef} className="will-change-transform">
              <div ref={collectionStageParallaxRef} className="will-change-transform">
                <ClothingCarousel3D
                  products={visibleProducts}
                  onSelectProduct={onSelectProduct}
                />
              </div>
            </div>

            <CollectionShowcaseGrid
              products={visibleProducts}
              activeTabLabel={activeTabLabel}
              onSelectProduct={onSelectProduct}
            />
          </div>
        </div>
      </section>

      {/* KINETIC WHITE & RED-YELLOW EDITORIAL RIBBON */}
      <div aria-hidden="true" className="w-full overflow-hidden border-b border-[#EAE3DB]">
        {/* Crisp Dominant White Upper Track */}
        <div className="w-full overflow-hidden bg-white py-2.5 border-b border-[#F5C518]/60">
          <div className="flex w-max animate-marquee-glide">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-8 pr-8">
                {t.collection.marquee.map((phrase, i) => (
                  <div key={`${dup}-${i}`} className="flex items-center gap-8">
                    <span className="font-editorial italic font-semibold text-base sm:text-lg tracking-[0.2em] text-[#B8121E] whitespace-nowrap">
                      {phrase}
                    </span>
                    <span className="w-2 h-2 rotate-45 bg-[#F5C518] shrink-0" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Vibrant Crimson & Yellow Accent Counter Track */}
        <div className="w-full overflow-hidden bg-[#B8121E] py-2">
          <div className="flex w-max animate-marquee-glide-reverse">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-8 pr-8">
                {[...t.collection.marquee].reverse().map((phrase, i) => (
                  <div key={`${dup}-${i}`} className="flex items-center gap-8">
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-[#FFE169] whitespace-nowrap">
                      {phrase}
                    </span>
                    <span className="w-2 h-2 rotate-45 bg-white shrink-0" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ABOUT US SECTION — DOMINANT GALLERY WHITE ARCHITECTURE */}
      <section
        id="about-section"
        className="relative bg-white text-[#1C0709] border-b border-[#EAE3DB] scroll-mt-20 overflow-hidden"
      >
        {/* Uploaded Red & White Roses Wallpaper Beneath Balanced Gallery White Veil */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        >
          <img
            src={ABOUT_WALLPAPER_URL}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 253, 249, 0.08) 50%, rgba(255, 255, 255, 0.18) 100%)',
            }}
          />
          <div
            className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-35"
            style={{
              background:
                'radial-gradient(circle, rgba(245,197,24,0.18) 0%, rgba(184,18,30,0.06) 45%, transparent 72%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-6 space-y-6 rounded-[32px] bg-white/92 backdrop-blur-md border border-white/85 p-7 sm:p-10 shadow-[0_24px_60px_rgba(28,7,9,0.14)]"
            >
              <div className="inline-flex items-center gap-3">
                <span className="h-0.5 w-6 bg-[#F5C518]" aria-hidden="true" />
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#B8121E] font-semibold">
                  {t.about.eyebrow}
                </p>
              </div>

              <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#1C0709] leading-[1.08] text-balance">
                {t.about.titlePre}{' '}
                <span className="italic text-[#B8121E]">{t.about.titleBrand}</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#2B1517] leading-relaxed">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
                <p>{t.about.p3}</p>
              </div>

              {/* Material Craftsmanship White Gallery Pillars */}
              <div className="pt-6 border-t border-[#EAE3DB] grid grid-cols-3 gap-4 sm:gap-5">
                {t.about.pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-2xl bg-white/95 border border-[#E6DFD5] p-3.5 sm:p-4 shadow-sm"
                  >
                    <span className="block w-6 h-0.5 bg-[#F5C518] mb-2" aria-hidden="true" />
                    <p className="font-editorial text-xl sm:text-2xl text-[#B8121E] font-medium">
                      {pillar.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#4A383A] mt-1">
                      {pillar.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-6 relative"
            >
              <div className="group relative aspect-[4/5] max-w-lg mx-auto rounded-t-[240px] rounded-b-[32px] bg-white p-2 border-2 border-[#F5C518] overflow-hidden shadow-[0_30px_70px_rgba(28,7,9,0.12)]">
                <div className="relative w-full h-full rounded-t-[230px] rounded-b-[24px] overflow-hidden">
                  <ImageWithFallback
                    src="/src/assets/images/collection_editorial_1795095959086.jpg"
                    alt={t.about.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 rounded-t-[218px] rounded-b-[16px] border border-[#B8121E]/35"
                  />
                </div>
              </div>

              {/* Floating House Monogram Medallion */}
              <div className="hidden sm:flex items-center justify-center w-24 h-24 rounded-full bg-white border-2 border-[#B8121E]/35 ring-4 ring-[#F5C518]/35 shadow-[0_14px_32px_rgba(28,7,9,0.12)] absolute -bottom-5 left-6 lg:left-4 p-3">
                <img
                  src="/assets/aistudio/CHYTESS_Crowned_Couture_Monogram_57675c74.png"
                  alt={t.about.sealAlt}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3B. SCROLL-CONTROLLED ATELIER LOOKBOOK VIDEO THEATRE */}
      <ScrollAtelierVideoSection />

      {/* 4. FOUNDER & CEO SECTION */}
      <section
        id="founder-section"
        className="relative w-full scroll-mt-20 bg-white text-[#1C0709] border-b border-[#EAE3DB] overflow-hidden"
      >
        {/* Uploaded White & Gold Blossom Wallpaper Beneath Balanced Gallery White Veil */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        >
          <img
            src={FOUNDER_WALLPAPER_URL}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 253, 249, 0.06) 50%, rgba(255, 255, 255, 0.16) 100%)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[540px] h-[540px] rounded-full blur-3xl opacity-30"
            style={{
              background:
                'radial-gradient(circle, rgba(245,197,24,0.18) 0%, rgba(184,18,30,0.06) 45%, transparent 72%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="group relative aspect-[4/5] rounded-[34px] bg-white p-2 border-2 border-[#B8121E]/30 overflow-hidden shadow-[0_30px_70px_rgba(28,7,9,0.18)]">
                <div className="relative w-full h-full rounded-[26px] overflow-hidden">
                  <img
                    src="/assets/aistudio/file_00000000765c81f4972bf643e45c5892_0357b623.png"
                    alt={t.founder.portraitAlt}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 rounded-[18px] border border-[#F5C518]/55"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1C0709]/80 via-[#1C0709]/25 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white">
                    <span>{t.founder.badgeLeft}</span>
                    <span className="text-[#FFE169] font-semibold">{t.founder.badgeRight}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 space-y-6 rounded-[32px] bg-white/92 backdrop-blur-md border border-white/85 p-7 sm:p-10 shadow-[0_24px_60px_rgba(28,7,9,0.14)]"
            >
              <div className="inline-flex items-center gap-3">
                <span className="h-0.5 w-6 bg-[#F5C518]" aria-hidden="true" />
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#B8121E] font-semibold">
                  {t.founder.eyebrow}
                </p>
              </div>

              <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#1C0709] leading-[1.08] text-balance">
                Chinyere Augustina <span className="italic text-[#B8121E]">Okezue</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#2B1517] leading-relaxed max-w-2xl">
                <p>{t.founder.p1}</p>
                <p>{t.founder.p2}</p>
                <p>{t.founder.p3}</p>
              </div>

              <div className="pt-6 border-t border-[#EAE3DB] max-w-xl flex items-start gap-4">
                <img
                  src="/assets/aistudio/CHYTESS_Crowned_Couture_Monogram_57675c74.png"
                  alt=""
                  aria-hidden="true"
                  className="w-10 h-10 object-contain shrink-0 mt-1"
                />
                <div>
                  <p className="font-editorial italic text-xl sm:text-2xl text-[#1C0709] leading-snug">
                    &ldquo;{t.founder.quote}&rdquo;
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[#B8121E] font-semibold">
                    {t.founder.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

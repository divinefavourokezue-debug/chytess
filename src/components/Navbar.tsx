import { useEffect, useState } from 'react';
import { Globe, Menu, Search, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export type MainSectionId =
  | 'collection-section'
  | 'about-section'
  | 'founder-section';

interface NavbarProps {
  onScrollToSection: (sectionId?: MainSectionId) => void;
  onOpenSearch: () => void;
}

export function Navbar({
  onScrollToSection,
  onOpenSearch,
}: NavbarProps) {
  const { lang, setLang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const overlayMode = !scrolled && !mobileMenuOpen;

  const sectionLinks: { label: string; id: MainSectionId }[] = [
    { label: t.nav.collection, id: 'collection-section' },
    { label: t.nav.about, id: 'about-section' },
    { label: t.nav.founder, id: 'founder-section' },
  ];

  const handleLinkClick = (id: MainSectionId) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <header
        className={`transition-all duration-300 ${
          overlayMode
            ? 'bg-gradient-to-b from-[#1C0709]/35 to-transparent border-b border-transparent'
            : 'bg-white/95 backdrop-blur-xl border-b-2 border-[#F5C518] shadow-[0_10px_30px_rgba(28,7,9,0.08)]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-2.5 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-8">
          {/* Brand Wordmark & Monogram Logo */}
          <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1 lg:flex-initial">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={t.nav.toggleMenu}
              className={`lg:hidden p-1.5 -ml-1 shrink-0 hover:opacity-75 transition-colors cursor-pointer ${
                overlayMode ? 'text-[#F5C518]' : 'text-[#B8121E]'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection();
              }}
              className={`brand-wordmark text-[13px] min-[375px]:text-[15px] sm:text-[21px] font-black tracking-[0.03em] min-[375px]:tracking-[0.05em] sm:tracking-[0.1em] uppercase min-w-0 cursor-pointer transition-colors inline-flex items-center gap-1.5 sm:gap-2.5 ${
                overlayMode ? 'text-[#F5C518]' : 'text-[#B8121E]'
              }`}
            >
              <img
                src="/assets/aistudio/CHYTESS_Crowned_Couture_Monogram_57675c74.png"
                alt=""
                aria-hidden="true"
                className="h-6 min-[375px]:h-7 sm:h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.22)]"
              />
              <span className="truncate font-black">CHYTESS COLLECTION</span>
            </button>
          </div>

          {/* Main Section Links */}
          <nav
            aria-label="Primary navigation"
            className={`hidden lg:flex items-center justify-center gap-8 text-base font-bold tracking-wide transition-colors ${
              overlayMode ? 'text-white' : 'text-[#1C0709]'
            }`}
          >
            {sectionLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] hover:after:w-full after:transition-all after:duration-200 cursor-pointer ${
                  overlayMode
                    ? 'hover:text-[#F5C518] after:bg-[#F5C518]'
                    : 'hover:text-[#B8121E] after:bg-gradient-to-r after:from-[#B8121E] after:to-[#F5C518]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Toggle & Search */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <div
              role="group"
              aria-label={t.nav.langSwitchAria}
              className={`inline-flex items-center rounded-full p-0.5 transition-all border ${
                overlayMode
                  ? 'bg-[#2B0609]/65 border-[#F5C518]/65 backdrop-blur-md'
                  : 'bg-[#FAF8F5] border-[#E6DFD5] shadow-xs'
              }`}
            >
              <Globe
                className={`w-3.5 h-3.5 ml-2 mr-1 hidden sm:inline shrink-0 ${
                  overlayMode ? 'text-[#F5C518]' : 'text-[#B8121E]'
                }`}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`px-2 min-[375px]:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[13px] sm:text-[15px] uppercase tracking-[0.06em] sm:tracking-[0.12em] font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? overlayMode
                      ? 'bg-[#F5C518] text-[#48050B] shadow-xs'
                      : 'bg-[#B8121E] text-[#FFE169] shadow-xs'
                    : overlayMode
                      ? 'text-white/80 hover:text-[#F5C518]'
                      : 'text-[#4A383A] hover:text-[#B8121E]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                aria-pressed={lang === 'fr'}
                className={`px-2 min-[375px]:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[13px] sm:text-[15px] uppercase tracking-[0.06em] sm:tracking-[0.12em] font-bold transition-all cursor-pointer ${
                  lang === 'fr'
                    ? overlayMode
                      ? 'bg-[#F5C518] text-[#48050B] shadow-xs'
                      : 'bg-[#B8121E] text-[#FFE169] shadow-xs'
                    : overlayMode
                      ? 'text-white/80 hover:text-[#F5C518]'
                      : 'text-[#4A383A] hover:text-[#B8121E]'
                }`}
              >
                FR
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenSearch}
              aria-label={t.nav.searchAria}
              className={`p-1.5 sm:p-2 transition-colors cursor-pointer ${
                overlayMode
                  ? 'text-white hover:text-[#F5C518]'
                  : 'text-[#1C0709] hover:text-[#B8121E]'
              }`}
            >
              <Search className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-[#EAE3DB] px-6 py-5 shadow-xl">
            <div className="flex flex-col space-y-2.5">
              {sectionLinks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item.id)}
                  className="text-left text-base font-medium text-[#1C0709] py-2.5 border-b border-[#EAE3DB] flex items-center justify-between cursor-pointer hover:text-[#B8121E] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-[#B8121E] font-semibold">
                    {t.nav.view}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  toggleLang();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-semibold text-[#B8121E] pt-2 flex items-center justify-between cursor-pointer"
              >
                <span>{lang === 'en' ? 'Français (FR)' : 'English (EN)'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5C518] text-[#48050B] text-xs uppercase tracking-[0.12em] font-bold">
                  {lang === 'en' ? 'FR' : 'EN'}
                </span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

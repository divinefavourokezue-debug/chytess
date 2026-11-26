import { Phone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { MainSectionId } from './Navbar';

export type InfoTopic =
  | 'about'
  | 'contact'
  | 'support'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms';

interface FooterProps {
  onScrollToSection: (sectionId: MainSectionId) => void;
  onOpenInfo: (topic: InfoTopic) => void;
}

export function Footer({ onScrollToSection, onOpenInfo }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#000000] text-[#FFFFFF] border-t-4 border-[#B8121E] shadow-[inset_0_3px_0_0_#F5C518]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 pb-8 sm:pb-12 border-b border-white/15">
          {/* Brand Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/CHYTESS_Crowned_Couture_Monogram_57675c74.png"
                alt="CHYTESS COLLECTION Logo"
                className="h-11 sm:h-14 w-auto object-contain shrink-0"
              />
              <h2 className="brand-wordmark text-[20px] sm:text-[26px] font-black tracking-[0.08em] uppercase text-[#F5C518]">
                CHYTESS COLLECTION
              </h2>
            </div>
            <p className="text-sm text-white/75 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
            <div className="pt-2">
              <a
                href="tel:+22658989891"
                className="inline-flex items-center gap-2.5 text-sm text-white/90 hover:text-[#F5C518] transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[#B8121E] text-[#F5C518] flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs uppercase tracking-[0.12em] text-[#F5C518] font-semibold">
                  {t.footer.phoneLabel}:
                </span>
                <span className="tabular-nums font-medium">+226 58 98 98 91</span>
              </a>
            </div>
          </div>

          {/* Site Navigation */}
          <div className="lg:col-span-3 lg:justify-self-end">
            <h3 className="text-xs uppercase tracking-[0.16em] text-[#F5C518] font-semibold mb-5">
              {t.footer.navigation}
            </h3>
            <ul className="space-y-3 text-sm text-white/85">
              <li>
                <button
                  type="button"
                  onClick={() => onScrollToSection('collection-section')}
                  className="hover:text-[#F5C518] transition-colors cursor-pointer"
                >
                  {t.footer.collection}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollToSection('about-section')}
                  className="hover:text-[#F5C518] transition-colors cursor-pointer"
                >
                  {t.footer.aboutUs}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollToSection('founder-section')}
                  className="hover:text-[#F5C518] transition-colors cursor-pointer"
                >
                  {t.footer.founderCeo}
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care & Info Pages */}
          <div className="lg:col-span-3 lg:justify-self-end">
            <h3 className="text-xs uppercase tracking-[0.16em] text-[#F5C518] font-semibold mb-5">
              {t.footer.clientCare}
            </h3>
            <ul className="space-y-3 text-sm text-white/85">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('contact')}
                  className="hover:text-[#F5C518] transition-colors cursor-pointer"
                >
                  {t.footer.contact}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('shipping')}
                  className="hover:text-[#F5C518] transition-colors cursor-pointer"
                >
                  {t.footer.shipping}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('returns')}
                  className="hover:text-[#F5C518] transition-colors cursor-pointer"
                >
                  {t.footer.returns}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('privacy')}
                  className="hover:text-[#F5C518] transition-colors cursor-pointer"
                >
                  {t.footer.privacy}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>
            © {new Date().getFullYear()}{' '}
            <span className="brand-wordmark tracking-[0.08em] text-white">
              CHYTESS COLLECTION
            </span>
            . {t.footer.rights}
          </p>
          <p className="font-semibold text-[#F5C518]">Ouagadougou, Burkina Faso</p>
        </div>
      </div>
    </footer>
  );
}


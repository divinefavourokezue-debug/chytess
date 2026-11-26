import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function WhatsAppButton() {
  const { t } = useLanguage();

  return (
    <aside aria-label={t.whatsapp.asideAria} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <a
        href={t.whatsapp.href}
        target="_blank"
        rel="noreferrer"
        aria-label={t.whatsapp.linkAria}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:bg-[#22bf5b] hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-[#25D366]" />
      </a>
    </aside>
  );
}

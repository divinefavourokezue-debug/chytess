import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { InfoTopic } from './Footer';

interface InfoPageProps {
  topic: InfoTopic;
  onBack: () => void;
}

export function InfoPage({ topic, onBack }: InfoPageProps) {
  const { t } = useLanguage();
  const content = t.info.topics[topic];
  const [sent, setSent] = useState(false);

  return (
    <main className="max-w-4xl mx-auto px-6 sm:px-10 pt-28 pb-16 min-h-[65vh]">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#B8121E] hover:text-[#8C0D16] font-semibold transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t.info.back}</span>
      </button>

      <div className="relative overflow-hidden rounded-[28px] bg-white border border-[#E6DFD5] p-8 sm:p-14 shadow-[0_24px_64px_rgba(28,7,9,0.08)]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#B8121E] via-[#F5C518] to-[#B8121E]"
        />
        <p className="text-xs uppercase tracking-[0.16em] text-[#B8121E] font-semibold mb-3">
          {content.eyebrow}
        </p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C0709] mb-8">
          {content.title}
        </h1>

        <div className="space-y-5 text-sm sm:text-base text-[#4A383A] leading-relaxed mb-10">
          {content.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {(topic === 'contact' || topic === 'support') && (
          <div className="pt-8 border-t border-[#EAE3DB] grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 text-sm text-[#1C0709]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-[#B8121E]" />
                <div>
                  <p className="font-semibold text-[#1C0709]">{t.info.emailLabel}</p>
                  <p className="text-[#4A383A]">concierge@chytesscollection.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-[#B8121E]" />
                <div>
                  <p className="font-semibold text-[#1C0709]">{t.info.phoneLabel}</p>
                  <p className="text-[#4A383A]">+226 58 98 98 91</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#B8121E]" />
                <div>
                  <p className="font-semibold text-[#1C0709]">{t.info.addressLabel}</p>
                  <p className="text-[#4A383A]">Avenue Kwamé N&apos;Krumah, Ouagadougou, Burkina Faso</p>
                </div>
              </div>
            </div>

            {sent ? (
              <div className="p-6 rounded-2xl bg-[#F5C518] text-sm text-[#48050B] font-medium">
                {t.info.sentMessage}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  placeholder={t.info.namePlaceholder}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DCD5] text-sm text-[#1C0709] placeholder:text-[#8E7B7D] focus:outline-none focus:border-[#B8121E]"
                />
                <input
                  type="email"
                  required
                  placeholder={t.info.emailPlaceholder}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DCD5] text-sm text-[#1C0709] placeholder:text-[#8E7B7D] focus:outline-none focus:border-[#B8121E]"
                />
                <textarea
                  required
                  rows={3}
                  placeholder={t.info.messagePlaceholder}
                  className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DCD5] text-sm text-[#1C0709] placeholder:text-[#8E7B7D] focus:outline-none focus:border-[#B8121E]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#F5C518] text-[#48050B] text-xs uppercase tracking-[0.14em] font-bold hover:bg-[#FFE169] transition-colors cursor-pointer border border-[#B8121E]/15"
                >
                  {t.info.sendMessage}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

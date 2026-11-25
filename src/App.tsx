import { useState } from 'react';
import { EditorialCursor } from './components/EditorialCursor';
import { Footer, type InfoTopic } from './components/Footer';
import { HomePage } from './components/HomePage';
import { InfoPage } from './components/InfoPage';
import { LookbookLightbox } from './components/LookbookLightbox';
import { Navbar, type MainSectionId } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HARDCODED_PRODUCTS } from './data/products';
import type { Product } from './types';

type ActiveRoute =
  | { view: 'home' }
  | { view: 'info'; topic: InfoTopic };

export default function App() {
  const [route, setRoute] = useState<ActiveRoute>({ view: 'home' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);

  const products = HARDCODED_PRODUCTS;

  const scrollToSection = (sectionId?: MainSectionId) => {
    if (route.view !== 'home') {
      setRoute({ view: 'home' });
      window.setTimeout(() => {
        if (sectionId) {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
      return;
    }

    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1C0709]">
      <Navbar
        onScrollToSection={scrollToSection}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="flex-1">
        {route.view === 'info' ? (
          <InfoPage
            topic={route.topic}
            onBack={() => {
              setRoute({ view: 'home' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <HomePage
            products={products}
            onSelectProduct={setLightboxProduct}
          />
        )}
      </div>

      <Footer
        onScrollToSection={scrollToSection}
        onOpenInfo={(topic) => {
          setRoute({ view: 'info', topic });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <SearchModal
        open={searchOpen}
        products={products}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={setLightboxProduct}
      />

      <LookbookLightbox
        product={lightboxProduct}
        onClose={() => setLightboxProduct(null)}
      />

      <WhatsAppButton />

      <EditorialCursor />
    </div>
  );
}

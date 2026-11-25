import type { Product } from '../types';

export type Language = 'en' | 'fr';

interface ProductTranslation {
  name: string;
  description: string;
  details: string[];
}

export const PRODUCT_FR_TRANSLATIONS: Record<string, ProductTranslation> = {
  'prod-m1': {
    name: 'Manteau Long Structuré en Laine Anthracite',
    description:
      'Manteau long structuré pour homme confectionné en laine Melton double-face anthracite dense, porté sur maille ivoire et pantalon en laine taillé.',
    details: [
      '100 % laine Melton vierge, 600 g/m²',
      'Col à revers structuré & poches à rabat',
      'Manches doublées en cupro pour un enfilage fluide',
      'Nettoyage à sec uniquement · Fabriqué au Portugal',
    ],
  },
  'prod-01': {
    name: 'Veste Courte Atelier en Laine',
    description:
      'Veste droite coupe carrée taillée dans une laine vierge italienne double-face dense, avec patte boutonnée dissimulée et col structuré.',
    details: [
      '100 % laine vierge, 480 g/m²',
      'Silhouette courte et structurée',
      'Patte frontale dissimulée et doublure en cupro',
      'Nettoyage à sec uniquement · Fabriqué au Portugal',
    ],
  },
  'prod-05': {
    name: 'Surchemise Architecturale en Popeline',
    description:
      'Surchemise en popeline de coton japonais haute torsion entre chemise formelle et veste légère, dotée de boutons mats en corozo.',
    details: [
      '100 % coton japonais haute torsion',
      'Boutons ton sur ton en noix de corozo',
      'Ourlet droit avec goussets latéraux',
      'Coupe structurée décontractée',
    ],
  },
  'prod-02': {
    name: 'Sweat à Capuche Épais Coupe Carrée',
    description:
      'Taillé dans un molleton bouclé en coton biologique brossé 520 g/m², doté d’une capuche architecturale doublée et d’épaules tombantes.',
    details: [
      '100 % coton biologique, 520 g/m²',
      'Épaules tombantes, coupe carrée ample',
      'Capuche structurée double épaisseur',
      'Prérétréci et lavé aux enzymes',
    ],
  },
  'prod-03': {
    name: 'Sweat Col Rond Teint en Pièce Atelier',
    description:
      'Sweat col rond en molleton épais fini par une teinture pigmentaire minérale, avec larges bords-côtes et coutures renforcées.',
    details: [
      '100 % coton peigné, 460 g/m²',
      'Teinture pigmentaire minérale en pièce',
      'Bords-côtes 2×2 haute densité aux poignets et à la taille',
      'Coupe structurée décontractée',
    ],
  },
  'prod-04': {
    name: 'T-Shirt Structuré Col Cheminée',
    description:
      'T-shirt en jersey épais filé à partir de coton biologique compact 310 g/m², rehaussé d’un col cheminée côtelé de 3 cm.',
    details: [
      '100 % coton biologique compact, 310 g/m²',
      'Col cheminée côtelé surélevé de 3 cm',
      'Tombé droit au niveau du buste',
      'Lavage en machine à froid',
    ],
  },
  'prod-07': {
    name: 'Short Tailleur en Twill de Coton',
    description:
      'Short mi-cuisse tailleur coupé dans un twill de coton brossé 340 g/m² au tombé net, doté de pinces discrètes sur le devant.',
    details: [
      '100 % twill de coton épais, 340 g/m²',
      'Longueur genou décontractée',
      'Taille élastiquée au dos avec cordon dissimulé',
      'Poches latérales profondes',
    ],
  },
  'prod-w1': {
    name: 'Trench Architectural Pourpre Maison',
    description:
      'Trench croisé emblématique de la maison en laine pourpre, épaules sculptées, taille ceinturée et drapé fluide mi-mollet.',
    details: [
      '100 % laine vierge fine brossée',
      'Taille ceinturée à boutons en corne',
      'Doublure intégrale en habotai de soie',
      'Nettoyage à sec · Coupe Atelier',
    ],
  },
  'prod-w2': {
    name: 'Ensemble Blazer & Pantalon Soie-Laine Ivoire',
    description:
      'Blazer croisé à revers en pointe avec boutons en laiton doré brossé, associé à un pantalon fluide taille haute et jambe large en soie-laine ivoire.',
    details: [
      '72 % laine vierge, 28 % soie de mûrier',
      'Boutons dorés brossés sur mesure',
      'Coupe pantalon large taille haute',
      'Finitions cousues à la main',
    ],
  },
  'prod-w3': {
    name: 'Robe Sculptée en Maille Bordeaux',
    description:
      'Robe fourreau en maille côtelée épaisse mérinos-soie bordeaux profond, ornée de panneaux côtelés en diagonale et d’un col montant.',
    details: [
      '85 % laine mérinos extra-fine, 15 % soie',
      'Construction architecturale en côtes diagonales',
      'Silhouette fourreau midi',
      'Pensée du jour au soir avec élégance',
    ],
  },
  'prod-06': {
    name: 'Pantalon Large à Doubles Pinces',
    description:
      'Pantalon ample fluide taillé dans une gabardine de laine respirante, avec doubles pinces frontales et plis marqués.',
    details: [
      '70 % laine vierge, 30 % twill technique',
      'Ceinture taillée mi-haute à haute',
      'Poches couture latérales et poches passepoilées au dos',
      'Doublure genoux intégrale en cupro',
    ],
  },
  'prod-11': {
    name: 'Manteau Croisé Monolith en Laine',
    description:
      'Manteau long croisé en laine vierge à revers crantés nets, boutons en corne et volume généreux pour la superposition.',
    details: [
      '100 % laine Melton vierge, 620 g/m²',
      'Doublure jacquard intégrale en viscose',
      'Poches latérales double passepoil',
      'Nettoyage à sec uniquement',
    ],
  },
  'prod-12': {
    name: 'Surchemise Galerie en Laine Texturée',
    description:
      'Surchemise fluide en mélange de laine brossée conçue comme une pièce de mi-saison aux épaules tombantes et finitions mates.',
    details: [
      '65 % laine vierge, 35 % coton biologique',
      'Coutures intérieures gansées sans doublure',
      'Poches latérales prises en couture',
      'Pensée pour des superpositions fluides',
    ],
  },
  'prod-08': {
    name: 'Baskets Basses en Cuir Nappa & Daim',
    description:
      'Baskets basses montées à la main en veau italien pleine fleur souple, rehaussées d’empiècements ton sur ton en daim.',
    details: [
      'Tige en cuir de veau pleine fleur & empiècements en daim',
      'Doublure en cuir tannage végétal',
      'Semelle cuvette cousue en caoutchouc ton sur ton',
      'Livrées avec housse et lacets de rechange',
    ],
  },
  'prod-w4': {
    name: 'Sac Cuir Bordeaux & Mules Crème',
    description:
      'Sac porté épaule structuré en veau grainé bordeaux profond à fermoir doré, accompagné de mules en cuir ivoire.',
    details: [
      '100 % cuir de veau italien pleine fleur',
      'Fermoir tourniquet doré brossé',
      'Bandoulière en cuir réglable',
      'Souliers doublés en agneau souple',
    ],
  },
  'prod-10': {
    name: 'Sac Bandoulière en Cuir Grainé',
    description:
      'Sac bandoulière architectural compact façonné en cuir pleine fleur grainé avec bouclerie en palladium brossé.',
    details: [
      '100 % cuir de veau grainé pleine fleur',
      'Bouclerie brossée & double compartiment zippé',
      'Intérieur doublé suédine avec porte-cartes',
      '22 cm × 14 cm × 6,5 cm',
    ],
  },
  'prod-09': {
    name: 'Casquette Six Panneaux en Laine Brossée',
    description:
      'Casquette souple à six panneaux confectionnée en twill de laine Melton brossée avec œillets brodés ton sur ton et fermoir mat.',
    details: [
      '80 % laine, 20 % polyamide recyclé',
      'Visière pré-courbée à 6 rangs de surpiqûres',
      'Bande intérieure en twill de coton',
      'Sangle arrière réglable (Taille unique)',
    ],
  },
  'prod-m2': {
    name: 'Veste Atelier en Cuir Pleine Fleur',
    description:
      'Blouson moto-atelier en cuir d’agneau noir pleine fleur souple avec col officier, zip en palladium brossé et doublure twill de soie.',
    details: [
      '100 % cuir d’agneau italien pleine fleur',
      'Double zip sur mesure en palladium brossé',
      'Poche poitrine intérieure en doublure cupro',
      'Ligne d’épaules tailleur façonnée à la main',
    ],
  },
  'prod-m3': {
    name: 'Costume Croisé Sur-Mesure Bordeaux',
    description:
      'Costume croisé six boutons à revers en pointe coupé en laine vierge Super 150s bordeaux-anthracite sur toile tailleur bâtie main.',
    details: [
      '100 % laine vierge Super 150s',
      'Toile flottante en crin de cheval',
      'Boutons en corne & boutonnières fonctionnelles',
      'Pantalon tailleur à pinces assorti inclus',
    ],
  },
  'prod-w5': {
    name: 'Robe du Soir en Soie Champagne & Pourpre',
    description:
      'Robe longue du soir asymétrique drapée à la main en charmeuse de soie de mûrier champagne lumineux et pourpre profond.',
    details: [
      '100 % charmeuse de soie de mûrier épaisse',
      'Corsage sculpté & cape d’épaule plissés main',
      'Fermeture éclair latérale dissimulée',
      'Doublure intégrale en habotai de soie',
    ],
  },
  'prod-f2': {
    name: 'Bottines Chelsea & Mocassins Bordeaux',
    description:
      'Bottines Chelsea et mocassins penny bordeaux patinés, montés à la main en cuir de veau sur semelle cuir cousue Blake.',
    details: [
      'Tiges en cuir de veau box et grainé pleine fleur',
      'Semelle cuir cousue Goodyear / Blake',
      'Première de propreté en veau tannage végétal',
      'Housses de protection incluses',
    ],
  },
  'prod-a2': {
    name: 'Cabas Bordeaux, Montre Or & Lunettes',
    description:
      'Cabas structuré en cuir grainé bordeaux profond accompagné de notre montre minimaliste or brossé et lunettes en acétate italien.',
    details: [
      'Cabas structuré en cuir de veau pleine fleur',
      'Montre boîtier acier doré brossé 38 mm',
      'Solaires en acétate italien écaille finies main',
      'Housses & coffret de présentation sur mesure',
    ],
  },
  'prod-m4': {
    name: 'Ensemble Atelier Cachemire & Laine Superposés',
    description:
      'Look signature de la boutique associant chemise en laine brossée, maille mérinos fine et drapé tailleur fluide.',
    details: [
      'Mélange laine vierge et cachemire brossé',
      'Patte de boutonnage dissimulée de précision',
      'Ligne d’épaules architecturale décontractée',
      'Pièce Signature Atelier Ouagadougou',
    ],
  },
};

export const CATEGORY_FR: Record<string, string> = {
  Jackets: 'Vestes & Manteaux',
  Suiting: 'Costumes',
  Dresses: 'Robes',
  Hoodies: 'Sweats à Capuche',
  Sweatshirts: 'Sweats',
  'T-shirts': 'T-shirts',
  Shirts: 'Chemises',
  Trousers: 'Pantalons',
  Shorts: 'Shorts',
  Sneakers: 'Baskets',
  Footwear: 'Chaussures',
  Caps: 'Casquettes',
  'Leather Goods': 'Maroquinerie',
  Accessories: 'Accessoires',
};

export const GENDER_FR: Record<string, string> = {
  Men: 'Homme',
  Women: 'Femme',
  Unisex: 'Unisexe',
};

export const COLOR_FR: Record<string, string> = {
  'Deep Charcoal': 'Anthracite Profond',
  Obsidian: 'Obsidienne',
  Charcoal: 'Anthracite',
  'Slate Navy': 'Bleu Ardoise',
  Chalk: 'Craie',
  'Washed Charcoal': 'Anthracite Délavé',
  Ivory: 'Ivoire',
  Onyx: 'Onyx',
  'Warm Stone': 'Pierre Chaude',
  'House Crimson': 'Pourpre Maison',
  'Cream Ivory': 'Ivoire Crème',
  'Deep Burgundy': 'Bordeaux Profond',
  'Heather Grey': 'Gris Chiné',
  Slate: 'Ardoise',
  'Bone / Grey': 'Os / Gris',
  'Deep Burgundy / Cream': 'Bordeaux / Crème',
  'Obsidian Leather': 'Cuir Obsidienne',
  'Oxblood Charcoal': 'Bordeaux Anthracite',
  'Champagne / Crimson': 'Champagne / Pourpre',
  'Obsidian / Oxblood': 'Obsidienne / Bordeaux',
  'Burgundy / Brushed Gold': 'Bordeaux / Or Brossé',
  'Charcoal Slate': 'Ardoise Anthracite',
};

export const COLLECTION_FR: Record<string, string> = {
  'Monolith AW26': 'Monolithe AH26',
  'Core Uniform': 'Vestiaire Essentiel',
  'Footwear Atelier': 'Atelier Souliers',
  'Leather Goods': 'Haute Maroquinerie',
  'Maison Couture': 'Maison Couture',
  'Maison Accessories': 'Accessoires Maison',
};

export const COPY = {
  en: {
    loading: 'Loading CHYTESS COLLECTION...',
    nav: {
      collection: 'Collection',
      about: 'About Us',
      founder: 'Founder',
      view: 'View',
      toggleMenu: 'Toggle navigation menu',
      searchAria: 'Search collection',
      langSwitchAria: 'Switch language to French',
    },
    hero: {
      ariaLabel: 'CHYTESS COLLECTION 3D Campaign Film',
      pause: 'Pause',
      playFilm: 'Play Film',
      scrollToDescend: 'Scroll to Descend',
    },
    collection: {
      eyebrow: 'Maison Chytess · Showroom',
      titlePre: 'The',
      titleItalic: 'Collection',
      tabs: {
        ALL: 'All',
        MEN: 'Men',
        WOMEN: 'Women',
        FOOTWEAR: 'Footwear',
        ACCESSORIES: 'Accessories',
      },
      marquee: [
        'CHYTESS COLLECTION',
        'OUAGADOUGOU FLAGSHIP',
        'TAILORING & SILHOUETTES',
        'MAISON DE COUTURE',
        'BURKINA FASO',
        'ARCHITECTURAL DRAPE',
      ],
    },
    carousel: {
      empty: 'No garments available in this category.',
      ariaStage: 'Interactive 3D Garment Model Carousel',
      prev: 'Previous garment',
      next: 'Next garment',
      auto: 'Auto',
      play: 'Play',
      speedAria: 'Carousel speed',
      pushForward: 'Push Forward',
      inspectGarment: 'Inspect Garment',
      selectColor: 'Select colour',
    },
    grid: {
      eyebrowPrefix: 'Editorial Catalogue',
      titlePre: 'Curated',
      titleItalic: 'Silhouettes',
      piecesCount: (count: number) =>
        `${String(count).padStart(2, '0')} Pieces · Select Any Garment to Inspect`,
      inspectAria: 'Inspect',
      noPrefix: 'No.',
      newArrival: 'New Arrival',
      inspectBtn: 'Inspect',
      previewColor: 'Preview',
      inColor: 'in',
    },
    about: {
      eyebrow: '02 · The House',
      titlePre: 'About',
      titleBrand: 'CHYTESS COLLECTION',
      p1: 'CHYTESS COLLECTION is an independent contemporary fashion house dedicated to disciplined proportion, heavyweight natural textiles, and enduring architectural silhouettes.',
      p2: 'Our brand philosophy is rooted in quiet luxury and structural permanence. Each seasonal release bridges modern streetwear sensibility with bespoke tailoring—working with dense 520gsm organic cotton fleece, Japanese high-twist poplin, virgin wool outerwear, and hand-lasted Italian leather goods.',
      p3: 'From our boutique and tailoring showroom in Ouagadougou, Burkina Faso, we produce deliberate, numbered runs crafted to live in your wardrobe for years rather than weeks.',
      pillars: [
        { title: '520gsm', subtitle: 'Organic Fleece' },
        { title: 'Virgin Wool', subtitle: 'Structured Tailoring' },
        { title: 'Full-Grain', subtitle: 'Hand-Lasted Leather' },
      ],
      imageAlt: 'CHYTESS COLLECTION Atelier Editorial',
      sealAlt: 'CHYTESS COLLECTION Seal',
    },
    theatre: {
      ariaSection: 'CHYTESS COLLECTION Scroll-Controlled Lookbook Reel',
      eyebrow: 'Maison Chytess · Scroll-Controlled Film',
      titlePre: 'Digital',
      titleItalic: 'Lookbook',
      titlePost: 'Theatre',
      pause: 'Pause',
      play: 'Play',
      canvasAria: 'Scroll-reactive lookbook film displaying CHYTESS collections',
      scrollToPlay: 'Scroll to Play Reel',
      scrollHint: 'Scroll Down to Advance · Scroll Up to Rewind',
      beats: [
        {
          index: '01',
          title: 'Digital Showroom',
          caption: 'Lookbook curation framed for effortless mobile discovery.',
        },
        {
          index: '02',
          title: 'Scroll-Locked Motion',
          caption: 'Advance or rewind the reel frame by frame with every scroll gesture.',
        },
        {
          index: '03',
          title: 'Ouagadougou Studio',
          caption: 'Contemporary silhouettes engineered to linger beyond the season.',
        },
      ],
    },
    founder: {
      eyebrow: '03 · Founder & Chief Executive Officer',
      portraitAlt: 'Chinyere Augustina Okezue — Founder & CEO of CHYTESS COLLECTION',
      badgeLeft: 'Founder & CEO',
      badgeRight: 'Ouagadougou',
      p1: 'At the heart of CHYTESS COLLECTION is Founder and Chief Executive Officer Chinyere Augustina Okezue—a visionary entrepreneur with a discerning eye for effortless elegance, structured tailoring, and modern luxury.',
      p2: 'Guided by her conviction that clothing should inspire quiet confidence the moment you step into a room, Chinyere personally oversees the curation and creative standard of the house—from timeless outerwear and evening silhouettes to signature footwear and fine leather accessories.',
      p3: "From our flagship boutique on Avenue Kwamé N'Krumah in Ouagadougou, Burkina Faso, she has built CHYTESS COLLECTION into a welcoming destination for clients who value enduring quality, impeccable finishing, and unmistakable poise.",
      quote:
        'True style is never hurried—it lives in the fit, the texture, and the quiet certainty with which you wear every piece.',
      caption: 'Chinyere Augustina Okezue · CEO & Owner',
    },
    footer: {
      tagline:
        'Contemporary architectural fashion and tailored wardrobe essentials across Menswear, Womenswear, and Leather Goods.',
      navigation: 'Navigation',
      collection: 'Collection',
      aboutUs: 'About Us',
      founderCeo: 'Founder & CEO',
      phoneLabel: 'Phone',
      rights: 'All rights reserved.',
    },
    search: {
      placeholder: 'Search men, women, coats, suits, dresses, sneakers...',
      clear: 'Clear',
      closeAria: 'Close search',
      highlights: 'Collection Highlights',
      matchingPieces: (count: number) => `${count} Matching Pieces`,
      empty: (q: string) =>
        `No pieces matched “${q}”. Try Men, Women, Jackets, Suiting, Dresses, or Sneakers.`,
    },
    lightbox: {
      closeAria: 'Close photo preview',
      colourways: 'Colourways',
      materialsCut: 'Materials & Cut',
      selectColor: 'Select colour',
      viewWord: 'view',
    },
    whatsapp: {
      asideAria: 'WhatsApp Concierge',
      linkAria: 'Chat with CHYTESS COLLECTION on WhatsApp',
      href: 'https://wa.me/22658989891?text=Hello%20CHYTESS%20COLLECTION%20Boutique,%20Ouagadougou,%20I%20would%20like%20to%20inquire%20about%20clothing%20pieces.',
    },
    info: {
      back: 'Back to Storefront',
      emailLabel: 'Email Concierge',
      phoneLabel: 'Boutique Line',
      addressLabel: 'Flagship Boutique',
      sentMessage:
        'Thank you. Your inquiry has been logged for our concierge team, and we will respond within one business day.',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Email Address',
      messagePlaceholder: 'How can our concierge assist?',
      sendMessage: 'Send Message',
      topics: {
        about: {
          eyebrow: 'The House',
          title: 'About CHYTESS COLLECTION',
          paragraphs: [
            'CHYTESS COLLECTION is a premier clothing boutique and fashion house located in Ouagadougou, Burkina Faso, dedicated to disciplined proportion, heavyweight natural textiles, and enduring architectural silhouettes.',
            'Each seasonal release bridges modern streetwear sensibility with quiet luxury tailoring—working with dense 520gsm organic cotton fleece, Japanese high-twist poplin, virgin wool outerwear, and hand-lasted footwear.',
            'From our boutique on Avenue Kwamé N’Krumah in Ouagadougou, we offer direct clothing sales and bespoke fittings designed for daily elegance.',
          ],
        },
        contact: {
          eyebrow: 'Boutique Concierge',
          title: 'Contact Us',
          paragraphs: [
            'Our boutique team in Ouagadougou, Burkina Faso is available Monday through Saturday, 08:30 – 19:00 GMT, to assist with clothing purchases, sizing guidance, and showroom visits.',
            'Boutique Showroom: Avenue Kwamé N’Krumah, Ouagadougou, Burkina Faso.',
          ],
        },
        support: {
          eyebrow: 'Client Care',
          title: 'Customer Support',
          paragraphs: [
            'For order modifications, delivery scheduling, or care instructions for virgin wool and full-grain leather goods, reach our concierge using the inquiry form below or write directly to concierge@chytesscollection.com.',
          ],
        },
        shipping: {
          eyebrow: 'Dispatch & Logistics',
          title: 'Shipping Information',
          paragraphs: [
            'All orders are inspected, garment-steamed, and dispatched within 24–48 business hours from our fulfillment studio.',
            'Complimentary express delivery applies automatically on all orders of $250 or more. Standard regional dispatch within Burkina Faso & West Africa is $12 (1–3 business days). United Kingdom express courier is $22 (2–4 business days). International DHL Express worldwide is $28 (3–5 business days).',
          ],
        },
        returns: {
          eyebrow: 'Client Guarantee',
          title: 'Returns and Refunds',
          paragraphs: [
            'Unworn garments in original condition with tags and garment bags intact may be returned or exchanged within 14 days of delivery.',
            'Size exchanges are prioritized upon receipt. Approved refunds are processed to the original payment method (Paystack or Flutterwave) within 3–5 business days.',
          ],
        },
        privacy: {
          eyebrow: 'Legal & Data Protection',
          title: 'Privacy Policy',
          paragraphs: [
            'CHYTESS COLLECTION collects only the contact, shipping, and order details required to fulfill purchases, verify payments securely through Paystack or Flutterwave, and send dispatch notifications.',
            'Payment card numbers are processed directly on encrypted gateway infrastructure and are never stored on CHYTESS COLLECTION servers.',
          ],
        },
        terms: {
          eyebrow: 'Terms of Service',
          title: 'Terms and Conditions',
          paragraphs: [
            'By placing an order with CHYTESS COLLECTION, you confirm that all shipping and contact information provided is accurate. Prices are listed in USD and converted transparently at gateway settlement when paying in local currencies.',
            'Limited capsule garments are subject to real-time inventory availability.',
          ],
        },
      },
    },
  },
  fr: {
    loading: 'Chargement de CHYTESS COLLECTION...',
    nav: {
      collection: 'Collection',
      about: 'La Maison',
      founder: 'Fondatrice',
      view: 'Voir',
      toggleMenu: 'Ouvrir le menu de navigation',
      searchAria: 'Rechercher dans la collection',
      langSwitchAria: 'Passer la langue en anglais',
    },
    hero: {
      ariaLabel: 'Film de campagne 3D CHYTESS COLLECTION',
      pause: 'Pause',
      playFilm: 'Lire le film',
      scrollToDescend: 'Faites défiler pour entrer',
    },
    collection: {
      eyebrow: 'Maison Chytess · Salon d’Exposition',
      titlePre: 'La',
      titleItalic: 'Collection',
      tabs: {
        ALL: 'Tout',
        MEN: 'Homme',
        WOMEN: 'Femme',
        FOOTWEAR: 'Souliers',
        ACCESSORIES: 'Accessoires',
      },
      marquee: [
        'CHYTESS COLLECTION',
        'BOUTIQUE OUAGADOUGOU',
        'COUPE & SILHOUETTES',
        'MAISON DE COUTURE',
        'BURKINA FASO',
        'DRAPÉ ARCHITECTURAL',
      ],
    },
    carousel: {
      empty: 'Aucune pièce disponible dans cette catégorie.',
      ariaStage: 'Carrousel interactif 3D des pièces de couture',
      prev: 'Pièce précédente',
      next: 'Pièce suivante',
      auto: 'Auto',
      play: 'Lecture',
      speedAria: 'Vitesse du carrousel',
      pushForward: 'Accélérer',
      inspectGarment: 'Voir la pièce',
      selectColor: 'Choisir le coloris',
    },
    grid: {
      eyebrowPrefix: 'Catalogue Éditorial',
      titlePre: 'Silhouettes',
      titleItalic: 'Choisies',
      piecesCount: (count: number) =>
        `${String(count).padStart(2, '0')} Pièces · Sélectionnez une création pour l’explorer`,
      inspectAria: 'Explorer',
      noPrefix: 'N°',
      newArrival: 'Nouveauté',
      inspectBtn: 'Découvrir',
      previewColor: 'Aperçu',
      inColor: 'en',
    },
    about: {
      eyebrow: '02 · La Maison',
      titlePre: 'À propos de',
      titleBrand: 'CHYTESS COLLECTION',
      p1: 'CHYTESS COLLECTION est une maison de mode contemporaine indépendante dédiée aux proportions maîtrisées, aux textiles naturels denses et aux silhouettes architecturales intemporelles.',
      p2: 'Notre philosophie repose sur un luxe discret et une tenue structurelle durable. Chaque collection saisonnière réunit l’esprit urbain contemporain et l’art du tailleur sur mesure — molleton de coton biologique 520 g/m², popeline japonaise haute torsion, laine vierge et maroquinerie italienne façonnée à la main.',
      p3: 'Depuis notre boutique et salon de couture à Ouagadougou, au Burkina Faso, nous réalisons des séries numérotées et réfléchies, pensées pour habiter votre vestiaire durant des années.',
      pillars: [
        { title: '520 g/m²', subtitle: 'Coton Biologique' },
        { title: 'Laine Vierge', subtitle: 'Coupe Structurée' },
        { title: 'Pleine Fleur', subtitle: 'Cuir Monté Main' },
      ],
      imageAlt: 'Éditorial Atelier CHYTESS COLLECTION',
      sealAlt: 'Sceau CHYTESS COLLECTION',
    },
    theatre: {
      ariaSection: 'Théâtre Lookbook interactif CHYTESS COLLECTION',
      eyebrow: 'Maison Chytess · Film Piloté au Défilement',
      titlePre: 'Théâtre',
      titleItalic: 'Lookbook',
      titlePost: 'Numérique',
      pause: 'Pause',
      play: 'Lecture',
      canvasAria: 'Film lookbook réactif au défilement présentant les collections CHYTESS',
      scrollToPlay: 'Faites défiler pour lancer',
      scrollHint: 'Défiler vers le bas pour avancer · Vers le haut pour revenir',
      beats: [
        {
          index: '01',
          title: 'Salon Numérique',
          caption: 'Une sélection lookbook mise en scène pour une découverte fluide sur mobile.',
        },
        {
          index: '02',
          title: 'Mouvement Synchronisé',
          caption: 'Avancez ou rembobinez le film image par image à chaque geste de défilement.',
        },
        {
          index: '03',
          title: 'Studio Ouagadougou',
          caption: 'Des silhouettes contemporaines pensées pour durer bien au-delà de la saison.',
        },
      ],
    },
    founder: {
      eyebrow: '03 · Fondatrice & Présidente-Directrice Générale',
      portraitAlt: 'Chinyere Augustina Okezue — Fondatrice & PDG de CHYTESS COLLECTION',
      badgeLeft: 'Fondatrice & PDG',
      badgeRight: 'Ouagadougou',
      p1: 'Au cœur de CHYTESS COLLECTION se trouve sa Fondatrice et Directrice Générale Chinyere Augustina Okezue — une entrepreneure visionnaire dotée d’un regard sûr pour l’élégance naturelle, la coupe structurée et le luxe contemporain.',
      p2: 'Guidée par la conviction qu’un vêtement doit inspirer une assurance sereine dès que vous entrez dans une pièce, Chinyere supervise personnellement la direction artistique et l’exigence de la maison — des manteaux intemporels aux tenues du soir, souliers et accessoires en cuir raffiné.',
      p3: 'Depuis notre boutique phare sur l’Avenue Kwamé N’Krumah à Ouagadougou, au Burkina Faso, elle a fait de CHYTESS COLLECTION une adresse d’exception pour une clientèle éprise de qualité durable, de finitions impeccables et de prestance.',
      quote:
        'Le véritable style ne se presse jamais — il réside dans la coupe, la matière et l’assurance paisible avec laquelle vous portez chaque pièce.',
      caption: 'Chinyere Augustina Okezue · PDG & Propriétaire',
    },
    footer: {
      tagline:
        'Mode architecturale contemporaine et pièces essentielles sur mesure pour Homme, Femme et Haute Maroquinerie.',
      navigation: 'Navigation',
      collection: 'Collection',
      aboutUs: 'La Maison',
      founderCeo: 'Fondatrice & PDG',
      phoneLabel: 'Téléphone',
      rights: 'Tous droits réservés.',
    },
    search: {
      placeholder: 'Rechercher homme, femme, manteaux, costumes, robes, baskets...',
      clear: 'Effacer',
      closeAria: 'Fermer la recherche',
      highlights: 'Sélections Phares',
      matchingPieces: (count: number) =>
        `${count} ${count > 1 ? 'Pièces Trouvées' : 'Pièce Trouvée'}`,
      empty: (q: string) =>
        `Aucune création trouvée pour « ${q} ». Essayez Homme, Femme, Vestes, Costumes, Robes ou Baskets.`,
    },
    lightbox: {
      closeAria: 'Fermer l’aperçu photo',
      colourways: 'Coloris',
      materialsCut: 'Matières & Coupe',
      selectColor: 'Choisir le coloris',
      viewWord: 'vue',
    },
    whatsapp: {
      asideAria: 'Conciergerie WhatsApp',
      linkAria: 'Discuter avec CHYTESS COLLECTION sur WhatsApp',
      href: 'https://wa.me/22658989891?text=Bonjour%20CHYTESS%20COLLECTION%20Ouagadougou,%20je%20souhaite%20obtenir%20des%20informations%20sur%20vos%20cr%C3%A9ations.',
    },
    info: {
      back: 'Retour à la Boutique',
      emailLabel: 'Conciergerie E-mail',
      phoneLabel: 'Ligne Boutique',
      addressLabel: 'Boutique Phare',
      sentMessage:
        'Merci. Votre message a bien été transmis à notre équipe conciergerie qui vous répondra sous un jour ouvré.',
      namePlaceholder: 'Votre Nom',
      emailPlaceholder: 'Adresse E-mail',
      messagePlaceholder: 'Comment notre conciergerie peut-elle vous accompagner ?',
      sendMessage: 'Envoyer le Message',
      topics: {
        about: {
          eyebrow: 'La Maison',
          title: 'À propos de CHYTESS COLLECTION',
          paragraphs: [
            'CHYTESS COLLECTION est une boutique de mode et maison de couture installée à Ouagadougou, au Burkina Faso, dédiée aux proportions rigoureuses, aux textiles naturels denses et aux silhouettes architecturales durables.',
            'Chaque sortie saisonnière marie une sensibilité contemporaine à l’exigence du sur-mesure — coton biologique 520 g/m², popeline japonaise haute torsion, laine vierge et souliers montés main.',
            'Depuis notre boutique sur l’Avenue Kwamé N’Krumah à Ouagadougou, nous proposons nos créations et essayages sur mesure pour une élégance quotidienne.',
          ],
        },
        contact: {
          eyebrow: 'Conciergerie Boutique',
          title: 'Contact',
          paragraphs: [
            'Notre équipe à Ouagadougou est disponible du lundi au samedi, de 08h30 à 19h00 GMT, pour vous accompagner dans vos achats, conseils de taille et visites privées.',
            'Salon Boutique : Avenue Kwamé N’Krumah, Ouagadougou, Burkina Faso.',
          ],
        },
        support: {
          eyebrow: 'Service Client',
          title: 'Accompagnement Client',
          paragraphs: [
            'Pour toute modification de commande, planification de livraison ou conseil d’entretien de vos pièces en laine vierge et cuir pleine fleur, contactez notre conciergerie ci-dessous ou à concierge@chytesscollection.com.',
          ],
        },
        shipping: {
          eyebrow: 'Expédition & Logistique',
          title: 'Livraison',
          paragraphs: [
            'Toutes les commandes sont contrôlées, préparées et expédiées sous 24 à 48 heures ouvrées depuis notre atelier.',
            'Livraison express offerte dès 250 $ d’achat. Expédition régionale au Burkina Faso et en Afrique de l’Ouest à 12 $ (1–3 jours ouvrés), Royaume-Uni 22 $ (2–4 jours) et DHL Express international à 28 $ (3–5 jours).',
          ],
        },
        returns: {
          eyebrow: 'Garantie Client',
          title: 'Retours et Échanges',
          paragraphs: [
            'Les pièces non portées dans leur état d’origine avec étiquettes et housses peuvent être retournées ou échangées sous 14 jours.',
            'Les échanges de taille sont traités en priorité dès réception, et les remboursements validés sont effectués sous 3 à 5 jours ouvrés.',
          ],
        },
        privacy: {
          eyebrow: 'Protection des Données',
          title: 'Confidentialité',
          paragraphs: [
            'CHYTESS COLLECTION collecte uniquement les informations nécessaires au traitement des commandes et à leur acheminement.',
            'Aucune donnée bancaire n’est conservée sur les serveurs de CHYTESS COLLECTION.',
          ],
        },
        terms: {
          eyebrow: 'Conditions Générales',
          title: 'Conditions d’Utilisation',
          paragraphs: [
            'En passant commande auprès de CHYTESS COLLECTION, vous confirmez l’exactitude de vos coordonnées de livraison.',
            'Les créations en édition limitée sont proposées sous réserve de disponibilité immédiate.',
          ],
        },
      },
    },
  },
} as const;

export function localizeProduct(product: Product, lang: Language): {
  name: string;
  description: string;
  details: string[];
  category: string;
  gender: string;
  collection: string;
  translateColor: (colorName?: string) => string;
} {
  if (lang === 'en') {
    return {
      name: product.name,
      description: product.description,
      details: product.details,
      category: product.category,
      gender: product.gender,
      collection: product.collection,
      translateColor: (colorName?: string) => colorName || '',
    };
  }

  const fr = PRODUCT_FR_TRANSLATIONS[product.id];
  return {
    name: fr?.name || product.name,
    description: fr?.description || product.description,
    details: fr?.details || product.details,
    category: CATEGORY_FR[product.category] || product.category,
    gender: GENDER_FR[product.gender] || product.gender,
    collection: COLLECTION_FR[product.collection] || product.collection,
    translateColor: (colorName?: string) =>
      colorName ? COLOR_FR[colorName] || colorName : '',
  };
}

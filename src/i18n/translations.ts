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
  'prod-w6': {
    name: 'Ensemble Lingerie Soie Pourpre & Dentelle',
    description:
      'Ensemble lingerie et sous-vêtements femme confectionné en satin de soie de mûrier bordeaux profond et dentelle de Chantilly française, avec bralette et culotte assorties.',
    details: [
      '100 % charmeuse de soie de mûrier 19 mommes',
      'Bordures en dentelle de Chantilly festonnée',
      'Bretelles réglables en soie & boutons recouverts',
      'Doublure intérieure respirante en coton biologique',
    ],
  },
  'prod-w7': {
    name: 'Coffret Sous-Vêtements Côtelés Coton-Modal',
    description:
      'Ensemble de sous-vêtements et bralettes du quotidien pour femme tricoté en maille côtelée ultra-douce coton biologique et modal dans les tons signature de la maison.',
    details: [
      '58 % coton Pima biologique, 37 % modal Tencel, 5 % élasthanne',
      'Bande de maintien côtelée sans coutures',
      'Culotte galbante taille mi-haute à haute',
      'Présenté en pochette en lin signée Chytess',
    ],
  },
  'prod-u1': {
    name: 'Slips Tailleur Coton & Soie',
    description:
      'Sous-vêtements slips ergonomiques confectionnés en coton Pima biologique peigné et jersey de soie respirant, finis d’une ceinture tissée ton sur ton.',
    details: [
      '78 % coton Pima biologique, 16 % soie de mûrier, 6 % élasthanne',
      'Ceinture micro-tissée douce ton sur ton',
      'Coutures plates anti-frottements',
      'Présentation atelier individuelle ou coffret',
    ],
  },
  'prod-u2': {
    name: 'Boxers Popeline & Maille Côtelée',
    description:
      'Caleçons boxers en popeline japonaise croquante et boxers côtelés en coton-modal biologique pensés pour une aisance respirante et un maintien impeccable.',
    details: [
      'Popeline haute torsion 100 % coton & maille côtelée coton-modal',
      'Fentes latérales taillées & braguette dissimulée',
      'Poche anatomique de maintien confortable',
      'Prélavés pour une douceur immédiate',
    ],
  },
  'prod-u3': {
    name: 'Soutien-Gorge Sculpté Soie & Dentelle',
    description:
      'Soutien-gorge balconnet architectural à armatures en satin de soie de mûrier bordeaux profond, habillé de dentelle de Chantilly champagne et fermoirs dorés.',
    details: [
      'Bonnets en charmeuse de soie de mûrier 19 mommes',
      'Dentelle de Chantilly champagne festonnée',
      'Fermoir avant & réglages en métal doré brossé',
      'Doublure respirante en coton et soie',
    ],
  },
  'prod-u4': {
    name: 'Débardeur Singlet Finement Côtelé Pima',
    description:
      'Singlet sans manches seconde peau tricoté en fines côtes 2×2 de coton Pima biologique et modal pour des superpositions nettes sous vos costumes.',
    details: [
      '65 % coton Pima biologique, 35 % micro-modal',
      'Corps tubulaire sans coutures latérales',
      'Encolure et emmanchures gansées renforcées',
      'Lavage à froid · Tenue durable',
    ],
  },
  'prod-u5': {
    name: 'Collants Sculptants Mats & Voilés Atelier',
    description:
      'Collants haute tenue anti-filage dotés d’une ceinture gainante taille haute et d’un fini mat velouté 60 deniers, présentés dans une pochette en satin pourpre.',
    details: [
      'Microfibre italienne multifilament haute douceur',
      'Compression graduée & ceinture plate confort',
      'Gousset coton respirant & pointes renforcées',
      'Livrés avec pochette de rangement en soie pourpre',
    ],
  },
  'prod-a3': {
    name: 'Chaînes Or Brossé 18 ct & Pendentif',
    description:
      'Chaînes maille gourmette épaisses superposées et collier à pendentif médaillon sculpté en or brossé 18 carats, pensés pour sublimer chaque silhouette.',
    details: [
      'Vermeil or 18 carats sur argent massif recyclé',
      'Médaillon organique ciselé à la main',
      'Fermoir mousqueton sur mesure & maillons réglables',
      'Finition satinée anti-ternissement · Pochette incluse',
    ],
  },
  'prod-a4': {
    name: 'Montre Atelier Cadran Bordeaux & Or',
    description:
      'Montre habillée mécanique minimaliste au boîtier de 39 mm en acier doré brossé, cadran soleillé bordeaux profond et bracelet en cuir grainé expresso.',
    details: [
      'Boîtier 39 mm acier inoxydable 316L doré brossé',
      'Cadran soleillé bordeaux & verre saphir antireflet',
      'Mouvement automatique suisse réserve de marche 42 h',
      'Bracelet en veau grainé expresso interchangeable',
    ],
  },
  'prod-a5': {
    name: 'Joncs & Bangles Or Sculpté & Émail',
    description:
      'Parure architecturale de bracelets joncs martelés et facettés en or 18 carats accompagnés de bangles articulés en émail pourpre.',
    details: [
      'Vermeil or 18 carats martelé et facetté',
      'Incrustations en émail laqué pourpre cuit au four',
      'Charnière ressort dissimulée haute précision',
      'Présentés dans leur coffret joaillerie Chytess',
    ],
  },
  'prod-a6': {
    name: 'Parfum Extrait Oud & Rose Pourpre',
    description:
      'Extrait de parfum signature haute tenue mêlant safran épicé, rose pourpre de Damas, ambre du Sahara et oud fumé dans un flacon facetté coiffé d’un capot doré.',
    details: [
      'Concentration Extrait de Parfum 100 ml (28 % d’essences)',
      'Tête : Safran & Bergamote · Cœur : Rose Pourpre',
      'Fond : Oud Fumé, Ambre Chaud & Musc Blanc',
      'Flacon architectural taillé et capot laiton brossé',
    ],
  },
  'prod-w8': {
    name: 'Robe du Soir Plissée Soie Champagne',
    description:
      'Robe longue du soir en satin de soie champagne-ivoire dotée d’un bustier asymétrique drapé main, de fins plis soleil et d’une traîne fluide.',
    details: [
      '100 % satin de soie de mûrier 22 mommes',
      'Bustier sculptural drapé asymétrique à la main',
      'Jupe longue micro-plissée à mouvement fluide',
      'Doublure intégrale en habotai de soie · Zip dissimulé',
    ],
  },
  'prod-w9': {
    name: 'Robe Longue Velours Bordeaux Épaules Dénudées',
    description:
      'Robe du soir majestueuse en velours de soie bordeaux profond, coupe épaules dénudées sculptée, taille corsetée et jupe évasée tombant jusqu’au sol.',
    details: [
      '82 % viscose, 18 % soie de mûrier velours couture',
      'Corsage baleiné intégré pour un port sculptural',
      'Col drapé épaules dénudées',
      'Nettoyage à sec · Édition Atelier Ouagadougou',
    ],
  },
  'prod-w10': {
    name: 'Blouse Soie Perle & Jupe Midi Plissée Pourpre',
    description:
      'Ensemble féminin deux pièces réunissant une blouse fluide à lavallière en soie de mûrier ivoire perle et une jupe midi plissée taille haute pourpre maison.',
    details: [
      'Blouse 100 % charmeuse de soie 19 mommes avec lien lavallière',
      'Jupe midi plissée soleil en crêpe pourpre',
      'Livrée avec fine ceinture en cuir boucle dorée',
      'Poches latérales dissimulées & fermeture invisible',
    ],
  },
  'prod-w11': {
    name: 'Robe Portefeuille Cocktail Dentelle Ivoire',
    description:
      'Robe cocktail portefeuille longueur midi en dentelle de Chantilly florale ivoire poudré doublée de georgette de soie, manches volantées et ceinture nouée.',
    details: [
      'Dentelle de Chantilly française sur fond de soie pure',
      'Décolleté cache-cœur croisé et ceinture à nouer',
      'Manches trois-quarts volantées festonnées',
      'Ourlet midi fluide fini main',
    ],
  },
};

export const CATEGORY_FR: Record<string, string> = {
  Jackets: 'Vestes & Manteaux',
  Suiting: 'Costumes',
  Dresses: 'Robes',
  Intimates: 'Lingerie & Sous-vêtements',
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
  Jewellery: 'Joaillerie',
  Fragrance: 'Parfums',
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
  'Deep Burgundy / Champagne': 'Bordeaux / Champagne',
  'Champagne / Espresso / Crimson': 'Champagne / Expresso / Pourpre',
  'Charcoal / Ivory / Burgundy': 'Anthracite / Ivoire / Bordeaux',
  'Burgundy / Obsidian / Champagne': 'Bordeaux / Obsidienne / Champagne',
  'Ivory / Charcoal': 'Ivoire / Anthracite',
  'Obsidian / Espresso / Slate': 'Obsidienne / Expresso / Ardoise',
  'Brushed 18k Gold': 'Or Brossé 18 ct',
  'Burgundy Dial / Espresso': 'Cadran Bordeaux / Expresso',
  'Gold / Crimson Enamel': 'Or / Émail Pourpre',
  'Amber Oud / Brushed Gold': 'Oud Ambré / Or Brossé',
  'Champagne Ivory': 'Ivoire Champagne',
  'Deep Oxblood Velvet': 'Velours Bordeaux Profond',
  'Pearl Ivory / Crimson': 'Ivoire Perle / Pourpre',
  'Blush Ivory Lace': 'Dentelle Ivoire Poudré',
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
        UNDERWEAR: 'Underwear',
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
      menRowEyebrow: '01 · Menswear Division',
      menRowTitle: "Men's",
      menRowTitleItalic: 'Collection',
      menRowSubtitle: 'Tailored coats, suiting, shirts, fleece, footwear & essentials',
      womenRowEyebrow: '02 · Complete Womenswear',
      womenRowTitle: "Women's",
      womenRowTitleItalic: 'Collection',
      womenRowSubtitle: 'Coats, suiting, gowns, intimates & underwear, bags, heels & essentials',
      underwearRowEyebrow: '03 · Underwear Division',
      underwearRowTitle: 'Underwear',
      underwearRowTitleItalic: 'Collection',
      underwearRowSubtitle: 'Sample briefs pants, boxers, sculpted brassieres, singlets, tights & intimates',
      footwearRowEyebrow: 'Atelier Footwear',
      footwearRowTitle: 'Hand-Lasted',
      footwearRowTitleItalic: 'Footwear',
      footwearRowSubtitle: 'Calfskin sneakers, Chelsea boots & oxblood loafers',
      accessoriesRowEyebrow: '04 · Accessories Division',
      accessoriesRowTitle: 'Accessories',
      accessoriesRowTitleItalic: 'Collection',
      accessoriesRowSubtitle: 'Chains, necklaces, watches, bangles, perfumes, bags & eyewear',
      swipeHint: 'Swipe or scroll horizontally',
      scrollLeftAria: 'Scroll garments left',
      scrollRightAria: 'Scroll garments right',
      verticalMen: 'MEN',
      verticalWomen: 'WOMEN',
      verticalUnderwear: 'UNDERWEAR',
      verticalAccessories: 'ACCESSORIES',
      verticalUnisex: 'UNISEX',
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
      clientCare: 'Client Care',
      contact: 'Boutique Contact',
      shipping: 'Showroom & Delivery',
      returns: 'Garment Care & Fitting',
      privacy: 'Privacy Policy',
      phoneLabel: 'Phone',
      rights: 'All rights reserved.',
    },
    search: {
      placeholder: 'Search men, women, gowns, underwear, chains, watches, perfume...',
      clear: 'Clear',
      closeAria: 'Close search',
      highlights: 'Collection Highlights',
      quickLabel: 'Quick Explore',
      quickTags: ['Gowns', 'Men', 'Women', 'Underwear', 'Chains', 'Watches', 'Perfume'],
      matchingPieces: (count: number) => `${count} Matching Pieces`,
      empty: (q: string) =>
        `No pieces matched “${q}”. Try Men, Women, Gowns, Underwear, Chains, or Watches.`,
    },
    lightbox: {
      closeAria: 'Close photo preview',
      colourways: 'Colourways',
      materialsCut: 'Materials & Cut',
      sizesLabel: 'Available Sizes',
      selectColor: 'Select colour',
      viewWord: 'view',
      prevPhotoAria: 'Previous photo',
      nextPhotoAria: 'Next photo',
      inquireWhatsapp: 'Inquire on WhatsApp',
      whatsappProductMsg: (name: string) =>
        `https://wa.me/22658989891?text=${encodeURIComponent(
          `Hello CHYTESS COLLECTION Boutique, Ouagadougou, I would like to inquire about "${name}".`
        )}`,
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
            'From our boutique on Avenue Kwamé N’Krumah in Ouagadougou, we welcome guests for private fittings and bespoke styling designed for daily elegance.',
          ],
        },
        contact: {
          eyebrow: 'Boutique Concierge',
          title: 'Contact Us',
          paragraphs: [
            'Our boutique team in Ouagadougou, Burkina Faso is available Monday through Saturday, 08:30 – 19:00 GMT, to assist with private styling, sizing guidance, and showroom visits.',
            'Boutique Showroom: Avenue Kwamé N’Krumah, Ouagadougou, Burkina Faso.',
          ],
        },
        support: {
          eyebrow: 'Client Care',
          title: 'Customer Support',
          paragraphs: [
            'For private styling appointments, delivery scheduling, or care instructions for virgin wool and full-grain leather goods, reach our concierge using the inquiry form below or write directly to concierge@chytesscollection.com.',
          ],
        },
        shipping: {
          eyebrow: 'Dispatch & Logistics',
          title: 'Showroom & Delivery',
          paragraphs: [
            'Every piece is inspected, garment-steamed, and carefully prepared within 24–48 business hours at our Ouagadougou atelier.',
            'Regional courier coordination across Burkina Faso & West Africa takes 1–3 business days, with international concierge courier arrangements available directly through our Ouagadougou team.',
          ],
        },
        returns: {
          eyebrow: 'Client Guarantee',
          title: 'Garment Care & Exchanges',
          paragraphs: [
            'Unworn garments in original condition with tags and garment bags intact may be scheduled for a size exchange within 14 days of receipt.',
            'Tailoring adjustments and size exchanges are prioritized by our Ouagadougou showroom team.',
          ],
        },
        privacy: {
          eyebrow: 'Legal & Data Protection',
          title: 'Privacy Policy',
          paragraphs: [
            'CHYTESS COLLECTION collects only the contact and appointment details you voluntarily share when reaching out to our Ouagadougou concierge team.',
            'Client inquiries are handled with strict confidentiality and are never shared with outside third parties.',
          ],
        },
        terms: {
          eyebrow: 'Terms of Service',
          title: 'Terms and Conditions',
          paragraphs: [
            'By submitting a styling or showroom inquiry with CHYTESS COLLECTION, you confirm that your contact information is accurate so our concierge team may assist you.',
            'Limited capsule garments showcased in our lookbook are subject to current atelier and showroom availability.',
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
        UNDERWEAR: 'Sous-vêtements',
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
      menRowEyebrow: '01 · Vestiaire Masculin',
      menRowTitle: 'Section',
      menRowTitleItalic: 'Homme',
      menRowSubtitle: 'Manteaux, costumes, surchemises, molleton, souliers & essentiels',
      womenRowEyebrow: '02 · Vestiaire Féminin Complet',
      womenRowTitle: 'Section',
      womenRowTitleItalic: 'Femme',
      womenRowSubtitle: 'Manteaux, tailleurs, robes, lingerie & sous-vêtements, sacs & souliers',
      underwearRowEyebrow: '03 · Lingerie & Sous-Vêtements',
      underwearRowTitle: 'Section',
      underwearRowTitleItalic: 'Sous-vêtements',
      underwearRowSubtitle: 'Slips, boxers, soutiens-gorge, débardeurs singlets, collants & lingerie',
      footwearRowEyebrow: 'Atelier Souliers',
      footwearRowTitle: 'Souliers',
      footwearRowTitleItalic: 'Atelier',
      footwearRowSubtitle: 'Baskets en cuir nappa, bottines Chelsea & mocassins bordeaux',
      accessoriesRowEyebrow: '04 · Joaillerie, Parfums & Accessoires',
      accessoriesRowTitle: 'Section',
      accessoriesRowTitleItalic: 'Accessoires',
      accessoriesRowSubtitle: 'Chaînes, colliers, montres, joncs bangles, parfums, sacs & lunettes',
      swipeHint: 'Glisser horizontalement',
      scrollLeftAria: 'Défiler vers la gauche',
      scrollRightAria: 'Défiler vers la droite',
      verticalMen: 'HOMME',
      verticalWomen: 'FEMME',
      verticalUnderwear: 'UNDERWEAR',
      verticalAccessories: 'ACCESSOIRES',
      verticalUnisex: 'UNISEXE',
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
      clientCare: 'Service Client',
      contact: 'Contact Boutique',
      shipping: 'Atelier & Livraison',
      returns: 'Entretien & Échanges',
      privacy: 'Confidentialité',
      phoneLabel: 'Téléphone',
      rights: 'Tous droits réservés.',
    },
    search: {
      placeholder: 'Rechercher homme, femme, robes, sous-vêtements, chaînes, montres...',
      clear: 'Effacer',
      closeAria: 'Fermer la recherche',
      highlights: 'Sélections Phares',
      quickLabel: 'Accès Rapide',
      quickTags: ['Robes', 'Homme', 'Femme', 'Lingerie', 'Chaînes', 'Montres', 'Parfum'],
      matchingPieces: (count: number) =>
        `${count} ${count > 1 ? 'Pièces Trouvées' : 'Pièce Trouvée'}`,
      empty: (q: string) =>
        `Aucune création trouvée pour « ${q} ». Essayez Homme, Femme, Robes, Lingerie, Chaînes ou Montres.`,
    },
    lightbox: {
      closeAria: 'Fermer l’aperçu photo',
      colourways: 'Coloris',
      materialsCut: 'Matières & Coupe',
      sizesLabel: 'Tailles Disponibles',
      selectColor: 'Choisir le coloris',
      viewWord: 'vue',
      prevPhotoAria: 'Photo précédente',
      nextPhotoAria: 'Photo suivante',
      inquireWhatsapp: 'Contacter sur WhatsApp',
      whatsappProductMsg: (name: string) =>
        `https://wa.me/22658989891?text=${encodeURIComponent(
          `Bonjour CHYTESS COLLECTION Ouagadougou, je souhaite des informations sur « ${name} ».`
        )}`,
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
            'Notre équipe à Ouagadougou est disponible du lundi au samedi, de 08h30 à 19h00 GMT, pour vous accompagner dans vos essayages privés, conseils de taille et visites au salon.',
            'Salon Boutique : Avenue Kwamé N’Krumah, Ouagadougou, Burkina Faso.',
          ],
        },
        support: {
          eyebrow: 'Service Client',
          title: 'Accompagnement Client',
          paragraphs: [
            'Pour tout rendez-vous privé, planification d’acheminement ou conseil d’entretien de vos pièces en laine vierge et cuir pleine fleur, contactez notre conciergerie ci-dessous ou à concierge@chytesscollection.com.',
          ],
        },
        shipping: {
          eyebrow: 'Expédition & Logistique',
          title: 'Atelier & Livraison',
          paragraphs: [
            'Toutes les créations sont contrôlées, défroissées à la vapeur et préparées sous 24 à 48 heures ouvrées au sein de notre atelier à Ouagadougou.',
            'L’acheminement régional au Burkina Faso et en Afrique de l’Ouest s’effectue sous 1 à 3 jours ouvrés, avec coordination de courrier international sur demande via notre conciergerie.',
          ],
        },
        returns: {
          eyebrow: 'Garantie Client',
          title: 'Entretien & Échanges',
          paragraphs: [
            'Les pièces non portées dans leur état d’origine avec étiquettes et housses peuvent être programmées pour un échange de taille sous 14 jours.',
            'Les ajustements de coupe et échanges de taille sont traités en priorité par notre équipe du salon de Ouagadougou.',
          ],
        },
        privacy: {
          eyebrow: 'Protection des Données',
          title: 'Confidentialité',
          paragraphs: [
            'CHYTESS COLLECTION recueille uniquement les coordonnées que vous partagez volontairement lors de vos échanges avec notre conciergerie à Ouagadougou.',
            'Vos demandes sont traitées en toute confidentialité et ne sont jamais transmises à des tiers.',
          ],
        },
        terms: {
          eyebrow: 'Conditions Générales',
          title: 'Conditions d’Utilisation',
          paragraphs: [
            'En adressant une demande de renseignement ou de rendez-vous à CHYTESS COLLECTION, vous confirmez l’exactitude de vos coordonnées de contact.',
            'Les créations en édition limitée présentées dans notre lookbook sont proposées selon la disponibilité immédiate en atelier.',
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

import type { CategoryName } from '../types';

export interface CategoryTile {
  name: CategoryName;
  subtitle: string;
  image: string;
}

export const CATEGORY_TILES: CategoryTile[] = [
  {
    name: 'Jackets',
    subtitle: 'Structured wool & technical outerwear',
    image: '/src/assets/images/jacket_obsidian_1795095958769.jpg',
  },
  {
    name: 'Hoodies',
    subtitle: '520gsm organic brushed fleece',
    image: '/src/assets/images/hoodie_chalk_1795095958973.jpg',
  },
  {
    name: 'Sweatshirts',
    subtitle: 'Garment-dyed loopback crewnecks',
    image: '/src/assets/images/sweatshirt_charcoal_1795095958616.jpg',
  },
  {
    name: 'T-shirts',
    subtitle: 'Compact 310gsm jersey essentials',
    image: '/src/assets/images/tee_ivory_1795095958370.jpg',
  },
  {
    name: 'Shirts',
    subtitle: 'Architectural poplin & wool overshirts',
    image: '/src/assets/images/shirt_slate_1795095958283.jpg',
  },
  {
    name: 'Trousers',
    subtitle: 'Double-pleated tailored silhouettes',
    image: '/src/assets/images/trousers_stone_1795095958593.jpg',
  },
  {
    name: 'Shorts',
    subtitle: 'Heavyweight cotton twill tailoring',
    image: '/src/assets/images/shorts_onyx_1795095958953.jpg',
  },
  {
    name: 'Sneakers',
    subtitle: 'Hand-lasted Italian leather & suede',
    image: '/src/assets/images/sneakers_bone_1795095958722.jpg',
  },
  {
    name: 'Caps',
    subtitle: 'Brushed wool-twill headwear',
    image: '/src/assets/images/cap_minimal_1795095958692.jpg',
  },
  {
    name: 'Accessories',
    subtitle: 'Full-grain leather goods & objects',
    image: '/src/assets/images/accessories_leather_1795095959074.jpg',
  },
];

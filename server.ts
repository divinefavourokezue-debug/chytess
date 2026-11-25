import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import type {
  Banner,
  NewsletterSubscriber,
  Order,
  OrderStatus,
  PaymentProvider,
  Product,
  User,
} from './src/types.ts';

interface StoredUser extends User {
  passwordHash: string;
}

interface StoreData {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  users: StoredUser[];
  subscribers: NewsletterSubscriber[];
}

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const SESSION_SECRET =
  process.env.SESSION_SECRET && !process.env.SESSION_SECRET.includes('REPLACE_WITH')
    ? process.env.SESSION_SECRET
    : crypto.createHash('sha256').update(process.cwd() + '-chytess-collection-session').digest('hex');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function createSessionToken(user: { id: string; email: string; role: 'customer' | 'admin' }): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined): { sub: string; email: string; role: 'customer' | 'admin' } | null {
  if (!token) return null;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return null;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed.exp !== 'number' || parsed.exp < Date.now()) return null;
    return { sub: String(parsed.sub), email: String(parsed.email), role: parsed.role };
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const key = part.slice(0, idx).trim();
      const val = decodeURIComponent(part.slice(idx + 1).trim());
      out[key] = val;
    }
  }
  return out;
}

const IMG = {
  hero: '/src/assets/images/hero_campaign_1795095958770.jpg',
  editorial: '/src/assets/images/collection_editorial_1795095959086.jpg',
  jacket: '/src/assets/images/jacket_obsidian_1795095958769.jpg',
  hoodie: '/src/assets/images/hoodie_chalk_1795095958973.jpg',
  sweatshirt: '/src/assets/images/sweatshirt_charcoal_1795095958616.jpg',
  tee: '/src/assets/images/tee_ivory_1795095958370.jpg',
  shirt: '/src/assets/images/shirt_slate_1795095958283.jpg',
  trousers: '/src/assets/images/trousers_stone_1795095958593.jpg',
  shorts: '/src/assets/images/shorts_onyx_1795095958953.jpg',
  sneakers: '/src/assets/images/sneakers_bone_1795095958722.jpg',
  cap: '/src/assets/images/cap_minimal_1795095958692.jpg',
  accessories: '/src/assets/images/accessories_leather_1795095959074.jpg',
};

function createInitialStore(): StoreData {
  const now = new Date().toISOString();
  const earlier = new Date(Date.now() - 86400000 * 3).toISOString();
  const lastWeek = new Date(Date.now() - 86400000 * 7).toISOString();

  const products: Product[] = [
    {
      id: 'prod-01',
      slug: 'atelier-cropped-wool-jacket',
      name: 'Atelier Cropped Wool Jacket',
      category: 'Jackets',
      gender: 'Unisex',
      collection: 'Monolith AW26',
      price: 340,
      description:
        'Precision-cut boxy jacket tailored from dense Italian double-faced virgin wool. Features a concealed horn placket, structured collar, and articulated sleeves for clean architectural volume.',
      details: [
        '100% Virgin Wool, 480gsm',
        'Boxy cropped silhouette',
        'Concealed front placket with cupro lining',
        'Dry clean only · Made in Portugal',
      ],
      images: [IMG.jacket, IMG.hero, IMG.editorial],
      colors: [
        { name: 'Obsidian', hex: '#141414', image: IMG.jacket },
        { name: 'Charcoal', hex: '#3B3D40', image: IMG.hero },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      stock: 18,
      isNewArrival: true,
      isFeatured: true,
      popularity: 98,
      createdAt: now,
    },
    {
      id: 'prod-02',
      slug: 'heavyweight-chalk-fleece-hoodie',
      name: 'Heavyweight Boxy Fleece Hoodie',
      category: 'Hoodies',
      gender: 'Unisex',
      collection: 'Core Uniform',
      price: 185,
      description:
        'Cut from 520gsm organic brushed loop-back French terry with a double-layered architectural hood and dropped shoulders. Garment-washed for a dry, structured hand-feel.',
      details: [
        '100% Organic Cotton, 520gsm',
        'Dropped shoulder, relaxed boxy fit',
        'Double-layer structured hood without drawcord',
        'Pre-shrunk and enzyme-washed',
      ],
      images: [IMG.hoodie, IMG.hero, IMG.sweatshirt],
      colors: [
        { name: 'Chalk', hex: '#EDEAE2', image: IMG.hoodie },
        { name: 'Washed Charcoal', hex: '#37393B', image: IMG.sweatshirt },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      stock: 34,
      isNewArrival: true,
      isFeatured: true,
      popularity: 96,
      createdAt: now,
    },
    {
      id: 'prod-03',
      slug: 'washed-charcoal-crewneck',
      name: 'Garment-Dyed Atelier Crewneck',
      category: 'Sweatshirts',
      gender: 'Unisex',
      collection: 'Core Uniform',
      price: 155,
      description:
        'Heavyweight loopback crewneck sweatshirt finished in a mineral pigment wash. Engineered with wide ribbed trims and reinforced flatlock seams for enduring shape.',
      details: [
        '100% Combed Cotton, 460gsm',
        'Mineral pigment garment dye',
        'High-density 2x2 ribbed cuffs and hem',
        'Relaxed unisex cut',
      ],
      images: [IMG.sweatshirt, IMG.hoodie],
      colors: [
        { name: 'Washed Charcoal', hex: '#3A3C3F', image: IMG.sweatshirt },
        { name: 'Chalk', hex: '#ECE8DF', image: IMG.hoodie },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 27,
      isNewArrival: false,
      isFeatured: true,
      popularity: 91,
      createdAt: earlier,
    },
    {
      id: 'prod-04',
      slug: 'mock-neck-heavy-jersey-tee',
      name: 'Structured Mock-Neck Tee',
      category: 'T-shirts',
      gender: 'Unisex',
      collection: 'Core Uniform',
      price: 85,
      description:
        'Elevated everyday jersey tee spun from compact 310gsm organic cotton. Features an extended half-sleeve, thick mock-neck collar, and clean blind-stitched hem.',
      details: [
        '100% Organic Compact Cotton, 310gsm',
        'Elevated 3cm ribbed mock-neck collar',
        'Boxy drape through chest and torso',
        'Machine wash cold',
      ],
      images: [IMG.tee, IMG.hoodie],
      colors: [
        { name: 'Ivory', hex: '#F3EFE4', image: IMG.tee },
        { name: 'Onyx', hex: '#171717', image: IMG.shorts },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      stock: 45,
      isNewArrival: true,
      isFeatured: true,
      popularity: 94,
      createdAt: now,
    },
    {
      id: 'prod-05',
      slug: 'slate-poplin-studio-overshirt',
      name: 'Architectural Poplin Overshirt',
      category: 'Shirts',
      gender: 'Men',
      collection: 'Monolith AW26',
      price: 210,
      description:
        'Crisp Japanese high-twist cotton poplin overshirt bridged between formal shirting and light outerwear. Detailed with matte corozo buttons and a clean single chest pocket.',
      details: [
        '100% High-Twist Japanese Cotton',
        'Corozo nut tonal buttons',
        'Straight hem with side gussets',
        'Relaxed tailored fit',
      ],
      images: [IMG.shirt, IMG.editorial],
      colors: [
        { name: 'Slate Navy', hex: '#2B3543', image: IMG.shirt },
        { name: 'Obsidian', hex: '#141414', image: IMG.editorial },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 22,
      isNewArrival: true,
      isFeatured: true,
      popularity: 88,
      createdAt: now,
    },
    {
      id: 'prod-06',
      slug: 'double-pleated-wool-trousers',
      name: 'Double-Pleated Wide Trousers',
      category: 'Trousers',
      gender: 'Women',
      collection: 'Monolith AW26',
      price: 245,
      description:
        'Fluid wide-leg trousers tailored in a breathable wool-gabardine blend. Deep double front pleats fall cleanly into a full-length silhouette with pressed creases.',
      details: [
        '70% Virgin Wool, 30% Technical Twill',
        'High-to-mid rise tailored waistband',
        'Side seam pockets and rear welt pockets',
        'Full cupro knee lining',
      ],
      images: [IMG.trousers, IMG.editorial],
      colors: [
        { name: 'Warm Stone', hex: '#C6AC8F', image: IMG.trousers },
        { name: 'Charcoal', hex: '#2D2E30', image: IMG.editorial },
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      stock: 19,
      isNewArrival: true,
      isFeatured: true,
      popularity: 95,
      createdAt: now,
    },
    {
      id: 'prod-07',
      slug: 'pleated-cotton-twill-shorts',
      name: 'Tailored Cotton Twill Shorts',
      category: 'Shorts',
      gender: 'Men',
      collection: 'Core Uniform',
      price: 135,
      description:
        'Knee-skimming tailored shorts cut from crisp 340gsm brushed cotton twill. Combines subtle front pleats with an internal tonal drawcord for effortless comfort.',
      details: [
        '100% Heavy Cotton Twill, 340gsm',
        'Relaxed knee-length proportion',
        'Elasticated rear waist with hidden drawcord',
        'Deep side-entry pockets',
      ],
      images: [IMG.shorts],
      colors: [
        { name: 'Onyx', hex: '#191919', image: IMG.shorts },
        { name: 'Stone', hex: '#C6AC8F', image: IMG.trousers },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 29,
      isNewArrival: false,
      isFeatured: false,
      popularity: 82,
      createdAt: earlier,
    },
    {
      id: 'prod-08',
      slug: 'travertine-court-low-sneakers',
      name: 'Nappa & Suede Low Sneakers',
      category: 'Sneakers',
      gender: 'Unisex',
      collection: 'Footwear Atelier',
      price: 295,
      description:
        'Hand-lasted low-top court sneakers constructed from supple full-grain Italian calfskin with tonal Italian suede overlays and a stitched Margom cupsole.',
      details: [
        'Full-grain calfskin upper & suede panelling',
        'Vegetable-tanned leather lining',
        'Stitched tonal rubber cupsole',
        'Includes spare organic cotton laces & dust bag',
      ],
      images: [IMG.sneakers],
      colors: [
        { name: 'Bone / Grey', hex: '#E8E3D9', image: IMG.sneakers },
      ],
      sizes: ['40', '41', '42', '43', '44', '45'],
      stock: 16,
      isNewArrival: true,
      isFeatured: true,
      popularity: 97,
      createdAt: now,
    },
    {
      id: 'prod-09',
      slug: 'brushed-wool-six-panel-cap',
      name: 'Brushed Wool Six-Panel Cap',
      category: 'Caps',
      gender: 'Unisex',
      collection: 'Core Uniform',
      price: 75,
      description:
        'Unstructured six-panel silhouette crafted from brushed Melton wool-twill with tonal stitched eyelets and an adjustable matte gunmetal clasp.',
      details: [
        '80% Wool, 20% Recycled Polyamide',
        'Pre-curved brim with 6-row tonal stitching',
        'Cotton twill interior sweatband',
        'Adjustable back strap (One Size)',
      ],
      images: [IMG.cap],
      colors: [
        { name: 'Charcoal', hex: '#2F3134', image: IMG.cap },
      ],
      sizes: ['One Size'],
      stock: 40,
      isNewArrival: false,
      isFeatured: false,
      popularity: 84,
      createdAt: earlier,
    },
    {
      id: 'prod-10',
      slug: 'grained-leather-crossbody-bag',
      name: 'Grained Leather Crossbody Bag',
      category: 'Accessories',
      gender: 'Unisex',
      collection: 'Leather Goods',
      price: 320,
      description:
        'Compact architectural crossbody bag crafted in pebble-grained full-grain leather with brushed palladium hardware, dual-zip compartments, and an adjustable strap.',
      details: [
        '100% Full-Grain Pebble Calfskin',
        'Brushed silver-tone hardware & YKK Excella zips',
        'Suede-lined interior with card slot',
        '22cm × 14cm × 6.5cm',
      ],
      images: [IMG.accessories],
      colors: [
        { name: 'Obsidian Leather', hex: '#141414', image: IMG.accessories },
      ],
      sizes: ['One Size'],
      stock: 12,
      isNewArrival: true,
      isFeatured: true,
      popularity: 93,
      createdAt: now,
    },
    {
      id: 'prod-11',
      slug: 'monolith-double-breasted-overcoat',
      name: 'Monolith Wool Overcoat',
      category: 'Jackets',
      gender: 'Women',
      collection: 'Monolith AW26',
      price: 490,
      description:
        'Full-length double-breasted wool overcoat with clean notch lapels, horn buttons, and generous layering room over heavyweight fleece or knitwear.',
      details: [
        '100% Virgin Melton Wool, 620gsm',
        'Full jacquard viscose lining',
        'Double welt side pockets & internal breast pocket',
        'Dry clean only',
      ],
      images: [IMG.hero, IMG.jacket],
      colors: [
        { name: 'Deep Charcoal', hex: '#27292B', image: IMG.hero },
        { name: 'Obsidian', hex: '#141414', image: IMG.jacket },
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      stock: 9,
      isNewArrival: true,
      isFeatured: false,
      popularity: 92,
      createdAt: now,
    },
    {
      id: 'prod-12',
      slug: 'atelier-wool-overshirt-set',
      name: 'Textured Wool Gallery Overshirt',
      category: 'Shirts',
      gender: 'Women',
      collection: 'Monolith AW26',
      price: 260,
      description:
        'Relaxed brushed wool-blend overshirt designed as an effortless transitional outer layer. Tailored with clean dropped shoulders and tonal matte hardware.',
      details: [
        '65% Virgin Wool, 35% Organic Cotton',
        'Unlined clean-bound interior seams',
        'Twin side seam pockets',
        'Designed for relaxed layering',
      ],
      images: [IMG.editorial, IMG.shirt],
      colors: [
        { name: 'Heather Grey', hex: '#5D5F62', image: IMG.editorial },
        { name: 'Slate', hex: '#2B3543', image: IMG.shirt },
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      stock: 15,
      isNewArrival: false,
      isFeatured: false,
      popularity: 86,
      createdAt: lastWeek,
    },
  ];

  const banners: Banner[] = [
    {
      id: 'banner-announcement',
      placement: 'announcement',
      eyebrow: 'Season Dispatch',
      title: 'Complimentary express shipping on orders over $250 · Autumn / Winter 26 Now Live',
      subtitle: '',
      ctaText: 'Explore New Arrivals',
      ctaCategory: 'New Arrivals',
      image: '',
      active: true,
    },
    {
      id: 'banner-hero',
      placement: 'hero',
      eyebrow: 'Autumn / Winter 2026 Campaign',
      title: 'Architectural Restraint in Every Silhouette',
      subtitle:
        'Heavyweight natural fabrics, disciplined proportions, and contemporary tailoring engineered for daily permanence.',
      ctaText: 'Shop Now',
      ctaCategory: 'All',
      image: IMG.hero,
      active: true,
    },
    {
      id: 'banner-editorial',
      placement: 'editorial',
      eyebrow: 'The Monolith Capsule',
      title: 'Form, Texture & Quiet Luxury',
      subtitle:
        'A focused study in virgin wool outerwear, compact organic jersey, and tonal leather goods.',
      ctaText: 'Shop The Capsule',
      ctaCategory: 'Jackets',
      image: IMG.editorial,
      active: true,
    },
    {
      id: 'banner-promo',
      placement: 'promo',
      eyebrow: 'Seasonal Archive Release',
      title: '20% Off Core Uniform Bundles',
      subtitle:
        'Pair any heavyweight hoodie or crewneck with tailored trousers for refined seasonal layering.',
      ctaText: 'Shop Core Uniform',
      ctaCategory: 'Hoodies',
      image: IMG.hoodie,
      active: true,
    },
    {
      id: 'banner-scroll-video',
      placement: 'scroll_video',
      eyebrow: 'Campaign Film · AW26',
      title: 'Silhouettes in Motion',
      subtitle:
        'Tailored virgin wool and heavyweight organic cotton studied through architectural movement.',
      ctaText: 'Shop The Campaign',
      ctaCategory: 'All',
      image: IMG.editorial,
      videoUrl: '',
      active: true,
    },
  ];

  const adminUser: StoredUser = {
    id: 'usr-admin-1',
    name: 'Chytess Collection Owner',
    email: 'admin@chytesscollection.com',
    role: 'admin',
    createdAt: lastWeek,
    passwordHash: hashPassword('ChytessOwner2026!'),
  };

  const sampleCustomer: StoredUser = {
    id: 'usr-cust-1',
    name: 'Amara Okafor',
    email: 'amara@example.com',
    role: 'customer',
    phone: '+234 803 555 0192',
    address: '14 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    country: 'Nigeria',
    createdAt: earlier,
    passwordHash: hashPassword('Customer2026!'),
  };

  const sampleOrders: Order[] = [
    {
      id: 'ord-1001',
      orderNumber: 'CHY-1042',
      userId: 'usr-cust-1',
      customerName: 'Amara Okafor',
      email: 'amara@example.com',
      phone: '+234 803 555 0192',
      address: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      country: 'Nigeria',
      items: [
        {
          productId: 'prod-01',
          name: 'Atelier Cropped Wool Jacket',
          category: 'Jackets',
          price: 340,
          quantity: 1,
          size: 'M',
          color: 'Obsidian',
          image: IMG.jacket,
        },
        {
          productId: 'prod-04',
          name: 'Structured Mock-Neck Tee',
          category: 'T-shirts',
          price: 85,
          quantity: 1,
          size: 'M',
          color: 'Ivory',
          image: IMG.tee,
        },
      ],
      subtotal: 425,
      deliveryFee: 0,
      total: 425,
      paymentMethod: 'paystack',
      paymentReference: 'CHY-PAY-1042',
      paymentStatus: 'verified',
      status: 'Shipped',
      createdAt: earlier,
      updatedAt: now,
    },
  ];

  return {
    products,
    banners,
    orders: sampleOrders,
    users: [adminUser, sampleCustomer],
    subscribers: [
      { id: 'sub-1', email: 'editorial@chytesscollection.com', createdAt: lastWeek },
    ],
  };
}

function readStore(): StoreData {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = createInitialStore();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as StoreData;
    if (Array.isArray(parsed.banners) && !parsed.banners.some((b) => b.placement === 'scroll_video')) {
      parsed.banners.push({
        id: 'banner-scroll-video',
        placement: 'scroll_video',
        eyebrow: 'Campaign Film · AW26',
        title: 'Silhouettes in Motion',
        subtitle:
          'Tailored virgin wool and heavyweight organic cotton studied through architectural movement.',
        ctaText: 'Shop The Campaign',
        ctaCategory: 'All',
        image: IMG.editorial,
        videoUrl: '',
        active: true,
      });
      writeStore(parsed);
    }
    return parsed;
  } catch {
    const fallback = createInitialStore();
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

function writeStore(data: StoreData): void {
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, DATA_FILE);
}

function sanitizeUser(user: StoredUser): User {
  const { passwordHash: _ignored, ...rest } = user;
  return rest;
}

function computeDeliveryFee(country: string, subtotal: number): number {
  if (subtotal >= 250) return 0;
  const normalized = country.trim().toLowerCase();
  if (normalized === 'nigeria' || normalized === 'ghana') return 12;
  if (normalized === 'united kingdom' || normalized === 'uk') return 22;
  return 28;
}

// Preserve original uploaded file bytes and extension without any modification/editing
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base = path
      .basename(file.originalname || 'asset', ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 48);
    const unique = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${base || 'upload'}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 },
});

interface AuthedRequest extends Request {
  authUser?: StoredUser;
}

function getAuthToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookies = parseCookies(req.headers.cookie);
  return cookies.chytess_session;
}

function attachUser(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = getAuthToken(req);
  const decoded = verifySessionToken(token);
  if (decoded) {
    const store = readStore();
    const found = store.users.find((u) => u.id === decoded.sub);
    if (found) {
      req.authUser = found;
    }
  }
  next();
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.authUser) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.authUser) {
    res.status(401).json({ error: 'Admin authentication required' });
    return;
  }
  if (req.authUser.role !== 'admin') {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }
  next();
}

async function startServer() {
  // Ensure initial store exists on boot
  readStore();

  const app = express();
  app.use(express.json({ limit: '4mb' }));
  app.use(attachUser);
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'chytess-collection' });
  });

  // Public products listing & filtering
  app.get('/api/products', (req, res) => {
    const store = readStore();
    let list = [...store.products];

    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const gender = typeof req.query.gender === 'string' ? req.query.gender : '';
    const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
    const size = typeof req.query.size === 'string' ? req.query.size : '';
    const color = typeof req.query.color === 'string' ? req.query.color.toLowerCase() : '';
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
    const newArrival = req.query.newArrival === 'true';
    const featured = req.query.featured === 'true';
    const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (gender && gender !== 'All') {
      list = list.filter(
        (p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Unisex'
      );
    }
    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.collection.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }
    if (size) {
      list = list.filter((p) => p.sizes.includes(size));
    }
    if (color) {
      list = list.filter((p) => p.colors.some((c) => c.name.toLowerCase().includes(color)));
    }
    if (!Number.isNaN(minPrice) && minPrice > 0) {
      list = list.filter((p) => p.price >= minPrice);
    }
    if (!Number.isNaN(maxPrice) && maxPrice < Number.MAX_SAFE_INTEGER) {
      list = list.filter((p) => p.price <= maxPrice);
    }
    if (newArrival) {
      list = list.filter((p) => p.isNewArrival);
    }
    if (featured) {
      list = list.filter((p) => p.isFeatured);
    }

    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      list.sort((a, b) => b.popularity - a.popularity);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({ products: list });
  });

  app.get('/api/products/:id', (req, res) => {
    const store = readStore();
    const product = store.products.find(
      (p) => p.id === req.params.id || p.slug === req.params.id
    );
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const related = store.products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => {
        const aMatch = a.category === product.category ? 1 : 0;
        const bMatch = b.category === product.category ? 1 : 0;
        return bMatch - aMatch || b.popularity - a.popularity;
      })
      .slice(0, 4);
    res.json({ product, related });
  });

  app.get('/api/banners', (_req, res) => {
    const store = readStore();
    res.json({ banners: store.banners.filter((b) => b.active) });
  });

  app.post('/api/newsletter', (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    const store = readStore();
    const existing = store.subscribers.find((s) => s.email === email);
    if (existing) {
      res.json({ ok: true, alreadySubscribed: true, message: 'You are already subscribed to Chytess Collection updates.' });
      return;
    }
    const subscriber: NewsletterSubscriber = {
      id: `sub-${crypto.randomUUID().slice(0, 8)}`,
      email,
      createdAt: new Date().toISOString(),
    };
    store.subscribers.unshift(subscriber);
    writeStore(store);
    res.status(201).json({ ok: true, message: 'Welcome to Chytess Collection. You are now on the dispatch list.' });
  });

  // Auth routes
  app.post('/api/auth/register', (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!name || name.length < 2) {
      res.status(400).json({ error: 'Full name is required.' });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Valid email address is required.' });
      return;
    }
    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const store = readStore();
    if (store.users.some((u) => u.email === email)) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const newUser: StoredUser = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      name,
      email,
      role: 'customer',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
    };
    store.users.push(newUser);
    writeStore(store);

    const token = createSessionToken(newUser);
    res.cookie('chytess_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({ user: sanitizeUser(newUser), token });
  });

  app.post('/api/auth/login', (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const store = readStore();
    const user = store.users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    const token = createSessionToken(user);
    res.cookie('chytess_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ user: sanitizeUser(user), token });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie('chytess_session');
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req: AuthedRequest, res) => {
    if (!req.authUser) {
      res.json({ user: null });
      return;
    }
    res.json({ user: sanitizeUser(req.authUser) });
  });

  app.get('/api/my-orders', requireAuth, (req: AuthedRequest, res) => {
    const store = readStore();
    const user = req.authUser!;
    const orders = store.orders
      .filter((o) => o.userId === user.id || o.email.toLowerCase() === user.email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ orders });
  });

  // Payment provider configuration readiness
  app.get('/api/payments/config', (_req, res) => {
    const paystackKey = process.env.PAYSTACK_SECRET_KEY || '';
    const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY || '';
    res.json({
      paystackConfigured: Boolean(paystackKey && !paystackKey.includes('replace_with')),
      flutterwaveConfigured: Boolean(flutterwaveKey && !flutterwaveKey.includes('replace_with')),
    });
  });

  // Real Paystack & Flutterwave Checkout Architecture
  app.post('/api/checkout/initialize', async (req: AuthedRequest, res) => {
    const body = req.body || {};
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const address = typeof body.address === 'string' ? body.address.trim() : '';
    const city = typeof body.city === 'string' ? body.city.trim() : '';
    const country = typeof body.country === 'string' ? body.country.trim() : '';
    const paymentMethod: PaymentProvider =
      body.paymentMethod === 'flutterwave' ? 'flutterwave' : 'paystack';
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || !address || !city || !country) {
      res.status(400).json({ error: 'All shipping and contact fields are required.' });
      return;
    }
    if (rawItems.length === 0) {
      res.status(400).json({ error: 'Your shopping bag is empty.' });
      return;
    }

    const store = readStore();
    const verifiedItems: Order['items'] = [];
    let subtotal = 0;

    for (const raw of rawItems) {
      const prod = store.products.find((p) => p.id === raw.productId);
      const qty = Math.max(1, Math.floor(Number(raw.quantity) || 1));
      if (!prod) {
        res.status(400).json({ error: `Product ${raw.productId} is no longer available.` });
        return;
      }
      if (prod.stock < qty) {
        res.status(400).json({ error: `Insufficient stock for ${prod.name} (${prod.stock} remaining).` });
        return;
      }
      const matchedColor = prod.colors.find((c) => c.name === raw.color) || prod.colors[0];
      verifiedItems.push({
        productId: prod.id,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        quantity: qty,
        size: String(raw.size || prod.sizes[0] || 'One Size'),
        color: String(raw.color || matchedColor?.name || 'Default'),
        image: matchedColor?.image || prod.images[0] || '',
      });
      subtotal += prod.price * qty;
    }

    const deliveryFee = computeDeliveryFee(country, subtotal);
    const total = subtotal + deliveryFee;
    const now = new Date().toISOString();
    const orderNumber = `CHY-${Math.floor(1050 + Math.random() * 8900)}`;
    const paymentReference = `CHY-${paymentMethod.toUpperCase()}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const newOrder: Order = {
      id: `ord-${crypto.randomUUID().slice(0, 8)}`,
      orderNumber,
      userId: req.authUser?.id,
      customerName,
      email,
      phone,
      address,
      city,
      country,
      items: verifiedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentReference,
      paymentStatus: 'awaiting_gateway',
      status: 'Pending Payment',
      createdAt: now,
      updatedAt: now,
    };

    const originUrl =
      process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')
        ? process.env.APP_URL
        : `${req.protocol}://${req.get('host')}`;

    if (paymentMethod === 'paystack') {
      const secret = process.env.PAYSTACK_SECRET_KEY || '';
      if (!secret || secret.includes('replace_with')) {
        newOrder.paymentStatus = 'unpaid';
        store.orders.unshift(newOrder);
        writeStore(store);
        res.status(503).json({
          gatewayConfigured: false,
          order: newOrder,
          error:
            'Paystack live/test secret key (PAYSTACK_SECRET_KEY) is not configured on the server. Your order has been saved as Pending Payment, and payment was not charged.',
        });
        return;
      }

      try {
        const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            amount: Math.round(total * 100),
            reference: paymentReference,
            callback_url: `${originUrl}/?payment_verify=paystack&reference=${encodeURIComponent(paymentReference)}`,
            metadata: {
              orderId: newOrder.id,
              orderNumber,
              customerName,
            },
          }),
        });
        const data = (await paystackRes.json()) as {
          status?: boolean;
          message?: string;
          data?: { authorization_url?: string };
        };
        if (!paystackRes.ok || !data.status || !data.data?.authorization_url) {
          newOrder.paymentStatus = 'failed';
          store.orders.unshift(newOrder);
          writeStore(store);
          res.status(502).json({
            gatewayConfigured: true,
            order: newOrder,
            error: data.message || 'Paystack refused transaction initialization.',
          });
          return;
        }
        store.orders.unshift(newOrder);
        writeStore(store);
        res.json({
          gatewayConfigured: true,
          order: newOrder,
          authorizationUrl: data.data.authorization_url,
        });
        return;
      } catch (err) {
        newOrder.paymentStatus = 'failed';
        store.orders.unshift(newOrder);
        writeStore(store);
        res.status(502).json({
          gatewayConfigured: true,
          order: newOrder,
          error: err instanceof Error ? err.message : 'Unable to reach Paystack gateway.',
        });
        return;
      }
    } else {
      const secret = process.env.FLUTTERWAVE_SECRET_KEY || '';
      if (!secret || secret.includes('replace_with')) {
        newOrder.paymentStatus = 'unpaid';
        store.orders.unshift(newOrder);
        writeStore(store);
        res.status(503).json({
          gatewayConfigured: false,
          order: newOrder,
          error:
            'Flutterwave secret key (FLUTTERWAVE_SECRET_KEY) is not configured on the server. Your order has been saved as Pending Payment, and payment was not charged.',
        });
        return;
      }

      try {
        const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tx_ref: paymentReference,
            amount: total,
            currency: 'USD',
            redirect_url: `${originUrl}/?payment_verify=flutterwave&tx_ref=${encodeURIComponent(paymentReference)}`,
            customer: {
              email,
              phonenumber: phone,
              name: customerName,
            },
            customizations: {
              title: 'CHYTESS COLLECTION',
              description: `Order ${orderNumber}`,
            },
          }),
        });
        const data = (await flwRes.json()) as {
          status?: string;
          message?: string;
          data?: { link?: string };
        };
        if (!flwRes.ok || data.status !== 'success' || !data.data?.link) {
          newOrder.paymentStatus = 'failed';
          store.orders.unshift(newOrder);
          writeStore(store);
          res.status(502).json({
            gatewayConfigured: true,
            order: newOrder,
            error: data.message || 'Flutterwave refused transaction initialization.',
          });
          return;
        }
        store.orders.unshift(newOrder);
        writeStore(store);
        res.json({
          gatewayConfigured: true,
          order: newOrder,
          authorizationUrl: data.data.link,
        });
        return;
      } catch (err) {
        newOrder.paymentStatus = 'failed';
        store.orders.unshift(newOrder);
        writeStore(store);
        res.status(502).json({
          gatewayConfigured: true,
          order: newOrder,
          error: err instanceof Error ? err.message : 'Unable to reach Flutterwave gateway.',
        });
        return;
      }
    }
  });

  app.post('/api/checkout/verify', async (req, res) => {
    const provider = req.body?.provider === 'flutterwave' ? 'flutterwave' : 'paystack';
    const reference = typeof req.body?.reference === 'string' ? req.body.reference.trim() : '';
    const transactionId = typeof req.body?.transactionId === 'string' ? req.body.transactionId.trim() : '';

    if (!reference) {
      res.status(400).json({ error: 'Payment reference is required.' });
      return;
    }

    const store = readStore();
    const order = store.orders.find((o) => o.paymentReference === reference);
    if (!order) {
      res.status(404).json({ error: 'Matching order not found.' });
      return;
    }
    if (order.paymentStatus === 'verified') {
      res.json({ verified: true, order });
      return;
    }

    if (provider === 'paystack') {
      const secret = process.env.PAYSTACK_SECRET_KEY || '';
      if (!secret || secret.includes('replace_with')) {
        res.status(503).json({ verified: false, error: 'Paystack secret key is not configured.' });
        return;
      }
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${secret}` } }
      );
      const data = (await verifyRes.json()) as {
        status?: boolean;
        data?: { status?: string; amount?: number };
      };
      if (data.status && data.data?.status === 'success' && (data.data.amount || 0) >= Math.round(order.total * 100)) {
        order.paymentStatus = 'verified';
        order.status = 'Paid';
        order.updatedAt = new Date().toISOString();
        for (const item of order.items) {
          const prod = store.products.find((p) => p.id === item.productId);
          if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
        }
        writeStore(store);
        res.json({ verified: true, order });
        return;
      }
      res.status(402).json({ verified: false, error: 'Paystack verification did not confirm payment.' });
      return;
    } else {
      const secret = process.env.FLUTTERWAVE_SECRET_KEY || '';
      if (!secret || secret.includes('replace_with') || !transactionId) {
        res.status(503).json({ verified: false, error: 'Flutterwave credentials or transaction ID missing.' });
        return;
      }
      const verifyRes = await fetch(
        `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
        { headers: { Authorization: `Bearer ${secret}` } }
      );
      const data = (await verifyRes.json()) as {
        status?: string;
        data?: { status?: string; amount?: number; tx_ref?: string };
      };
      if (
        data.status === 'success' &&
        data.data?.status === 'successful' &&
        data.data?.tx_ref === reference &&
        (data.data?.amount || 0) >= order.total
      ) {
        order.paymentStatus = 'verified';
        order.status = 'Paid';
        order.updatedAt = new Date().toISOString();
        for (const item of order.items) {
          const prod = store.products.find((p) => p.id === item.productId);
          if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
        }
        writeStore(store);
        res.json({ verified: true, order });
        return;
      }
      res.status(402).json({ verified: false, error: 'Flutterwave verification did not confirm payment.' });
    }
  });

  // Admin: Original unmodified photo/file upload endpoint
  app.post('/api/upload', requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }
    res.status(201).json({
      url: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });

  // Admin: Products CRUD
  app.post('/api/admin/products', requireAdmin, (req, res) => {
    const b = req.body || {};
    const name = typeof b.name === 'string' ? b.name.trim() : '';
    const category = typeof b.category === 'string' ? b.category : 'T-shirts';
    const price = Number(b.price);
    if (!name || Number.isNaN(price) || price < 0) {
      res.status(400).json({ error: 'Valid product name and price are required.' });
      return;
    }
    const store = readStore();
    const id = `prod-${crypto.randomUUID().slice(0, 8)}`;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id.slice(-4)}`;
    const newProduct: Product = {
      id,
      slug,
      name,
      category: category as Product['category'],
      gender: b.gender === 'Men' || b.gender === 'Women' ? b.gender : 'Unisex',
      collection: typeof b.collection === 'string' && b.collection.trim() ? b.collection.trim() : 'Core Uniform',
      price,
      description: typeof b.description === 'string' ? b.description.trim() : '',
      details: Array.isArray(b.details) ? b.details.map(String) : [],
      images: Array.isArray(b.images) && b.images.length > 0 ? b.images.map(String) : [IMG.tee],
      colors:
        Array.isArray(b.colors) && b.colors.length > 0
          ? b.colors
          : [{ name: 'Obsidian', hex: '#141414', image: Array.isArray(b.images) ? b.images[0] : IMG.tee }],
      sizes: Array.isArray(b.sizes) && b.sizes.length > 0 ? b.sizes.map(String) : ['S', 'M', 'L'],
      stock: Math.max(0, Number(b.stock) || 0),
      isNewArrival: Boolean(b.isNewArrival),
      isFeatured: Boolean(b.isFeatured),
      popularity: Number(b.popularity) || 85,
      createdAt: new Date().toISOString(),
    };
    store.products.unshift(newProduct);
    writeStore(store);
    res.status(201).json({ product: newProduct });
  });

  app.patch('/api/admin/products/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idx = store.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    const existing = store.products[idx];
    const b = req.body || {};
    const updated: Product = {
      ...existing,
      name: typeof b.name === 'string' && b.name.trim() ? b.name.trim() : existing.name,
      category: typeof b.category === 'string' ? (b.category as Product['category']) : existing.category,
      gender: b.gender === 'Men' || b.gender === 'Women' || b.gender === 'Unisex' ? b.gender : existing.gender,
      collection: typeof b.collection === 'string' ? b.collection.trim() : existing.collection,
      price: typeof b.price === 'number' && !Number.isNaN(b.price) ? b.price : existing.price,
      description: typeof b.description === 'string' ? b.description : existing.description,
      details: Array.isArray(b.details) ? b.details.map(String) : existing.details,
      images: Array.isArray(b.images) && b.images.length > 0 ? b.images.map(String) : existing.images,
      colors: Array.isArray(b.colors) && b.colors.length > 0 ? b.colors : existing.colors,
      sizes: Array.isArray(b.sizes) && b.sizes.length > 0 ? b.sizes.map(String) : existing.sizes,
      stock: typeof b.stock === 'number' && !Number.isNaN(b.stock) ? Math.max(0, b.stock) : existing.stock,
      isNewArrival: typeof b.isNewArrival === 'boolean' ? b.isNewArrival : existing.isNewArrival,
      isFeatured: typeof b.isFeatured === 'boolean' ? b.isFeatured : existing.isFeatured,
    };
    store.products[idx] = updated;
    writeStore(store);
    res.json({ product: updated });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const next = store.products.filter((p) => p.id !== req.params.id);
    if (next.length === store.products.length) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    store.products = next;
    writeStore(store);
    res.json({ ok: true });
  });

  // Admin: Orders
  app.get('/api/admin/orders', requireAdmin, (_req, res) => {
    const store = readStore();
    const orders = [...store.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ orders });
  });

  app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const order = store.orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    const allowedStatuses: OrderStatus[] = [
      'Pending Payment',
      'Paid',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];
    if (typeof req.body?.status === 'string' && allowedStatuses.includes(req.body.status as OrderStatus)) {
      order.status = req.body.status as OrderStatus;
    }
    order.updatedAt = new Date().toISOString();
    writeStore(store);
    res.json({ order });
  });

  // Admin: Customers & Newsletter Subscribers
  app.get('/api/admin/customers', requireAdmin, (_req, res) => {
    const store = readStore();
    const customerMap = new Map<
      string,
      {
        email: string;
        name: string;
        phone?: string;
        city?: string;
        country?: string;
        ordersCount: number;
        totalSpent: number;
        registered: boolean;
        lastOrderAt?: string;
      }
    >();

    for (const u of store.users) {
      if (u.role === 'customer') {
        customerMap.set(u.email.toLowerCase(), {
          email: u.email,
          name: u.name,
          phone: u.phone,
          city: u.city,
          country: u.country,
          ordersCount: 0,
          totalSpent: 0,
          registered: true,
        });
      }
    }

    for (const o of store.orders) {
      const key = o.email.toLowerCase();
      const current = customerMap.get(key) || {
        email: o.email,
        name: o.customerName,
        phone: o.phone,
        city: o.city,
        country: o.country,
        ordersCount: 0,
        totalSpent: 0,
        registered: false,
      };
      current.ordersCount += 1;
      current.totalSpent += o.total;
      current.phone = current.phone || o.phone;
      current.city = current.city || o.city;
      current.country = current.country || o.country;
      if (!current.lastOrderAt || o.createdAt > current.lastOrderAt) {
        current.lastOrderAt = o.createdAt;
      }
      customerMap.set(key, current);
    }

    res.json({
      customers: Array.from(customerMap.values()),
      subscribers: store.subscribers,
    });
  });

  // Admin: Banners CRUD
  app.get('/api/admin/banners', requireAdmin, (_req, res) => {
    const store = readStore();
    res.json({ banners: store.banners });
  });

  app.post('/api/admin/banners', requireAdmin, (req, res) => {
    const b = req.body || {};
    const store = readStore();
    const banner: Banner = {
      id: `banner-${crypto.randomUUID().slice(0, 8)}`,
      placement:
        b.placement === 'announcement' ||
        b.placement === 'hero' ||
        b.placement === 'editorial' ||
        b.placement === 'scroll_video'
          ? b.placement
          : 'promo',
      eyebrow: typeof b.eyebrow === 'string' ? b.eyebrow.trim() : 'Seasonal Highlight',
      title: typeof b.title === 'string' ? b.title.trim() : 'Chytess Collection Capsule',
      subtitle: typeof b.subtitle === 'string' ? b.subtitle.trim() : '',
      ctaText: typeof b.ctaText === 'string' ? b.ctaText.trim() : 'Shop Now',
      ctaCategory: typeof b.ctaCategory === 'string' ? b.ctaCategory : 'All',
      image: typeof b.image === 'string' ? b.image : IMG.editorial,
      videoUrl: typeof b.videoUrl === 'string' ? b.videoUrl.trim() : '',
      active: b.active !== false,
    };
    store.banners.push(banner);
    writeStore(store);
    res.status(201).json({ banner });
  });

  app.patch('/api/admin/banners/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idx = store.banners.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Banner not found.' });
      return;
    }
    const existing = store.banners[idx];
    const b = req.body || {};
    store.banners[idx] = {
      ...existing,
      placement:
        b.placement === 'announcement' ||
        b.placement === 'hero' ||
        b.placement === 'editorial' ||
        b.placement === 'promo' ||
        b.placement === 'scroll_video'
          ? b.placement
          : existing.placement,
      eyebrow: typeof b.eyebrow === 'string' ? b.eyebrow : existing.eyebrow,
      title: typeof b.title === 'string' ? b.title : existing.title,
      subtitle: typeof b.subtitle === 'string' ? b.subtitle : existing.subtitle,
      ctaText: typeof b.ctaText === 'string' ? b.ctaText : existing.ctaText,
      ctaCategory: typeof b.ctaCategory === 'string' ? b.ctaCategory : existing.ctaCategory,
      image: typeof b.image === 'string' ? b.image : existing.image,
      videoUrl: typeof b.videoUrl === 'string' ? b.videoUrl : existing.videoUrl,
      active: typeof b.active === 'boolean' ? b.active : existing.active,
    };
    writeStore(store);
    res.json({ banner: store.banners[idx] });
  });

  app.delete('/api/admin/banners/:id', requireAdmin, (req, res) => {
    const store = readStore();
    store.banners = store.banners.filter((b) => b.id !== req.params.id);
    writeStore(store);
    res.json({ ok: true });
  });

  // Vite or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chytess Collection server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export const CATEGORIES = [
  'Jackets',
  'Suiting',
  'Dresses',
  'Intimates',
  'Hoodies',
  'Sweatshirts',
  'T-shirts',
  'Shirts',
  'Trousers',
  'Shorts',
  'Sneakers',
  'Footwear',
  'Caps',
  'Leather Goods',
  'Jewellery',
  'Fragrance',
  'Accessories',
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export type GenderTarget = 'Men' | 'Women' | 'Unisex';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryName;
  gender: GenderTarget;
  collection: string;
  price: number;
  description: string;
  details: string[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  popularity: number;
  createdAt: string;
}

export interface Banner {
  id: string;
  placement: 'announcement' | 'hero' | 'editorial' | 'promo' | 'scroll_video';
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaCategory?: string;
  image: string;
  videoUrl?: string;
  active: boolean;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentProvider = 'paystack' | 'flutterwave';

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentProvider;
  paymentReference: string;
  paymentStatus: 'unpaid' | 'awaiting_gateway' | 'verified' | 'failed';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  category: CategoryName;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface PaymentGatewayStatus {
  paystackConfigured: boolean;
  flutterwaveConfigured: boolean;
}

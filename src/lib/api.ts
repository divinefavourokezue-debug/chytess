import { HARDCODED_PRODUCTS } from '../data/products';
import type {
  Banner,
  NewsletterSubscriber,
  Order,
  OrderStatus,
  PaymentGatewayStatus,
  PaymentProvider,
  Product,
  User,
} from '../types';

const TOKEN_KEY = 'chytess_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`) as Error & {
      status?: number;
      payload?: unknown;
    };
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data as T;
}

export async function fetchProducts(): Promise<Product[]> {
  return HARDCODED_PRODUCTS;
}

export async function fetchProductById(id: string): Promise<{ product: Product; related: Product[] }> {
  return apiFetch<{ product: Product; related: Product[] }>(`/api/products/${encodeURIComponent(id)}`);
}

export async function fetchBanners(): Promise<Banner[]> {
  const data = await apiFetch<{ banners: Banner[] }>('/api/banners');
  return data.banners;
}

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean; message: string }> {
  return apiFetch<{ ok: boolean; message: string }>('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const data = await apiFetch<{ user: User | null }>('/api/auth/me');
  return data.user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const data = await apiFetch<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(data.token);
  return data.user;
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const data = await apiFetch<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setStoredToken(data.token);
  return data.user;
}

export async function logoutUser(): Promise<void> {
  setStoredToken(null);
  await apiFetch('/api/auth/logout', { method: 'POST' });
}

export async function fetchMyOrders(): Promise<Order[]> {
  const data = await apiFetch<{ orders: Order[] }>('/api/my-orders');
  return data.orders;
}

export async function fetchPaymentConfig(): Promise<PaymentGatewayStatus> {
  return apiFetch<PaymentGatewayStatus>('/api/payments/config');
}

export interface CheckoutPayload {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: PaymentProvider;
  items: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }[];
}

export async function initializeCheckout(payload: CheckoutPayload): Promise<{
  gatewayConfigured: boolean;
  order: Order;
  authorizationUrl?: string;
}> {
  return apiFetch('/api/checkout/initialize', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyCheckoutPayment(payload: {
  provider: PaymentProvider;
  reference: string;
  transactionId?: string;
}): Promise<{ verified: boolean; order: Order }> {
  return apiFetch('/api/checkout/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Uploads the exact original File untouched via FormData
export async function uploadOriginalFile(file: File): Promise<{
  url: string;
  originalName: string;
  size: number;
  mimetype: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
}

// Admin APIs
export async function adminCreateProduct(product: Partial<Product>): Promise<Product> {
  const data = await apiFetch<{ product: Product }>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  return data.product;
}

export async function adminUpdateProduct(id: string, patch: Partial<Product>): Promise<Product> {
  const data = await apiFetch<{ product: Product }>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return data.product;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  await apiFetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function adminFetchOrders(): Promise<Order[]> {
  const data = await apiFetch<{ orders: Order[] }>('/api/admin/orders');
  return data.orders;
}

export async function adminUpdateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const data = await apiFetch<{ order: Order }>(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data.order;
}

export interface AdminCustomerRecord {
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

export async function adminFetchCustomers(): Promise<{
  customers: AdminCustomerRecord[];
  subscribers: NewsletterSubscriber[];
}> {
  return apiFetch('/api/admin/customers');
}

export async function adminFetchBanners(): Promise<Banner[]> {
  const data = await apiFetch<{ banners: Banner[] }>('/api/admin/banners');
  return data.banners;
}

export async function adminCreateBanner(banner: Partial<Banner>): Promise<Banner> {
  const data = await apiFetch<{ banner: Banner }>('/api/admin/banners', {
    method: 'POST',
    body: JSON.stringify(banner),
  });
  return data.banner;
}

export async function adminUpdateBanner(id: string, patch: Partial<Banner>): Promise<Banner> {
  const data = await apiFetch<{ banner: Banner }>(`/api/admin/banners/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return data.banner;
}

export async function adminDeleteBanner(id: string): Promise<void> {
  await apiFetch(`/api/admin/banners/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

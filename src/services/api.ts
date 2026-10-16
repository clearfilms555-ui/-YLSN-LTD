import {
  Category,
  CompanySettings,
  Order,
  Product,
  QuotationRequest,
  ServiceRequest,
} from '../types';
import {
  initialCategories,
  initialCompanySettings,
  initialOrders,
  initialProducts,
  initialQuotations,
  initialServiceRequests,
} from '../data/mockData';

const BASE_URL = '/api';

// Local storage backup keys for offline resilience
const KEYS = {
  SETTINGS: 'ylsn_settings',
  PRODUCTS: 'ylsn_products',
  CATEGORIES: 'ylsn_categories',
  ORDERS: 'ylsn_orders',
  SERVICES: 'ylsn_services',
  QUOTES: 'ylsn_quotes',
  ADMIN_AUTH: 'ylsn_admin_auth',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage quota or error:', e);
  }
}

export const api = {
  // Settings
  async getSettings(): Promise<CompanySettings> {
    try {
      const res = await fetch(`${BASE_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        setLocal(KEYS.SETTINGS, data);
        return data;
      }
    } catch (e) {
      console.warn('API error fetching settings, using cache/fallback', e);
    }
    return getLocal(KEYS.SETTINGS, initialCompanySettings);
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        setLocal(KEYS.SETTINGS, data.settings);
        return data.settings;
      }
    } catch (e) {
      console.warn('API error updating settings, using local store', e);
    }
    const current = getLocal(KEYS.SETTINGS, initialCompanySettings);
    const updated = { ...current, ...settings };
    setLocal(KEYS.SETTINGS, updated);
    return updated;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setLocal(KEYS.CATEGORIES, data);
        return data;
      }
    } catch (e) {
      console.warn('API error fetching categories', e);
    }
    return getLocal(KEYS.CATEGORIES, initialCategories);
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Category API error', e);
    }
    const list = getLocal(KEYS.CATEGORIES, initialCategories);
    const created: Category = {
      id: cat.id || 'cat-' + Date.now(),
      name: cat.name || 'New Category',
      slug: (cat.name || 'new').toLowerCase().replace(/\s+/g, '-'),
      description: cat.description || '',
      iconName: cat.iconName || 'Speaker',
    };
    list.push(created);
    setLocal(KEYS.CATEGORIES, list);
    return created;
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Category delete error', e);
    }
    const list = getLocal(KEYS.CATEGORIES, initialCategories).filter((c) => c.id !== id);
    setLocal(KEYS.CATEGORIES, list);
    return true;
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');

      const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (!params?.category && !params?.search) {
          setLocal(KEYS.PRODUCTS, data);
        }
        return data;
      }
    } catch (e) {
      console.warn('API error fetching products, using local store', e);
    }

    let list = getLocal<Product[]>(KEYS.PRODUCTS, initialProducts);
    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (params?.featured) {
      list = list.filter((p) => p.featured);
    }
    return list;
  },

  async createProduct(prod: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error creating product', e);
    }

    const list = getLocal<Product[]>(KEYS.PRODUCTS, initialProducts);
    const newProd: Product = {
      id: prod.id || 'ylsn-' + Date.now().toString(36),
      name: prod.name || 'Sound Equipment',
      category: prod.category || 'speakers',
      brand: prod.brand || 'YLSN Pro',
      priceRwf: Number(prod.priceRwf) || 0,
      priceUsd: Number(prod.priceUsd) || Math.round((Number(prod.priceRwf) || 0) / 1350),
      stock: Number(prod.stock) || 0,
      availability: prod.availability || 'in_stock',
      isRentalAvailable: Boolean(prod.isRentalAvailable),
      rentalPricePerDay: prod.rentalPricePerDay ? Number(prod.rentalPricePerDay) : undefined,
      featured: Boolean(prod.featured),
      rating: 5.0,
      imageUrl: prod.imageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      specifications: prod.specifications || {},
      tags: prod.tags || [],
    };
    list.unshift(newProd);
    setLocal(KEYS.PRODUCTS, list);
    return newProd;
  },

  async updateProduct(id: string, prod: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error updating product', e);
    }
    const list = getLocal<Product[]>(KEYS.PRODUCTS, initialProducts);
    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...prod };
      setLocal(KEYS.PRODUCTS, list);
      return list[idx];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API error deleting product', e);
    }
    const list = getLocal<Product[]>(KEYS.PRODUCTS, initialProducts).filter((p) => p.id !== id);
    setLocal(KEYS.PRODUCTS, list);
    return true;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        setLocal(KEYS.ORDERS, data);
        return data;
      }
    } catch (e) {
      console.warn('API error fetching orders', e);
    }
    return getLocal<Order[]>(KEYS.ORDERS, initialOrders);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error creating order', e);
    }

    const list = getLocal<Order[]>(KEYS.ORDERS, initialOrders);
    const orderNumber = 'YLSN-ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerName: orderData.customerName || 'Customer',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail,
      deliveryType: orderData.deliveryType || 'pickup',
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod || 'pay_on_delivery',
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      items: orderData.items || [],
      subtotalRwf: orderData.subtotalRwf || 0,
      deliveryFeeRwf: orderData.deliveryFeeRwf || 0,
      totalRwf: orderData.totalRwf || 0,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newOrder);
    setLocal(KEYS.ORDERS, list);
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error updating order', e);
    }
    const list = getLocal<Order[]>(KEYS.ORDERS, initialOrders);
    const idx = list.findIndex((o) => o.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      setLocal(KEYS.ORDERS, list);
      return list[idx];
    }
    throw new Error('Order not found');
  },

  // Services
  async getServices(): Promise<ServiceRequest[]> {
    try {
      const res = await fetch(`${BASE_URL}/services`);
      if (res.ok) {
        const data = await res.json();
        setLocal(KEYS.SERVICES, data);
        return data;
      }
    } catch (e) {
      console.warn('API error fetching services', e);
    }
    return getLocal<ServiceRequest[]>(KEYS.SERVICES, initialServiceRequests);
  },

  async createService(srv: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srv),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error creating service', e);
    }

    const list = getLocal<ServiceRequest[]>(KEYS.SERVICES, initialServiceRequests);
    const newReq: ServiceRequest = {
      id: 'srv-' + Date.now(),
      requestNumber: 'YLSN-SRV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
      serviceType: srv.serviceType || 'installation',
      clientName: srv.clientName || '',
      clientPhone: srv.clientPhone || '',
      clientEmail: srv.clientEmail,
      eventDate: srv.eventDate,
      eventLocation: srv.eventLocation,
      expectedAudience: srv.expectedAudience,
      details: srv.details || '',
      budgetRange: srv.budgetRange,
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newReq);
    setLocal(KEYS.SERVICES, list);
    return newReq;
  },

  async updateService(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error updating service', e);
    }
    const list = getLocal<ServiceRequest[]>(KEYS.SERVICES, initialServiceRequests);
    const idx = list.findIndex((s) => s.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      setLocal(KEYS.SERVICES, list);
      return list[idx];
    }
    throw new Error('Service request not found');
  },

  // Quotations
  async getQuotations(): Promise<QuotationRequest[]> {
    try {
      const res = await fetch(`${BASE_URL}/quotations`);
      if (res.ok) {
        const data = await res.json();
        setLocal(KEYS.QUOTES, data);
        return data;
      }
    } catch (e) {
      console.warn('API error fetching quotations', e);
    }
    return getLocal<QuotationRequest[]>(KEYS.QUOTES, initialQuotations);
  },

  async createQuotation(quo: Partial<QuotationRequest>): Promise<QuotationRequest> {
    try {
      const res = await fetch(`${BASE_URL}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quo),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error creating quotation', e);
    }

    const list = getLocal<QuotationRequest[]>(KEYS.QUOTES, initialQuotations);
    const newQuote: QuotationRequest = {
      id: 'quo-' + Date.now(),
      quoteNumber: 'YLSN-QT-' + Math.floor(1000 + Math.random() * 9000),
      clientName: quo.clientName || 'Valued Client',
      clientPhone: quo.clientPhone || '',
      clientEmail: quo.clientEmail,
      eventType: quo.eventType || 'Event',
      venueType: quo.venueType || 'Indoor',
      guestCount: quo.guestCount || '200-500',
      eventDate: quo.eventDate,
      requiredEquipment: quo.requiredEquipment || [],
      needSoundEngineer: Boolean(quo.needSoundEngineer),
      estimatedBudgetRwf: quo.estimatedBudgetRwf,
      additionalNotes: quo.additionalNotes,
      status: 'pending_review',
      estimatedTotalRwf: quo.estimatedTotalRwf || 750000,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newQuote);
    setLocal(KEYS.QUOTES, list);
    return newQuote;
  },

  async updateQuotation(id: string, updates: Partial<QuotationRequest>): Promise<QuotationRequest> {
    try {
      const res = await fetch(`${BASE_URL}/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error updating quotation', e);
    }
    const list = getLocal<QuotationRequest[]>(KEYS.QUOTES, initialQuotations);
    const idx = list.findIndex((q) => q.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      setLocal(KEYS.QUOTES, list);
      return list[idx];
    }
    throw new Error('Quotation not found');
  },

  // Admin Login
  async adminLogin(username: string, pass: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLocal(KEYS.ADMIN_AUTH, { loggedIn: true, user: data.user, at: Date.now() });
        return data;
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch {
      if (
        (username === 'admin' || username === 'admin@ylsn.rw' || username === 'ylsn') &&
        (pass === '00000' || pass === 'ylsn2026' || pass === 'admin')
      ) {
        const user = { name: 'YLSN Chief Sound Director', role: 'Super Admin', email: 'director@ylsn.rw' };
        setLocal(KEYS.ADMIN_AUTH, { loggedIn: true, user, at: Date.now() });
        return { success: true, user };
      }
      return { success: false, error: 'Invalid administrator credentials. Please verify your username and password.' };
    }
  },

  getAdminSession(): { loggedIn: boolean; user?: any } | null {
    return getLocal(KEYS.ADMIN_AUTH, null);
  },

  adminLogout(): void {
    try {
      localStorage.removeItem(KEYS.ADMIN_AUTH);
    } catch {}
  },
};

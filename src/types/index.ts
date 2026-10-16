export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  priceRwf: number;
  priceUsd: number;
  stock: number;
  availability: 'in_stock' | 'low_stock' | 'pre_order' | 'out_of_stock';
  isRentalAvailable: boolean;
  rentalPricePerDay?: number;
  featured: boolean;
  rating: number;
  imageUrl: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  itemCount?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  priceRwf: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  paymentMethod: 'pay_on_delivery' | 'momo_rwanda' | 'bank_transfer';
  paymentStatus: 'pending' | 'verified' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotalRwf: number;
  deliveryFeeRwf: number;
  totalRwf: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  serviceType: 'installation' | 'event_rental' | 'live_sound_support' | 'dj_pa_systems' | 'maintenance_repair' | 'technical_consultation';
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventDate?: string;
  eventLocation?: string;
  expectedAudience?: string;
  details: string;
  budgetRange?: string;
  status: 'new' | 'contacted' | 'quoted' | 'scheduled' | 'completed' | 'cancelled';
  adminNotes?: string;
  createdAt: string;
}

export interface QuotationRequest {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventType: string;
  venueType: string;
  guestCount: string;
  eventDate?: string;
  requiredEquipment: string[];
  needSoundEngineer: boolean;
  estimatedBudgetRwf?: number;
  additionalNotes?: string;
  status: 'pending_review' | 'quote_sent' | 'approved' | 'declined';
  estimatedTotalRwf?: number;
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  physicalAddress: string;
  city: string;
  country: string;
  slogan: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  workingHours: string;
  logoUrl: string;
  emergencyHotline: string;
}

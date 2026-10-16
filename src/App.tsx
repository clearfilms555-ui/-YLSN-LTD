import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ShopSection } from './components/ShopSection';
import { QuotationBuilder } from './components/QuotationBuilder';
import { AudioVisualizerSection } from './components/AudioVisualizerSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AICustomerAssistant } from './components/AICustomerAssistant';
import { Category, CompanySettings, OrderItem, Product } from './types';
import { Language } from './i18n/translations';
import { api } from './services/api';
import {
  initialCategories,
  initialCompanySettings,
  initialProducts,
} from './data/mockData';
import { Phone, MessageSquare } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<CompanySettings>(initialCompanySettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Language state (5 languages: English, French, Chinese, Kinyarwanda, Kiswahili)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ylsn_language');
      if (saved === 'en' || saved === 'fr' || saved === 'zh' || saved === 'rw' || saved === 'sw') {
        return saved;
      }
    } catch {}
    return 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('ylsn_language', lang);
    } catch {}
  };

  // Cart State
  const [cartItems, setCartItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('ylsn_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Panels State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [activeServiceType, setActiveServiceType] = useState('installation');

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ylsn_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [s, p, c] = await Promise.all([
        api.getSettings(),
        api.getProducts(),
        api.getCategories(),
      ]);
      setSettings(s);
      setProducts(p);
      setCategories(c);
    } catch (e) {
      console.warn('Failed to load initial data, fallback initialized', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          priceRwf: product.priceRwf,
          quantity,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenServiceModal = (type = 'installation') => {
    setActiveServiceType(type);
    setServiceModalOpen(true);
  };

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navigation Header with 5-Language Selector */}
      <Navbar
        settings={settings}
        cartCount={totalCartCount}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenServiceModal={handleOpenServiceModal}
        onOpenQuoteModal={() => handleScrollTo('quote-builder')}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          settings={settings}
          currentLanguage={currentLanguage}
          onExploreEquipment={() => handleScrollTo('shop')}
          onRequestService={() => handleOpenServiceModal('installation')}
          onContactUs={() => handleScrollTo('contact')}
          onRequestQuote={() => handleScrollTo('quote-builder')}
        />

        {/* Services Section */}
        <ServicesSection
          phone={settings.phone}
          whatsappNumber={settings.whatsappNumber}
          onSelectService={(srv) => handleOpenServiceModal(srv)}
        />

        {/* Product Catalog & Online Store */}
        <ShopSection
          products={products}
          categories={categories}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
          whatsappNumber={settings.whatsappNumber}
        />

        {/* Interactive Event Quotation Builder */}
        <QuotationBuilder
          whatsappNumber={settings.whatsappNumber}
          phone={settings.phone}
        />

        {/* Audio Precision & Frequency Simulation */}
        <AudioVisualizerSection />

        {/* Why Choose YLSN / About */}
        <AboutSection
          settings={settings}
          onRequestQuote={() => handleScrollTo('quote-builder')}
          onRequestService={() => handleOpenServiceModal('installation')}
        />

        {/* Contact Section & Customer Inquiries */}
        <ContactSection
          settings={settings}
          onRequestService={handleOpenServiceModal}
          onRequestQuote={() => handleScrollTo('quote-builder')}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onRequestService={handleOpenServiceModal}
        onRequestQuote={() => handleScrollTo('quote-builder')}
      />

      {/* Floating Quick Action Buttons (Call & WhatsApp) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
            'Hello YLSN LTD! I am contacting you regarding your sound systems services and equipment.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-white/20"
          title="Chat on WhatsApp (+250 783 008 214)"
        >
          <MessageSquare className="w-5 h-5" />
        </a>

        <a
          href={`tel:${settings.phone.replace(/\s+/g, '')}`}
          className="p-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-white/20"
          title={`Call Official Hotline: ${settings.phone}`}
        >
          <Phone className="w-5 h-5 text-slate-950" />
        </a>
      </div>

      {/* YLSN AI Customer Assistant (5 Languages) */}
      <AICustomerAssistant
        currentLanguage={currentLanguage}
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
        onOpenServiceModal={handleOpenServiceModal}
        onOpenQuoteModal={() => handleScrollTo('quote-builder')}
      />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        whatsappNumber={settings.whatsappNumber}
        phone={settings.phone}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        whatsappNumber={settings.whatsappNumber}
        phone={settings.phone}
      />

      <ServiceRequestModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        initialServiceType={activeServiceType}
        whatsappNumber={settings.whatsappNumber}
        phone={settings.phone}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onSettingsUpdate={(updated) => setSettings(updated)}
        products={products}
        categories={categories}
        onRefreshData={loadData}
      />
    </div>
  );
}

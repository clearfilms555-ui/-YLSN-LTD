import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Eye,
  MessageSquare,
  Sparkles,
  Check,
  Tag,
  ArrowUpDown,
  Filter,
  Phone,
} from 'lucide-react';
import { Category, Product } from '../types';

interface ShopSectionProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  whatsappNumber: string;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  categories,
  onAddToCart,
  onSelectProduct,
  whatsappNumber,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'name'>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyRentals, setOnlyRentals] = useState<boolean>(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p, 1);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const formatRwf = (val: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (onlyInStock && p.stock <= 0) return false;
        if (onlyRentals && !p.isRentalAvailable) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchDesc && !matchTag) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'brand') return a.brand.localeCompare(b.brand);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'stock') return b.stock - a.stock;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, onlyInStock, onlyRentals]);

  return (
    <section id="shop" className="py-20 bg-[#07090E] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Professional Sound Equipment
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Sound Gear & <span className="gold-gradient-text">Accessories Store</span>
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Genuine concert speakers, digital consoles, heavy-duty amplifiers, wireless microphone systems, and stage cables. In-stock in Kigali with warranty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredProducts.length}</strong> products
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#0E131F] rounded-2xl border border-slate-800 p-4 sm:p-5 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search speakers, mixers, amps, cables, Shure, JBL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 relative flex items-center">
              <ArrowUpDown className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="featured">Featured & Best Matches</option>
                <option value="brand">Brand (A - Z)</option>
                <option value="name">Product Name (A - Z)</option>
                <option value="stock">In-Stock First</option>
              </select>
            </div>

            {/* Quick Checkbox Toggles */}
            <div className="md:col-span-3 flex items-center justify-between sm:justify-start gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyRentals}
                  onChange={(e) => setOnlyRentals(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
                />
                <span>Rental Gear</span>
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 pt-4 border-t border-slate-800 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Equipment ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#0E131F] rounded-2xl border border-slate-800 p-8">
            <p className="text-lg font-bold text-white mb-2">No audio equipment matches your criteria</p>
            <p className="text-sm text-slate-400 mb-6">
              Try adjusting your category filter, clearing your search, or contacting our team directly for custom gear procurement.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyInStock(false);
                setOnlyRentals(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group relative rounded-2xl bg-[#0E131F] border border-slate-800 hover:border-amber-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-black/60 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-transparent opacity-80"></div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-amber-400 border border-amber-500/30">
                        {product.brand}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {product.stock > 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                          In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-400 border border-slate-700">
                          Pre-Order
                        </span>
                      )}
                    </div>

                    {product.isRentalAvailable && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-400/40">
                          Rental Ready
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.shortDescription || product.description}
                      </p>
                    </div>

                    {/* Pricing & Inquiry Action Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-3 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-semibold">Pricing on Request</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                          Direct Admin Quote
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={product.stock === 0}
                          className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : product.stock === 0
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" /> Inquire List
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product);
                          }}
                          className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Details</span>
                        </button>
                      </div>

                      {/* WhatsApp Fast Inquiry */}
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          `Hello YLSN LTD Admin, I am inquiring about the ${product.name} (${product.brand}). Please provide price quotation and availability details.`
                        )}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full py-2 px-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inquire on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

import React from 'react';
import {
  X,
  ShoppingCart,
  Phone,
  MessageSquare,
  ShieldCheck,
  Check,
  Zap,
  Tag,
  Star,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  whatsappNumber: string;
  phone: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  whatsappNumber,
  phone,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatRwf = (val: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0E131F] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Column */}
          <div className="relative bg-[#07090E] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80';
                }}
              />
              {product.isRentalAvailable && (
                <div className="absolute top-3 left-3 bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Rental Available
                </div>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>100% Genuine Pro Audio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Tested in Kigali Lab</span>
              </div>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-500/30">
                  {product.brand}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                    product.availability === 'in_stock'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : product.availability === 'low_stock'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      : 'bg-red-950/60 text-red-400 border border-red-500/30'
                  }`}
                >
                  {product.availability === 'in_stock'
                    ? `In Stock (${product.stock} units)`
                    : product.availability === 'low_stock'
                    ? `Low Stock (${product.stock} left)`
                    : 'Pre-Order Only'}
                </span>
              </div>

              <h2 className="text-2xl font-heading font-extrabold text-white leading-snug">
                {product.name}
              </h2>

              {/* Official Quotation Notice */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                    Pricing & Equipment Quotation
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Contact Admin directly for current prices, rental rates, and package discounts.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                    Contact Admin
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="mt-4">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Product Overview
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Technical Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-900/60 border border-slate-800/80"
                      >
                        <span className="text-slate-400 font-medium">{key}</span>
                        <span className="text-slate-200 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions & Checkout controls */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 20, q + 1))}
                    className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : product.stock === 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Inquiry List!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Inquiry List
                    </>
                  )}
                </button>
              </div>

              {/* Direct Inquire via WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello YLSN LTD Admin, I am interested in: ${product.name} (${product.brand}). Please provide price quotation and availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Admin on WhatsApp ({phone})</span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Admin Hotline Directly ({phone})</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

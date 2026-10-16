import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Phone,
  Truck,
  Store,
  Send,
} from 'lucide-react';
import { Order, OrderItem } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  whatsappNumber: string;
  phone: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
  phone,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Build WhatsApp text from selected equipment
  const buildWhatsAppText = () => {
    let msg = `Hello YLSN LTD Admin, I would like to request a quotation for the following sound equipment:\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} — Qty: ${item.quantity}\n`;
    });
    if (customerName) msg += `\nClient Name: ${customerName}`;
    if (customerPhone) msg += `\nPhone: ${customerPhone}`;
    if (deliveryType === 'delivery' && deliveryAddress) msg += `\nDelivery Address: ${deliveryAddress}`;
    if (notes) msg += `\nNotes: ${notes}`;
    msg += `\nPlease advise on pricing and equipment availability. Thank you!`;
    return encodeURIComponent(msg);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await api.createOrder({
        customerName,
        customerPhone,
        customerEmail,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'YLSN LTD Official Store Pickup',
        paymentMethod: 'pay_on_delivery',
        items,
        subtotalRwf: 0,
        deliveryFeeRwf: 0,
        totalRwf: 0,
        notes,
      });

      setCreatedOrder(order);
      onClearCart();
      setIsCheckingOut(false);
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Failed to submit equipment order. Please try again or call our hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E131F] border-l border-amber-500/30 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#07090E]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                {createdOrder ? 'Inquiry Submitted' : isCheckingOut ? 'Submit Equipment Request' : 'Equipment Inquiry List'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* 1. ORDER SUCCESS STATE */}
            {createdOrder ? (
              <div className="space-y-5 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Inquiry Received by Admin
                  </span>
                  <h3 className="text-xl font-heading font-black text-white mt-1">
                    #{createdOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2">
                    Thank you, <strong className="text-white">{createdOrder.customerName}</strong>. Your equipment order has been registered in the YLSN LTD dispatch console.
                  </p>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pricing Status:</span>
                    <span className="font-bold text-amber-400">Custom Admin Quotation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fulfillment Mode:</span>
                    <span className="text-slate-200 capitalize">{createdOrder.deliveryType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Official Contact:</span>
                    <span className="text-cyan-400 font-semibold">{phone}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-left text-xs space-y-1">
                  <p className="font-bold text-emerald-400">Fast WhatsApp Confirmation:</p>
                  <p className="text-slate-300">
                    You can immediately send this reference to the admin on WhatsApp to expedite quotation and delivery.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hello YLSN LTD Admin, I submitted equipment inquiry #${createdOrder.orderNumber} for client: ${createdOrder.customerName} (${createdOrder.customerPhone}). Please provide quotation.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Admin Directly</span>
                  </a>

                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Call Admin Hotline ({phone})</span>
                  </a>

                  <button
                    onClick={() => {
                      setCreatedOrder(null);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Close & Continue Browsing
                  </button>
                </div>
              </div>
            ) : isCheckingOut ? (
              
              /* 2. SUBMISSION FORM */
              <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Selected Gear:</span>
                    <span className="font-bold text-white text-sm">{items.length} Products ({totalItemCount} Units)</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
                    Quote by Admin
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Mugisha"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number (Rwanda / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+250 78X XXX XXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="client@domain.rw"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Delivery Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fulfillment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Store Pickup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>On-Site Delivery</span>
                    </button>
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Venue / Delivery Address in Rwanda *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Street address, district, venue or landmark in Kigali..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Additional Technical Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Need audio cables, sound technician, event date..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </form>
            ) : items.length === 0 ? (
              
              /* 3. EMPTY INQUIRY LIST */
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <p className="text-base font-bold text-white">Your inquiry list is empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse our speakers, subwoofers, mixers, microphones, and cables to add professional equipment to your inquiry list.
                </p>
              </div>
            ) : (
              
              /* 4. ITEMS LIST */
              <div className="space-y-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                  <span>Prices quoted directly by Admin</span>
                  <span className="font-bold text-white">{items.length} Items</span>
                </div>

                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-black border border-slate-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] font-semibold text-amber-400 mt-0.5">
                        Pricing: Contact Admin
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.productId)}
                          className="p-1 text-red-400 hover:text-red-300 ml-auto"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {!createdOrder && items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#07090E] space-y-3">
              {isCheckingOut ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={submitting}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Send Request to Admin'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppText()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Equipment List on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                  >
                    <span>Submit Inquiry Form to Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

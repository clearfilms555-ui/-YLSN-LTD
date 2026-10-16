import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  CheckCircle2,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  Phone,
  MessageSquare,
  Layers,
  Volume2,
} from 'lucide-react';
import { api } from '../services/api';
import { QuotationRequest } from '../types';

interface QuotationBuilderProps {
  whatsappNumber: string;
  phone: string;
}

export const QuotationBuilder: React.FC<QuotationBuilderProps> = ({
  whatsappNumber,
  phone,
}) => {
  const [eventType, setEventType] = useState('Concert & Live Music');
  const [guestCount, setGuestCount] = useState('200 - 500 Guests');
  const [venueType, setVenueType] = useState('Indoor Auditorium / Hall');
  const [needEngineer, setNeedEngineer] = useState(true);
  const [selectedEquip, setSelectedEquip] = useState<string[]>([
    'Line Array PA Tops',
    'High-SPL Concert Subwoofers',
    'Digital Mixing Console',
    'Wireless Vocal Microphones',
  ]);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuotationRequest | null>(null);

  const equipOptions = [
    { id: 'Line Array PA Tops', label: 'Line Array PA Loudspeakers' },
    { id: 'High-SPL Concert Subwoofers', label: 'Dual 18" High-Power Subwoofers' },
    { id: 'Digital Mixing Console', label: 'Digital Mixing Desk (X32 / SQ-6)' },
    { id: 'Wireless Vocal Microphones', label: 'Shure / Sennheiser UHF Wireless Mics' },
    { id: 'Stage Monitors / IEMs', label: 'Stage Wedge Monitors & In-Ear Systems' },
    { id: 'Pioneer DJ Pro Console', label: 'Pioneer DJ XDJ/CDJ Standalone Console' },
    { id: 'Multicore Snake & Rigging', label: 'Digital Snake & Aluminum Rigging Stands' },
  ];

  const toggleEquip = (item: string) => {
    setSelectedEquip((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    try {
      const quote = await api.createQuotation({
        clientName,
        clientPhone,
        clientEmail,
        eventType,
        venueType,
        guestCount,
        eventDate,
        requiredEquipment: selectedEquip,
        needSoundEngineer: needEngineer,
        estimatedTotalRwf: 0,
        additionalNotes: notes,
      });
      setSubmittedQuote(quote);
    } catch (err) {
      console.error('Failed to submit quote:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quote-builder" className="py-20 bg-[#0E131F] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" /> Instant Sound Package Estimator
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Build Your Event <span className="gold-gradient-text">Sound Quotation</span>
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base">
            Select your event parameters to receive an instant estimate, or submit your specifications directly to our senior audio engineers.
          </p>
        </div>

        {submittedQuote ? (
          <div className="max-w-2xl mx-auto bg-[#07090E] border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Quotation Request Received!
            </span>
            <h3 className="text-2xl font-heading font-bold text-white mt-1 mb-2">
              Reference #{submittedQuote.quoteNumber}
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
              Thank you, <strong className="text-white">{submittedQuote.clientName}</strong>. Our chief sound engineer has received your request for <em>{submittedQuote.eventType}</em> and is preparing your tailored official proposal.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left mb-6 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Quotation Status:</span>
                <span className="font-bold text-amber-400 text-sm">
                  Custom Official Quote by Admin
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Event Date:</span>
                <span className="font-medium text-slate-200">{submittedQuote.eventDate || 'Flexible / TBD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Client Phone:</span>
                <span className="font-medium text-slate-200">{submittedQuote.clientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sound Engineer on Site:</span>
                <span className="font-medium text-emerald-400">
                  {submittedQuote.needSoundEngineer ? 'Yes (Certified FOH)' : 'Self-managed'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello YLSN LTD! I just submitted quotation request ${submittedQuote.quoteNumber} for ${submittedQuote.eventType} (${submittedQuote.guestCount}). My name is ${submittedQuote.clientName}. Please send me the official contract/quote.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp ({phone})</span>
              </a>

              <button
                onClick={() => setSubmittedQuote(null)}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                Calculate Another Quote
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Steps Panel */}
            <div className="lg:col-span-7 bg-[#07090E] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              
              {/* Step 1: Event Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                  1. Select Event Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Concert & Live Music',
                    'Corporate Conference',
                    'Wedding & Reception',
                    'Church & Worship',
                    'Club / DJ Night',
                    'Sports & Outdoor Rally',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                        eventType === type
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Crowd Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                  2. Expected Crowd / Audience Size
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    '50 - 200 Guests',
                    '200 - 500 Guests',
                    '500 - 1,500 Guests',
                    '1,500 - 5,000 Guests',
                    '5,000+ Stadium',
                  ].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                        guestCount === count
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Venue Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                  3. Venue Environment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Indoor Auditorium / Hall',
                    'Outdoor Open Field',
                    'Marquee / Glass Tent',
                    'Hotel Ballroom / Conference',
                  ].map((venue) => (
                    <button
                      key={venue}
                      type="button"
                      onClick={() => setVenueType(venue)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                        venueType === venue
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {venue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Equipment Requirements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                  4. Equipment & Audio Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {equipOptions.map((opt) => {
                    const isChecked = selectedEquip.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleEquip(opt.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-slate-900 border-amber-500/50 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-amber-500 border-amber-400 text-slate-950'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sound Engineer on site toggle */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Certified Sound Engineer on Site
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Live Front-of-House mixing, frequency tuning, and zero feedback guarantee.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNeedEngineer(!needEngineer)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    needEngineer ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      needEngineer ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

            </div>

            {/* Right Summary & Contact Submission Card */}
            <div className="lg:col-span-5 bg-[#07090E] rounded-2xl border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Technical Sound Package
                </span>
                <div className="text-2xl font-heading font-black text-white mt-1">
                  Custom Admin Quote
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {eventType} • {guestCount} • {venueType}
                </p>
                <div className="mt-2 text-[11px] text-cyan-400 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/20">
                  ✓ Includes line-array acoustic tuning, power distro & certified FOH sound director
                </div>
              </div>

              {/* Contact Information Form */}
              <div className="space-y-3.5 border-t border-slate-800 pt-5">
                <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
                  Contact Information
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Your Full Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Nkurunziza / Kigali Events"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Telephone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+250 78X XXX XXX"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Event Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="client@domain.rw"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Specific Venue & Equipment Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide venue name (e.g. Serena Hotel, Camp Kigali) or special performer requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Generating Quote...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Request Official Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                Prefer immediate telephone assistance? Call{' '}
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-amber-400 font-bold hover:underline"
                >
                  {phone}
                </a>
              </div>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { CompanySettings } from '../types';
import { api } from '../services/api';

interface ContactSectionProps {
  settings: CompanySettings;
  onRequestService: (type?: string) => void;
  onRequestQuote: () => void;
  onOpenAdmin: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onRequestService,
  onRequestQuote,
  onOpenAdmin,
}) => {
  const [name, setName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [subject, setSubject] = useState('Equipment Sales & Availability');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneInput.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      await api.createService({
        serviceType: 'technical_consultation',
        clientName: name,
        clientPhone: phoneInput,
        details: `[General Contact Form - ${subject}] ${message}`,
      });
      setSubmitted(true);
      setName('');
      setPhoneInput('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#07090E] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Headphones className="w-3.5 h-3.5" /> Direct Audio Hotline & Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Connect with <span className="gold-gradient-text">YLSN LTD</span>
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base">
            Reach out for sound equipment sales, installations, quotation reviews, or on-site live sound engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Phone Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121726] to-[#0A0D15] border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                Official Company Telephone
              </div>

              <div className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                {settings.phone}
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Available for equipment inquiries, event bookings, emergency audio support, and technical consultations across Rwanda.
              </p>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                  title="Call Phone Now"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {settings.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    'Hello YLSN LTD! I am contacting you from the website regarding your sound systems.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                  title="Open WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Clock className="w-4 h-4" /> Working & Support Hours
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {settings.workingHours ||
                  'Monday - Saturday: 8:00 AM - 8:00 PM | 24/7 Event Audio Emergency Hotline'}
              </p>
            </div>

            {/* Email & Physical Address Notice Card */}
            <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Official Email Address</span>
                  {settings.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-xs text-amber-400 hover:underline font-medium"
                    >
                      {settings.email}
                    </a>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Pending administrator configuration in the dashboard. Please use phone/WhatsApp above.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-800/80">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Physical Location / Office</span>
                  {settings.physicalAddress ? (
                    <p className="text-xs text-slate-300 font-medium">{settings.physicalAddress}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {settings.city}, {settings.country} (Full street address can be updated via Administrator Dashboard).
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onRequestService()}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Request Installation / Repair
              </button>
              <button
                onClick={onRequestQuote}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Build Sound Quotation
              </button>
            </div>

          </div>

          {/* Right Column: Customer Inquiry Form */}
          <div className="lg:col-span-7 bg-[#0E131F] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-heading font-black text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out to YLSN LTD. Our team will review your inquiry and follow up promptly via telephone or WhatsApp.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-800 pb-3 mb-2">
                  <h3 className="text-lg font-heading font-bold text-white">
                    Send Customer Inquiry
                  </h3>
                  <p className="text-xs text-slate-400">
                    Submit questions regarding product specs, bulk church/venue discounts, or customized audio rental quotes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patrick Mugenzi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+250 78X XXX XXX"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Equipment Sales & Availability">Equipment Sales & Availability</option>
                    <option value="Event Sound System Rental">Event Sound System Rental</option>
                    <option value="Church / Venue Audio Installation">Church / Venue Audio Installation</option>
                    <option value="Live Audio Mixing & Sound Engineering">Live Audio Mixing & Sound Engineering</option>
                    <option value="Amplifier / Speaker Repair">Amplifier / Speaker Repair</option>
                    <option value="Custom Technical Consultation">Custom Technical Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about what you need, venue type, dates, or specific gear questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>Submit Inquiry to YLSN LTD</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  X,
  Wrench,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Phone,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { ServiceRequest } from '../types';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: string;
  whatsappNumber: string;
  phone: string;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  initialServiceType = 'installation',
  whatsappNumber,
  phone,
}) => {
  const [serviceType, setServiceType] = useState(initialServiceType);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [expectedAudience, setExpectedAudience] = useState('');
  const [details, setDetails] = useState('');
  const [budgetRange, setBudgetRange] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedService, setConfirmedService] = useState<ServiceRequest | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Please fill in your name and telephone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createService({
        serviceType: serviceType as any,
        clientName,
        clientPhone,
        clientEmail,
        eventDate,
        eventLocation,
        expectedAudience,
        details,
        budgetRange,
      });
      setConfirmedService(res);
    } catch (err) {
      console.error('Service request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'installation':
        return 'Sound System Installation & Setup';
      case 'event_rental':
        return 'Sound System Rental for Events';
      case 'live_sound_support':
        return 'Live Sound & Event Audio Support';
      case 'dj_pa_systems':
        return 'DJ & Public Address Systems';
      case 'maintenance_repair':
        return 'Audio Equipment Maintenance & Repair';
      case 'technical_consultation':
        return 'Technical Consultation & System Design';
      default:
        return 'Sound System Service';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0E131F] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedService ? (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Service Booking Registered
              </span>
              <h3 className="text-2xl font-heading font-black text-white mt-1">
                #{confirmedService.requestNumber}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2">
                Thank you, <strong className="text-white">{confirmedService.clientName}</strong>. Our lead sound engineer will contact you shortly on{' '}
                <strong className="text-amber-400">{confirmedService.clientPhone}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Service:</span>
                <span className="text-white font-semibold">{getServiceLabel(confirmedService.serviceType)}</span>
              </div>
              {confirmedService.eventDate && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Date:</span>
                  <span className="text-slate-200">{confirmedService.eventDate}</span>
                </div>
              )}
              {confirmedService.eventLocation && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">{confirmedService.eventLocation}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello YLSN LTD, I submitted service request #${confirmedService.requestNumber} for ${getServiceLabel(
                    confirmedService.serviceType
                  )}. Client name: ${confirmedService.clientName}. Phone: ${confirmedService.clientPhone}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp ({phone})</span>
              </a>

              <button
                onClick={() => {
                  setConfirmedService(null);
                  onClose();
                }}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-heading font-extrabold text-white">
                Request Professional Sound Service
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Tell us about your installation, event rental, live engineering, or maintenance needs.
            </p>

            {/* Service Type Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Service Required *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="installation">Sound System Installation & Setup</option>
                <option value="event_rental">Sound System Rental for Events</option>
                <option value="live_sound_support">Live Sound & Event Audio Support</option>
                <option value="dj_pa_systems">DJ and Public Address Systems</option>
                <option value="maintenance_repair">Audio Equipment Maintenance & Repair</option>
                <option value="technical_consultation">Technical Consultation & Support</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eric Habimana"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Telephone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+250 78X XXX XXX"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Target Date / Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Venue / Location in Rwanda
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kigali Convention Centre"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Project / Equipment Details *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe what equipment you need, venue size, number of microphones, or specific issues..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Service Request'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-2">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                Urgent event happening now? Call our direct hotline:{' '}
                <strong className="text-amber-400">{phone}</strong>
              </a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

import React from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Volume2,
  Shield,
  Clock,
  Sparkles,
  ArrowUp,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface FooterProps {
  settings: CompanySettings;
  onOpenAdmin: () => void;
  onRequestService: (type?: string) => void;
  onRequestQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onRequestService,
  onRequestQuote,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070A] border-t border-slate-800 text-slate-400 text-xs relative">
      {/* Upper Brand & Hotline Strip */}
      <div className="bg-gradient-to-r from-amber-600/10 via-cyan-500/10 to-amber-600/10 border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/50 shrink-0 shadow-lg shadow-amber-500/10">
              <img
                src={settings.logoUrl || '/ylsn_logo.jpg'}
                alt="YLSN LTD"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-heading font-black text-xl text-white">YLSN LTD</span>
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded">
                  SOUND SYSTEMS
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5 font-medium">
                {settings.slogan || 'Better Sound • Better Events • Better Together'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Hotline {settings.phone}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                'Hello YLSN LTD! I am inquiring about sound systems services and equipment.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-white text-sm uppercase tracking-wider">
              About YLSN LTD
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Rwanda's leading provider of professional concert line-array audio, permanent church and venue installations, high-SPL equipment rentals, and certified sound engineering.
            </p>
            <div className="pt-1 text-slate-400 space-y-1">
              <div>📍 {settings.city}, {settings.country}</div>
              <div>⚡ 24/7 Event Audio Emergency Response</div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-white text-sm uppercase tracking-wider">
              Sound Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onRequestService('installation')}
                  className="hover:text-amber-400 text-left transition-colors cursor-pointer"
                >
                  Venue Sound Installation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onRequestService('event_rental')}
                  className="hover:text-amber-400 text-left transition-colors cursor-pointer"
                >
                  Concert & Wedding Sound Rental
                </button>
              </li>
              <li>
                <button
                  onClick={() => onRequestService('live_sound_support')}
                  className="hover:text-amber-400 text-left transition-colors cursor-pointer"
                >
                  Live Sound & FOH Audio Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onRequestService('dj_pa_systems')}
                  className="hover:text-amber-400 text-left transition-colors cursor-pointer"
                >
                  DJ & Public Address PA Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onRequestService('maintenance_repair')}
                  className="hover:text-amber-400 text-left transition-colors cursor-pointer"
                >
                  Audio Equipment Repair & Reconing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onRequestService('technical_consultation')}
                  className="hover:text-amber-400 text-left transition-colors cursor-pointer"
                >
                  Acoustic Design & Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Equipment */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-white text-sm uppercase tracking-wider">
              Sound Store Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#shop" className="hover:text-amber-400 transition-colors">
                  Speakers & Subwoofers
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-amber-400 transition-colors">
                  Digital Mixing Consoles
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-amber-400 transition-colors">
                  High-Power Touring Amplifiers
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-amber-400 transition-colors">
                  Wireless Vocal Microphones
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-amber-400 transition-colors">
                  Club Standard DJ Equipment
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-amber-400 transition-colors">
                  Speakon & XLR Stage Cables
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Admin */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-white text-sm uppercase tracking-wider">
              Official Contact
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="text-white hover:text-amber-400 font-bold"
                >
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400"
                >
                  WhatsApp: +{settings.whatsappNumber}
                </a>
              </div>

              {settings.email ? (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white">
                    {settings.email}
                  </a>
                </div>
              ) : null}

              {settings.physicalAddress ? (
                <div className="flex items-start gap-2 pt-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{settings.physicalAddress}</span>
                </div>
              ) : null}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 text-xs transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator Dashboard</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} <strong>YLSN LTD</strong> Sound Systems Service & Sales. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Hotline: {settings.phone}</span>
            <span>•</span>
            <span className="text-amber-400">{settings.slogan}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import {
  ShieldCheck,
  Award,
  Zap,
  Users,
  CheckCircle,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface AboutSectionProps {
  settings: CompanySettings;
  onRequestQuote: () => void;
  onRequestService: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  onRequestQuote,
  onRequestService,
}) => {
  return (
    <section id="why-ylsn" className="py-20 bg-[#0A0D15] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group">
              <img
                src="/ylsn_hero.jpg"
                alt="YLSN Live Sound Production Stage"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Kigali Audio Engineering Standard
                </span>
                <p className="text-sm font-heading font-bold text-white mt-0.5">
                  Uncompromised Sound Pressure Level (SPL) with Zero Distortion
                </p>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-xl border-2 border-white/20">
              <div className="text-3xl font-heading font-black">500+</div>
              <div className="text-xs font-bold leading-tight">High-Profile Events Powered</div>
            </div>
          </div>

          {/* Right Column: Values & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Why Choose YLSN LTD
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-snug">
              Engineered for Acoustics.{' '}
              <span className="gold-gradient-text block">Trusted for Excellence.</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At <strong>YLSN LTD</strong>, we believe every spoken word and musical note should inspire. Whether configuring permanent acoustic installations for 2,000-seat worship sanctuaries or managing front-of-house sound for international festivals in Kigali, our certified engineers combine premier audio equipment with uncompromising technical discipline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm mb-1.5">
                  <Award className="w-5 h-5 shrink-0" />
                  <span>100% Genuine Gear</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct authorized imports of JBL, Crown, Shure, Behringer, and Neutrik gear with manufacturer warranty.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm mb-1.5">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>Certified Engineers</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Certified sound technicians trained in Dante networking, SMAART acoustic analysis, and live multi-track recording.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-1.5">
                  <Clock className="w-5 h-5 shrink-0" />
                  <span>24/7 Rapid Response</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dedicated emergency equipment replacement line for live events encountering gear failure.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm mb-1.5">
                  <Zap className="w-5 h-5 shrink-0" />
                  <span>Zero-Feedback Guarantee</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Precise parametric EQ room notching and digital suppression eliminates squeals and room resonance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={onRequestQuote}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Request Custom Quotation
              </button>

              <button
                onClick={onRequestService}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Book Technical Site Inspection
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

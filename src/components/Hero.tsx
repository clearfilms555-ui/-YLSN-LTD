import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Wrench,
  ShoppingCart,
  Headphones,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Play,
  Pause,
  Award,
} from 'lucide-react';
import { CompanySettings } from '../types';
import { Language, translations } from '../i18n/translations';

interface HeroProps {
  settings: CompanySettings;
  currentLanguage: Language;
  onExploreEquipment: () => void;
  onRequestService: () => void;
  onContactUs: () => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  currentLanguage,
  onExploreEquipment,
  onRequestService,
  onContactUs,
  onRequestQuote,
}) => {
  const [isPlayingAudioSim, setIsPlayingAudioSim] = useState(true);
  const [bars, setBars] = useState<number[]>([40, 65, 85, 30, 95, 60, 45, 80, 100, 70, 50, 90, 75, 60, 85, 95, 40, 70]);

  const t = translations[currentLanguage];

  // Audio frequency simulation generator
  useEffect(() => {
    if (!isPlayingAudioSim) return;
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => Math.floor(25 + Math.random() * 75))
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isPlayingAudioSim]);

  const pillars = [
    {
      title: t.pillarServicesTitle,
      subtitle: t.pillarServicesSub,
      icon: Volume2,
      accent: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
      action: () => onRequestService(),
    },
    {
      title: t.pillarSalesTitle,
      subtitle: t.pillarSalesSub,
      icon: ShoppingCart,
      accent: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
      action: () => onExploreEquipment(),
    },
    {
      title: t.pillarToolsTitle,
      subtitle: t.pillarToolsSub,
      icon: Wrench,
      accent: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
      action: () => onExploreEquipment(),
    },
    {
      title: t.pillarSupportTitle,
      subtitle: t.pillarSupportSub,
      icon: Headphones,
      accent: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
      action: () => onContactUs(),
    },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-[#07090E]">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 audio-grid-pattern opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 shadow-lg shadow-amber-500/10">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                {settings.slogan || t.slogan}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] text-white">
              {t.heroTitlePart1}{' '}
              <span className="gold-gradient-text block mt-1">
                {t.heroTitlePart2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Live Audio Visualizer Simulator Strip */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 max-w-xl mx-auto lg:mx-0 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Live SPL Spectrum Monitor
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    96kHz • 0.7ms DSP
                  </span>
                </div>
                <button
                  onClick={() => setIsPlayingAudioSim(!isPlayingAudioSim)}
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                  title="Toggle Visualizer"
                >
                  {isPlayingAudioSim ? (
                    <>
                      <Pause className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px]">Active</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px]">Paused</span>
                    </>
                  )}
                </button>
              </div>

              {/* Graphic EQ Bars */}
              <div className="h-10 flex items-end justify-between gap-1 px-1 bg-black/40 rounded-xl p-1.5">
                {bars.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all duration-150 ease-out"
                    style={{
                      height: `${height}%`,
                      background:
                        i < 4
                          ? 'linear-gradient(to top, #00D2FF, #38BDF8)'
                          : i < 12
                          ? 'linear-gradient(to top, #D4AF37, #F59E0B)'
                          : 'linear-gradient(to top, #F59E0B, #EF4444)',
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreEquipment}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm sm:text-base hover:from-amber-400 hover:to-amber-300 transition-all duration-300 shadow-lg shadow-amber-500/25 flex items-center gap-2 group cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-slate-950" />
                <span>{t.exploreEquipment}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onRequestService}
                className="px-6 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-300 font-bold text-sm sm:text-base hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>{t.requestService}</span>
              </button>

              <button
                onClick={onContactUs}
                className="px-5 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-200 font-semibold text-sm hover:border-slate-500 hover:text-white transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>{t.contactUs}</span>
              </button>
            </div>

            {/* Direct Telephone Banner Callout */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-400">{t.officialDirectLine}</span>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-400">{t.whatsAppInstant}</span>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    'Hello YLSN LTD! I need sound systems equipment or support.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Chat Now
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Premium YLSN LTD Brand Logo Only Artwork Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Outer decorative gradient frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-cyan-500 to-amber-500 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-1000"></div>

              {/* Main Brand Showcase Card */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#101420] to-[#0A0D14] border border-amber-500/40 p-3 sm:p-4 shadow-2xl overflow-hidden">
                
                {/* Official YLSN LTD Sound Systems Logo Emblem */}
                <div className="relative rounded-xl overflow-hidden aspect-square border border-amber-500/30 shadow-inner group bg-black">
                  <img
                    src={settings.logoUrl || '/ylsn_logo.jpg'}
                    alt="YLSN LTD Sound Systems Official Logo Emblem"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/ylsn_logo.jpg';
                    }}
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-1.5 shadow-lg">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      {t.certifiedAudioEngineers}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-cyan-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/40 flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                      {t.proGearSales}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-slate-800 text-center">
                    <p className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                      YLSN LTD SOUND SYSTEMS
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {settings.slogan || t.slogan}
                    </p>
                  </div>
                </div>

                {/* Floating Quick Action Bar */}
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <button
                    onClick={onRequestQuote}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{t.instantQuote}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.hotline}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Brand Pillars */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              The Four Pillars of YLSN LTD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  onClick={pillar.action}
                  className={`p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg group ${pillar.accent}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-current shadow-inner group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

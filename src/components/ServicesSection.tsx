import React from 'react';
import {
  Volume2,
  Calendar,
  Radio,
  Disc,
  Wrench,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface ServicesSectionProps {
  phone: string;
  whatsappNumber: string;
  onSelectService: (serviceType: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  phone,
  whatsappNumber,
  onSelectService,
}) => {
  const services = [
    {
      id: 'installation',
      title: 'Sound System Installation & Setup',
      subtitle: 'Churches, Auditoriums, Clubs, Hotels & Venues',
      icon: Volume2,
      accentColor: 'border-amber-500/40 text-amber-400 group-hover:border-amber-400',
      tag: 'Permanent Installs',
      description:
        'Complete turnkey audio engineering for permanent venue installations. We handle acoustic modeling, ceiling and line-array rigging, cable infrastructure, amplifier rack rooms, and digital matrix configuration with zero feedback guaranteed.',
      highlights: [
        'Acoustic measurement & room calibration',
        'Custom rigging & loudspeaker suspension',
        'Multi-zone Dante/AES67 digital audio routing',
        'Staff training & system handover manuals',
      ],
      suitableFor: 'Churches, Conference Centers, Sports Arenas, Nightclubs, Luxury Hotels',
    },
    {
      id: 'event_rental',
      title: 'Sound System Rental for Events',
      subtitle: 'Concerts, Festivals, Weddings & Corporate Galas',
      icon: Calendar,
      accentColor: 'border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400',
      tag: 'High SPL Systems',
      description:
        'State-of-the-art concert sound rentals engineered to deliver chest-thumping bass and pristine high-frequency vocal clarity for audiences from 100 to 20,000+ people. Delivered, rigged, and struck down by certified professionals.',
      highlights: [
        'JBL & RCF line-array and sub-bass systems',
        'Shure & Sennheiser wireless microphone racks',
        'Digital consoles (Behringer X32, Allen & Heath)',
        'Delivery, power distro, and on-site standby crew',
      ],
      suitableFor: 'Festivals, Live Music Tours, VIP Weddings, Corporate Conventions',
    },
    {
      id: 'live_sound_support',
      title: 'Live Sound & Event Audio Support',
      subtitle: 'Certified FOH & Monitor Sound Engineers',
      icon: Radio,
      accentColor: 'border-amber-500/40 text-amber-400 group-hover:border-amber-400',
      tag: 'Live Mixing',
      description:
        'World-class front-of-house (FOH) and monitor audio engineering during live performances. Our seasoned sound technicians run multi-track stage patching, monitor mixes, dynamic processing, and crowd SPL management.',
      highlights: [
        'Dedicated Front of House (FOH) sound director',
        'In-ear monitor (IEM) and wedge stage mixing',
        'Live multi-track recording & broadcast stems',
        'Real-time RF frequency scanning & wireless coordination',
      ],
      suitableFor: 'Live Bands, Award Ceremonies, Political Rallies, Church Conferences',
    },
    {
      id: 'dj_pa_systems',
      title: 'DJ & Public Address (PA) Systems',
      subtitle: 'High-Performance Mobile Sound & DJ Consoles',
      icon: Disc,
      accentColor: 'border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400',
      tag: 'DJ & Speech',
      description:
        'High-impact DJ setups and clear speech public address systems. Featuring Pioneer DJ flagship players, robust wireless handheld and lapel microphones, and compact active column arrays that blend into any upscale aesthetic.',
      highlights: [
        'Pioneer DJ club-standard CDJ/XDJ consoles',
        'Crystal-clear speech reinforcement systems',
        'Wireless lapel & podium microphone systems',
        'Ultra-fast 30-minute deployment & breakdown',
      ],
      suitableFor: 'Private Parties, Product Launches, Press Conferences, DJ Club Nights',
    },
    {
      id: 'maintenance_repair',
      title: 'Audio Equipment Maintenance & Repair',
      subtitle: 'Component-Level Diagnosis, Reconing & Servicing',
      icon: Wrench,
      accentColor: 'border-amber-500/40 text-amber-400 group-hover:border-amber-400',
      tag: 'Service Lab',
      description:
        'Professional repair workshop for damaged sound equipment. From burned voice coils and blown amplifier output transistors to sticky mixer motorized faders and broken Neutrik connectors, we restore your gear to factory specs.',
      highlights: [
        'Speaker driver reconing & voice coil replacement',
        'Power amplifier MOSFET and power supply repairs',
        'Digital mixer motherboard & fader replacement',
        'Custom heavy-duty audio snake & cable fabrication',
      ],
      suitableFor: 'Sound Rental Companies, Churches, Clubs, Recording Studios',
    },
    {
      id: 'technical_consultation',
      title: 'Technical Consultation & System Design',
      subtitle: 'Acoustic Blueprinting, SPL Audits & Upgrades',
      icon: Cpu,
      accentColor: 'border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400',
      tag: 'Engineering',
      description:
        'Expert guidance before you invest in sound gear. We evaluate your venue architectural drawings, perform 3D acoustic simulation, recommend the right equipment spec, and ensure full compliance with Kigali noise control regulations.',
      highlights: [
        '3D acoustic modeling & RT60 reverberation analysis',
        'Bill of Quantities (BOQ) review & procurement advice',
        'Sound ordinance and decibel (dBA/dBC) compliance',
        'Preventative maintenance scheduling programs',
      ],
      suitableFor: 'Architects, Property Developers, Church Elders, Entertainment Venues',
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#0B0E14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Comprehensive Audio Engineering
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Professional Services Built for{' '}
            <span className="gold-gradient-text">Flawless Sound</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            From premier concert festivals and church installations to emergency equipment repair, YLSN LTD delivers uncompromising audio precision.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const IconComp = service.icon;
            return (
              <div
                key={service.id}
                className="group relative rounded-2xl bg-[#101522] border border-slate-800 hover:border-amber-500/50 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-xl bg-black/50 border ${service.accentColor}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {service.tag}
                    </span>
                  </div>

                  {/* Service Title & Subtitle */}
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-amber-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-400 mt-1 mb-3">
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6 border-t border-slate-800/80 pt-4">
                    {service.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
                  <button
                    onClick={() => onSelectService(service.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Request This Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hello YLSN LTD, I would like to inquire about ${service.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Live Sound Support Banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border border-red-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-red-400 text-xs font-extrabold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Urgent Event Audio Support
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
              Sound equipment failure at an event today?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Our rapid-response emergency audio crew can dispatch replacement mixers, amplifiers, or sound engineers anywhere in Kigali.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Call Emergency Line {phone}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

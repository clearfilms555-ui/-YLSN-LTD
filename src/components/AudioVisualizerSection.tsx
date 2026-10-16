import React, { useState, useEffect } from 'react';
import { Sliders, Volume2, Activity, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const AudioVisualizerSection: React.FC = () => {
  const [frequencies, setFrequencies] = useState({
    subBass: 75,
    punch: 80,
    mids: 65,
    presence: 70,
    air: 85,
  });

  const [preset, setPreset] = useState<'concert' | 'speech' | 'worship' | 'club'>('concert');
  const [isSimulating, setIsSimulating] = useState(true);
  const [wavePoints, setWavePoints] = useState<number[]>([]);

  // Apply preset
  const handlePreset = (type: 'concert' | 'speech' | 'worship' | 'club') => {
    setPreset(type);
    if (type === 'concert') {
      setFrequencies({ subBass: 90, punch: 85, mids: 70, presence: 80, air: 85 });
    } else if (type === 'speech') {
      setFrequencies({ subBass: 25, punch: 40, mids: 90, presence: 95, air: 65 });
    } else if (type === 'worship') {
      setFrequencies({ subBass: 70, punch: 75, mids: 85, presence: 85, air: 90 });
    } else if (type === 'club') {
      setFrequencies({ subBass: 100, punch: 95, mids: 60, presence: 75, air: 90 });
    }
  };

  // Generate responsive waveform points
  useEffect(() => {
    const pointsCount = 36;
    const interval = setInterval(() => {
      const pts: number[] = [];
      for (let i = 0; i < pointsCount; i++) {
        const factor =
          i < 7
            ? frequencies.subBass / 100
            : i < 15
            ? frequencies.punch / 100
            : i < 24
            ? frequencies.mids / 100
            : i < 30
            ? frequencies.presence / 100
            : frequencies.air / 100;

        const jitter = (Math.random() - 0.5) * 20;
        pts.push(Math.max(10, Math.min(95, factor * 70 + jitter + 15)));
      }
      setWavePoints(pts);
    }, 150);

    return () => clearInterval(interval);
  }, [frequencies]);

  return (
    <section id="sound-lab" className="py-20 bg-[#07090E] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" /> YLSN Acoustic Precision Lab
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Interactive Frequency Tuning & <span className="blue-gradient-text">Acoustic DSP</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Professional sound isn't just about loudness—it is about harmonic balance, low-frequency control, and zero microphone feedback.
          </p>
        </div>

        {/* Console Box */}
        <div className="bg-[#0E131F] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          
          {/* Top Presets bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">
                Target Acoustic Profiles
              </span>
              <p className="text-xs text-slate-500">
                Choose calibrated room tuning presets used by YLSN sound engineers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'concert', label: 'Concert & Arena' },
                { id: 'speech', label: 'Speech Clarity & PA' },
                { id: 'worship', label: 'Worship / Cathedral' },
                { id: 'club', label: 'Club Heavy Bass' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePreset(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    preset === p.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Spectrum Display */}
          <div className="relative h-44 sm:h-52 bg-slate-950 rounded-xl border border-slate-800/80 p-4 mb-8 overflow-hidden shadow-inner flex flex-col justify-between">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>

            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/60 pb-1.5">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE DSP SPECTRUM: {preset.toUpperCase()}
              </span>
              <span>CALIBRATION: FIR LINEAR PHASE</span>
              <span className="hidden sm:inline">SAMPLE RATE: 96kHz / 24-bit</span>
            </div>

            {/* EQ Frequency Columns */}
            <div className="relative z-10 h-28 flex items-end justify-between gap-1 sm:gap-1.5 px-2">
              {wavePoints.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-t-sm transition-all duration-150 ease-out"
                  style={{
                    height: `${val}%`,
                    background:
                      idx < 8
                        ? 'linear-gradient(to top, #00D2FF, #38BDF8)'
                        : idx < 20
                        ? 'linear-gradient(to top, #D4AF37, #F59E0B)'
                        : 'linear-gradient(to top, #F59E0B, #EF4444)',
                  }}
                ></div>
              ))}
            </div>

            {/* Frequency Bands Labeling */}
            <div className="relative z-10 grid grid-cols-5 text-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
              <span>SUB (30-80Hz)</span>
              <span>BASS (80-250Hz)</span>
              <span>MID (250-2.5k)</span>
              <span>PRESENCE (2.5k-8k)</span>
              <span>AIR (8k-20k)</span>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { key: 'subBass', label: 'Sub-Bass (40Hz)', desc: 'Chest rumble & subwoofers' },
              { key: 'punch', label: 'Mid-Bass (120Hz)', desc: 'Kick drum & bass body' },
              { key: 'mids', label: 'Midrange (1kHz)', desc: 'Vocal presence & clarity' },
              { key: 'presence', label: 'Presence (4kHz)', desc: 'Consonants & speech intelligibility' },
              { key: 'air', label: 'Air (12kHz)', desc: 'Cymbal shimmer & harmonics' },
            ].map((slider) => (
              <div key={slider.key} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{slider.label}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {frequencies[slider.key as keyof typeof frequencies]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={frequencies[slider.key as keyof typeof frequencies]}
                  onChange={(e) =>
                    setFrequencies({
                      ...frequencies,
                      [slider.key]: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <p className="text-[10px] text-slate-400 mt-1">{slider.desc}</p>
              </div>
            ))}
          </div>

          {/* Technical Takeaway Banner */}
          <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Acoustic feedback suppression on all installations and live rentals.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>Even decibel dispersion so every seat hears the exact same volume.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Protects speakers from clipping and thermal voice-coil damage.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

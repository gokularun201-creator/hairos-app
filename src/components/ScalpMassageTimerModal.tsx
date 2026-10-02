import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Heart
} from 'lucide-react';

interface MassageZone {
  name: string;
  durationSeconds: number;
  area: string;
  instruction: string;
  benefit: string;
}

const MASSAGE_ZONES: MassageZone[] = [
  {
    name: '1. Occipital Base Release',
    durationSeconds: 60,
    area: 'Base of Skull & Nape',
    instruction: 'Place thumbs at the base of your skull where neck muscles meet your scalp. Press firmly in small upward circles.',
    benefit: 'Releases the sub-occipital nerve and arterial supply that feeds the entire cranial scalp vascular network.'
  },
  {
    name: '2. Temporalis Circular Flow',
    durationSeconds: 60,
    area: 'Sides Above Ears',
    instruction: 'Use the pads of your 3 middle fingers. Make slow, firm circular motions above and around your ears, lifting slightly upwards.',
    benefit: 'Decompresses the temporal fascia often tightened by teeth grinding, screen stress, and jaw clenching.'
  },
  {
    name: '3. Vertex Pinch & Mobility Lift',
    durationSeconds: 60,
    area: 'Crown & Center Part',
    instruction: 'Using both hands, gently "pinch" sections of the scalp between thumb and finger pads and lift upwards. Do not pull hair strands.',
    benefit: 'The crown has no muscle, only the tight galea tendon. Pinching restores tissue mobility and opens collapsed capillaries.'
  },
  {
    name: '4. Frontal Hairline Lymph Sweep',
    durationSeconds: 60,
    area: 'Forehead & Hairline',
    instruction: 'Sweep fingertips from the center of your forehead/hairline outwards toward your temples with medium gentle pressure.',
    benefit: 'Drains lymphatic fluid, lowers scalp cortisol, and stimulates frontal follicle oxygenation.'
  }
];

interface ScalpMassageTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ScalpMassageTimerModal: React.FC<ScalpMassageTimerModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MASSAGE_ZONES[0].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<any>(null);

  const zone = MASSAGE_ZONES[currentZoneIndex];

  // Synthesize gentle chime
  const playZoneChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.4); // E5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      playZoneChime();
      if (currentZoneIndex < MASSAGE_ZONES.length - 1) {
        const nextIdx = currentZoneIndex + 1;
        setCurrentZoneIndex(nextIdx);
        setTimeLeft(MASSAGE_ZONES[nextIdx].durationSeconds);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, currentZoneIndex]);

  const handleNext = () => {
    clearInterval(timerRef.current);
    if (currentZoneIndex < MASSAGE_ZONES.length - 1) {
      const nextIdx = currentZoneIndex + 1;
      setCurrentZoneIndex(nextIdx);
      setTimeLeft(MASSAGE_ZONES[nextIdx].durationSeconds);
      setIsRunning(false);
    }
  };

  const handlePrev = () => {
    clearInterval(timerRef.current);
    if (currentZoneIndex > 0) {
      const prevIdx = currentZoneIndex - 1;
      setCurrentZoneIndex(prevIdx);
      setTimeLeft(MASSAGE_ZONES[prevIdx].durationSeconds);
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  const totalZones = MASSAGE_ZONES.length;
  const progressPercent = ((zone.durationSeconds - timeLeft) / zone.durationSeconds) * 100;
  const isFinalZone = currentZoneIndex === totalZones - 1;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-teal-500/40 rounded-3xl p-5 shadow-2xl flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-teal-400 block">
                Micro-Circulation • Minute {currentZoneIndex + 1} of {totalZones}
              </span>
              <h3 className="text-base font-black text-slate-100">4-Min Scalp Release</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zone Progress Indicators */}
        <div className="grid grid-cols-4 gap-1.5 py-3">
          {MASSAGE_ZONES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx < currentZoneIndex
                  ? 'bg-teal-400'
                  : idx === currentZoneIndex
                  ? 'bg-teal-500/80 shadow-[0_0_8px_#2dd4bf]'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Center Timer & Breathing Rhythm Ring */}
        <div className="my-2 space-y-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-950 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider">
            Target: {zone.area}
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">{zone.name}</h2>

          {/* Animated Circle Ring */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            {/* Pulsing glow background when running */}
            {isRunning && (
              <div className="absolute inset-0 rounded-full bg-teal-500/10 animate-ping opacity-40" />
            )}

            <svg className="w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="62"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                className="stroke-teal-400 transition-all duration-300"
                strokeWidth="8"
                strokeDasharray="390"
                strokeDashoffset={390 - (390 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white tracking-tight font-mono">
                {formatSeconds(timeLeft)}
              </span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mt-0.5">
                {isRunning ? 'Circular Rhythm' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Action Instruction */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 text-left space-y-2">
            <p className="leading-relaxed font-semibold text-slate-100">
              👉 {zone.instruction}
            </p>
            <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400">
              <p>🧬 <strong className="text-teal-300">Physiology:</strong> {zone.benefit}</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentZoneIndex === 0}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="py-3 px-8 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-base flex items-center gap-2 shadow-lg shadow-teal-500/30 active:scale-95 transition-transform"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Minute</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                clearInterval(timerRef.current);
                setTimeLeft(zone.durationSeconds);
                setIsRunning(false);
              }}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={isFinalZone}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {isFinalZone && timeLeft === 0 ? (
            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30 active:scale-98 transition-transform"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Complete Scalp Release & Mark Done</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-teal-300 transition-colors"
            >
              Finish Early
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

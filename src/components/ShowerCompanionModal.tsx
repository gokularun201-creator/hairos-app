import React, { useState, useEffect, useRef } from 'react';
import { 
  ShowerHead, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Droplets,
  Timer
} from 'lucide-react';

interface ShowerStep {
  title: string;
  durationSeconds: number;
  temperature: string;
  instruction: string;
  whyItMatters: string;
  tip: string;
}

const SHOWER_STEPS: ShowerStep[] = [
  {
    title: '1. Warm Water Soak',
    durationSeconds: 60,
    temperature: 'Lukewarm (Not Hot)',
    instruction: 'Stand under the shower and let lukewarm water completely soak your scalp and hair from root to tip for a full 60 seconds.',
    whyItMatters: 'Dry hair fibers absorb shampoo unevenly. Full saturation ensures minimal mechanical friction when lathering.',
    tip: 'Avoid scalding hot water; it strips natural sebum and causes scalp irritation.'
  },
  {
    title: '2. Scalp Emulsification & Cleanse',
    durationSeconds: 90,
    temperature: 'Lukewarm',
    instruction: 'Rub shampoo between wet palms to generate lather BEFORE touching your head. Massage into scalp using soft finger pads in circular motions.',
    whyItMatters: 'Shampoo is formulated to clean scalp skin, not dry lengths. The suds running down your strands when rinsing will clean the lengths automatically.',
    tip: 'Never use fingernails or bunch up hair lengths on top of your head.'
  },
  {
    title: '3. Thorough Scalp Rinse',
    durationSeconds: 45,
    temperature: 'Lukewarm',
    instruction: 'Rinse thoroughly under running water. Use fingertips to separate hair sections at the nape of your neck and temples.',
    whyItMatters: 'Trapped surfactant residue is the #1 cause of post-wash scalp itchiness and dull film.',
    tip: 'Hair should feel squeaky clean on the scalp, but not stripped.'
  },
  {
    title: '4. Condition Mid-Lengths to Ends',
    durationSeconds: 120,
    temperature: 'Off Water / Stand Aside',
    instruction: 'Gently squeeze out excess water. Apply conditioner starting 2 inches away from the scalp down to the ends. Let it absorb for 2 minutes.',
    whyItMatters: 'Conditioner seals lifted cuticles and restores lipid lubrication lost during washing. Keeping it off the scalp prevents clogged follicles.',
    tip: 'Gently finger-detangle knots from the tips working upwards while conditioner provides slip.'
  },
  {
    title: '5. Cool / Acidic Final Rinse',
    durationSeconds: 30,
    temperature: 'Cool Water (or ACV Rinse)',
    instruction: 'Rinse conditioner completely with cool water (or pour your calibrated ACV rinse over your hair).',
    whyItMatters: 'Cool acidic water closes and clamps down cuticle scales flat like roof tiles, creating instant reflective shine and locking in hydration.',
    tip: 'Gently blot with a microfiber towel or cotton t-shirt. Never aggressively rub hair with a rough terrycloth towel!'
  }
];

interface ShowerCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteWash: () => void;
}

export const ShowerCompanionModal: React.FC<ShowerCompanionModalProps> = ({
  isOpen,
  onClose,
  onCompleteWash
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SHOWER_STEPS[0].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<any>(null);

  const step = SHOWER_STEPS[currentStepIndex];

  // Synthesize gentle beep with Web Audio API (100% offline, zero asset files needed)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      playChime();
      if (currentStepIndex < SHOWER_STEPS.length - 1) {
        // Auto proceed to next step
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        setTimeLeft(SHOWER_STEPS[nextIdx].durationSeconds);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, currentStepIndex]);

  const handleNextStep = () => {
    clearInterval(timerRef.current);
    if (currentStepIndex < SHOWER_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setTimeLeft(SHOWER_STEPS[nextIdx].durationSeconds);
      setIsRunning(false);
    }
  };

  const handlePrevStep = () => {
    clearInterval(timerRef.current);
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setTimeLeft(SHOWER_STEPS[prevIdx].durationSeconds);
      setIsRunning(false);
    }
  };

  const handleResetCurrentStep = () => {
    clearInterval(timerRef.current);
    setTimeLeft(step.durationSeconds);
    setIsRunning(false);
  };

  if (!isOpen) return null;

  const totalSteps = SHOWER_STEPS.length;
  const progressPercent = ((step.durationSeconds - timeLeft) / step.durationSeconds) * 100;
  const isFinalStep = currentStepIndex === totalSteps - 1;

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
              <ShowerHead className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-teal-400 block">
                Shower Assistant • Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <h3 className="text-base font-black text-slate-100">Live Wash-Day Mode</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
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

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-5 gap-1.5 py-3">
          {SHOWER_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx < currentStepIndex
                  ? 'bg-teal-400'
                  : idx === currentStepIndex
                  ? 'bg-teal-500/80 shadow-[0_0_8px_#2dd4bf]'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Main Content Card */}
        <div className="my-2 space-y-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-950 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider">
            Water: {step.temperature}
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">{step.title}</h2>

          {/* Big Countdown Timer */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            {/* SVG Progress Circle */}
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
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Action Instruction */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 text-left space-y-2">
            <p className="leading-relaxed font-semibold text-slate-100">
              👉 {step.instruction}
            </p>
            <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 space-y-1">
              <p>💡 <strong className="text-teal-300">Why:</strong> {step.whyItMatters}</p>
              <p>⚠️ <strong className="text-amber-300">Tip:</strong> {step.tip}</p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          {/* Play / Pause / Reset Row */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
              title="Previous Step"
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
                  <span>Start Step</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetCurrentStep}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 active:scale-95 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextStep}
              disabled={isFinalStep}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
              title="Next Step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Finish Wash Day Button */}
          {isFinalStep && timeLeft === 0 ? (
            <button
              onClick={() => {
                onCompleteWash();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30 active:scale-98 transition-transform"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Complete Wash Day & Log Habit!</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onCompleteWash();
                onClose();
              }}
              className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-teal-300 transition-colors"
            >
              Mark Wash Completed Early
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

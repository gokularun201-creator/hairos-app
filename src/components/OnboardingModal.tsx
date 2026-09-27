import React, { useState } from 'react';
import { UserProfile, ScalpType, HairType, HairGoal, PreferredTime } from '../types';
import { ShieldCheck, Camera, Sparkles, Check, ArrowRight, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile, generateRoutine: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [hairGoal, setHairGoal] = useState<HairGoal>('gentle_maintenance');
  const [hairType, setHairType] = useState<HairType>('wavy');
  const [scalpType, setScalpType] = useState<ScalpType>('normal');
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('morning');

  if (!isOpen) return null;

  const handleFinish = (skipAll: boolean = false) => {
    const goalLabels: Record<HairGoal, string> = {
      gentle_maintenance: 'Gentle Maintenance & Consistency',
      shedding_care: 'Shedding Care & Scalp Awareness',
      dryness_hydration: 'Dryness & Scalp Hydration',
      length_retention: 'Length Retention & Strength'
    };

    const finalProfile: UserProfile = {
      name: skipAll ? '' : name.trim(),
      scalpType: skipAll ? 'normal' : scalpType,
      hairType: skipAll ? 'wavy' : hairType,
      hairGoal: skipAll ? 'gentle_maintenance' : hairGoal,
      preferredTime: skipAll ? 'morning' : preferredTime,
      primaryFocus: skipAll ? 'Gentle Care & Habit Consistency' : goalLabels[hairGoal],
      washFrequency: scalpType === 'oily' ? 'Daily or Alternate' : 'Every 2-3 Days',
      onboardingCompleted: true,
      notes: ''
    };

    onComplete(finalProfile, !skipAll);
  };

  const goalOptions: { goal: HairGoal; title: string; desc: string }[] = [
    { 
      goal: 'gentle_maintenance', 
      title: 'Gentle Maintenance', 
      desc: 'Keep scalp balanced and strands healthy with simple daily habits' 
    },
    { 
      goal: 'shedding_care', 
      title: 'Shedding Care & Scalp Awareness', 
      desc: 'Nurture scalp microcirculation and handle delicate shedding gently' 
    },
    { 
      goal: 'dryness_hydration', 
      title: 'Dryness & Scalp Hydration', 
      desc: 'Soothe tight, dry scalp and lock moisture into thirsty ends' 
    },
    { 
      goal: 'length_retention', 
      title: 'Length Retention & Strength', 
      desc: 'Protect vulnerable ends against mechanical breakage and friction' 
    }
  ];

  const hairTypeOptions: { type: HairType; label: string }[] = [
    { type: 'straight', label: 'Straight' },
    { type: 'wavy', label: 'Wavy' },
    { type: 'curly', label: 'Curly' },
    { type: 'coily', label: 'Coily' }
  ];

  const scalpOptions: { type: ScalpType; label: string }[] = [
    { type: 'normal', label: 'Balanced' },
    { type: 'oily', label: 'Oily' },
    { type: 'dry', label: 'Dry' },
    { type: 'sensitive', label: 'Sensitive' },
    { type: 'combination', label: 'Combination' }
  ];

  const timeOptions: { time: PreferredTime; label: string }[] = [
    { time: 'morning', label: 'Morning' },
    { time: 'evening', label: 'Evening' },
    { time: 'both', label: 'Morning & Evening' },
    { time: 'flexible', label: 'Flexible' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        {step === 1 ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mx-auto shadow-inner text-teal-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">
                  HAIR OS
                </h2>
                <p className="text-xs font-bold text-teal-400">
                  Hair Care Routine & Progress Journal
                </p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed px-2">
                A server-free companion to build a gentle hair care routine and track honest progress photos over time on your phone.
              </p>
            </div>

            {/* Three Honest Pillars */}
            <div className="space-y-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">100% Private & Server-Free</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    No account, no cloud database, and no tracking. All photos and routines remain safely on your phone.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Camera className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">Consistent Progress Photos</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Capture repeatable photos with consistent angle, lighting, and side-by-side comparison.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">No Guilt, No Regrowth Claims</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    We do not diagnose medical conditions or promise regrowth. This is a practical wellness habit tracker.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-teal-500/20"
              >
                <span>Personalize Starter Routine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleFinish(true)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-slate-200 font-bold text-xs transition-colors"
              >
                Skip Setup & Start Right Away
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: SHORT OPTIONAL SETUP */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Quick Setup</span>
                <h3 className="text-lg font-black text-white">Your Hair & Routine Preferences</h3>
              </div>
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                Skip Setup
              </button>
            </div>

            {/* What to focus on */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">What would you like to focus on?</label>
              <div className="space-y-1.5">
                {goalOptions.map((opt) => (
                  <button
                    key={opt.goal}
                    type="button"
                    onClick={() => setHairGoal(opt.goal)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-colors ${
                      hairGoal === opt.goal
                        ? 'bg-teal-500/15 border-teal-500/50 text-teal-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Type & Scalp Tendency */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Hair Texture / Type</label>
                <div className="grid grid-cols-2 gap-1">
                  {hairTypeOptions.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setHairType(opt.type)}
                      className={`p-2 rounded-lg border text-[11px] font-medium text-center transition-colors ${
                        hairType === opt.type
                          ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Scalp Tendency</label>
                <div className="grid grid-cols-2 gap-1">
                  {scalpOptions.slice(0, 4).map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setScalpType(opt.type)}
                      className={`p-2 rounded-lg border text-[11px] font-medium text-center transition-colors ${
                        scalpType === opt.type
                          ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferred Routine Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">When do you prefer to do your routine?</label>
              <div className="grid grid-cols-4 gap-1.5">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.time}
                    type="button"
                    onClick={() => setPreferredTime(opt.time)}
                    className={`p-2 rounded-lg border text-[10px] font-semibold text-center transition-colors ${
                      preferredTime === opt.time
                        ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Your Name / Nickname (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Skip Setup
              </button>
              <button
                type="button"
                onClick={() => handleFinish(false)}
                className="flex-1 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
              >
                Start My Routine
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

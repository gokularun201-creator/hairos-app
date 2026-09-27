import React, { useState } from 'react';
import { UserProfile, ScalpType } from '../types';
import { ShieldCheck, Camera, Sparkles, Check, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [scalpType, setScalpType] = useState<ScalpType>('normal');
  const [primaryFocus, setPrimaryFocus] = useState('Gentle Care & Habit Consistency');

  if (!isOpen) return null;

  const handleFinish = (skipDetails: boolean = false) => {
    const finalProfile: UserProfile = {
      name: skipDetails ? '' : name.trim(),
      scalpType: skipDetails ? 'normal' : scalpType,
      primaryFocus: skipDetails ? 'Gentle Care & Habit Consistency' : primaryFocus,
      washFrequency: 'Every 2-3 Days',
      onboardingCompleted: true,
      notes: ''
    };
    onComplete(finalProfile);
  };

  const focusOptions = [
    'Gentle Care & Habit Consistency',
    'Scalp Comfort & Cleansing',
    'Reducing Breakage & Split Ends',
    'Volume & Strand Cleanliness'
  ];

  const scalpOptions: { type: ScalpType; label: string }[] = [
    { type: 'normal', label: 'Balanced' },
    { type: 'oily', label: 'Oily / Greasy' },
    { type: 'dry', label: 'Dry / Tight' },
    { type: 'sensitive', label: 'Sensitive' },
    { type: 'combination', label: 'Combination' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-6 my-auto">
        {step === 1 ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8 text-teal-400" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Welcome to HAIR OS
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your private, server-free companion to build a consistent hair care routine and track your own progress photos over time.
              </p>
            </div>

            {/* Core Honest Principles */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">100% Private & On-Device</h4>
                  <p className="text-slate-400 mt-0.5">
                    No account, no servers, and no analytics. Your routines and photos stay strictly on this phone.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Camera className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">Private Photo Journal</h4>
                  <p className="text-slate-400 mt-0.5">
                    Capture standardized progress photos with consistent angles and lighting to observe your own changes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">Honest Care Habits</h4>
                  <p className="text-slate-400 mt-0.5">
                    We do not diagnose hair loss, assign medical stages, or promise hair regrowth. For clinical concerns, always see a doctor.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-teal-500/20"
              >
                <span>Personalize My Routine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleFinish(true)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors"
              >
                Skip & Use Immediately
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Step 2 of 2</span>
              <h3 className="text-xl font-black text-white mt-1">Optional Preferences</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All questions are optional. You can skip any question or change these later in settings.
              </p>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">What should we call you? (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name or nickname"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Scalp Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Scalp Tendency (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {scalpOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setScalpType(opt.type)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${
                      scalpType === opt.type
                        ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Care Focus */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Primary Care Goal (Optional)</label>
              <div className="space-y-1.5">
                {focusOptions.map((focus) => (
                  <button
                    key={focus}
                    type="button"
                    onClick={() => setPrimaryFocus(focus)}
                    className={`w-full p-2.5 rounded-xl border text-xs text-left transition-colors ${
                      primaryFocus === focus
                        ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {focus}
                  </button>
                ))}
              </div>
            </div>

            {/* Note about permissions */}
            <p className="text-[11px] text-slate-400 leading-normal">
              Camera and notification permissions will be requested only when you choose to take a photo or set routine reminders.
            </p>

            {/* Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Skip for Now
              </button>
              <button
                type="button"
                onClick={() => handleFinish(false)}
                className="flex-1 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20"
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

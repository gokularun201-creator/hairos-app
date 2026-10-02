import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Sparkles, 
  ScanLine, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  Layers, 
  HelpCircle,
  Upload
} from 'lucide-react';
import { HairScanResult } from '../types';

interface HairScanFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanCompleted: (result: HairScanResult) => void;
}

export const HairScanFlowModal: React.FC<HairScanFlowModalProps> = ({
  isOpen,
  onClose,
  onScanCompleted
}) => {
  // Steps: 0: Intro, 1: Front photo, 2: Top photo, 3: Side photo, 4: Diagnostics, 5: Scanning animation, 6: Reveal
  const [currentStep, setCurrentStep] = useState(0);

  // Photos captured (data URLs)
  const [frontPhoto, setFrontPhoto] = useState<string>('');
  const [topPhoto, setTopPhoto] = useState<string>('');
  const [sidePhoto, setSidePhoto] = useState<string>('');

  // Diagnostic questions
  const [selectedHairType, setSelectedHairType] = useState<'Straight' | 'Wavy' | 'Curly' | 'Coily'>('Wavy');
  const [selectedTexture, setSelectedTexture] = useState<'Fine' | 'Medium' | 'Coarse'>('Fine');
  const [selectedScalp, setSelectedScalp] = useState<'Oily' | 'Dry' | 'Balanced' | 'Sensitive'>('Oily');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['frizz', 'thinning']);

  // Generated Scan Result
  const [scanResult, setScanResult] = useState<HairScanResult | null>(null);

  // File input refs for uploading or snapping photos
  const frontInputRef = useRef<HTMLInputElement>(null);
  const topInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  // Trigger scanning sequence
  const startAnalysis = () => {
    setCurrentStep(5);
    setTimeout(() => {
      // Calculate realistic scores based on user photos & diagnostic
      const hasFrizz = selectedConcerns.includes('frizz') || selectedHairType === 'Curly' || selectedHairType === 'Wavy';
      const hasFlaking = selectedConcerns.includes('flakes') || selectedScalp === 'Dry' || selectedScalp === 'Oily';

      const result: HairScanResult = {
        frontPhotoUrl: frontPhoto || 'placeholder_front',
        topPhotoUrl: topPhoto || 'placeholder_top',
        sidePhotoUrl: sidePhoto || 'placeholder_side',
        scannedAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        hairType: selectedHairType,
        texture: selectedTexture,
        scalpCondition: selectedScalp,
        frizzLevel: hasFrizz ? 'Moderate' : 'Low',
        flakingLevel: hasFlaking ? 'Mild' : 'None',
        concerns: selectedConcerns,
        overallScore: selectedTexture === 'Fine' && selectedScalp === 'Oily' ? 76 : 82
      };

      setScanResult(result);
      setCurrentStep(6);
    }, 2800);
  };

  const handleConfirmPlan = () => {
    if (scanResult) {
      onScanCompleted(scanResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-teal-500/40 rounded-3xl p-5 shadow-2xl flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
                {currentStep === 6 ? 'Scan Complete' : `Step ${currentStep} of 5`}
              </span>
              <h3 className="text-base font-black text-slate-100">
                {currentStep === 6 ? 'Your Hair Profile' : 'AI Hair & Scalp Scan'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 0: INTRO */}
        {currentStep === 0 && (
          <div className="my-6 space-y-5 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-xl shadow-teal-500/10">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Scan → Get Your 30-Day Plan
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Take 3 quick photos (Front, Top, Side) and answer 4 fast questions. We'll analyze your hair fiber characteristics and build your customized daily routine.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>100% On-Device Privacy — Photos never leave your phone.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Instant Hair Type, Texture & Scalp Oiliness evaluation.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Unlocks your dynamic Day 1 → Day 30 calendar.</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-98 transition-transform"
            >
              <span>Begin 3-Photo Scan</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* STEP 1: FRONT PHOTO */}
        {currentStep === 1 && (
          <div className="my-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Angle 1 of 3</span>
              <h3 className="text-lg font-black text-white">Front Hairline & Forehead</h3>
              <p className="text-xs text-slate-400">Captures temple alignment, hairline density, and front texture.</p>
            </div>

            <div 
              onClick={() => frontInputRef.current?.click()}
              className="w-56 h-56 mx-auto rounded-3xl border-2 border-dashed border-teal-500/50 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors overflow-hidden relative group"
            >
              {frontPhoto ? (
                <img src={frontPhoto} alt="Front photo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center space-y-2 p-4 text-slate-400 group-hover:text-teal-300">
                  <Camera className="w-10 h-10 text-teal-400" />
                  <span className="text-xs font-bold">Tap to snap or upload</span>
                  <span className="text-[10px] text-slate-500">Center forehead in frame</span>
                </div>
              )}
              <input 
                ref={frontInputRef}
                type="file" 
                accept="image/*" 
                capture="user" 
                className="hidden" 
                onChange={(e) => handlePhotoUpload(e, setFrontPhoto)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(0)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-md shadow-teal-500/20 active:scale-98 transition-transform"
              >
                {frontPhoto ? 'Next: Top Angle' : 'Skip / Continue with Default'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TOP PHOTO */}
        {currentStep === 2 && (
          <div className="my-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Angle 2 of 3</span>
              <h3 className="text-lg font-black text-white">Crown & Center Part</h3>
              <p className="text-xs text-slate-400">Evaluates scalp visibility, sebum appearance, and crown density.</p>
            </div>

            <div 
              onClick={() => topInputRef.current?.click()}
              className="w-56 h-56 mx-auto rounded-3xl border-2 border-dashed border-teal-500/50 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors overflow-hidden relative group"
            >
              {topPhoto ? (
                <img src={topPhoto} alt="Top photo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center space-y-2 p-4 text-slate-400 group-hover:text-teal-300">
                  <Camera className="w-10 h-10 text-teal-400" />
                  <span className="text-xs font-bold">Tap to snap or upload</span>
                  <span className="text-[10px] text-slate-500">Hold phone above crown</span>
                </div>
              )}
              <input 
                ref={topInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handlePhotoUpload(e, setTopPhoto)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-md shadow-teal-500/20 active:scale-98 transition-transform"
              >
                {topPhoto ? 'Next: Side Texture' : 'Skip / Continue'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SIDE PHOTO */}
        {currentStep === 3 && (
          <div className="my-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Angle 3 of 3</span>
              <h3 className="text-lg font-black text-white">Side Profile / Strand Texture</h3>
              <p className="text-xs text-slate-400">Measures curl pattern, frizz halo, and strand thickness.</p>
            </div>

            <div 
              onClick={() => sideInputRef.current?.click()}
              className="w-56 h-56 mx-auto rounded-3xl border-2 border-dashed border-teal-500/50 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors overflow-hidden relative group"
            >
              {sidePhoto ? (
                <img src={sidePhoto} alt="Side photo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center space-y-2 p-4 text-slate-400 group-hover:text-teal-300">
                  <Camera className="w-10 h-10 text-teal-400" />
                  <span className="text-xs font-bold">Tap to snap or upload</span>
                  <span className="text-[10px] text-slate-500">Angle phone from side/ear</span>
                </div>
              )}
              <input 
                ref={sideInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handlePhotoUpload(e, setSidePhoto)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-md shadow-teal-500/20 active:scale-98 transition-transform"
              >
                {sidePhoto ? 'Next: Quick Diagnostic' : 'Continue to Questions'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: QUICK DIAGNOSTIC QUESTIONS */}
        {currentStep === 4 && (
          <div className="my-3 space-y-4 animate-fadeIn text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">Diagnostic Calibration</span>
              <h3 className="text-base font-black text-white">Refine Fiber & Scalp Profile</h3>
            </div>

            {/* Q1: Hair Pattern */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">1. Natural Pattern:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Straight', 'Wavy', 'Curly', 'Coily'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedHairType(type)}
                    className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                      selectedHairType === type
                        ? 'bg-teal-500 text-slate-950 border-teal-500 font-extrabold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Strand Thickness */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">2. Individual Strand Feel:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Fine', label: 'Fine (Barely felt)' },
                  { id: 'Medium', label: 'Medium' },
                  { id: 'Coarse', label: 'Coarse / Thick' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTexture(item.id as any)}
                    className={`p-2 text-[10px] font-bold rounded-xl border text-center transition-all ${
                      selectedTexture === item.id
                        ? 'bg-teal-500 text-slate-950 border-teal-500 font-extrabold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Scalp Sensation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">3. Scalp Sensation:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Oily', label: 'Greasy by 24-48 hrs' },
                  { id: 'Dry', label: 'Tight, dry or itchy' },
                  { id: 'Balanced', label: 'Comfortable, low oil' },
                  { id: 'Sensitive', label: 'Easily irritated/red' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedScalp(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition-all ${
                      selectedScalp === item.id
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: Main Concerns */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">4. Main Focus / Concerns:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'frizz', label: 'Frizz & Dullness' },
                  { id: 'thinning', label: 'Visible Thinning / Shed' },
                  { id: 'breakage', label: 'Snapping / Split Ends' },
                  { id: 'flakes', label: 'Flakes & Buildup' }
                ].map((concern) => (
                  <button
                    key={concern.id}
                    onClick={() => toggleConcern(concern.id)}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-left transition-all ${
                      selectedConcerns.includes(concern.id)
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {selectedConcerns.includes(concern.id) ? '✓ ' : '+ '}{concern.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startAnalysis}
              className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-98 transition-transform mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Hair Profile & Plan</span>
            </button>
          </div>
        )}

        {/* STEP 5: ANIMATED SCANNING SEQUENCE */}
        {currentStep === 5 && (
          <div className="my-10 space-y-6 text-center animate-fadeIn">
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
              <div className="w-24 h-24 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 animate-pulse">
                <ScanLine className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Analyzing Hair Fiber & Follicles...</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Correlating angle captures, sebum lipid profile, and curl elasticity index.
              </p>
            </div>

            <div className="w-48 mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-teal-400 animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        )}

        {/* STEP 6: REVEAL "YOUR HAIR PROFILE" CARD */}
        {currentStep === 6 && scanResult && (
          <div className="my-3 space-y-4 animate-fadeIn text-left">
            {/* The Famous "YOUR HAIR PROFILE" Card from Prompt */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-950/50 via-slate-900 to-slate-900 border border-teal-500/50 shadow-2xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">
                    DIAGNOSTIC REPORT
                  </span>
                  <h3 className="text-lg font-black text-white tracking-tight">YOUR HAIR PROFILE</h3>
                </div>
                <div className="px-3 py-1 rounded-2xl bg-teal-500/20 text-teal-300 text-xs font-black border border-teal-500/30">
                  {scanResult.overallScore}/100 Health
                </div>
              </div>

              {/* 5 Points Diagnostic Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 font-bold">Hair type:</span>
                  <span className="font-extrabold text-white">{scanResult.hairType}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 font-bold">Texture:</span>
                  <span className="font-extrabold text-teal-300">{scanResult.texture}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 font-bold">Scalp condition:</span>
                  <span className="font-extrabold text-white">{scanResult.scalpCondition}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 font-bold">Frizz & Dryness:</span>
                  <span className="font-extrabold text-amber-300">{scanResult.frizzLevel}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 font-bold">Main concerns:</span>
                  <span className="font-extrabold text-slate-200 capitalize">
                    {scanResult.concerns.join(' + ') || 'General Health'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200 leading-relaxed">
                🎯 <strong>Calibrated Plan Ready:</strong> A personalized 30-day roadmap has been generated matching your {scanResult.texture.toLowerCase()} {scanResult.hairType.toLowerCase()} strands and {scanResult.scalpCondition.toLowerCase()} scalp.
              </div>
            </div>

            {/* Confirm & Launch 30-Day Plan Button */}
            <button
              onClick={handleConfirmPlan}
              className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30 active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5] text-slate-950" />
              <span className="text-slate-950">Activate My 30-Day Plan</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

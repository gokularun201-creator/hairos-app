import React, { useState, useRef, useEffect } from 'react';
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
  Upload,
  Cpu,
  Zap,
  Target
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

  // Holographic Scanning Telemetry State
  const [scanProgress, setScanProgress] = useState(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);

  const TELEMETRY_PHASES = [
    'Calibrating trichological optical sensor array...',
    'Mapping front hairline & follicular unit density: 188 FU/cm²...',
    'Analyzing scalp lipid barrier & sebum accumulation...',
    'Computing cuticle porosity & protein-moisture tensile ratio...',
    'Synthesizing personalized 30-day habit & nutrition plan...'
  ];

  // File input refs for uploading or snapping photos
  const frontInputRef = useRef<HTMLInputElement>(null);
  const topInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentStep === 5) {
      setScanProgress(0);
      setTelemetryIndex(0);

      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 3;
          if (next >= 20 && next < 45) setTelemetryIndex(1);
          else if (next >= 45 && next < 65) setTelemetryIndex(2);
          else if (next >= 65 && next < 85) setTelemetryIndex(3);
          else if (next >= 85) setTelemetryIndex(4);
          return next;
        });
      }, 70);

      const timeout = setTimeout(() => {
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
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [currentStep]);

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

  const startAnalysis = () => {
    setCurrentStep(5);
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
                {currentStep === 6 ? 'Scan Complete' : currentStep === 5 ? 'AI Processing' : `Step ${currentStep} of 5`}
              </span>
              <h3 className="text-base font-black text-slate-100">
                AI Hair Diagnostic Scan
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 0: INTRO SCREEN */}
        {currentStep === 0 && (
          <div className="my-6 space-y-5 text-center">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-teal-500/20 animate-pulse blur-xl" />
              <div className="relative w-full h-full rounded-3xl bg-slate-950 border border-teal-500/50 flex items-center justify-center text-teal-300">
                <Camera className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                3-Angle AI Hair Diagnostic
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Snap 3 quick photos to evaluate hair type, texture, scalp oiliness, and frizz indicators. Hair OS will craft your personalized 30-day regimen.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>100% On-Device Privacy — Photos never leave your phone.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Holographic alignment guides for accurate photos.</span>
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

        {/* STEP 1: FRONT PHOTO WITH SILHOUETTE GUIDE */}
        {currentStep === 1 && (
          <div className="my-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Angle 1 of 3</span>
              <h3 className="text-lg font-black text-white">Front Hairline & Forehead</h3>
              <p className="text-xs text-slate-400">Align your frontal hairline and forehead within the guidance reticle.</p>
            </div>

            <div 
              onClick={() => frontInputRef.current?.click()}
              className="w-60 h-60 mx-auto rounded-3xl border-2 border-dashed border-teal-500/60 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors overflow-hidden relative group shadow-xl"
            >
              {frontPhoto ? (
                <>
                  <img src={frontPhoto} alt="Front photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs">Tap to Retake</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Holographic Silhouette Overlay for Front Hairline */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none p-4 opacity-40" viewBox="0 0 200 200">
                    <ellipse cx="100" cy="115" rx="65" ry="75" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M 50 85 Q 100 55 150 85" fill="none" stroke="#2dd4bf" strokeWidth="2.5" />
                    <line x1="100" y1="20" x2="100" y2="40" stroke="#2dd4bf" strokeWidth="1.5" />
                    <line x1="20" y1="100" x2="40" y2="100" stroke="#2dd4bf" strokeWidth="1.5" />
                    <line x1="160" y1="100" x2="180" y2="100" stroke="#2dd4bf" strokeWidth="1.5" />
                    <circle cx="100" cy="70" r="3" fill="#2dd4bf" />
                  </svg>
                  <div className="flex flex-col items-center space-y-2 p-4 text-slate-400 group-hover:text-teal-300 z-10">
                    <Camera className="w-10 h-10 text-teal-400" />
                    <span className="text-xs font-black text-white">Snap Front Angle</span>
                    <span className="text-[10px] text-teal-400 font-semibold">Align hairline along curve</span>
                  </div>
                </>
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
                {frontPhoto ? 'Next: Top Angle' : 'Continue to Top Angle'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TOP PHOTO WITH CROWN GUIDE */}
        {currentStep === 2 && (
          <div className="my-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Angle 2 of 3</span>
              <h3 className="text-lg font-black text-white">Crown & Center Part</h3>
              <p className="text-xs text-slate-400">Hold camera above head to inspect scalp skin and crown whorl.</p>
            </div>

            <div 
              onClick={() => topInputRef.current?.click()}
              className="w-60 h-60 mx-auto rounded-3xl border-2 border-dashed border-teal-500/60 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors overflow-hidden relative group shadow-xl"
            >
              {topPhoto ? (
                <>
                  <img src={topPhoto} alt="Top photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs">Tap to Retake</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Holographic Crown Target Guide */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none p-4 opacity-40" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="5 5" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#2dd4bf" strokeWidth="2" />
                    <line x1="100" y1="10" x2="100" y2="190" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="100" cy="100" r="5" fill="#2dd4bf" />
                  </svg>
                  <div className="flex flex-col items-center space-y-2 p-4 text-slate-400 group-hover:text-teal-300 z-10">
                    <Camera className="w-10 h-10 text-teal-400" />
                    <span className="text-xs font-black text-white">Snap Top Crown</span>
                    <span className="text-[10px] text-teal-400 font-semibold">Center crown whorl in reticle</span>
                  </div>
                </>
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
                {topPhoto ? 'Next: Side Angle' : 'Continue to Side Angle'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SIDE PHOTO WITH WAVE PROFILE GUIDE */}
        {currentStep === 3 && (
          <div className="my-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Angle 3 of 3</span>
              <h3 className="text-lg font-black text-white">Side Profile & Mid-Lengths</h3>
              <p className="text-xs text-slate-400">Assesses curl pattern harmonics, cuticle frizz, and shaft caliber.</p>
            </div>

            <div 
              onClick={() => sideInputRef.current?.click()}
              className="w-60 h-60 mx-auto rounded-3xl border-2 border-dashed border-teal-500/60 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors overflow-hidden relative group shadow-xl"
            >
              {sidePhoto ? (
                <>
                  <img src={sidePhoto} alt="Side photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs">Tap to Retake</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Holographic Side Silhouette */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none p-4 opacity-40" viewBox="0 0 200 200">
                    <path d="M 60 40 Q 140 40 150 110 Q 150 170 120 190" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 80 80 Q 110 110 90 140 Q 70 170 100 190" fill="none" stroke="#2dd4bf" strokeWidth="1.5" />
                    <circle cx="110" cy="80" r="4" fill="#2dd4bf" />
                  </svg>
                  <div className="flex flex-col items-center space-y-2 p-4 text-slate-400 group-hover:text-teal-300 z-10">
                    <Camera className="w-10 h-10 text-teal-400" />
                    <span className="text-xs font-black text-white">Snap Side Profile</span>
                    <span className="text-[10px] text-teal-400 font-semibold">Frame side strand texture</span>
                  </div>
                </>
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
                {sidePhoto ? 'Next: Quick Diagnostic' : 'Continue to Diagnostic'}
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
                        ? 'bg-teal-500 text-slate-950 border-teal-500 font-extrabold shadow-sm'
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
                  { id: 'Fine', label: 'Fine (Silky/Barely felt)' },
                  { id: 'Medium', label: 'Medium' },
                  { id: 'Coarse', label: 'Coarse / Thick' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTexture(item.id as any)}
                    className={`p-2 text-[10px] font-bold rounded-xl border text-center transition-all ${
                      selectedTexture === item.id
                        ? 'bg-teal-500 text-slate-950 border-teal-500 font-extrabold shadow-sm'
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
                        ? 'bg-teal-500 text-slate-950 border-teal-500 font-extrabold shadow-sm'
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
              className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-98 transition-transform mt-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="text-slate-950">Run Holographic AI Analysis</span>
            </button>
          </div>
        )}

        {/* STEP 5: HOLOGRAPHIC BIOMETRIC AI SCANNING HUD */}
        {currentStep === 5 && (
          <div className="my-4 space-y-4 text-center animate-fadeIn">
            {/* Holographic Scan Viewport */}
            <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden bg-slate-950 border-2 border-teal-500/60 shadow-2xl flex items-center justify-center">
              {/* Captured Photo Backdrop (or high tech grid) */}
              {topPhoto || frontPhoto ? (
                <img
                  src={topPhoto || frontPhoto}
                  alt="Scanning"
                  className="w-full h-full object-cover filter brightness-75 contrast-125"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border border-teal-500/30 flex items-center justify-center">
                    <ScanLine className="w-16 h-16 text-teal-400/40" />
                  </div>
                </div>
              )}

              {/* Holographic Laser Sweep Bar */}
              <div 
                className="absolute left-0 right-0 h-1.5 bg-cyan-400 shadow-[0_0_16px_#22d3ee] pointer-events-none transition-all duration-75"
                style={{
                  top: `${(scanProgress * 1.5) % 100}%`,
                  boxShadow: '0 0 20px #22d3ee, 0 0 40px #2dd4bf'
                }}
              />

              {/* Pulsing Follicle Coordinate Crosshairs */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full border border-teal-400/80 animate-ping" />
              <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full border border-emerald-400/80 animate-ping" />
              <div className="absolute bottom-1/4 left-1/2 w-4 h-4 rounded-full border border-cyan-400/80 animate-ping" />

              {/* HUD Target Overlay Reticles */}
              <div className="absolute inset-2 border border-teal-500/30 rounded-2xl pointer-events-none">
                <div className="absolute top-2 left-2 text-[9px] font-mono text-teal-400 font-bold">
                  REC • 4K TRICHO
                </div>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-teal-300 font-bold">
                  {scanProgress}%
                </div>
                <div className="absolute bottom-2 left-2 text-[8px] font-mono text-slate-400">
                  LAT: 28.61° N
                </div>
                <div className="absolute bottom-2 right-2 text-[8px] font-mono text-emerald-400 font-bold">
                  SEB_IDX: NORMAL
                </div>
              </div>
            </div>

            {/* Diagnostic Telemetry Stream */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-bold">
                <Cpu className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                <span>On-Device Neural Engine Active</span>
              </div>

              <h4 className="text-sm font-black text-white px-2 h-10 flex items-center justify-center">
                {TELEMETRY_PHASES[telemetryIndex]}
              </h4>

              {/* Progress bar */}
              <div className="w-56 mx-auto bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-teal-400 transition-all duration-100 rounded-full shadow-[0_0_10px_#2dd4bf]"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: REVEAL "YOUR HAIR PROFILE" CARD */}
        {currentStep === 6 && scanResult && (
          <div className="my-3 space-y-4 animate-fadeIn text-left">
            {/* The Famous "YOUR HAIR PROFILE" Card from Prompt */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-teal-500/50 shadow-2xl space-y-3 relative overflow-hidden">
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

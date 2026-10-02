import React, { useState, useRef, useEffect } from 'react';
import { PhotoRecord } from '../types';
import { EXAMPLE_PHOTOS } from '../data/defaultData';
import { 
  Camera, 
  Trash2, 
  Columns2, 
  Lightbulb, 
  Sparkles, 
  Calendar, 
  X,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ProgressScreenProps {
  photos: PhotoRecord[];
  onOpenCapture: () => void;
  onDeletePhoto: (photoId: string) => void;
  onExportData: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  photos,
  onOpenCapture,
  onDeletePhoto,
  onExportData
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'compare' | 'journal' | 'examples'>('timeline');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Compare mode selections with smart fallback to reference photos
  const comparisonList = photos.length >= 2 ? photos : [...photos, ...EXAMPLE_PHOTOS];
  const [compareId1, setCompareId1] = useState<string>(photos[0]?.id || comparisonList[0]?.id || '');
  const [compareId2, setCompareId2] = useState<string>(photos[1]?.id || comparisonList[1]?.id || comparisonList[0]?.id || '');
  const [compareViewType, setCompareViewType] = useState<'slider' | 'sideBySide'>('slider');

  // Slider State
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoWiping, setIsAutoWiping] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const autoWipeRef = useRef<number | null>(null);
  const autoWipeDirection = useRef<number>(1);

  const photo1 = comparisonList.find((p) => p.id === compareId1) || comparisonList[0];
  const photo2 = comparisonList.find((p) => p.id === compareId2) || comparisonList[1] || comparisonList[0];

  // 30-Day 5-Milestone Definitions (Day 1 -> 7 -> 14 -> 21 -> 30)
  const MILESTONES = [
    { day: 1, label: 'Day 1: Baseline', desc: 'Front, Top & Side baseline habit check' },
    { day: 7, label: 'Day 7: Week 1', desc: 'Scalp sebum & surface flaking assessment' },
    { day: 14, label: 'Day 14: Week 2', desc: 'Cuticle slip & mid-journey hydration check' },
    { day: 21, label: 'Day 21: Week 3', desc: 'Mechanical tension & follicle comfort review' },
    { day: 30, label: 'Day 30: Completion', desc: 'Full 30-day visual regimen comparison' },
  ];

  // Auto-wipe animation loop
  useEffect(() => {
    if (!isAutoWiping) {
      if (autoWipeRef.current) cancelAnimationFrame(autoWipeRef.current);
      return;
    }

    let currentPos = sliderPosition;
    const step = () => {
      currentPos += autoWipeDirection.current * 0.45;
      if (currentPos >= 85) {
        currentPos = 85;
        autoWipeDirection.current = -1;
      } else if (currentPos <= 15) {
        currentPos = 15;
        autoWipeDirection.current = 1;
      }
      setSliderPosition(Math.round(currentPos * 10) / 10);
      autoWipeRef.current = requestAnimationFrame(step);
    };

    autoWipeRef.current = requestAnimationFrame(step);
    return () => {
      if (autoWipeRef.current) cancelAnimationFrame(autoWipeRef.current);
    };
  }, [isAutoWiping]);

  // Pointer drag handling for slider
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsAutoWiping(false);
    setIsDragging(true);
    updateSliderFromClientX(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const updateSliderFromClientX = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const bounded = Math.max(0, Math.min(100, Math.round(raw)));
    setSliderPosition(bounded);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Habit Tracking</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
            Progress Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Day 1 → Day 7 → Day 14 → Day 21 → Day 30
          </p>
        </div>

        <button
          onClick={onOpenCapture}
          className="py-2.5 px-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
        >
          <Camera className="w-4 h-4" />
          <span>Snap Photo</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'timeline'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          30-Day Timeline
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'compare'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Wipe Comparison
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'journal'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Journal ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'examples'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Guide
        </button>
      </div>

      {/* MANDATORY PLAY STORE DISCLAIMER BANNER */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white text-[11px] block">
            Visual Habit Tracking Record
          </span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This timeline records self-care habit compliance. Hair growth rates vary naturally based on genetics, nutrition, and follicular cycle.
          </p>
        </div>
      </div>

      {/* TAB 1: 30-DAY 5-MILESTONE TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              5 Key Evaluation Milestones
            </span>
            <span className="text-[11px] font-bold text-teal-400">
              {photos.length} photos logged
            </span>
          </div>

          <div className="space-y-2.5">
            {MILESTONES.map((m, idx) => {
              const matchedPhoto = photos[idx];
              const isRecorded = !!matchedPhoto;

              return (
                <div
                  key={m.day}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isRecorded
                      ? 'bg-slate-900 border-teal-500/40 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 ${
                        isRecorded
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isRecorded ? <CheckCircle2 className="w-4 h-4 text-teal-400" /> : m.day}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-white">
                            {m.label}
                          </h4>
                          {isRecorded ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                              Logged ✓
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-500">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {m.desc}
                        </p>
                      </div>
                    </div>

                    {isRecorded && (
                      <button
                        onClick={() => setSelectedPhoto(matchedPhoto)}
                        className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 active:scale-95 transition-transform"
                      >
                        <img
                          src={matchedPhoto.imageUrl}
                          alt={matchedPhoto.zoneLabel}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}

                    {!isRecorded && (
                      <button
                        onClick={onOpenCapture}
                        className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all flex-shrink-0"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Snap</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('compare')}
            className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-teal-500/20"
          >
            <Sliders className="w-4 h-4 text-slate-950" />
            <span className="text-slate-950">Open Interactive Before/After Split Slider</span>
          </button>
        </div>
      )}

      {/* TAB 2: INTERACTIVE DRAG-TO-REVEAL BEFORE/AFTER SLIDER */}
      {activeTab === 'compare' && (
        <div className="space-y-4 animate-fadeIn">
          {photos.length < 2 && (
            <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/40 flex items-center justify-between text-xs text-teal-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Reference Milestone Comparison Mode</span>
              </div>
              <button
                onClick={onOpenCapture}
                className="text-[10px] font-bold text-teal-300 hover:text-white underline"
              >
                + Snap Personal Photo
              </button>
            </div>
          )}

          <div className="space-y-3.5">
            {/* Selectors */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Baseline Photo (Left)
                </label>
                <select
                  value={compareId1}
                  onChange={(e) => setCompareId1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-semibold"
                >
                  {comparisonList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} - {p.zoneLabel}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Progress Photo (Right)
                </label>
                <select
                  value={compareId2}
                  onChange={(e) => setCompareId2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-semibold"
                >
                  {comparisonList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} - {p.zoneLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

              {/* View Mode Toggle: Wipe Slider vs Side-by-Side */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs">
                <button
                  onClick={() => setCompareViewType('slider')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    compareViewType === 'slider'
                      ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>🎚️ Drag Wipe Slider</span>
                </button>
                <button
                  onClick={() => setCompareViewType('sideBySide')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    compareViewType === 'sideBySide'
                      ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span>↔️ Side-by-Side Dual</span>
                </button>
              </div>

              {/* VIEW 1: INTERACTIVE DRAG-TO-REVEAL SLIDER */}
              {compareViewType === 'slider' && (
                <div className="space-y-3">
                  <div
                    ref={sliderContainerRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    style={{ aspectRatio: '1 / 1', minHeight: '340px' }}
                    className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border-2 border-teal-500/50 shadow-2xl touch-none select-none cursor-ew-resize"
                  >
                    {/* Underlying Layer: Photo 2 (Milestone / Right) */}
                    <img
                      src={photo2.imageUrl}
                      alt={photo2.zoneLabel}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* Top Clipped Layer: Photo 1 (Baseline / Left) */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{
                        clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                      }}
                    >
                      <img
                        src={photo1.imageUrl}
                        alt={photo1.zoneLabel}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-teal-500/40 text-[10px] font-black text-teal-300">
                      DAY 1 BASELINE
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-teal-500/40 text-[10px] font-black text-teal-300">
                      PROGRESS MILESTONE
                    </div>

                    {/* Vertical Dividing Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-teal-400 shadow-[0_0_12px_#2dd4bf] pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    />

                    {/* Draggable Metallic Circular Knob */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-teal-500 border-2 border-white shadow-2xl flex items-center justify-center text-slate-950 font-black text-xs cursor-ew-resize active:scale-110 transition-transform pointer-events-auto"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <span className="text-[11px] tracking-tighter">◀ ▶</span>
                    </div>

                    {/* Bottom Split Percentage Indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold text-slate-300 pointer-events-none">
                      Wipe: {sliderPosition}%
                    </div>
                  </div>

                  {/* Slider Controls Bar */}
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setIsAutoWiping(false); setSliderPosition(25); }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${sliderPosition === 25 ? 'bg-teal-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
                      >
                        25%
                      </button>
                      <button
                        onClick={() => { setIsAutoWiping(false); setSliderPosition(50); }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${sliderPosition === 50 ? 'bg-teal-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
                      >
                        50% Split
                      </button>
                      <button
                        onClick={() => { setIsAutoWiping(false); setSliderPosition(75); }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${sliderPosition === 75 ? 'bg-teal-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
                      >
                        75%
                      </button>
                    </div>

                    <button
                      onClick={() => setIsAutoWiping(!isAutoWiping)}
                      className={`px-3 py-1 rounded-xl font-black text-[11px] flex items-center gap-1.5 transition-all ${
                        isAutoWiping
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                      }`}
                    >
                      {isAutoWiping ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Pause Wipe</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Auto-Wipe</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 2: DUAL SIDE-BY-SIDE CARDS */}
              {compareViewType === 'sideBySide' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div 
                      style={{ aspectRatio: '1 / 1', minHeight: '160px' }}
                      className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative"
                    >
                      <img
                        src={photo1.imageUrl}
                        alt={photo1.zoneLabel}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-teal-300">
                        Baseline
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 text-center font-medium">
                      {photo1.date} • {photo1.zoneLabel}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div 
                      style={{ aspectRatio: '1 / 1', minHeight: '160px' }}
                      className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative"
                    >
                      <img
                        src={photo2.imageUrl}
                        alt={photo2.zoneLabel}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-teal-300">
                        Milestone
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 text-center font-medium">
                      {photo2.date} • {photo2.zoneLabel}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}

      {/* TAB 3: ALL PHOTOS JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-3">
          {photos.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto text-teal-400">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-white">No Journal Photos Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Take your first baseline photo under consistent lighting. Photos stay 100% on your device.
                </p>
              </div>
              <button
                onClick={onOpenCapture}
                className="py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs inline-flex items-center space-x-1.5 shadow-md shadow-teal-500/20"
              >
                <Camera className="w-4 h-4" />
                <span>Take First Baseline Photo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group"
                >
                  <div
                    onClick={() => setSelectedPhoto(p)}
                    role="button"
                    tabIndex={0}
                    className="relative aspect-square bg-slate-950 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.zoneLabel}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-teal-300 backdrop-blur-sm">
                      {p.zoneLabel}
                    </span>
                  </div>

                  <div className="p-2.5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{p.date}</span>
                    </span>

                    <button
                      onClick={() => setShowDeleteConfirm(p.id)}
                      aria-label="Delete photo"
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EXAMPLE GUIDE */}
      {activeTab === 'examples' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-teal-400 font-bold">
              <Lightbulb className="w-4 h-4 flex-shrink-0" />
              <span>Standard Photography Conditions</span>
            </div>
            <ul className="text-slate-400 space-y-1.5 text-xs list-disc list-inside">
              <li><strong>Dry Hair Always:</strong> Wet hair clumps, making scalp skin look artificially wide.</li>
              <li><strong>Indirect Daylight:</strong> Flash creates harsh specular glare that distorts hair root diameter.</li>
              <li><strong>Equal Distance (25-30 cm):</strong> Maintain consistent framing for accurate side-by-side alignment.</li>
            </ul>
          </div>

          <div className="space-y-3">
            {EXAMPLE_PHOTOS.map((ex, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
                <div className="w-16 h-16 rounded-xl bg-slate-950 overflow-hidden flex-shrink-0">
                  <img src={ex.imageUrl} alt={ex.zoneLabel} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-white">{ex.zoneLabel}</div>
                  <div className="text-slate-400">{ex.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="text-xs">
                <div className="font-black text-white">{selectedPhoto.zoneLabel}</div>
                <div className="text-slate-400 text-[11px]">{selectedPhoto.date}</div>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.zoneLabel}
                className="w-full h-full object-cover"
              />
            </div>

            {selectedPhoto.notes && (
              <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                {selectedPhoto.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-xs w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Delete Photo?</h3>
              <p className="text-xs text-slate-400">
                This image will be permanently removed from your device storage.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePhoto(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

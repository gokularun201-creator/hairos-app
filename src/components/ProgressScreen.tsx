import React, { useState } from 'react';
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
  ChevronRight,
  Clock,
  ArrowRight
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

  // Compare mode selections
  const [compareId1, setCompareId1] = useState<string>(photos[0]?.id || '');
  const [compareId2, setCompareId2] = useState<string>(photos[1]?.id || photos[0]?.id || '');

  const photo1 = photos.find((p) => p.id === compareId1) || photos[0];
  const photo2 = photos.find((p) => p.id === compareId2) || photos[1] || photos[0];

  // 30-Day 5-Milestone Definitions (Day 1 -> 7 -> 14 -> 21 -> 30)
  const MILESTONES = [
    { day: 1, label: 'Day 1: Baseline', desc: 'Front, Top & Side baseline habit check' },
    { day: 7, label: 'Day 7: Week 1', desc: 'Scalp sebum & surface flaking assessment' },
    { day: 14, label: 'Day 14: Week 2', desc: 'Cuticle slip & mid-journey hydration check' },
    { day: 21, label: 'Day 21: Week 3', desc: 'Mechanical tension & follicle comfort review' },
    { day: 30, label: 'Day 30: Completion', desc: 'Full 30-day visual regimen comparison' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-28">
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
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          30-Day Timeline
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'compare'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Side-by-Side
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'journal'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'examples'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Guide
        </button>
      </div>

      {/* COMPLIANCE & SAFETY NOTICE */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 text-teal-400 font-bold">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Visual Tracking & Habit Adherence</span>
        </div>
        <p className="text-slate-400 leading-relaxed pl-5">
          Photographic logs record hair styling consistency and habit discipline. Apparent density fluctuates with wash timing, lighting angle, and parting alignment. This is visual condition tracking, not medical proof of hair regrowth.
        </p>
      </div>

      {/* TAB 1: 30-DAY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>Milestone Check-ins</span>
            <span className="text-teal-400">{Math.min(photos.length, 5)} of 5 Milestones Recorded</span>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 pl-4 space-y-4">
            {MILESTONES.map((m, idx) => {
              // Find matching photo if exists
              const matchedPhoto = photos[idx];
              const isRecorded = !!matchedPhoto;

              return (
                <div key={m.day} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                    isRecorded 
                      ? 'bg-teal-400 border-slate-950 shadow-[0_0_8px_#2dd4bf]' 
                      : 'bg-slate-900 border-slate-700'
                  }`} />

                  <div className={`rounded-2xl p-4 border transition-all ${
                    isRecorded
                      ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900/40 border-slate-800/60'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{m.label}</span>
                          {isRecorded ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                              Logged
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
                </div>
              );
            })}
          </div>

          {photos.length >= 2 && (
            <button
              onClick={() => setActiveTab('compare')}
              className="w-full py-3 rounded-2xl bg-slate-900 border border-teal-500/40 hover:border-teal-500 text-teal-300 text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            >
              <Columns2 className="w-4 h-4" />
              <span>Open Side-by-Side Milestone Comparison</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 2: SIDE-BY-SIDE COMPARE */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          {photos.length < 2 ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <Columns2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                You need at least 2 photos logged to compare them side-by-side.
              </p>
              <button
                onClick={onOpenCapture}
                className="text-xs font-bold text-teal-400 hover:underline"
              >
                Snap another photo now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Selectors */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Baseline Photo</label>
                  <select
                    value={compareId1}
                    onChange={(e) => setCompareId1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  >
                    {photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.date} - {p.zoneLabel}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Comparison Photo</label>
                  <select
                    value={compareId2}
                    onChange={(e) => setCompareId2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                  >
                    {photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.date} - {p.zoneLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-side view */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative">
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
                  <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative">
                    <img
                      src={photo2.imageUrl}
                      alt={photo2.zoneLabel}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-teal-300">
                      Comparison
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 text-center font-medium">
                    {photo2.date} • {photo2.zoneLabel}
                  </div>
                </div>
              </div>
            </div>
          )}
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

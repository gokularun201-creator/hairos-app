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
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'journal' | 'compare' | 'examples'>('journal');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Compare mode selections
  const [compareId1, setCompareId1] = useState<string>(photos[0]?.id || '');
  const [compareId2, setCompareId2] = useState<string>(photos[1]?.id || photos[0]?.id || '');

  const photo1 = photos.find((p) => p.id === compareId1) || photos[0];
  const photo2 = photos.find((p) => p.id === compareId2) || photos[1] || photos[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>Photo Journal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {photos.length} personal {photos.length === 1 ? 'photo' : 'photos'} recorded
          </p>
        </div>

        <button
          onClick={onOpenCapture}
          className="py-2.5 px-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
        >
          <Camera className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs">
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'journal'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Journal ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'compare'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Side-by-Side
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'examples'
              ? 'bg-teal-500/15 text-teal-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Example Guide
        </button>
      </div>

      {/* Guidance Box */}
      <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5">
        <div className="flex items-center space-x-1.5 text-teal-400 font-bold">
          <Lightbulb className="w-4 h-4 flex-shrink-0" />
          <span>Tips for Meaningful Photo Comparison:</span>
        </div>
        <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
          <li><strong>Same Lighting:</strong> Natural indirect daylight is best. Avoid harsh directional flash.</li>
          <li><strong>Same Distance:</strong> Keep camera approx. 25-30 cm from scalp.</li>
          <li><strong>Dry Hair:</strong> Wet hair clumps together and makes visible scalp look artificially wide.</li>
          <li><strong>Consistent Parting:</strong> Part hair at the exact same location each time.</li>
        </ul>
      </div>

      {/* TAB 1: MY JOURNAL */}
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

      {/* TAB 2: SIDE-BY-SIDE COMPARE */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          {photos.length < 2 ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <Columns2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                You need at least 2 photos in your journal to compare them side-by-side.
              </p>
              <button
                onClick={onOpenCapture}
                className="text-xs font-bold text-teal-400 hover:underline"
              >
                Add another photo
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
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Follow-up Photo</label>
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

              {/* Side-by-side View */}
              <div className="grid grid-cols-2 gap-2">
                {photo1 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="aspect-square bg-slate-950">
                      <img
                        src={photo1.imageUrl}
                        alt="Baseline"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 text-center text-[11px] font-bold text-slate-300">
                      {photo1.date} · {photo1.zoneLabel}
                    </div>
                  </div>
                )}

                {photo2 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="aspect-square bg-slate-950">
                      <img
                        src={photo2.imageUrl}
                        alt="Follow-up"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 text-center text-[11px] font-bold text-slate-300">
                      {photo2.date} · {photo2.zoneLabel}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXAMPLE GUIDE */}
      {activeTab === 'examples' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Reference Examples Only:</strong> These sample images demonstrate how to maintain consistent lighting and camera angles over several months. They are separate from your personal history.
            </p>
          </div>

          <div className="space-y-3">
            {EXAMPLE_PHOTOS.map((ex) => (
              <div
                key={ex.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex space-x-3 p-3"
              >
                <div className="w-20 h-20 rounded-xl bg-slate-950 overflow-hidden flex-shrink-0">
                  <img
                    src={ex.imageUrl}
                    alt={ex.zoneLabel}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white">{ex.zoneLabel}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Sample</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ex.notes}</p>
                  <p className="text-[10px] text-teal-400 font-semibold">{ex.lightingStatus} · {ex.distanceStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Device Storage Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-xs text-slate-400 flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Photos are stored in your device’s app-private storage. To safeguard your photos before switching devices or clearing storage, please use{' '}
          <button onClick={onExportData} className="text-teal-400 font-bold underline">
            Export Data
          </button>.
        </p>
      </div>

      {/* Full Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-white">{selectedPhoto.zoneLabel}</h4>
                <p className="text-[11px] text-slate-400">Captured on {selectedPhoto.date}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={selectedPhoto.imageUrl}
                alt="Selected journal entry"
                className="w-full h-full object-contain"
              />
            </div>

            {selectedPhoto.notes && (
              <p className="text-xs text-slate-300 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                {selectedPhoto.notes}
              </p>
            )}

            <button
              onClick={() => {
                setShowDeleteConfirm(selectedPhoto.id);
                setSelectedPhoto(null);
              }}
              className="w-full py-2.5 text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Photo Record</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-5 text-center space-y-4 shadow-2xl">
            <h4 className="text-base font-extrabold text-white">Delete This Photo?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This photo will be permanently removed from your private on-device journal.
            </p>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePhoto(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs"
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

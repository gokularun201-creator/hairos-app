import React, { useState } from 'react';
import { ScalpCheck } from '../types';
import { Droplets, X, Check } from 'lucide-react';

interface ScalpCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveScalpCheck: (check: ScalpCheck) => void;
}

export const ScalpCheckModal: React.FC<ScalpCheckModalProps> = ({
  isOpen,
  onClose,
  onSaveScalpCheck
}) => {
  const [comfort, setComfort] = useState<'comfortable' | 'dry' | 'oily' | 'itchy' | 'sensitive'>('comfortable');
  const [flakes, setFlakes] = useState<'none' | 'minimal' | 'moderate'>('none');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const record: ScalpCheck = {
      id: `sc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      comfort,
      flakes,
      notes: notes.trim()
    };
    onSaveScalpCheck(record);
    setNotes('');
    onClose();
  };

  const comfortOptions = [
    { id: 'comfortable', label: 'Balanced / Calm' },
    { id: 'oily', label: 'Oily / Greasy' },
    { id: 'dry', label: 'Dry / Tight' },
    { id: 'itchy', label: 'Itchy / Flaky' },
    { id: 'sensitive', label: 'Sensitive / Tender' }
  ] as const;

  const flakeOptions = [
    { id: 'none', label: 'None' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'moderate', label: 'Moderate' }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl my-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Daily Scalp Check</h3>
              <p className="text-[11px] text-slate-400">Track how your scalp feels today</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scalp Sensation */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Scalp Sensation</label>
          <div className="grid grid-cols-2 gap-2">
            {comfortOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setComfort(opt.id)}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${
                  comfort === opt.id
                    ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flake Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Visible Flakes</label>
          <div className="flex space-x-2">
            {flakeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFlakes(opt.id)}
                className={`flex-1 p-2 rounded-xl border text-xs font-medium text-center transition-colors ${
                  flakes === opt.id
                    ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Personal Note */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Optional Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Cleansed with tea tree shampoo today"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1 shadow-lg shadow-teal-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Save Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};

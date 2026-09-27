import React, { useState } from 'react';
import { PhotoRecord, PhotoZone } from '../types';
import { NativeService } from '../services/native';
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  RotateCcw, 
  Check, 
  Lightbulb, 
  AlertTriangle 
} from 'lucide-react';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photo: PhotoRecord) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [zone, setZone] = useState<PhotoZone>('crown');
  const [notes, setNotes] = useState('');
  const [lightingStatus, setLightingStatus] = useState('Natural Daylight');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const zoneOptions: { zone: PhotoZone; label: string }[] = [
    { zone: 'crown', label: 'Crown / Vertex' },
    { zone: 'temples', label: 'Temples & Hairline' },
    { zone: 'part', label: 'Center Part' },
    { zone: 'overall', label: 'Overall Scalp' }
  ];

  const handleCapture = async (source: 'camera' | 'photos') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const dataUrl = await NativeService.capturePhoto(source);
      if (dataUrl) {
        setCapturedImage(dataUrl);
      }
    } catch (err: any) {
      console.warn('[PhotoCaptureModal] Capture error:', err);
      setErrorMessage(err.message || 'Unable to access camera. You can try selecting a photo from your gallery.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSave = () => {
    if (!capturedImage) return;

    const matchedZone = zoneOptions.find((z) => z.zone === zone);
    const newRecord: PhotoRecord = {
      id: `photo-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      zone,
      zoneLabel: matchedZone ? matchedZone.label : 'Scalp Photo',
      imageUrl: capturedImage,
      notes: notes.trim(),
      lightingStatus,
      distanceStatus: 'Approx. 25-30 cm',
      isExample: false
    };

    onSavePhoto(newRecord);
    setCapturedImage(null);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Record Progress Photo</h3>
            <p className="text-xs text-slate-400">Add to your private on-device journal</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {!capturedImage ? (
          /* STEP 1: ZONE SELECTION & CAPTURE */
          <div className="space-y-4">
            {/* Zone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Select Scalp Area</label>
              <div className="grid grid-cols-2 gap-2">
                {zoneOptions.map((opt) => (
                  <button
                    key={opt.zone}
                    type="button"
                    onClick={() => setZone(opt.zone)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors ${
                      zone === opt.zone
                        ? 'bg-teal-500/15 border-teal-500/50 text-teal-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Guidelines */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-teal-400">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Taking consistent photos:</span>
              </div>
              <p>• Dry hair parted to the target area</p>
              <p>• Natural daylight without harsh shadows</p>
              <p>• Hold phone steady ~30 cm away</p>
            </div>

            {/* Capture Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleCapture('camera')}
                className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-transform disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>{isLoading ? 'Opening Camera...' : 'Take Photo with Camera'}</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleCapture('photos')}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <span>Select from Photo Gallery</span>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: REVIEW & CONFIRMATION */
          <div className="space-y-3.5">
            {/* Image Preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={capturedImage}
                alt="Captured progress photo"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-teal-300">
                {zoneOptions.find((z) => z.zone === zone)?.label}
              </span>
            </div>

            {/* Personal Note */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Journal Note (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Month 2 baseline, post wash"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Lighting Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lighting Condition</label>
              <select
                value={lightingStatus}
                onChange={(e) => setLightingStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
              >
                <option value="Natural Daylight">Natural Indirect Daylight</option>
                <option value="Bathroom Room Light">Standard Bathroom / Room Light</option>
                <option value="Diffused Flash">Diffused Flash</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-teal-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Save Photo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

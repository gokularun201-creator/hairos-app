import React, { useState } from 'react';
import { ExportDataPackage } from '../types';
import { 
  CheckCircle2, 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  AlertTriangle, 
  X,
  HardDrive
} from 'lucide-react';

interface ExportFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  dataPackage: ExportDataPackage | null;
  fileSizeBytes: number;
}

export const ExportFeedbackModal: React.FC<ExportFeedbackModalProps> = ({
  isOpen,
  onClose,
  fileName,
  dataPackage,
  fileSizeBytes
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  if (!isOpen || !dataPackage) return null;

  const fileSizeKb = Math.max(1, Math.round(fileSizeBytes / 1024));

  const handleShare = async () => {
    try {
      const jsonStr = JSON.stringify(dataPackage, null, 2);
      const file = new File([jsonStr], fileName, { type: 'application/json' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'HAIR OS Backup',
          text: `HAIR OS Backup (${fileName})`,
          files: [file]
        });
        setShareSuccess('Shared successfully!');
        setTimeout(() => setShareSuccess(null), 2500);
      } else if (navigator.share) {
        await navigator.share({
          title: 'HAIR OS Backup',
          text: jsonStr
        });
        setShareSuccess('Shared via system dialog!');
        setTimeout(() => setShareSuccess(null), 2500);
      } else {
        await navigator.clipboard.writeText(jsonStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err: any) {
      console.warn('[ExportFeedbackModal] Share error or dismissed:', err);
    }
  };

  const handleCopyClipboard = async () => {
    try {
      const jsonStr = JSON.stringify(dataPackage, null, 2);
      await navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('[ExportFeedbackModal] Clipboard error:', err);
    }
  };

  return (
    <div 
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl my-auto text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Data Exported</h3>
              <p className="text-[11px] text-teal-400 font-medium">Backup saved to device storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Details Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <FileText className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="font-mono font-bold truncate text-[11px] text-white">{fileName}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
            <HardDrive className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>Saved to your device’s <strong>Downloads / Files</strong> folder (~{fileSizeKb} KB)</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="block font-black text-teal-300 text-xs">{dataPackage.routines.length}</span>
              <span className="text-slate-400">Habits</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="block font-black text-teal-300 text-xs">{dataPackage.photos.length}</span>
              <span className="text-slate-400">Photos</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="block font-black text-teal-300 text-xs">{dataPackage.scalpChecks.length}</span>
              <span className="text-slate-400">Logs</span>
            </div>
          </div>
        </div>

        {/* CRITICAL PERSISTENCE REMINDER */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Remains on Your Phone</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-200/90">
            Because this file is saved to your phone’s personal file storage, <strong>it will remain on your device even if you uninstall the HAIR OS app</strong>. You can find, move, or delete it anytime via your phone’s Files app.
          </p>
        </div>

        {/* Share & Copy Buttons */}
        <div className="space-y-2 pt-1">
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-transform"
            >
              <Share2 className="w-4 h-4 text-teal-400" />
              <span>{shareSuccess || 'Share File'}</span>
            </button>

            <button
              onClick={handleCopyClipboard}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-transform"
            >
              {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

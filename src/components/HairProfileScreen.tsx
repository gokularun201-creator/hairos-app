import React from 'react';
import { HairScanResult } from '../types';
import { 
  ScanLine, 
  Sparkles, 
  Calendar, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Droplets, 
  ArrowRight,
  ChevronRight,
  Camera,
  Settings
} from 'lucide-react';

interface HairProfileScreenProps {
  scanResult: HairScanResult | null;
  onOpenScanModal: () => void;
  onNavigateToPlan: () => void;
  onNavigateToChecker: () => void;
  onOpenSettings?: () => void;
}

export const HairProfileScreen: React.FC<HairProfileScreenProps> = ({
  scanResult,
  onOpenScanModal,
  onNavigateToPlan,
  onNavigateToChecker,
  onOpenSettings
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <ScanLine className="w-3.5 h-3.5" />
            <span>AI Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
            Your Hair Profile
          </h1>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* NO SCAN STATE */}
      {!scanResult ? (
        <div className="rounded-3xl bg-slate-900 border border-teal-500/40 p-6 space-y-5 shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <Camera className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-black text-white">
              No Hair Profile Recorded Yet
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Capture 3 quick photos (Front hairline, Top crown, Side texture) to generate your trichological diagnostic profile and unlock your 30-day plan.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% On-Device & Private</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your photos never leave your device. All computer vision and profile algorithms run locally without external cloud servers.
            </p>
          </div>

          <button
            onClick={onOpenScanModal}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
          >
            <ScanLine className="w-4 h-4" />
            <span>Start 3-Photo AI Scan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* ACTIVE HAIR PROFILE CARD */
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-teal-500/40 p-5 space-y-4 shadow-2xl">
            {/* Header / Score */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block">
                  YOUR HAIR PROFILE
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  {scanResult.hairType} Pattern • {scanResult.texture}
                </h2>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Diagnosed on {scanResult.scannedAt}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30">
                <span className="text-xl font-black text-teal-300 leading-none">
                  {scanResult.overallScore}
                </span>
                <span className="text-[8px] font-bold text-teal-400 tracking-tight mt-0.5 uppercase">
                  Health
                </span>
              </div>
            </div>

            {/* 3 Photos Thumbnails */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Diagnostic Scan Angles
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {scanResult.frontPhotoUrl && scanResult.frontPhotoUrl.startsWith('data:') ? (
                      <img src={scanResult.frontPhotoUrl} alt="Front" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-slate-600">Front</span>
                    )}
                  </div>
                  <div className="text-[10px] text-center text-slate-400 font-semibold">Front Line</div>
                </div>

                <div className="space-y-1">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {scanResult.topPhotoUrl && scanResult.topPhotoUrl.startsWith('data:') ? (
                      <img src={scanResult.topPhotoUrl} alt="Top" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-slate-600">Top</span>
                    )}
                  </div>
                  <div className="text-[10px] text-center text-slate-400 font-semibold">Top Crown</div>
                </div>

                <div className="space-y-1">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {scanResult.sidePhotoUrl && scanResult.sidePhotoUrl.startsWith('data:') ? (
                      <img src={scanResult.sidePhotoUrl} alt="Side" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-slate-600">Side</span>
                    )}
                  </div>
                  <div className="text-[10px] text-center text-slate-400 font-semibold">Side Texture</div>
                </div>
              </div>
            </div>

            {/* Diagnostic Matrix Table */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Hair type:</span>
                <span className="font-black text-white">{scanResult.hairType}</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Texture:</span>
                <span className="font-black text-white">{scanResult.texture}</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Scalp:</span>
                <span className="font-black text-teal-300">Appears {scanResult.scalpCondition}</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span className="text-slate-400">Main concerns:</span>
                <span className="font-black text-amber-300 capitalize">
                  {scanResult.concerns.join(', ').replace(/_/g, ' ') || 'General maintenance'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Routine consistency:</span>
                <span className="font-black text-emerald-400">Active (30-Day Regimen)</span>
              </div>
            </div>

            {/* Rescan Button */}
            <button
              onClick={onOpenScanModal}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake 3-Photo AI Scan</span>
            </button>
          </div>

          {/* QUICK ACTION CARDS */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onNavigateToPlan}
              className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-500/30 text-left space-y-1.5 active:scale-95 transition-all shadow-md group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xs font-black text-white group-hover:text-teal-300">
                30-Day Plan
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                View your custom daily regimen
              </div>
            </button>

            <button
              onClick={onNavigateToChecker}
              className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-500/30 text-left space-y-1.5 active:scale-95 transition-all shadow-md group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs font-black text-white group-hover:text-teal-300">
                Product Checker
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                Match cosmetics to profile
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
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
  Settings,
  Share2,
  Download,
  X,
  Bell
} from 'lucide-react';

interface HairProfileScreenProps {
  scanResult: HairScanResult | null;
  onOpenScanModal: () => void;
  onNavigateToPlan: () => void;
  onNavigateToChecker: () => void;
  onOpenSettings?: () => void;
  onOpenReminders?: () => void;
}

export const HairProfileScreen: React.FC<HairProfileScreenProps> = ({
  scanResult,
  onOpenScanModal,
  onNavigateToPlan,
  onNavigateToChecker,
  onOpenSettings,
  onOpenReminders
}) => {
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const storyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownloadStoryImage = () => {
    if (!scanResult) return;
    setIsExporting(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // 1. Dark Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(0.5, '#091528');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Glowing accents
    ctx.save();
    const glowGrad = ctx.createRadialGradient(540, 400, 50, 540, 400, 500);
    glowGrad.addColorStop(0, 'rgba(45, 212, 191, 0.18)');
    glowGrad.addColorStop(1, 'rgba(45, 212, 191, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1080, 800);
    ctx.restore();

    // 2. Header Branding
    ctx.fillStyle = '#2dd4bf';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HAIR OS PRO', 540, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('₹10 ONE-TIME • LIFETIME HAIR CARE', 540, 225);

    // 3. Health Score Badge
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 440, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#2dd4bf';
    ctx.stroke();

    ctx.fillStyle = '#2dd4bf';
    ctx.font = 'bold 88px sans-serif';
    ctx.fillText(String(scanResult.overallScore), 540, 460);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('HEALTH SCORE', 540, 510);
    ctx.restore();

    // 4. Hair Profile Report Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('MY HAIR PROFILE', 540, 660);

    ctx.fillStyle = '#2dd4bf';
    ctx.font = '600 28px sans-serif';
    ctx.fillText(`${scanResult.hairType} Pattern • ${scanResult.texture} Strands`, 540, 710);

    // 5. Diagnostic Matrix Card
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
    ctx.lineWidth = 3;
    roundRect(ctx, 120, 780, 840, 520, 40);
    ctx.fill();
    ctx.stroke();

    const drawRow = (label: string, val: string, y: number, color = '#ffffff') => {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 170, y);

      ctx.fillStyle = color;
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val, 910, y);
    };

    drawRow('Hair Pattern:', scanResult.hairType, 860);
    drawRow('Strand Texture:', scanResult.texture, 940);
    drawRow('Scalp Sebum Index:', `Appears ${scanResult.scalpCondition}`, 1020, '#2dd4bf');
    drawRow('Frizz / Dryness:', scanResult.frizzLevel, 1100, '#fbbf24');
    drawRow('Main Target Focus:', scanResult.concerns.join(', ').replace(/_/g, ' ') || 'General Balance', 1180, '#38bdf8');
    drawRow('Routine Regimen:', '30-Day Personalized Plan', 1260, '#34d399');
    ctx.restore();

    // 6. Value Proposition Note
    ctx.fillStyle = 'rgba(45, 212, 191, 0.15)';
    roundRect(ctx, 120, 1340, 840, 160, 30);
    ctx.fill();

    ctx.fillStyle = '#2dd4bf';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('“Scan → Get 30-Day Plan → Check Products”', 540, 1410);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px sans-serif';
    ctx.fillText('100% On-Device • Zero Subscriptions • Play Store', 540, 1450);

    // 7. Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '600 22px sans-serif';
    ctx.fillText('Diagnosed with Hair OS PRO • Available on Google Play', 540, 1780);

    // Download trigger
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `HairOS-Profile-Story-${scanResult.hairType}.png`;
      a.click();
      setIsExporting(false);
    }, 200);
  };

  const handleNativeShare = async () => {
    if (!scanResult) return;
    const shareText = `My Hair Profile from Hair OS PRO:\n✨ Health Score: ${scanResult.overallScore}/100\n✨ Pattern: ${scanResult.hairType}\n✨ Scalp: ${scanResult.scalpCondition}\nGet your personalized 30-Day Hair Plan for ₹10!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Hair Profile - Hair OS',
          text: shareText,
          url: 'https://play.google.com/store/apps/details?id=com.hairos.app'
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleDownloadStoryImage();
    }
  };

  // Helper function to draw rounded rectangles on canvas
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-32">
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

        <div className="flex items-center gap-1.5">
          {onOpenReminders && (
            <button
              onClick={onOpenReminders}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 hover:text-white transition-colors"
              aria-label="Smart Reminders"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
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
            className="w-full py-3.5 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 active:scale-95 transition-all"
          >
            <ScanLine className="w-4 h-4 text-slate-950" />
            <span className="text-slate-950">Start 3-Photo AI Scan</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
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

            {/* SHARE STORY CARD & RESCAN BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowStoryModal(true)}
                className="py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Share Story Card</span>
              </button>

              <button
                onClick={onOpenScanModal}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Scan</span>
              </button>
            </div>
          </div>

          {/* QUICK ACTION CARDS */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onNavigateToPlan}
              className="p-4 rounded-2xl bg-slate-900 border border-teal-500/30 text-left space-y-1.5 active:scale-95 transition-all shadow-md group"
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
              className="p-4 rounded-2xl bg-slate-900 border border-teal-500/30 text-left space-y-1.5 active:scale-95 transition-all shadow-md group"
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

      {/* SHAREABLE 9:16 STORY CARD MODAL */}
      {showStoryModal && scanResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-teal-500/40 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
                  Export & Share
                </span>
                <h3 className="text-base font-black text-white">
                  Hair Profile Story Card (9:16)
                </h3>
              </div>
              <button
                onClick={() => setShowStoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 9:16 Visual Card Preview */}
            <div className="aspect-[9/16] w-full max-w-[280px] mx-auto rounded-3xl bg-slate-950 border-2 border-teal-500/40 p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden text-center select-none">
              {/* Card Header */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-black text-teal-400 tracking-wider">
                  HAIR OS PRO
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  ₹10 Lifetime Regimen
                </div>
              </div>

              {/* Health Score Pill */}
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 border-2 border-teal-400 flex flex-col items-center justify-center shadow-lg shadow-teal-500/20">
                <span className="text-2xl font-black text-teal-300 leading-none">
                  {scanResult.overallScore}
                </span>
                <span className="text-[7px] font-black text-teal-400 uppercase mt-0.5">
                  Health
                </span>
              </div>

              {/* Profile Matrix */}
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">
                  MY HAIR PROFILE
                </h4>
                <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[10px] space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pattern:</span>
                    <span className="font-bold text-white">{scanResult.hairType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Texture:</span>
                    <span className="font-bold text-teal-300">{scanResult.texture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scalp:</span>
                    <span className="font-bold text-white">{scanResult.scalpCondition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Focus:</span>
                    <span className="font-bold text-amber-300 capitalize">{scanResult.concerns[0] || 'Care'}</span>
                  </div>
                </div>
              </div>

              {/* 30-Day Plan Badge */}
              <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[9px] text-teal-300 font-semibold">
                📅 30-Day Custom Plan Active
              </div>

              {/* Watermark Footer */}
              <div className="text-[8px] text-slate-500 font-semibold pb-1">
                Available on Google Play • Hair OS AI
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleDownloadStoryImage}
                disabled={isExporting}
                className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span className="text-slate-950">{isExporting ? 'Generating PNG...' : 'Download 9:16 Story Image'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4 text-teal-400" />
                <span>Share via WhatsApp / Instagram</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

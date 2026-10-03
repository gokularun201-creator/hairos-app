import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, ShieldCheck, Droplet, Moon, ShowerHead } from 'lucide-react';

export interface HudNotificationPayload {
  title: string;
  body: string;
  category?: 'morning' | 'midday' | 'night' | 'wash_day' | 'pre_wash_eve' | 'milestone' | 'test' | 'patch_test';
  timestamp?: number;
}

export const NotificationHud: React.FC = () => {
  const [currentNotice, setCurrentNotice] = useState<HudNotificationPayload | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleNotificationEvent = (e: any) => {
      const payload: HudNotificationPayload = e.detail;
      if (!payload) return;

      // Play soft web audio chime
      playSoftChime();

      setCurrentNotice(payload);
      setIsVisible(true);

      // Auto-hide after 5.5s
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5500);

      return () => clearTimeout(timer);
    };

    window.addEventListener('hair_os_notification_event', handleNotificationEvent);
    return () => {
      window.removeEventListener('hair_os_notification_event', handleNotificationEvent);
    };
  }, []);

  const playSoftChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {}
  };

  if (!currentNotice || !isVisible) return null;

  const getCategoryIcon = () => {
    switch (currentNotice.category) {
      case 'morning':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'midday':
        return <Droplet className="w-4 h-4 text-sky-400" />;
      case 'night':
        return <Moon className="w-4 h-4 text-purple-400" />;
      case 'wash_day':
      case 'pre_wash_eve':
        return <ShowerHead className="w-4 h-4 text-teal-400" />;
      case 'patch_test':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-teal-400 animate-pulse" />;
    }
  };

  return (
    <div
      style={{ zIndex: 99999 }}
      className="fixed top-3 left-4 right-4 max-w-sm mx-auto animate-in slide-in-from-top-6 duration-300 pointer-events-auto"
    >
      <div 
        onClick={() => setIsVisible(false)}
        className="cursor-pointer bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 rounded-2xl p-3.5 shadow-2xl shadow-teal-950/50 flex items-start space-x-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-slate-800 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
          {getCategoryIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Hair OS • Now
            </span>
            <span className="text-[9px] text-slate-400">Tap to dismiss</span>
          </div>

          <h4 className="text-xs font-bold text-white leading-tight mt-0.5 truncate">
            {currentNotice.title}
          </h4>

          <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
            {currentNotice.body}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  Clock, 
  ShowerHead, 
  ShieldCheck, 
  Moon, 
  Droplet, 
  Camera, 
  X, 
  Volume2, 
  Vibrate, 
  FlaskConical, 
  Check, 
  AlertCircle,
  Play
} from 'lucide-react';
import { ReminderSettings, NotificationPersona, UserProfile, PlanDay } from '../types';
import { NativeService } from '../services/native';
import { NotificationContentGenerator } from '../services/notificationContentGenerator';

interface SmartReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: ReminderSettings;
  profile: UserProfile;
  currentPlanDay?: PlanDay;
  onSaveReminders: (updated: ReminderSettings) => Promise<void>;
}

export const SmartReminderModal: React.FC<SmartReminderModalProps> = ({
  isOpen,
  onClose,
  reminders,
  profile,
  currentPlanDay,
  onSaveReminders
}) => {
  // Master switch
  const [enabled, setEnabled] = useState(reminders.enabled ?? false);
  const [persona, setPersona] = useState<NotificationPersona>(reminders.persona || 'clinical');
  const [vibration, setVibration] = useState(reminders.vibration !== false);
  const [sound, setSound] = useState(reminders.sound !== false);

  // Channels
  const [morningEnabled, setMorningEnabled] = useState(reminders.morningEnabled !== false);
  const [morningTime, setMorningTime] = useState(reminders.morningTime || '08:00');

  const [afternoonEnabled, setAfternoonEnabled] = useState(reminders.afternoonEnabled !== false);
  const [afternoonTime, setAfternoonTime] = useState(reminders.afternoonTime || '13:00');

  const [nightEnabled, setNightEnabled] = useState(reminders.nightEnabled !== false);
  const [nightTime, setNightTime] = useState(reminders.nightTime || '21:00');

  // Wash schedule
  const [washDayEnabled, setWashDayEnabled] = useState(reminders.washDayEnabled !== false);
  const [washDays, setWashDays] = useState<number[]>(reminders.washDays || [1, 4]);
  const [washTime, setWashTime] = useState(reminders.washTime || '07:30');
  const [preWashEveEnabled, setPreWashEveEnabled] = useState(reminders.preWashEveEnabled !== false);

  // Milestone photo
  const [milestonePhotoEnabled, setMilestonePhotoEnabled] = useState(reminders.milestonePhotoEnabled !== false);

  // 24h Patch Test
  const [patchProductName, setPatchProductName] = useState('');
  const [patchAlertAt, setPatchAlertAt] = useState<number | null>(reminders.patchTestAlertAt || null);
  const [patchActiveName, setPatchActiveName] = useState<string | null>(reminders.patchTestProductName || null);

  // Status & Feedback
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkPermission();
    }
  }, [isOpen]);

  const checkPermission = async () => {
    const status = await NativeService.checkNotificationPermission();
    setPermissionStatus(status);
  };

  const handleRequestPermission = async () => {
    const granted = await NativeService.requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      setEnabled(true);
      setFeedbackMsg('Notification permission granted! ✅');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      setFeedbackMsg('Permission not granted. Please enable in Android Settings.');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleSendTestNotification = async () => {
    setIsTesting(true);
    setFeedbackMsg('Dispatching live test alert with haptics...');

    await NativeService.sendInstantTestNotification({
      persona,
      hairType: profile.hairType,
      scalpType: profile.scalpType,
      planDayNumber: currentPlanDay?.dayNumber || 1,
      planDayTitle: currentPlanDay?.title
    });

    setTimeout(() => {
      setIsTesting(false);
      setFeedbackMsg('✨ Live test alert fired! Check your screen top & status bar.');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }, 400);
  };

  const handleToggleWashDay = (day: number) => {
    if (washDays.includes(day)) {
      if (washDays.length === 1) {
        setFeedbackMsg('Keep at least 1 wash day, or disable Wash Day alarms.');
        setTimeout(() => setFeedbackMsg(null), 2500);
        return;
      }
      setWashDays(washDays.filter(d => d !== day));
    } else {
      setWashDays([...washDays, day].sort());
    }
  };

  const handleStartPatchTest = async () => {
    const name = patchProductName.trim() || 'New Hair Care Formula';
    const alertTime = await NativeService.schedulePatchTestReminder(name, 24);
    setPatchAlertAt(alertTime);
    setPatchActiveName(name);
    setPatchProductName('');
    setFeedbackMsg(`⏱️ 24h Patch Test Timer started for "${name}"!`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleCancelPatchTest = () => {
    setPatchAlertAt(null);
    setPatchActiveName(null);
    setFeedbackMsg('Patch test timer cleared.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleSave = async () => {
    const updated: ReminderSettings = {
      ...reminders,
      enabled,
      persona,
      vibration,
      sound,
      morningEnabled,
      morningTime,
      afternoonEnabled,
      afternoonTime,
      nightEnabled,
      nightTime,
      washDayEnabled,
      washDays,
      washTime,
      preWashEveEnabled,
      milestonePhotoEnabled,
      patchTestAlertAt: patchAlertAt,
      patchTestProductName: patchActiveName,
      // Legacy fields
      eveningTime: nightTime,
      showerDayReminder: washDayEnabled
    };

    await onSaveReminders(updated);

    // Schedule on device
    await NativeService.scheduleAllSmartReminders(updated, {
      hairType: profile.hairType,
      scalpType: profile.scalpType,
      planDayNumber: currentPlanDay?.dayNumber || 1,
      planDayTitle: currentPlanDay?.title
    });

    setFeedbackMsg('Smart Alarms & Notifications synchronized!');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  const dayNames = [
    { day: 0, label: 'Sun' },
    { day: 1, label: 'Mon' },
    { day: 2, label: 'Tue' },
    { day: 3, label: 'Wed' },
    { day: 4, label: 'Thu' },
    { day: 5, label: 'Fri' },
    { day: 6, label: 'Sat' }
  ];

  // Sample preview of the selected persona
  const sampleNotice = NotificationContentGenerator.generate('morning', {
    persona,
    hairType: profile.hairType || 'wavy',
    scalpType: profile.scalpType || 'normal',
    planDayNumber: currentPlanDay?.dayNumber || 1,
    planDayTitle: currentPlanDay?.title || 'Follicle Boost'
  });

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex items-center justify-center p-3.5 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-4.5 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">
                Smart Reminder Hub
              </h3>
              <p className="text-[11px] text-teal-400 font-medium">
                Personalized Follicle & Routine Alarms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Master Switch & Device Permission Row */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-white block">
                Master Hair Care Reminders
              </span>
              <span className="text-[10px] text-slate-400">
                {enabled ? 'Active • Daily schedule synchronized' : 'Paused • No alerts will sound'}
              </span>
            </div>

            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                enabled ? 'bg-teal-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle master reminders"
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  enabled ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Android Permission Status & Live Test Button */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-slate-400">Device Status:</span>
              {permissionStatus === 'granted' ? (
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                  Ready ✅
                </span>
              ) : (
                <button
                  onClick={handleRequestPermission}
                  className="text-[10px] font-bold text-amber-400 underline hover:text-amber-300"
                >
                  Enable Permission ⚠️
                </button>
              )}
            </div>

            <button
              onClick={handleSendTestNotification}
              disabled={isTesting}
              className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-[10px] font-bold flex items-center space-x-1 active:scale-95 transition-transform"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isTesting ? 'Sending...' : 'Test Now'}</span>
            </button>
          </div>
        </div>

        {/* Notification Persona Style */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Notification Persona Tone
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setPersona('clinical')}
              className={`p-2 rounded-xl border text-center transition-all ${
                persona === 'clinical'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-base mb-0.5">🔬</div>
              <div className="text-[10px] font-extrabold leading-tight">Clinical</div>
              <div className="text-[8px] text-slate-400 mt-0.5">Dermatology</div>
            </button>

            <button
              type="button"
              onClick={() => setPersona('gentle')}
              className={`p-2 rounded-xl border text-center transition-all ${
                persona === 'gentle'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-base mb-0.5">🌿</div>
              <div className="text-[10px] font-extrabold leading-tight">Gentle</div>
              <div className="text-[8px] text-slate-400 mt-0.5">Mindfulness</div>
            </button>

            <button
              type="button"
              onClick={() => setPersona('coach')}
              className={`p-2 rounded-xl border text-center transition-all ${
                persona === 'coach'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-base mb-0.5">🔥</div>
              <div className="text-[10px] font-extrabold leading-tight">Coach</div>
              <div className="text-[8px] text-slate-400 mt-0.5">Consistency</div>
            </button>
          </div>

          {/* Live Persona Preview Pill */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-[10px] text-slate-300">
            <span className="font-bold text-teal-400 block mb-0.5">
              Live Preview:
            </span>
            <span className="font-bold text-white block">{sampleNotice.title}</span>
            <span className="text-slate-400 mt-0.5 block leading-snug line-clamp-2">
              "{sampleNotice.body}"
            </span>
          </div>
        </div>

        {/* 5 Specialized Hair Care Channels */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Routine Channels & Alarms
          </label>

          {/* 1. Morning Routine */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-white">☀️ Morning Care & Water</span>
              </div>
              <input
                type="checkbox"
                checked={morningEnabled}
                onChange={(e) => setMorningEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 accent-teal-500"
              />
            </div>
            {morningEnabled && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Time:</span>
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-teal-300 focus:outline-none focus:border-teal-400"
                />
              </div>
            )}
          </div>

          {/* 2. Midday Hydration */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplet className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs font-bold text-white">🌤️ Midday Follicle Hydration</span>
              </div>
              <input
                type="checkbox"
                checked={afternoonEnabled}
                onChange={(e) => setAfternoonEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 accent-teal-500"
              />
            </div>
            {afternoonEnabled && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Time:</span>
                <input
                  type="time"
                  value={afternoonTime}
                  onChange={(e) => setAfternoonTime(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-teal-300 focus:outline-none focus:border-teal-400"
                />
              </div>
            )}
          </div>

          {/* 3. Night Silk Bonnet & Scalp Release */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-white">🌙 Night Protection & Silk Bonnet</span>
              </div>
              <input
                type="checkbox"
                checked={nightEnabled}
                onChange={(e) => setNightEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 accent-teal-500"
              />
            </div>
            {nightEnabled && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Time:</span>
                <input
                  type="time"
                  value={nightTime}
                  onChange={(e) => setNightTime(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-teal-300 focus:outline-none focus:border-teal-400"
                />
              </div>
            )}
          </div>

          {/* 4. Wash Day Smart Alarms (Morning + Pre-Poo Eve) */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShowerHead className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-bold text-white">🚿 Scheduled Wash Day Alarms</span>
              </div>
              <input
                type="checkbox"
                checked={washDayEnabled}
                onChange={(e) => setWashDayEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 accent-teal-500"
              />
            </div>

            {washDayEnabled && (
              <div className="space-y-2 pt-1 border-t border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Wash Days:</span>
                  <div className="flex justify-between gap-1">
                    {dayNames.map(({ day, label }) => {
                      const isSelected = washDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleToggleWashDay(day)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                            isSelected
                              ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                              : 'bg-slate-900 border border-slate-800 text-slate-400'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Morning Wash Alarm:</span>
                  <input
                    type="time"
                    value={washTime}
                    onChange={(e) => setWashTime(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-teal-300 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-200 block">
                      ✨ Night-Before Pre-Poo Prep Alert
                    </span>
                    <span className="text-[9px] text-slate-400">
                      Alerts at 8:30 PM the evening before wash day
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preWashEveEnabled}
                    onChange={(e) => setPreWashEveEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 accent-teal-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Weekly Photo Milestone */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  📸 7-Day Milestone Photo Reminder
                </span>
                <span className="text-[9px] text-slate-400">
                  Weekly prompt for side-by-side wipe slider
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={milestonePhotoEnabled}
              onChange={(e) => setMilestonePhotoEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 accent-teal-500"
            />
          </div>

          {/* 6. 24-Hour Product Patch Test Safety Timer */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-white">
                🧴 24h Product Patch Test Timer
              </span>
            </div>

            {patchAlertAt && patchAlertAt > Date.now() ? (
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-300 block">
                    Active: {patchActiveName || 'Product'}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    Fires in {Math.round((patchAlertAt - Date.now()) / (3600 * 1000))} hours
                  </span>
                </div>
                <button
                  onClick={handleCancelPatchTest}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-300 text-[10px] font-bold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 pt-1">
                <input
                  type="text"
                  placeholder="e.g. Minimalist Maleic Bond Serum"
                  value={patchProductName}
                  onChange={(e) => setPatchProductName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                />
                <button
                  type="button"
                  onClick={handleStartPatchTest}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold active:scale-95 transition-transform"
                >
                  Start 24h
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Haptics & Sound Settings */}
        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <Vibrate className="w-3.5 h-3.5 text-teal-400" />
            <span>Haptic Vibration Feedback</span>
          </div>
          <input
            type="checkbox"
            checked={vibration}
            onChange={(e) => setVibration(e.target.checked)}
            className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 accent-teal-500"
          />
        </div>

        {/* Save CTA */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save & Synchronize Alarms</span>
          </button>
        </div>

      </div>
    </div>
  );
};

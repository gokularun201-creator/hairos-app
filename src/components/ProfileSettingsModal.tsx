import React, { useState, useEffect } from 'react';
import { UserProfile, ReminderSettings, ScalpType, HairGoal, HairType } from '../types';
import { NativeService } from '../services/native';
import { 
  X, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Bell, 
  Check, 
  AlertTriangle,
  Info,
  Sparkles,
  Lock,
  Utensils,
  ChevronRight
} from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  reminders: ReminderSettings;
  onSaveProfile: (profile: UserProfile) => void;
  onSaveReminders: (reminders: ReminderSettings) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onClearAllData: () => void;
  onOpenFoodWaterSettings?: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  reminders,
  onSaveProfile,
  onSaveReminders,
  onExportData,
  onImportData,
  onClearAllData,
  onOpenFoodWaterSettings
}) => {
  const [name, setName] = useState(profile.name || '');
  const [scalpType, setScalpType] = useState<ScalpType>(profile.scalpType || 'normal');
  const [hairGoal, setHairGoal] = useState<HairGoal>(profile.hairGoal || 'gentle_maintenance');
  const [hairType, setHairType] = useState<HairType>(profile.hairType || 'wavy');

  // Reminders state
  const [notifEnabled, setNotifEnabled] = useState(reminders.enabled);
  const [morningTime, setMorningTime] = useState(reminders.morningTime || '08:30');
  const [eveningTime, setEveningTime] = useState(reminders.eveningTime || '20:30');

  // Deletion confirm dialog
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Synchronize local form fields whenever modal opens or saved profile/reminders update
  useEffect(() => {
    if (isOpen) {
      setName(profile.name || '');
      setScalpType(profile.scalpType || 'normal');
      setHairGoal(profile.hairGoal || 'gentle_maintenance');
      setHairType(profile.hairType || 'wavy');
      setNotifEnabled(reminders.enabled);
      setMorningTime(reminders.morningTime || '08:30');
      setEveningTime(reminders.eveningTime || '20:30');
    }
  }, [isOpen, profile, reminders]);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    const goalLabels: Record<HairGoal, string> = {
      gentle_maintenance: 'Gentle Maintenance & Consistency',
      shedding_care: 'Shedding Care & Scalp Awareness',
      dryness_hydration: 'Dryness & Scalp Hydration',
      length_retention: 'Length Retention & Strength'
    };

    onSaveProfile({
      ...profile,
      name: name.trim(),
      scalpType,
      hairGoal,
      hairType,
      primaryFocus: goalLabels[hairGoal] || profile.primaryFocus
    });
    setStatusMessage('Preferences updated successfully!');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleToggleReminders = async (enabled: boolean) => {
    setNotifEnabled(enabled);
    if (enabled) {
      const granted = await NativeService.requestNotificationPermission();
      if (!granted) {
        setStatusMessage('Notification permission not granted. You can allow alerts in phone settings.');
        setNotifEnabled(false);
        return;
      }
    }
    const updated: ReminderSettings = {
      enabled,
      morningTime,
      eveningTime,
      showerDayReminder: true
    };
    onSaveReminders(updated);
    await NativeService.scheduleReminders(enabled, morningTime, eveningTime);
    setStatusMessage(enabled ? 'Reminders scheduled successfully!' : 'Reminders turned off.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleTimeChange = async () => {
    const updated: ReminderSettings = {
      enabled: notifEnabled,
      morningTime,
      eveningTime,
      showerDayReminder: true
    };
    onSaveReminders(updated);
    if (notifEnabled) {
      await NativeService.scheduleReminders(true, morningTime, eveningTime);
    }
    setStatusMessage('Reminder times updated!');
    setTimeout(() => setStatusMessage(null), 2000);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportData(text);
        setStatusMessage('Data imported successfully!');
        setTimeout(() => setStatusMessage(null), 2500);
      } catch (err: any) {
        setStatusMessage(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const scalpOptions: { type: ScalpType; label: string }[] = [
    { type: 'normal', label: 'Balanced' },
    { type: 'oily', label: 'Oily' },
    { type: 'dry', label: 'Dry' },
    { type: 'sensitive', label: 'Sensitive' },
    { type: 'combination', label: 'Combination' }
  ];

  const goalOptions: { goal: HairGoal; label: string }[] = [
    { goal: 'gentle_maintenance', label: 'Gentle Maintenance' },
    { goal: 'shedding_care', label: 'Shedding Care' },
    { goal: 'dryness_hydration', label: 'Dryness & Hydration' },
    { goal: 'length_retention', label: 'Length Retention' }
  ];

  const hairTypeOptions: { type: HairType; label: string }[] = [
    { type: 'straight', label: 'Straight' },
    { type: 'wavy', label: 'Wavy' },
    { type: 'curly', label: 'Curly' },
    { type: 'coily', label: 'Coily' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-5 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Settings & Privacy</h3>
            <p className="text-xs text-slate-400">Preferences and on-device storage</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center space-x-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* SECTION 1: PROFILE & CARE PREFERENCES */}
        <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Care Preferences</h4>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Your Name / Nickname</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Primary Focus</label>
            <div className="grid grid-cols-2 gap-1.5">
              {goalOptions.map((opt) => (
                <button
                  key={opt.goal}
                  type="button"
                  onClick={() => setHairGoal(opt.goal)}
                  className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-colors ${
                    hairGoal === opt.goal
                      ? 'bg-teal-500/15 border-teal-500/50 text-teal-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Hair Type</label>
              <select
                value={hairType}
                onChange={(e) => setHairType(e.target.value as HairType)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
              >
                {hairTypeOptions.map((opt) => (
                  <option key={opt.type} value={opt.type}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Scalp Tendency</label>
              <select
                value={scalpType}
                onChange={(e) => setScalpType(e.target.value as ScalpType)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
              >
                {scalpOptions.map((opt) => (
                  <option key={opt.type} value={opt.type}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition-transform"
          >
            Save Preferences
          </button>

          {onOpenFoodWaterSettings && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFoodWaterSettings();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-teal-300 flex items-center justify-between active:scale-95 transition-transform"
            >
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-teal-400" />
                <span>Food, Water & Wash Schedule</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* SECTION 2: GENTLE REMINDERS */}
        <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-teal-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Routine Reminders</h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifEnabled}
                onChange={(e) => handleToggleReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          <p className="text-[11px] text-slate-400">
            Gentle reminders without guilt or streak pressure. Turn off anytime.
          </p>

          {notifEnabled && (
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Morning Routine</label>
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => {
                    setMorningTime(e.target.value);
                    setTimeout(handleTimeChange, 100);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Evening Routine</label>
                <input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => {
                    setEveningTime(e.target.value);
                    setTimeout(handleTimeChange, 100);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: LOCAL DEVICE PRIVACY & DATA OWNERSHIP */}
        <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Device Privacy Center</h4>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            HAIR OS operates 100% server-free. All profile data, habits, scalp checks, and photos stay on this phone. Automatic cloud backup is disabled so data is never uploaded to remote servers or unexpectedly restored after uninstalling.
          </p>

          {/* Export / Import Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onExportData();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Export All Data (JSON)</span>
            </button>

            <label className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition-transform">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Import Data from File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          {/* Destructive Clear */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Local Data</span>
            </button>
          </div>
        </div>

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-5 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h4 className="text-base font-extrabold text-white">Permanently Clear Data?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will delete all routines, scalp logs, and photos from this device. This cannot be undone unless you have exported a backup.
              </p>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClearAllData();
                    setShowClearConfirm(false);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs"
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-1">
          <span className="text-[10px] text-slate-500 font-mono">HAIR OS v2.3.0 (Build 5) · Server-Free Care Journal</span>
        </div>
      </div>
    </div>
  );
};

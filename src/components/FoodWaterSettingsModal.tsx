import React, { useState } from 'react';
import { DailyFoodWaterConfig } from '../types';
import { 
  X, 
  Droplets, 
  Utensils, 
  Calendar, 
  Bell, 
  ShowerHead,
  Sparkles,
  Camera,
  Info,
  Check
} from 'lucide-react';

interface FoodWaterSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DailyFoodWaterConfig;
  onSaveConfig: (newConfig: DailyFoodWaterConfig) => void;
}

export const FoodWaterSettingsModal: React.FC<FoodWaterSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  // Morning settings
  const [morningWaterGoal, setMorningWaterGoal] = useState(
    config.morningWaterGoal || 'Drink water toward daily goal (e.g. 2 glasses)'
  );
  const [morningFoodSuggestion, setMorningFoodSuggestion] = useState(
    config.morningFoodSuggestion || 'Eat breakfast with a protein option (e.g. eggs, curd, dal, or beans)'
  );
  const [morningTime, setMorningTime] = useState(config.morningReminderTime || '08:00');

  // Afternoon settings
  const [afternoonWaterGoal, setAfternoonWaterGoal] = useState(
    config.afternoonWaterGoal || 'Drink water (e.g. 2-3 glasses)'
  );
  const [afternoonFoodSuggestion, setAfternoonFoodSuggestion] = useState(
    config.afternoonFoodSuggestion || 'Eat lunch'
  );
  const [afternoonTime, setAfternoonTime] = useState(config.afternoonReminderTime || '13:00');

  // Night settings
  const [nightWaterGoal, setNightWaterGoal] = useState(
    config.nightWaterGoal || 'Drink water if wanted (no set amount required before bed)'
  );
  const [nightFoodSuggestion, setNightFoodSuggestion] = useState(
    config.nightFoodSuggestion || 'Eat dinner'
  );
  const [nightTime, setNightTime] = useState(config.nightReminderTime || '20:30');

  // Wash schedule
  const [washEnabled, setWashEnabled] = useState(config.washEnabled ?? true);
  const [washDays, setWashDays] = useState<number[]>(config.washDays || [1, 4]);
  const [washTime, setWashTime] = useState(config.washReminderTime || '08:00');
  const [washPostCareTip, setWashPostCareTip] = useState(
    config.washPostCareTip || 'After washing: Apply conditioner to mid-lengths and ends, and pat dry gently with a soft towel (avoid harsh rubbing).'
  );

  // Daily detangle tip & monthly photo
  const [dailyDetangleEnabled, setDailyDetangleEnabled] = useState(config.dailyDetangleEnabled ?? true);
  const [dailyDetangleTip, setDailyDetangleTip] = useState(
    config.dailyDetangleTip || 'Detangle gently starting at ends; avoid tight hairstyles that pull.'
  );
  const [monthlyPhotoPromptEnabled, setMonthlyPhotoPromptEnabled] = useState(config.monthlyPhotoPromptEnabled ?? true);

  // Reminders
  const [remindersEnabled, setRemindersEnabled] = useState(config.remindersEnabled ?? false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  const handleToggleWashDay = (day: number) => {
    if (washDays.includes(day)) {
      if (washDays.length === 1) {
        setStatusMessage('Select at least one wash day, or turn off Hair Wash below.');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
      setWashDays(washDays.filter((d) => d !== day));
    } else {
      setWashDays([...washDays, day].sort());
    }
  };

  const handleSave = () => {
    const updated: DailyFoodWaterConfig = {
      ...config,
      morningWaterGoal: morningWaterGoal.trim() || 'Drink water toward daily goal',
      morningFoodSuggestion: morningFoodSuggestion.trim() || 'Eat breakfast with protein',
      afternoonWaterGoal: afternoonWaterGoal.trim() || 'Drink water',
      afternoonFoodSuggestion: afternoonFoodSuggestion.trim() || 'Eat lunch',
      nightWaterGoal: nightWaterGoal.trim() || 'Drink water if wanted',
      nightFoodSuggestion: nightFoodSuggestion.trim() || 'Eat dinner',
      washEnabled,
      washDays,
      washPostCareTip: washPostCareTip.trim(),
      dailyDetangleEnabled,
      dailyDetangleTip: dailyDetangleTip.trim(),
      monthlyPhotoPromptEnabled,
      remindersEnabled,
      morningReminderTime: morningTime,
      afternoonReminderTime: afternoonTime,
      nightReminderTime: nightTime,
      washReminderTime: washTime
    };

    onSaveConfig(updated);
    onClose();
  };

  return (
    <div 
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Checklist & Routine Settings</h3>
            <p className="text-xs text-slate-400">Personalize suggestions, goals, and timing</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-3 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs flex items-center space-x-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* MEDICAL & GROWTH DISCLAIMER */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1 text-slate-400">
          <div className="flex items-center space-x-1.5 font-bold text-teal-400 text-[11px]">
            <Droplets className="w-3.5 h-3.5" />
            <span>Honest Health & Fluid Guidance:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Fluid needs vary by person and climate. If you have medical fluid restrictions from a physician, always follow your doctor’s instructions. Balanced foods, hydration, and washing support general wellness and hygiene, but do not guarantee hair growth.
          </p>
        </div>

        {/* SECTION 1: MORNING SUGGESTIONS & TIMING */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-teal-400 font-bold text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-sm">☀️</span>
              <span>Morning Routine Settings</span>
            </div>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Morning Water Goal</label>
            <input
              type="text"
              value={morningWaterGoal}
              onChange={(e) => setMorningWaterGoal(e.target.value)}
              placeholder="e.g. Drink water toward daily goal (2 glasses)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Morning Breakfast Suggestion</label>
            <input
              type="text"
              value={morningFoodSuggestion}
              onChange={(e) => setMorningFoodSuggestion(e.target.value)}
              placeholder="e.g. Eat breakfast with protein (eggs, curd, dal, beans)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* SECTION 2: AFTERNOON SUGGESTIONS & TIMING */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🌤️</span>
              <span>Afternoon Routine Settings</span>
            </div>
            <input
              type="time"
              value={afternoonTime}
              onChange={(e) => setAfternoonTime(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Afternoon Water Goal</label>
            <input
              type="text"
              value={afternoonWaterGoal}
              onChange={(e) => setAfternoonWaterGoal(e.target.value)}
              placeholder="e.g. Drink water (2-3 glasses)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Afternoon Lunch Suggestion</label>
            <input
              type="text"
              value={afternoonFoodSuggestion}
              onChange={(e) => setAfternoonFoodSuggestion(e.target.value)}
              placeholder="e.g. Eat lunch"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* SECTION 3: NIGHT SUGGESTIONS & TIMING */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-indigo-400 font-bold text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🌙</span>
              <span>Night Routine Settings</span>
            </div>
            <input
              type="time"
              value={nightTime}
              onChange={(e) => setNightTime(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Night Water (Optional)</label>
            <input
              type="text"
              value={nightWaterGoal}
              onChange={(e) => setNightWaterGoal(e.target.value)}
              placeholder="e.g. Drink water if wanted (no pressure before bed)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Night Dinner Suggestion</label>
            <input
              type="text"
              value={nightFoodSuggestion}
              onChange={(e) => setNightFoodSuggestion(e.target.value)}
              placeholder="e.g. Eat dinner"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* SECTION 4: SCHEDULED HAIR-WASH HABIT */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <ShowerHead className="w-4 h-4" />
              <span>Hair-Wash Schedule</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={washEnabled}
                onChange={(e) => setWashEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hair wash appears in your <strong>Morning routine</strong> only on your chosen days (default: <strong>Monday & Thursday</strong>). It reminds and tracks only on those days.
          </p>

          {washEnabled && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Scheduled Wash Days</label>
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map(({ day, label }) => {
                    const isSelected = washDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleWashDay(day)}
                        className={`py-2 rounded-lg text-center text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-teal-500 text-slate-950'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Wash Day Morning Reminder</label>
                <input
                  type="time"
                  value={washTime}
                  onChange={(e) => setWashTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">After-Wash Care Suggestion</label>
                <textarea
                  rows={2}
                  value={washPostCareTip}
                  onChange={(e) => setWashPostCareTip(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
                💡 <em>Note:</em> Monday and Thursday are your chosen schedule, not an inflexible medical rule. Wash frequency should always align with your individual sebum level and comfort.
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: DAILY GENTLE DETANGLING & MONTHLY PHOTO */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-200 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Daily Gentle Detangling Tip</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dailyDetangleEnabled}
                onChange={(e) => setDailyDetangleEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          {dailyDetangleEnabled && (
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Daily Detangling Guidance</label>
              <input
                type="text"
                value={dailyDetangleTip}
                onChange={(e) => setDailyDetangleTip(e.target.value)}
                placeholder="e.g. Detangle gently starting at ends; avoid hairstyles that pull."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-200 font-bold text-xs">
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>Monthly Progress Photo Reminder</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={monthlyPhotoPromptEnabled}
                onChange={(e) => setMonthlyPhotoPromptEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
        </div>

        {/* SECTION 6: QUIET NOTIFICATIONS */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-200 font-bold text-xs">
              <Bell className="w-4 h-4 text-teal-400" />
              <span>Quiet Routine Reminders</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Reminders are scheduled purely on your phone and designed to be quiet (single alert, no repeated buzzing). Notifications <strong>never tick or complete an item automatically</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

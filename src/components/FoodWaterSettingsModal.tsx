import React, { useState } from 'react';
import { DailyFoodWaterConfig } from '../types';
import { 
  X, 
  Droplets, 
  Utensils, 
  Calendar, 
  Bell, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Check, 
  Info,
  ShowerHead
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
  const [morningWater, setMorningWater] = useState(config.morningWaterGlasses);
  const [morningFood, setMorningFood] = useState(config.morningFood);
  const [afternoonWater, setAfternoonWater] = useState(config.afternoonWaterGlasses);
  const [afternoonFood, setAfternoonFood] = useState(config.afternoonFood);
  const [nightWater, setNightWater] = useState(config.nightWaterGlasses);
  const [nightFoodOptions, setNightFoodOptions] = useState<string[]>(config.nightFoodOptions);
  const [newNightFood, setNewNightFood] = useState('');

  // Wash schedule
  const [washEnabled, setWashEnabled] = useState(config.washEnabled);
  const [washDays, setWashDays] = useState<number[]>(config.washDays);

  // Reminder times
  const [remindersEnabled, setRemindersEnabled] = useState(config.remindersEnabled);
  const [morningTime, setMorningTime] = useState(config.morningReminderTime);
  const [afternoonTime, setAfternoonTime] = useState(config.afternoonReminderTime);
  const [nightTime, setNightTime] = useState(config.nightReminderTime);
  const [washTime, setWashTime] = useState(config.washReminderTime);

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

  const handleAddNightFood = () => {
    if (!newNightFood.trim()) return;
    setNightFoodOptions([...nightFoodOptions, newNightFood.trim()]);
    setNewNightFood('');
  };

  const handleRemoveNightFood = (index: number) => {
    if (nightFoodOptions.length <= 1) {
      setStatusMessage('Keep at least one night food option.');
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }
    setNightFoodOptions(nightFoodOptions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updated: DailyFoodWaterConfig = {
      morningWaterGlasses: Math.max(1, morningWater),
      morningFood: morningFood.trim() || '2 eggs',
      afternoonWaterGlasses: Math.max(1, afternoonWater),
      afternoonFood: afternoonFood.trim() || 'Lunch',
      nightWaterGlasses: Math.max(1, nightWater),
      nightFoodOptions: nightFoodOptions.length > 0 ? nightFoodOptions : ['2 eggs', '10 almonds', 'A normal serving of fish'],
      washEnabled,
      washDays,
      morningReminderTime: morningTime,
      afternoonReminderTime: afternoonTime,
      nightReminderTime: nightTime,
      washReminderTime: washTime,
      remindersEnabled
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
            <h3 className="text-base font-extrabold text-white">Food, Water & Wash Schedule</h3>
            <p className="text-xs text-slate-400">Personalize your daily routine and timing</p>
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

        {/* MEDICAL & FLUID INTAKE DISCLAIMER */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1 text-slate-400">
          <div className="flex items-center space-x-1.5 font-bold text-teal-400 text-[11px]">
            <Droplets className="w-3.5 h-3.5" />
            <span>Fluid & Nutrition Note:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Fluid needs vary by individual, body size, activity level, and climate. Some individuals have a doctor-ordered fluid limit. Adjust your targets to your medical needs. Specific foods and extra water support overall bodily wellness but do not guarantee hair regrowth.
          </p>
        </div>

        {/* SECTION 1: MORNING FOOD & WATER */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
            <span className="text-sm">☀️</span>
            <span>Morning Routine Settings</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Water Goal</label>
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={morningWater}
                  onChange={(e) => setMorningWater(parseInt(e.target.value) || 1)}
                  className="w-12 bg-transparent text-sm font-bold text-white focus:outline-none"
                />
                <span className="text-xs text-slate-400">glasses</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Reminder</label>
              <input
                type="time"
                value={morningTime}
                onChange={(e) => setMorningTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Morning Food Choice</label>
            <input
              type="text"
              value={morningFood}
              onChange={(e) => setMorningFood(e.target.value)}
              placeholder="e.g. 2 eggs, oatmeal, or protein shake"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* SECTION 2: AFTERNOON FOOD & WATER */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <span className="text-sm">🌤️</span>
            <span>Afternoon Routine Settings</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Water Goal</label>
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={afternoonWater}
                  onChange={(e) => setAfternoonWater(parseInt(e.target.value) || 1)}
                  className="w-12 bg-transparent text-sm font-bold text-white focus:outline-none"
                />
                <span className="text-xs text-slate-400">glasses</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Reminder</label>
              <input
                type="time"
                value={afternoonTime}
                onChange={(e) => setAfternoonTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">Afternoon Food Choice</label>
            <input
              type="text"
              value={afternoonFood}
              onChange={(e) => setAfternoonFood(e.target.value)}
              placeholder="e.g. Lunch (balanced plate)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* SECTION 3: NIGHT FOOD OPTIONS & WATER */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
            <span className="text-sm">🌙</span>
            <span>Night Routine Settings</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Water Goal</label>
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={nightWater}
                  onChange={(e) => setNightWater(parseInt(e.target.value) || 1)}
                  className="w-12 bg-transparent text-sm font-bold text-white focus:outline-none"
                />
                <span className="text-xs text-slate-400">glasses</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Reminder</label>
              <input
                type="time"
                value={nightTime}
                onChange={(e) => setNightTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Night Food Options List */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 block">Night Food Choices (Selectable)</label>
            <div className="space-y-1.5">
              {nightFoodOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <span className="text-slate-200 truncate pr-2">{opt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNightFood(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 pt-1">
              <input
                type="text"
                value={newNightFood}
                onChange={(e) => setNewNightFood(e.target.value)}
                placeholder="Add custom option (e.g. Greek yogurt)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
              />
              <button
                type="button"
                onClick={handleAddNightFood}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: SCHEDULED HAIR-WASH HABIT */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
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
            Hair wash is added to your <strong>Morning routine</strong> only on your chosen days (default: <strong>Monday & Thursday</strong>). It appears on the Home and Routine tabs and reminds only on those days.
          </p>

          {washEnabled && (
            <div className="space-y-2 pt-1">
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

              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
                💡 <em>Note:</em> Monday and Thursday are your chosen schedule, not an inflexible medical rule. Wash frequency should always align with your individual sebum level and comfort.
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: NOTIFICATION TOGGLE & BEHAVIOR NOTE */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-200 font-bold text-xs">
              <Bell className="w-4 h-4 text-teal-400" />
              <span>Routine & Wash Reminders</span>
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

          <p className="text-[11px] text-slate-400">
            Reminders are scheduled purely on your phone. Notifications <strong>never tick or complete an item automatically</strong>.
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
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PlanDay, HairScanResult } from '../types';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Camera, 
  Utensils, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  Droplets, 
  ShowerHead, 
  Moon, 
  Activity, 
  ShieldCheck, 
  Flame,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ThirtyDayPlanScreenProps {
  plan: PlanDay[];
  scanResult: HairScanResult | null;
  onToggleHabit: (dayNumber: number, habitId: string) => void;
  onOpenScanModal: () => void;
  onOpenPhotoCapture: () => void;
  onOpenProductChecker?: () => void;
}

export const ThirtyDayPlanScreen: React.FC<ThirtyDayPlanScreenProps> = ({
  plan,
  scanResult,
  onToggleHabit,
  onOpenScanModal,
  onOpenPhotoCapture,
  onOpenProductChecker
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');

  // Calculate overall stats
  const totalHabits = plan.reduce((acc, d) => acc + d.habits.length, 0);
  const completedHabits = plan.reduce(
    (acc, d) => acc + d.habits.filter((h) => h.completed).length,
    0
  );
  const overallPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Selected Day Data
  const currentDay = plan.find((d) => d.dayNumber === selectedDayNumber) || plan[0];

  // Filtered days for the list/carousel
  const displayedDays = selectedWeekFilter === 'all' 
    ? plan 
    : plan.filter((d) => d.weekNumber === selectedWeekFilter);

  // Icon helper for habit categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wash':
        return <ShowerHead className="w-4 h-4 text-cyan-400" />;
      case 'condition':
        return <Droplets className="w-4 h-4 text-teal-400" />;
      case 'hydrate':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'scalp':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'night':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'photo':
        return <Camera className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Personalized Regimen</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
            30-Day Hair Plan
          </h1>
        </div>

        {scanResult && (
          <button
            onClick={onOpenScanModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-teal-500/30 text-teal-300 text-xs font-bold active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        )}
      </div>

      {/* NO SCAN BANNER */}
      {!scanResult && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950/70 via-slate-900 to-slate-900 border border-teal-500/40 p-5 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-black tracking-wide border border-teal-500/30">
              <Camera className="w-3.5 h-3.5" />
              <span>3-Photo AI Hair Scan</span>
            </div>
            <h2 className="text-lg font-black text-white leading-tight">
              Unlock Your Custom 30-Day Plan
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Take 3 quick photos (Front hairline, Top crown, Side texture) and answer 4 questions. Hair OS will generate your custom 30-day day-by-day regimen.
            </p>
            <button
              onClick={onOpenScanModal}
              className="w-full py-3.5 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="text-slate-950">Scan My Hair Now (30s)</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}

      {/* SCAN PROFILE SUMMARY BADGE */}
      {scanResult && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 font-black text-sm">
              {scanResult.overallScore}
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wide">
                Active Diagnostic Profile
              </div>
              <div className="text-xs font-bold text-slate-200">
                {scanResult.hairType} Hair • {scanResult.texture} • {scanResult.scalpCondition} Scalp
              </div>
            </div>
          </div>
          <button
            onClick={onOpenScanModal}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 underline"
          >
            Details
          </button>
        </div>
      )}

      {/* 30-DAY PROGRESS BAR */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-teal-400" />
            Plan Completion
          </span>
          <span className="font-black text-teal-400">{overallPercentage}% ({completedHabits}/{totalHabits})</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-teal-400 h-2.5 rounded-full transition-all duration-500 shadow-[0_0_8px_#2dd4bf]"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-semibold">
          <span>Day 1: Baseline</span>
          <span>Day 7: Scalp Reset</span>
          <span>Day 14: Moisture</span>
          <span>Day 30: Consolidation</span>
        </div>
      </div>

      {/* WEEK FILTER TABS */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedWeekFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 'all'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All 30 Days
        </button>
        <button
          onClick={() => setSelectedWeekFilter(1)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 1
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 1 (1-7)
        </button>
        <button
          onClick={() => setSelectedWeekFilter(2)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 2
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 2 (8-14)
        </button>
        <button
          onClick={() => setSelectedWeekFilter(3)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 3
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 3 (15-21)
        </button>
        <button
          onClick={() => setSelectedWeekFilter(4)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 4
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 4 (22-30)
        </button>
      </div>

      {/* HORIZONTAL DAY PICKER */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {displayedDays.map((d) => {
          const isSelected = d.dayNumber === selectedDayNumber;
          const isDone = d.habits.length > 0 && d.habits.every((h) => h.completed);
          const hasMilestone = d.isMilestonePhotoDay;

          return (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayNumber(d.dayNumber)}
              className={`flex-shrink-0 w-16 py-2.5 px-2 rounded-2xl flex flex-col items-center justify-between border transition-all duration-200 ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-lg shadow-teal-500/20 scale-105'
                  : isDone
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-tight">
                Day
              </div>
              <div className="text-lg font-black leading-tight my-0.5">
                {d.dayNumber}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {hasMilestone && (
                  <Camera className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                )}
                {isDone && (
                  <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* CURRENT SELECTED DAY CARD */}
      {currentDay && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Phase & Day header */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                  {currentDay.phaseTitle}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Week {currentDay.weekNumber}
                </span>
              </div>
              <h2 className="text-lg font-black text-white pt-1">
                {currentDay.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentDay.focus}
              </p>
            </div>

            {/* MILESTONE BANNER IF PHOTO DAY */}
            {currentDay.isMilestonePhotoDay && (
              <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-200">
                      📸 7-Day Milestone Photo
                    </div>
                    <div className="text-[11px] text-amber-300/80">
                      Snap Front, Top & Side to update your timeline.
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenPhotoCapture}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black active:scale-95 transition-transform flex-shrink-0"
                >
                  Capture
                </button>
              </div>
            )}

            {/* HABITS LIST */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Today's Care Actions ({currentDay.habits.filter(h => h.completed).length}/{currentDay.habits.length})
              </div>

              {currentDay.habits.map((habit) => {
                return (
                  <button
                    key={habit.id}
                    onClick={() => onToggleHabit(currentDay.dayNumber, habit.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 active:scale-[0.99] ${
                      habit.completed
                        ? 'bg-teal-950/30 border-teal-500/40 text-slate-300'
                        : 'bg-slate-950/70 border-slate-800 text-slate-100 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {habit.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(habit.category)}
                        <span className={`text-xs font-bold leading-snug ${habit.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-100'}`}>
                          {habit.title}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DAILY NUTRITION BOOSTER */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Utensils className="w-4 h-4" />
                <span>Daily Follicle Nutrition Booster</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-5">
                {currentDay.foodTip}
              </p>
            </div>

            {/* HAIR WISDOM TIP */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
                <Lightbulb className="w-4 h-4" />
                <span>Trichology Care Tip</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-5">
                {currentDay.hairTip}
              </p>
            </div>

            {/* PREV / NEXT NAVIGATION */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentDay.dayNumber <= 1}
                onClick={() => setSelectedDayNumber(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Day {currentDay.dayNumber - 1}</span>
              </button>

              <button
                disabled={currentDay.dayNumber >= 30}
                onClick={() => setSelectedDayNumber(prev => Math.min(30, prev + 1))}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              >
                <span>Day {currentDay.dayNumber + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK CROSS-LINK TO PRODUCT CHECKER */}
      {onOpenProductChecker && (
        <div className="rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-black text-white">
              Buying a shampoo or serum?
            </div>
            <div className="text-[11px] text-slate-400">
              Check if it matches your {scanResult ? scanResult.scalpCondition : ''} scalp profile before spending money.
            </div>
          </div>
          <button
            onClick={onOpenProductChecker}
            className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-black flex items-center gap-1 active:scale-95 flex-shrink-0"
          >
            <span>Check Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

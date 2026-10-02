import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRight,
  PartyPopper,
  X
} from 'lucide-react';

interface ThirtyDayPlanScreenProps {
  plan: PlanDay[];
  scanResult: HairScanResult | null;
  onToggleHabit: (dayNumber: number, habitId: string) => void;
  onOpenScanModal: () => void;
  onOpenPhotoCapture: () => void;
  onOpenProductChecker?: () => void;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
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
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);

  // Confetti Canvas Ref
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiAnimationRef = useRef<number | null>(null);

  // Calculate overall stats
  const totalHabits = plan.reduce((acc, d) => acc + d.habits.length, 0);
  const completedHabits = plan.reduce(
    (acc, d) => acc + d.habits.filter((h) => h.completed).length,
    0
  );
  const overallPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Calculate Streak: consecutive days completed from Day 1 or total completed days
  const activeStreak = (() => {
    let count = 0;
    for (let i = 0; i < plan.length; i++) {
      const day = plan[i];
      const isDone = day.habits.length > 0 && day.habits.every(h => h.completed);
      if (isDone) count++;
      else break;
    }
    const totalDaysDone = plan.filter(d => d.habits.length > 0 && d.habits.every(h => h.completed)).length;
    return Math.max(count, totalDaysDone);
  })();

  // Selected Day Data
  const currentDay = plan.find((d) => d.dayNumber === selectedDayNumber) || plan[0];

  // Filtered days for the list/carousel
  const displayedDays = selectedWeekFilter === 'all' 
    ? plan 
    : plan.filter((d) => d.weekNumber === selectedWeekFilter);

  // Trigger Confetti Burst
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#2dd4bf', '#38bdf8', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#facc15'];
    const particles: ConfettiParticle[] = [];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.35 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let startTime = Date.now();
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      let stillAlive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.vRot;
        if (elapsed > 1600) {
          p.opacity -= 0.025;
        }

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          stillAlive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      });

      if (stillAlive && elapsed < 3200) {
        confettiAnimationRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (confettiAnimationRef.current) cancelAnimationFrame(confettiAnimationRef.current);
    confettiAnimationRef.current = requestAnimationFrame(render);
  };

  const handleHabitToggle = (dayNum: number, habitId: string) => {
    // Check if this action completes all habits for currentDay
    const willBeCompleted = currentDay.habits
      .map(h => h.id === habitId ? !h.completed : h.completed)
      .every(Boolean);

    onToggleHabit(dayNum, habitId);

    if (willBeCompleted) {
      triggerConfetti();
      setShowCelebrationModal(true);
    }
  };

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
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-32">
      {/* Invisible Confetti Canvas Overlay */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

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

      {/* STREAK COUNTER BADGE */}
      <div className="rounded-2xl bg-slate-900 border border-amber-500/30 p-3.5 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black border border-amber-500/40">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-amber-400 flex items-center gap-1">
              <span>Discipline Tracker</span>
            </div>
            <div className="text-sm font-black text-white">
              {activeStreak > 0 ? `🔥 ${activeStreak}-Day Hair Habit Streak` : '🔥 Day 1 Starting Today'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 block">Overall Done</span>
          <span className="text-xs font-black text-teal-400">{overallPercentage}%</span>
        </div>
      </div>

      {/* NO SCAN BANNER */}
      {!scanResult && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-teal-500/40 p-5 shadow-2xl">
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
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 flex items-center justify-between">
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
          <span>Day 30: Transformation</span>
        </div>
      </div>

      {/* WEEK FILTER TABS */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedWeekFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 'all'
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All 30 Days
        </button>
        <button
          onClick={() => setSelectedWeekFilter(1)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 1
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 1 (1-7)
        </button>
        <button
          onClick={() => setSelectedWeekFilter(2)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 2
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 2 (8-14)
        </button>
        <button
          onClick={() => setSelectedWeekFilter(3)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 3
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 3 (15-21)
        </button>
        <button
          onClick={() => setSelectedWeekFilter(4)}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedWeekFilter === 4
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Week 4 (22-30)
        </button>
      </div>

      {/* 30-DAY SELECTOR STRIP */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {displayedDays.map((d) => {
          const isSelected = d.dayNumber === selectedDayNumber;
          const isDone = d.habits.length > 0 && d.habits.every((h) => h.completed);
          const isMilestone = d.dayNumber === 1 || d.dayNumber === 7 || d.dayNumber === 14 || d.dayNumber === 21 || d.dayNumber === 30;

          return (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayNumber(d.dayNumber)}
              className={`flex-shrink-0 w-14 py-2.5 rounded-2xl flex flex-col items-center justify-between border transition-all active:scale-95 ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-lg shadow-teal-500/20'
                  : isDone
                  ? 'bg-teal-950/40 text-teal-300 border-teal-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                {isMilestone ? '📸' : `W${d.weekNumber}`}
              </span>
              <span className={`text-sm font-black my-0.5 ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                D{d.dayNumber}
              </span>
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-teal-400'}`} />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-slate-700'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE DAY DETAIL CARD */}
      {currentDay && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
          {/* Day Title & Phase */}
          <div className="space-y-1 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                {currentDay.phase}
              </span>
              <span className="text-xs font-black text-slate-400">
                Week {currentDay.weekNumber}
              </span>
            </div>
            <h2 className="text-lg font-black text-white">
              {currentDay.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentDay.focus}
            </p>
          </div>

          {/* 7-Day Milestone Photo Reminder */}
          {(currentDay.dayNumber === 1 || currentDay.dayNumber === 7 || currentDay.dayNumber === 14 || currentDay.dayNumber === 21 || currentDay.dayNumber === 30) && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-200">
                    📸 7-Day Milestone Photo Check-in
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
                  onClick={() => handleHabitToggle(currentDay.dayNumber, habit.id)}
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
              onClick={() => setSelectedDayNumber(Math.max(1, selectedDayNumber - 1))}
              disabled={selectedDayNumber <= 1}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Day {selectedDayNumber - 1}</span>
            </button>

            <button
              onClick={() => setSelectedDayNumber(Math.min(30, selectedDayNumber + 1))}
              disabled={selectedDayNumber >= 30}
              className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
            >
              <span>Day {selectedDayNumber + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CELEBRATION MODAL ON DAY COMPLETION */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-sm w-full bg-slate-900 border border-teal-500/50 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto text-teal-300">
              <PartyPopper className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-teal-400">
                Day {currentDay.dayNumber} Mastered
              </span>
              <h3 className="text-xl font-black text-white">
                All Care Habits Done! 🎉
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                You've completed all hair care actions for Day {currentDay.dayNumber}. Consistency is the true secret to reversing follicle damage.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Streak Maintained! Keep it burning tomorrow!</span>
            </div>

            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/30 active:scale-95 transition-all"
            >
              Awesome, Keep Going!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

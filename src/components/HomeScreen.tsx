import React from 'react';
import { UserProfile, RoutineTask, PhotoRecord, ScalpCheck, DailyFoodWaterConfig, DailyChecklistState } from '../types';
import { 
  Camera, 
  CalendarCheck, 
  CheckCircle2, 
  Circle, 
  Settings, 
  ShieldCheck, 
  Droplets, 
  ChevronRight,
  BookOpen,
  Utensils,
  ShowerHead,
  SlidersHorizontal,
  Info,
  Check,
  FlaskConical,
  Sparkles,
  Activity,
  Play,
  Bell
} from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  routines: RoutineTask[];
  photos: PhotoRecord[];
  scalpChecks: ScalpCheck[];
  foodWaterConfig: DailyFoodWaterConfig;
  dailyChecklistState: DailyChecklistState;
  remindersEnabled?: boolean;
  onOpenReminders?: () => void;
  onToggleChecklistItem: (key: keyof DailyChecklistState) => void;
  onSkipSection: (section: 'morning' | 'afternoon' | 'night') => void;
  onDismissMonthlyPhoto: () => void;
  onOpenFoodWaterSettings: () => void;
  onToggleTask: (taskId: string) => void;
  onOpenRoutineTab: () => void;
  onOpenJournalTab: () => void;
  onOpenLabTab?: () => void;
  onOpenShowerCompanion?: () => void;
  onOpenScalpMassage?: () => void;
  onOpenCapture: () => void;
  onOpenScalpCheck: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  routines,
  photos,
  scalpChecks,
  foodWaterConfig,
  dailyChecklistState,
  remindersEnabled,
  onOpenReminders,
  onToggleChecklistItem,
  onSkipSection,
  onDismissMonthlyPhoto,
  onOpenFoodWaterSettings,
  onToggleTask,
  onOpenRoutineTab,
  onOpenJournalTab,
  onOpenLabTab,
  onOpenShowerCompanion,
  onOpenScalpMassage,
  onOpenCapture,
  onOpenScalpCheck,
  onOpenSettings,
  onOpenGuide
}) => {
  const today = new Date();
  const todayDateStr = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  const currentDayOfWeek = today.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // Check if today is a scheduled hair wash day
  const isWashDay = foodWaterConfig.washEnabled && foodWaterConfig.washDays.includes(currentDayOfWeek);

  const completedCount = routines.filter((r) => r.completed).length;
  const totalRoutines = routines.length;
  const latestPhoto = photos.length > 0 ? photos[0] : null;
  const latestScalpCheck = scalpChecks.length > 0 ? scalpChecks[0] : null;

  // Monthly photo check: show if enabled and not dismissed for this month
  const showMonthlyPhotoPrompt = 
    foodWaterConfig.monthlyPhotoPromptEnabled && 
    dailyChecklistState.monthlyPhotoDismissedMonth !== currentYearMonth;

  // Calculate actions completed
  const totalActions = 
    (dailyChecklistState.morningSkipped ? 0 : (2 + (isWashDay ? 1 : 0) + (foodWaterConfig.dailyDetangleEnabled ? 1 : 0))) +
    (dailyChecklistState.afternoonSkipped ? 0 : 2) +
    (dailyChecklistState.nightSkipped ? 0 : 2);

  const doneActions = 
    (dailyChecklistState.morningSkipped ? 0 : (
      (dailyChecklistState.morningWaterDone ? 1 : 0) +
      (dailyChecklistState.morningFoodDone ? 1 : 0) +
      (isWashDay && dailyChecklistState.morningWashDone ? 1 : 0) +
      (foodWaterConfig.dailyDetangleEnabled && dailyChecklistState.morningDetangleDone ? 1 : 0)
    )) +
    (dailyChecklistState.afternoonSkipped ? 0 : (
      (dailyChecklistState.afternoonWaterDone ? 1 : 0) +
      (dailyChecklistState.afternoonFoodDone ? 1 : 0)
    )) +
    (dailyChecklistState.nightSkipped ? 0 : (
      (dailyChecklistState.nightWaterDone ? 1 : 0) +
      (dailyChecklistState.nightFoodDone ? 1 : 0)
    ));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-24">
      {/* Top Header — Clear Identity as Hair Care Routine & Journal */}
      <div className="pt-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white">HAIR OS</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Hair Care Routine & Journal
              </span>
            </div>
            <p className="text-[11px] text-teal-400/90 font-medium mt-0.5">
              Server-Free Daily Hair & Scalp Companion
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenReminders}
              aria-label="Smart Reminders & Alarms"
              className="relative w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-95"
            >
              <Bell className="w-5 h-5 text-teal-400/90" />
              {remindersEnabled && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 shadow-sm shadow-teal-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={onOpenSettings}
              aria-label="Settings and Privacy Center"
              className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-95"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Welcoming Greeting Card */}
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800/90 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-extrabold text-white">
              {profile.name ? `Hello, ${profile.name} ✨` : 'Welcome ✨'}
            </h2>
            <p className="text-[11px] text-slate-400">{todayDateStr}</p>
          </div>
          <div className="text-right">
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800/80 text-teal-300 border border-slate-700/50">
              {profile.primaryFocus || 'Gentle Care'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: THREE SIMPLE CHECKLIST SECTIONS (Morning, Afternoon, Night)       */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-extrabold text-white">Daily Checklist</h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">
              {doneActions}/{totalActions} Done
            </span>
            <button
              onClick={onOpenFoodWaterSettings}
              aria-label="Customize Checklist & Reminders"
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-teal-300 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SECTION 1: MORNING ROUTINE */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">☀️</span>
              <h4 className="text-sm font-black text-white">Morning Routine</h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {foodWaterConfig.morningReminderTime}
              </span>
              {isWashDay && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Wash Day
                </span>
              )}
            </div>

            {/* Skip Today Button (Zero Guilt) */}
            <button
              onClick={() => onSkipSection('morning')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-colors ${
                dailyChecklistState.morningSkipped
                  ? 'bg-slate-800 border-slate-700 text-teal-300'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dailyChecklistState.morningSkipped ? 'Undo Skip' : 'Skip today'}
            </button>
          </div>

          {dailyChecklistState.morningSkipped ? (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Skipped for today · No guilt, routine resumes anytime.</span>
              <button 
                onClick={() => onSkipSection('morning')}
                className="text-teal-400 font-bold ml-2 underline text-xs"
              >
                Resume
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-0.5">
              {/* Action 1: Morning Water Checkbox */}
              <div 
                onClick={() => onToggleChecklistItem('morningWaterDone')}
                className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  dailyChecklistState.morningWaterDone
                    ? 'bg-teal-500/10 border-teal-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  dailyChecklistState.morningWaterDone ? 'bg-teal-500 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                }`}>
                  {dailyChecklistState.morningWaterDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-semibold">{foodWaterConfig.morningWaterGoal}</span>
                </div>
                <Droplets className="w-4 h-4 text-teal-400 flex-shrink-0" />
              </div>

              {/* Action 2: Morning Breakfast Protein Checkbox */}
              <div 
                onClick={() => onToggleChecklistItem('morningFoodDone')}
                className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  dailyChecklistState.morningFoodDone
                    ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  dailyChecklistState.morningFoodDone ? 'bg-amber-400 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                }`}>
                  {dailyChecklistState.morningFoodDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-semibold">{foodWaterConfig.morningFoodSuggestion}</span>
                </div>
                <Utensils className="w-4 h-4 text-amber-400 flex-shrink-0" />
              </div>

              {/* Action 3: Hair Wash Checkbox (Monday & Thursday Mornings Only) */}
              {isWashDay && (
                <div className="space-y-1.5">
                  <div 
                    onClick={() => onToggleChecklistItem('morningWashDone')}
                    className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                      dailyChecklistState.morningWashDone
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-slate-100'
                        : 'bg-cyan-950/30 border-cyan-800/50 text-cyan-200 hover:border-cyan-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      dailyChecklistState.morningWashDone ? 'bg-cyan-400 text-slate-950 font-bold' : 'border border-cyan-600/70 bg-slate-900'
                    }`}>
                      {dailyChecklistState.morningWashDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-cyan-300">Hair wash scheduled for today</span>
                    </div>
                    <ShowerHead className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  </div>

                  {/* Suggest conditioner and gentle drying after washing */}
                  <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-[11px] text-cyan-300/90 leading-relaxed flex items-start space-x-2">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400 mt-0.5" />
                    <span>{foodWaterConfig.washPostCareTip}</span>
                  </div>

                  {onOpenShowerCompanion && (
                    <button
                      onClick={onOpenShowerCompanion}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 active:scale-98 transition-all"
                    >
                      <ShowerHead className="w-4 h-4 stroke-[2.5]" />
                      <span>Start Guided Shower Mode (Live Timers)</span>
                    </button>
                  )}
                </div>
              )}

              {/* Action 4: Optional Daily Gentle Detangling */}
              {foodWaterConfig.dailyDetangleEnabled && (
                <div 
                  onClick={() => onToggleChecklistItem('morningDetangleDone')}
                  className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                    dailyChecklistState.morningDetangleDone
                      ? 'bg-teal-500/10 border-teal-500/40 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    dailyChecklistState.morningDetangleDone ? 'bg-teal-400 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                  }`}>
                    {dailyChecklistState.morningDetangleDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <span>{foodWaterConfig.dailyDetangleTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: AFTERNOON ROUTINE */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🌤️</span>
              <h4 className="text-sm font-black text-white">Afternoon Routine</h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {foodWaterConfig.afternoonReminderTime}
              </span>
            </div>

            {/* Skip Today Button */}
            <button
              onClick={() => onSkipSection('afternoon')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-colors ${
                dailyChecklistState.afternoonSkipped
                  ? 'bg-slate-800 border-slate-700 text-teal-300'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dailyChecklistState.afternoonSkipped ? 'Undo Skip' : 'Skip today'}
            </button>
          </div>

          {dailyChecklistState.afternoonSkipped ? (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Skipped for today · No guilt, routine resumes anytime.</span>
              <button 
                onClick={() => onSkipSection('afternoon')}
                className="text-teal-400 font-bold ml-2 underline text-xs"
              >
                Resume
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-0.5">
              {/* Action 1: Afternoon Water Checkbox */}
              <div 
                onClick={() => onToggleChecklistItem('afternoonWaterDone')}
                className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  dailyChecklistState.afternoonWaterDone
                    ? 'bg-teal-500/10 border-teal-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  dailyChecklistState.afternoonWaterDone ? 'bg-teal-500 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                }`}>
                  {dailyChecklistState.afternoonWaterDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-semibold">{foodWaterConfig.afternoonWaterGoal}</span>
                </div>
                <Droplets className="w-4 h-4 text-teal-400 flex-shrink-0" />
              </div>

              {/* Action 2: Afternoon Lunch Checkbox */}
              <div 
                onClick={() => onToggleChecklistItem('afternoonFoodDone')}
                className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  dailyChecklistState.afternoonFoodDone
                    ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  dailyChecklistState.afternoonFoodDone ? 'bg-amber-400 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                }`}>
                  {dailyChecklistState.afternoonFoodDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-semibold">{foodWaterConfig.afternoonFoodSuggestion}</span>
                </div>
                <Utensils className="w-4 h-4 text-amber-400 flex-shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: NIGHT ROUTINE */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🌙</span>
              <h4 className="text-sm font-black text-white">Night Routine</h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {foodWaterConfig.nightReminderTime}
              </span>
            </div>

            {/* Skip Today Button */}
            <button
              onClick={() => onSkipSection('night')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-colors ${
                dailyChecklistState.nightSkipped
                  ? 'bg-slate-800 border-slate-700 text-teal-300'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dailyChecklistState.nightSkipped ? 'Undo Skip' : 'Skip today'}
            </button>
          </div>

          {dailyChecklistState.nightSkipped ? (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Skipped for today · Rest well, routine resumes anytime.</span>
              <button 
                onClick={() => onSkipSection('night')}
                className="text-teal-400 font-bold ml-2 underline text-xs"
              >
                Resume
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-0.5">
              {/* Action 1: Night Water if wanted (no set requirement before bed) */}
              <div 
                onClick={() => onToggleChecklistItem('nightWaterDone')}
                className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  dailyChecklistState.nightWaterDone
                    ? 'bg-teal-500/10 border-teal-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  dailyChecklistState.nightWaterDone ? 'bg-teal-500 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                }`}>
                  {dailyChecklistState.nightWaterDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-semibold">{foodWaterConfig.nightWaterGoal}</span>
                  <span className="block text-[10px] text-slate-400">No set amount required just before bed</span>
                </div>
                <Droplets className="w-4 h-4 text-teal-400 flex-shrink-0" />
              </div>

              {/* Action 2: Night Dinner Checkbox */}
              <div 
                onClick={() => onToggleChecklistItem('nightFoodDone')}
                className={`p-2.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  dailyChecklistState.nightFoodDone
                    ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  dailyChecklistState.nightFoodDone ? 'bg-amber-400 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-900'
                }`}>
                  {dailyChecklistState.nightFoodDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-semibold">{foodWaterConfig.nightFoodSuggestion}</span>
                </div>
                <Utensils className="w-4 h-4 text-amber-400 flex-shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Once a Month: Optional Progress Photo Card */}
        {showMonthlyPhotoPrompt && (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Monthly Progress Photo</h4>
                  <span className="text-[10px] text-indigo-300 font-medium">Optional monthly milestone</span>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                1x Month
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Capture your hair or hairline under consistent lighting to build an honest photo journal over time. Skip or take when ready.
            </p>

            <div className="flex space-x-2 pt-1">
              <button
                onClick={onOpenCapture}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={onDismissMonthlyPhoto}
                className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold active:scale-95 transition-transform"
              >
                Skip This Month
              </button>
            </div>
          </div>
        )}

        {/* Honest Medical & Wellness Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
            <Info className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span>Honest Care & Fluid Guidance</span>
          </div>
          <p className="leading-relaxed">
            Fluid needs vary by person and activity level. If you have medical fluid restrictions from a physician, always follow your doctor’s orders. Balanced nutrition, adequate hydration, and washing on fixed days support general wellness and cleanliness, but do not guarantee hair growth.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXISTING FEATURES PRESERVED: PROGRESS PHOTO & CARE HABITS                 */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2 border-t border-slate-850">
        {/* NEW: PRO HAIR LAB & INGREDIENT DECODER CARD */}
        {onOpenLabTab && (
          <div 
            onClick={onOpenLabTab}
            role="button"
            tabIndex={0}
            className="bg-gradient-to-br from-teal-950/50 via-slate-900 to-slate-900 border border-teal-500/30 hover:border-teal-500/50 rounded-3xl p-5 shadow-xl flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
          >
            <div className="space-y-1.5 pr-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-300" />
                  Pro Clinic Feature
                </span>
                <span className="text-[10px] text-slate-400 font-bold">100% Offline</span>
              </div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5 group-hover:text-teal-300 transition-colors">
                Hair Lab & Ingredient Decoder <FlaskConical className="w-4 h-4 text-teal-400" />
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scan shampoos for harsh sulfates & silicones, calculate hard water ACV rinse, and rosemary oil dilution.
              </p>
            </div>

            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        )}

        {/* GUIDED 4-MIN SCALP TENSION RELEASE */}
        {onOpenScalpMassage && (
          <div 
            onClick={onOpenScalpMassage}
            role="button"
            tabIndex={0}
            className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/50 rounded-3xl p-5 shadow-xl flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
          >
            <div className="space-y-1.5 pr-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-300" />
                  Micro-Circulation
                </span>
                <span className="text-[10px] text-slate-400 font-bold">4-Min Guided</span>
              </div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5 group-hover:text-indigo-300 transition-colors">
                Scalp Tension Release <Activity className="w-4 h-4 text-indigo-400" />
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Relieve galea tendon tightness across Occipital, Temporal, and Crown zones with live guided rhythm timers.
              </p>
            </div>

            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 fill-current" />
            </div>
          </div>
        )}

        {/* ACTION: ADD PROGRESS PHOTO */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1 pr-3">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-extrabold text-white">Progress Photo</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capture your scalp or hairline under consistent lighting to build an honest, private journal.
            </p>
          </div>

          <button
            onClick={onOpenCapture}
            className="flex-shrink-0 py-3 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
          >
            <Camera className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>

        {/* Recent Photo Journal Preview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Photo Entry</h4>
            <button
              onClick={onOpenJournalTab}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>Journal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {latestPhoto ? (
            <div
              onClick={onOpenJournalTab}
              role="button"
              tabIndex={0}
              className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-800">
                <img
                  src={latestPhoto.imageUrl}
                  alt="Latest progress photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden space-y-1">
                <span className="text-xs font-bold text-white block truncate">{latestPhoto.zoneLabel}</span>
                <p className="text-[11px] text-slate-400">Captured on {latestPhoto.date}</p>
                {latestPhoto.notes && (
                  <p className="text-[11px] text-slate-500 truncate">{latestPhoto.notes}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-2">
              <p className="text-xs text-slate-400">No progress photos recorded yet.</p>
              <button
                onClick={onOpenCapture}
                className="text-xs font-bold text-teal-400 hover:underline"
              >
                Take your baseline photo
              </button>
            </div>
          )}
        </div>

        {/* Scalp Care Habits Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Scalp Care Habits</h3>
                <p className="text-xs text-slate-400">
                  {totalRoutines === 0
                    ? 'No habits configured'
                    : `${completedCount} of ${totalRoutines} care habits completed`}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenRoutineTab}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Tasks List */}
          <div className="space-y-2 pt-1">
            {routines.slice(0, 3).map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                role="button"
                tabIndex={0}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                  task.completed
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-200'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3 pr-2 overflow-hidden">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-medium truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 flex-shrink-0 capitalize">
                  {task.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Scalp & Guide Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Scalp Comfort Quick-Check */}
        <div
          onClick={onOpenScalpCheck}
          role="button"
          tabIndex={0}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2 transition-all active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-white">Scalp Log</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {latestScalpCheck ? `Status: ${latestScalpCheck.comfort}` : 'Check today’s comfort'}
            </p>
          </div>
        </div>

        {/* Educational Hair Care Guide */}
        <div
          onClick={onOpenGuide}
          role="button"
          tabIndex={0}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-2 transition-all active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-white">Care Guide</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Evidence-informed tips</p>
          </div>
        </div>
      </div>

      {/* Server-Free & Medical Transparency Disclaimer Card */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-xs text-slate-400 space-y-1">
        <div className="flex items-center space-x-1.5 text-slate-300 font-bold text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Server-Free & Private</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          HAIR OS stores all routines and photos exclusively on your phone. We do not provide clinical diagnoses, medical staging, or prescriptions.
        </p>
      </div>
    </div>
  );
};

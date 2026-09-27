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
  Check
} from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  routines: RoutineTask[];
  photos: PhotoRecord[];
  scalpChecks: ScalpCheck[];
  foodWaterConfig: DailyFoodWaterConfig;
  dailyChecklistState: DailyChecklistState;
  onToggleDailyCard: (card: 'morning' | 'afternoon' | 'night') => void;
  onSelectNightFood: (food: string) => void;
  onOpenFoodWaterSettings: () => void;
  onToggleTask: (taskId: string) => void;
  onOpenRoutineTab: () => void;
  onOpenJournalTab: () => void;
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
  onToggleDailyCard,
  onSelectNightFood,
  onOpenFoodWaterSettings,
  onToggleTask,
  onOpenRoutineTab,
  onOpenJournalTab,
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

  // Check if today is a scheduled hair wash day
  const isWashDay = foodWaterConfig.washEnabled && foodWaterConfig.washDays.includes(currentDayOfWeek);

  const completedCount = routines.filter((r) => r.completed).length;
  const totalRoutines = routines.length;
  const latestPhoto = photos.length > 0 ? photos[0] : null;
  const latestScalpCheck = scalpChecks.length > 0 ? scalpChecks[0] : null;

  // Daily cards completed count (0 to 3)
  const dailyCardsDone = [
    dailyChecklistState.morningCompleted,
    dailyChecklistState.afternoonCompleted,
    dailyChecklistState.nightCompleted
  ].filter(Boolean).length;

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

          <button
            onClick={onOpenSettings}
            aria-label="Settings and Privacy Center"
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-95"
          >
            <Settings className="w-5 h-5" />
          </button>
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
      {/* SECTION: THREE DAILY ROUTINE CARDS (Morning, Afternoon, Night)             */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-extrabold text-white">Daily Food & Water Checklist</h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">
              {dailyCardsDone}/3 Done
            </span>
            <button
              onClick={onOpenFoodWaterSettings}
              aria-label="Customize Food, Water & Wash Settings"
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-teal-300 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 1: MORNING ROUTINE */}
        <div className={`p-4 rounded-3xl border transition-all ${
          dailyChecklistState.morningCompleted 
            ? 'bg-slate-900/40 border-teal-500/40 shadow-inner' 
            : 'bg-slate-900 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1 pr-3">
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

              {/* Items due in Morning Card */}
              <div className="space-y-1 text-xs text-slate-300 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  <span>Drink <strong>{foodWaterConfig.morningWaterGlasses} glasses</strong> of water</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>Eat <strong>{foodWaterConfig.morningFood}</strong></span>
                </div>

                {/* Scheduled Hair Wash (Mondays and Thursdays only) */}
                {isWashDay && (
                  <div className="flex items-center space-x-2 text-cyan-300 font-semibold p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mt-1">
                    <ShowerHead className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
                    <span>Hair wash scheduled for today</span>
                  </div>
                )}
              </div>
            </div>

            {/* ONE TICK BOX FOR MORNING CARD */}
            <button
              onClick={() => onToggleDailyCard('morning')}
              aria-label={dailyChecklistState.morningCompleted ? "Mark Morning Incomplete (Undo)" : "Complete Morning Routine"}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                dailyChecklistState.morningCompleted
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30'
                  : 'bg-slate-950 border border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              {dailyChecklistState.morningCompleted ? (
                <Check className="w-6 h-6 stroke-[3]" />
              ) : (
                <Circle className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Tick box only after completing items above</span>
            {dailyChecklistState.morningCompleted && (
              <span className="text-teal-400 font-bold">✓ Morning Complete (Tap to undo)</span>
            )}
          </div>
        </div>

        {/* CARD 2: AFTERNOON ROUTINE */}
        <div className={`p-4 rounded-3xl border transition-all ${
          dailyChecklistState.afternoonCompleted 
            ? 'bg-slate-900/40 border-teal-500/40 shadow-inner' 
            : 'bg-slate-900 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1 pr-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🌤️</span>
                <h4 className="text-sm font-black text-white">Afternoon Routine</h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {foodWaterConfig.afternoonReminderTime}
                </span>
              </div>

              {/* Items due in Afternoon Card */}
              <div className="space-y-1 text-xs text-slate-300 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  <span>Drink <strong>{foodWaterConfig.afternoonWaterGlasses} glasses</strong> of water</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>Eat <strong>{foodWaterConfig.afternoonFood}</strong></span>
                </div>
              </div>
            </div>

            {/* ONE TICK BOX FOR AFTERNOON CARD */}
            <button
              onClick={() => onToggleDailyCard('afternoon')}
              aria-label={dailyChecklistState.afternoonCompleted ? "Mark Afternoon Incomplete (Undo)" : "Complete Afternoon Routine"}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                dailyChecklistState.afternoonCompleted
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30'
                  : 'bg-slate-950 border border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              {dailyChecklistState.afternoonCompleted ? (
                <Check className="w-6 h-6 stroke-[3]" />
              ) : (
                <Circle className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Tick box only after completing items above</span>
            {dailyChecklistState.afternoonCompleted && (
              <span className="text-teal-400 font-bold">✓ Afternoon Complete (Tap to undo)</span>
            )}
          </div>
        </div>

        {/* CARD 3: NIGHT ROUTINE */}
        <div className={`p-4 rounded-3xl border transition-all ${
          dailyChecklistState.nightCompleted 
            ? 'bg-slate-900/40 border-teal-500/40 shadow-inner' 
            : 'bg-slate-900 border-slate-800 shadow-xl'
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1 pr-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🌙</span>
                <h4 className="text-sm font-black text-white">Night Routine</h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {foodWaterConfig.nightReminderTime}
                </span>
              </div>

              {/* Items due in Night Card */}
              <div className="space-y-1 text-xs text-slate-300 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  <span>Drink <strong>{foodWaterConfig.nightWaterGlasses} glasses</strong> of water</span>
                </div>
                <div className="pt-0.5">
                  <span className="text-slate-400 block mb-1">Choose one food option for tonight:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {foodWaterConfig.nightFoodOptions.map((opt) => {
                      const isSelected = (dailyChecklistState.nightFoodSelected || foodWaterConfig.nightFoodOptions[0]) === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onSelectNightFood(opt)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ONE TICK BOX FOR NIGHT CARD */}
            <button
              onClick={() => onToggleDailyCard('night')}
              aria-label={dailyChecklistState.nightCompleted ? "Mark Night Incomplete (Undo)" : "Complete Night Routine"}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                dailyChecklistState.nightCompleted
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30'
                  : 'bg-slate-950 border border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              {dailyChecklistState.nightCompleted ? (
                <Check className="w-6 h-6 stroke-[3]" />
              ) : (
                <Circle className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Tick box only after completing items above</span>
            {dailyChecklistState.nightCompleted && (
              <span className="text-teal-400 font-bold">✓ Night Complete (Tap to undo)</span>
            )}
          </div>
        </div>

        {/* Nutritional & Fluid Disclaimer */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-0.5">
          <div className="flex items-center space-x-1.5 font-bold text-slate-300">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>Hydration & Nutrition Guidance:</span>
          </div>
          <p className="leading-relaxed">
            Fluid needs vary by person and activity. Some individuals may have medical fluid restrictions from a physician. Balanced foods and hydration support overall wellbeing; no particular food or fluid guarantees hair regrowth.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXISTING FEATURES PRESERVED: PROGRESS PHOTO & CARE HABITS                 */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2 border-t border-slate-850">
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

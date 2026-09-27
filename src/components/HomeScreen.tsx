import React from 'react';
import { UserProfile, RoutineTask, PhotoRecord, ScalpCheck } from '../types';
import { 
  Camera, 
  CalendarCheck, 
  CheckCircle2, 
  Circle, 
  Settings, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Droplets,
  ChevronRight
} from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  routines: RoutineTask[];
  photos: PhotoRecord[];
  scalpChecks: ScalpCheck[];
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
  onToggleTask,
  onOpenRoutineTab,
  onOpenJournalTab,
  onOpenCapture,
  onOpenScalpCheck,
  onOpenSettings,
  onOpenGuide
}) => {
  const todayDateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const completedCount = routines.filter((r) => r.completed).length;
  const totalRoutines = routines.length;
  const latestPhoto = photos.length > 0 ? photos[0] : null;
  const latestScalpCheck = scalpChecks.length > 0 ? scalpChecks[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-white">HAIR OS</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Server-Free
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {profile.name ? `Hello, ${profile.name}` : 'Welcome, Friend'} · {todayDateStr}
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          aria-label="Settings and Data Controls"
          className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Focus: Two Clear, Obvious Actions */}
      <div className="space-y-4">
        {/* ACTION 1: TODAY'S ROUTINE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Today’s Care Routine</h3>
                <p className="text-xs text-slate-400">
                  {totalRoutines === 0
                    ? 'No habits configured'
                    : completedCount === 0
                    ? 'Ready to begin today’s care'
                    : `${completedCount} of ${totalRoutines} habits completed`}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenRoutineTab}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          {totalRoutines > 0 && (
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${totalRoutines > 0 ? (completedCount / totalRoutines) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

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

        {/* ACTION 2: ADD PROGRESS PHOTO */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1 pr-3">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-extrabold text-white">Progress Photo</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capture your scalp or hairline under consistent lighting to build an honest photo journal.
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
      </div>

      {/* Recent Photo Journal Preview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Photo Entry</h4>
          <button
            onClick={onOpenJournalTab}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
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

      {/* Quick Check-In & Guide Cards */}
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
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-white">Care Guide</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Curated tips & ingredients</p>
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
          HAIR OS stores all routines and photos exclusively on this device. We do not provide clinical diagnoses, staging, or prescriptions.
        </p>
      </div>
    </div>
  );
};

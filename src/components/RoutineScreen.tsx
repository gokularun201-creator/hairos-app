import React, { useState } from 'react';
import { RoutineTask, RoutineCategory, DailyFoodWaterConfig } from '../types';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Bell, 
  Trash2, 
  Edit3,
  X, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon, 
  ShowerHead, 
  Clock,
  SlidersHorizontal,
  Droplets,
  Utensils
} from 'lucide-react';

interface RoutineScreenProps {
  routines: RoutineTask[];
  foodWaterConfig: DailyFoodWaterConfig;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: RoutineTask) => void;
  onUpdateTask: (task: RoutineTask) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenReminders: () => void;
  onOpenFoodWaterSettings: () => void;
}

export const RoutineScreen: React.FC<RoutineScreenProps> = ({
  routines,
  foodWaterConfig,
  onToggleTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onOpenReminders,
  onOpenFoodWaterSettings
}) => {
  const [filter, setFilter] = useState<'all' | RoutineCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);

  // Form state for adding/editing task
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoutineCategory>('morning');
  const [timeOfDay, setTimeOfDay] = useState('08:00');
  const [whyItHelps, setWhyItHelps] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const isWashDay = foodWaterConfig.washEnabled && foodWaterConfig.washDays.includes(currentDayOfWeek);

  const filteredTasks = routines.filter((r) => {
    if (filter === 'all') return true;
    return r.category === filter;
  });

  const completedCount = routines.filter((r) => r.completed).length;

  const handleOpenAdd = () => {
    setTitle('');
    setCategory('morning');
    setTimeOfDay('08:00');
    setWhyItHelps('');
    setSafetyNotes('');
    setIsAdding(true);
  };

  const handleOpenEdit = (task: RoutineTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setCategory(task.category);
    setTimeOfDay(task.timeOfDay);
    setWhyItHelps(task.whyItHelps);
    setSafetyNotes(task.safetyNotes);
  };

  const handleSaveCustomTask = () => {
    if (!title.trim()) return;

    if (editingTask) {
      const updated: RoutineTask = {
        ...editingTask,
        title: title.trim(),
        category,
        timeOfDay,
        whyItHelps: whyItHelps.trim() || editingTask.whyItHelps,
        safetyNotes: safetyNotes.trim() || editingTask.safetyNotes
      };
      onUpdateTask(updated);
      setEditingTask(null);
    } else {
      const newTask: RoutineTask = {
        id: `rt-${Date.now()}`,
        title: title.trim(),
        category,
        frequency: 'daily',
        timeOfDay,
        whyItHelps: whyItHelps.trim() || 'Custom care habit added to support daily scalp and hair consistency.',
        safetyNotes: safetyNotes.trim() || 'Handle gently without aggressive friction or excessive tension.',
        completed: false,
        lastCompletedDate: null
      };
      onAddTask(newTask);
      setIsAdding(false);
    }

    setTitle('');
    setWhyItHelps('');
    setSafetyNotes('');
  };

  const getCategoryIcon = (cat: RoutineCategory) => {
    switch (cat) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'shower':
        return <ShowerHead className="w-4 h-4 text-cyan-400" />;
      case 'evening':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      default:
        return <Clock className="w-4 h-4 text-teal-400" />;
    }
  };

  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const washDayLabels = foodWaterConfig.washDays.map((d) => dayNamesShort[d]).join(', ');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>Care Routine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {completedCount} of {routines.length} habits completed today
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenFoodWaterSettings}
            aria-label="Food, Water & Wash Schedule Settings"
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-teal-400 transition-colors active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenReminders}
            aria-label="Configure Reminders"
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-95"
          >
            <Bell className="w-4 h-4 text-teal-400" />
          </button>
          <button
            onClick={handleOpenAdd}
            aria-label="Add Custom Habit"
            className="w-10 h-10 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center transition-colors shadow-lg shadow-teal-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SCHEDULED HAIR WASH BANNER / CARD */}
      {foodWaterConfig.washEnabled && (
        <div className={`p-4 rounded-3xl border transition-all ${
          isWashDay 
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200 shadow-lg' 
            : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                isWashDay ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                <ShowerHead className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-black text-white">Hair Wash Schedule</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isWashDay ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isWashDay ? 'Due Today!' : 'Not Due Today'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Scheduled for: <strong>{washDayLabels}</strong> (Morning at {foodWaterConfig.washReminderTime})
                </p>
              </div>
            </div>

            <button
              onClick={onOpenFoodWaterSettings}
              className="text-xs font-bold text-teal-400 hover:underline px-2 py-1"
            >
              Edit
            </button>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 leading-normal border-t border-slate-800/60 pt-1.5">
            Treat this schedule as your chosen preference, not an absolute rule. Wash when your scalp needs cleansing.
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'morning', 'shower', 'evening'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors capitalize ${
              filter === cat
                ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Habits' : cat}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 text-center space-y-3">
            <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-300">No habits in this category</p>
              <p className="text-xs text-slate-500">Tap the "+" button above to add your own custom habit.</p>
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedId === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-2xl border transition-all ${
                  task.completed
                    ? 'bg-slate-900/40 border-teal-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Main Row */}
                <div className="p-3.5 flex items-center justify-between">
                  <div
                    onClick={() => onToggleTask(task.id)}
                    role="button"
                    tabIndex={0}
                    className="flex items-center space-x-3 flex-1 cursor-pointer pr-2 overflow-hidden"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    )}
                    <div className="overflow-hidden">
                      <span className={`text-xs font-bold block truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="flex items-center space-x-1 text-[10px] text-slate-400 capitalize">
                          {getCategoryIcon(task.category)}
                          <span>{task.category}</span>
                        </span>
                        <span className="text-[10px] text-teal-400 font-mono">· {task.timeOfDay}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      aria-label="Edit habit"
                      className="p-1.5 text-slate-400 hover:text-teal-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : task.id)}
                      aria-label="Toggle details"
                      className="p-1.5 text-slate-400 hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      aria-label="Delete habit"
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-300">Why it helps:</span>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{task.whyItHelps}</p>
                    </div>
                    {task.safetyNotes && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                        <strong>Gentle Tip: </strong>
                        {task.safetyNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Gentle Philosophy Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
        💡 <strong>Consistent, gentle habits matter most.</strong> Avoid harsh friction, tight tension, or scalding water. Customize any habit or time to fit your lifestyle.
      </div>

      {/* Add / Edit Habit Modal */}
      {(isAdding || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">
                {editingTask ? 'Edit Care Habit' : 'Add Custom Care Habit'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingTask(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Habit Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Silk bonnet before bed"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RoutineCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                  >
                    <option value="morning">Morning</option>
                    <option value="shower">Shower</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Why It Helps (Optional)</label>
                <textarea
                  value={whyItHelps}
                  onChange={(e) => setWhyItHelps(e.target.value)}
                  placeholder="e.g. Minimizes overnight friction and keeps moisture locked in."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Gentle Tip (Optional)</label>
                <input
                  type="text"
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  placeholder="e.g. Keep band loose around edges"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingTask(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomTask}
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  {editingTask ? 'Save Changes' : 'Add Habit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

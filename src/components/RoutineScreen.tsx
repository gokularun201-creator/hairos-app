import React, { useState } from 'react';
import { RoutineTask, RoutineCategory } from '../types';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Bell, 
  Trash2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon, 
  ShowerHead, 
  Clock 
} from 'lucide-react';

interface RoutineScreenProps {
  routines: RoutineTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: RoutineTask) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenReminders: () => void;
}

export const RoutineScreen: React.FC<RoutineScreenProps> = ({
  routines,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenReminders
}) => {
  const [filter, setFilter] = useState<'all' | RoutineCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state for adding custom task
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoutineCategory>('morning');
  const [timeOfDay, setTimeOfDay] = useState('08:00');
  const [whyItHelps, setWhyItHelps] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');

  const filteredTasks = routines.filter((r) => {
    if (filter === 'all') return true;
    return r.category === filter;
  });

  const completedCount = routines.filter((r) => r.completed).length;

  const handleSaveCustomTask = () => {
    if (!title.trim()) return;
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
    setTitle('');
    setWhyItHelps('');
    setSafetyNotes('');
    setIsAdding(false);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>Care Routine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {completedCount} of {routines.length} habits done today
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenReminders}
            aria-label="Configure Reminders"
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAdding(true)}
            aria-label="Add Custom Habit"
            className="w-10 h-10 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center transition-colors shadow-lg shadow-teal-500/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

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
                        <span className="text-[10px] text-slate-500">· {task.timeOfDay}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
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
        💡 <strong>Consistent, gentle habits matter most.</strong> Avoid harsh friction, tight tension, or scalding water. Feel free to adjust these tasks to fit your personal comfort.
      </div>

      {/* Add Custom Habit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Add Custom Care Habit</h3>
              <button
                onClick={() => setIsAdding(false)}
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
                    <option value="shower">Shower / Wash</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Time</label>
                  <input
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Notes / Why it helps (Optional)</label>
                <input
                  type="text"
                  value={whyItHelps}
                  onChange={(e) => setWhyItHelps(e.target.value)}
                  placeholder="e.g. Protects hair tips from pillow friction"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomTask}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20"
              >
                Save Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { House, CalendarCheck, FlaskConical, Camera, BookOpen } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: House },
    { id: 'routine', label: 'Routine', icon: CalendarCheck },
    { id: 'lab', label: 'Lab', icon: FlaskConical },
    { id: 'journal', label: 'Photos', icon: Camera },
    { id: 'guide', label: 'Guide', icon: BookOpen }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none app-nav-container">
      {/* Background gradient fade to ensure readability */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

      <div className="relative max-w-md mx-auto px-4">
        <nav
          role="navigation"
          aria-label="Main Navigation"
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-1.5 shadow-2xl pointer-events-auto flex items-center justify-around"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 min-h-[50px] min-w-[48px] active:scale-95 ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 font-extrabold border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 font-medium border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-teal-400' : 'text-slate-400'}`} />
                <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold text-teal-300' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-0.5 shadow-[0_0_8px_#2dd4bf]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

import { Home, BookOpen, PieChart, BarChart3, Flame } from 'lucide-react';
import { TabId } from '../lib/types';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Snap', icon: Home },
  { id: 'diary', label: 'Diary', icon: BookOpen },
  { id: 'macros', label: 'Macros', icon: PieChart },
  { id: 'history', label: 'History', icon: BarChart3 },
  { id: 'streak', label: 'Streak', icon: Flame },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-dark-800/95 backdrop-blur-xl border-t border-white/5 z-50">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-all duration-200 ${
                isActive ? 'text-accent' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-accent/10' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

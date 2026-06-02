import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { getLast7Days } from '../lib/storage';
import { DailyData } from '../lib/types';

interface HistoryPageProps {
  refreshKey: number;
}

export default function HistoryPage({ refreshKey }: HistoryPageProps) {
  const [days, setDays] = useState<DailyData[]>([]);

  useEffect(() => {
    setDays(getLast7Days());
  }, [refreshKey]);

  const maxCalories = Math.max(...days.map(d => d.calories), 500);
  const avgCalories = days.length > 0
    ? Math.round(days.reduce((s, d) => s + d.calories, 0) / days.length)
    : 0;

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isToday = (dateStr: string) => {
    return dateStr === new Date().toISOString().split('T')[0];
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="pt-12 pb-2 px-5">
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-sm text-gray-500">Last 7 days</p>
      </div>

      {/* Average Card */}
      <div className="px-5 mt-4">
        <div className="rounded-2xl bg-dark-700 border border-white/5 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent/10">
            <TrendingUp size={22} className="text-accent" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Daily Average</p>
            <p className="text-white text-2xl font-bold">{avgCalories} <span className="text-sm text-gray-500 font-normal">kcal</span></p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl bg-dark-700 border border-white/5 p-5">
          <div className="flex items-end justify-between gap-2" style={{ height: 180 }}>
            {days.map((day, i) => {
              const height = maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0;
              const today = isToday(day.date);
              return (
                <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {day.calories > 0 ? day.calories : '-'}
                  </span>
                  <div className="w-full flex items-end justify-center" style={{ height: 140 }}>
                    <div
                      className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ease-out ${
                        today
                          ? 'bg-accent'
                          : day.calories > 0
                            ? 'bg-white/15'
                            : 'bg-white/5'
                      }`}
                      style={{
                        height: `${Math.max(height, 4)}%`,
                        transitionDelay: `${i * 80}ms`,
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${today ? 'text-accent' : 'text-gray-500'}`}>
                    {getDayLabel(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Details */}
      <div className="px-5 mt-4 pb-24 space-y-2">
        {days.slice().reverse().map(day => (
          <div
            key={day.date}
            className={`rounded-xl p-3 border ${
              isToday(day.date)
                ? 'bg-accent/5 border-accent/10'
                : 'bg-dark-700 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isToday(day.date) ? 'text-accent' : 'text-white'}`}>
                  {isToday(day.date) ? 'Today' : new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-macro-protein">{day.protein}g P</span>
                <span className="text-xs text-macro-carbs">{day.carbs}g C</span>
                <span className="text-xs text-macro-fat">{day.fat}g F</span>
                <span className="text-white font-bold text-sm">{day.calories}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

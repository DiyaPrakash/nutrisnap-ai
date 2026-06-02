import { useEffect, useState } from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { getStreak, getMeals } from '../lib/storage';
import { StreakData, MealEntry } from '../lib/types';

interface StreakPageProps {
  refreshKey: number;
}

export default function StreakPage({ refreshKey }: StreakPageProps) {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, bestStreak: 0, lastLogDate: '' });
  const [totalMeals, setTotalMeals] = useState(0);
  const [uniqueDays, setUniqueDays] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
    const meals: MealEntry[] = getMeals();
    setTotalMeals(meals.length);
    const days = new Set(meals.map(m => m.date));
    setUniqueDays(days.size);
  }, [refreshKey]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="pt-12 pb-2 px-5">
        <h1 className="text-2xl font-bold text-white">Streak</h1>
        <p className="text-sm text-gray-500">Keep the momentum going</p>
      </div>

      {/* Current Streak */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-dark-700 border border-accent/10 p-8 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-accent/15 mb-4">
            <Flame size={40} className="text-accent" />
          </div>
          <p className="text-6xl font-extrabold text-white mb-1">{streak.currentStreak}</p>
          <p className="text-accent font-semibold text-lg">Day Streak</p>
          <p className="text-gray-500 text-sm mt-2">
            {streak.currentStreak === 0
              ? 'Log a meal to start your streak!'
              : streak.currentStreak === 1
                ? 'Great start! Keep it going tomorrow.'
                : `Amazing! ${streak.currentStreak} days and counting.`}
          </p>
        </div>
      </div>

      {/* Best Streak */}
      <div className="px-5 mt-4">
        <div className="rounded-2xl bg-dark-700 border border-white/5 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-yellow-500/10">
            <Trophy size={22} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Best Streak</p>
            <p className="text-white text-2xl font-bold">{streak.bestStreak} <span className="text-sm text-gray-500 font-normal">days</span></p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-dark-700 border border-white/5 p-4 text-center">
          <Calendar size={20} className="text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{uniqueDays}</p>
          <p className="text-gray-500 text-xs mt-0.5">Days Tracked</p>
        </div>
        <div className="rounded-xl bg-dark-700 border border-white/5 p-4 text-center">
          <Flame size={20} className="text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalMeals}</p>
          <p className="text-gray-500 text-xs mt-0.5">Meals Logged</p>
        </div>
      </div>

      {/* Motivation */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl bg-dark-700/50 border border-white/5 p-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            <span className="text-accent font-semibold">Consistency is key.</span> Logging your meals every day builds awareness and helps you reach your nutrition goals faster. Even on off days, a quick snap keeps your streak alive!
          </p>
        </div>
      </div>
    </div>
  );
}

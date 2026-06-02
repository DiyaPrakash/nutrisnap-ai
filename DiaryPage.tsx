import { useState, useEffect } from 'react';
import { Trash2, UtensilsCrossed, Flame } from 'lucide-react';
import { getTodayMeals, deleteMeal, getTodayTotals } from '../lib/storage';
import { MealEntry } from '../lib/types';

interface DiaryPageProps {
  refreshKey: number;
}

export default function DiaryPage({ refreshKey }: DiaryPageProps) {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    setMeals(getTodayMeals());
    setTotals(getTodayTotals());
  }, [refreshKey]);

  const handleDelete = (id: string) => {
    deleteMeal(id);
    setMeals(getTodayMeals());
    setTotals(getTodayTotals());
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="pt-12 pb-2 px-5">
        <h1 className="text-2xl font-bold text-white">Diary</h1>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      {/* Calorie Summary Card */}
      <div className="px-5 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-accent" />
            <span className="text-sm text-accent font-medium">Today's Calories</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-white">{totals.calories}</span>
            <span className="text-gray-400 text-sm">kcal</span>
          </div>
          <div className="flex gap-4 mt-3">
            <span className="text-xs text-macro-protein font-medium">{totals.protein}g protein</span>
            <span className="text-xs text-macro-carbs font-medium">{totals.carbs}g carbs</span>
            <span className="text-xs text-macro-fat font-medium">{totals.fat}g fat</span>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="px-5 mt-5 pb-24">
        {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-2xl bg-dark-700/50 mb-4">
              <UtensilsCrossed size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-medium">No meals logged today</p>
            <p className="text-gray-600 text-sm mt-1">Snap a photo to start tracking</p>
          </div>
        ) : (
          <div className="space-y-2">
            {meals.map((meal, i) => (
              <div
                key={meal.id}
                className="rounded-xl bg-dark-700 border border-white/5 p-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">{meal.foodName}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {meal.servingSize} · {formatTime(meal.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-white font-bold text-lg">{meal.calories}</span>
                  <span className="text-gray-500 text-xs">kcal</span>
                  <div className="flex-1" />
                  <span className="px-2 py-0.5 rounded-md bg-macro-protein/10 text-macro-protein text-xs font-medium">
                    P {meal.protein}g
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-macro-carbs/10 text-macro-carbs text-xs font-medium">
                    C {meal.carbs}g
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-macro-fat/10 text-macro-fat text-xs font-medium">
                    F {meal.fat}g
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

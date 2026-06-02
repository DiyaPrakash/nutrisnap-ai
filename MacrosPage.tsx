import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import { getTodayTotals } from '../lib/storage';
import ProgressRing from '../components/ProgressRing';

interface MacrosPageProps {
  refreshKey: number;
}

const GOALS = {
  protein: 150,
  carbs: 200,
  fat: 65,
};

export default function MacrosPage({ refreshKey }: MacrosPageProps) {
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    setTotals(getTodayTotals());
  }, [refreshKey]);

  const proteinPct = Math.min((totals.protein / GOALS.protein) * 100, 100);
  const carbsPct = Math.min((totals.carbs / GOALS.carbs) * 100, 100);
  const fatPct = Math.min((totals.fat / GOALS.fat) * 100, 100);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="pt-12 pb-2 px-5">
        <h1 className="text-2xl font-bold text-white">Macros</h1>
        <p className="text-sm text-gray-500">Daily nutritional goals</p>
      </div>

      {/* Progress Rings */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl bg-dark-700 border border-white/5 p-6">
          <div className="flex items-center justify-around">
            <ProgressRing
              value={totals.protein}
              max={GOALS.protein}
              size={100}
              strokeWidth={8}
              color="#3b82f6"
              label="Protein"
              unit="g"
            />
            <ProgressRing
              value={totals.carbs}
              max={GOALS.carbs}
              size={100}
              strokeWidth={8}
              color="#f97316"
              label="Carbs"
              unit="g"
            />
            <ProgressRing
              value={totals.fat}
              max={GOALS.fat}
              size={100}
              strokeWidth={8}
              color="#22c55e"
              label="Fat"
              unit="g"
            />
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="px-5 mt-4 space-y-3">
        {/* Protein */}
        <div className="rounded-xl bg-dark-700 border border-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-macro-protein" />
              <span className="text-white font-medium text-sm">Protein</span>
            </div>
            <span className="text-gray-400 text-sm">{totals.protein}g / {GOALS.protein}g</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-macro-protein transition-all duration-700 ease-out"
              style={{ width: `${proteinPct}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="rounded-xl bg-dark-700 border border-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-macro-carbs" />
              <span className="text-white font-medium text-sm">Carbs</span>
            </div>
            <span className="text-gray-400 text-sm">{totals.carbs}g / {GOALS.carbs}g</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-macro-carbs transition-all duration-700 ease-out"
              style={{ width: `${carbsPct}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div className="rounded-xl bg-dark-700 border border-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-macro-fat" />
              <span className="text-white font-medium text-sm">Fat</span>
            </div>
            <span className="text-gray-400 text-sm">{totals.fat}g / {GOALS.fat}g</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-macro-fat transition-all duration-700 ease-out"
              style={{ width: `${fatPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goals Info */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl bg-dark-700/50 border border-white/5 p-4 flex items-start gap-3">
          <Target size={18} className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-white font-medium text-sm">Daily Goals</p>
            <p className="text-gray-500 text-xs mt-1">
              Protein: {GOALS.protein}g · Carbs: {GOALS.carbs}g · Fat: {GOALS.fat}g
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

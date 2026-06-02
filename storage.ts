import { MealEntry, DailyData, StreakData } from './types';

const MEALS_KEY = 'nutrisnap_meals';
const STREAK_KEY = 'nutrisnap_streak';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getMeals(): MealEntry[] {
  const raw = localStorage.getItem(MEALS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveMeals(meals: MealEntry[]) {
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function addMeal(entry: Omit<MealEntry, 'id' | 'timestamp' | 'date'>): MealEntry {
  const meals = getMeals();
  const meal: MealEntry = {
    ...entry,
    id: generateId(),
    timestamp: Date.now(),
    date: getToday(),
  };
  meals.push(meal);
  saveMeals(meals);
  updateStreak();
  return meal;
}

export function deleteMeal(id: string) {
  const meals = getMeals().filter(m => m.id !== id);
  saveMeals(meals);
}

export function getTodayMeals(): MealEntry[] {
  const today = getToday();
  return getMeals().filter(m => m.date === today);
}

export function getTodayTotals(): { calories: number; protein: number; carbs: number; fat: number } {
  const meals = getTodayMeals();
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function getLast7Days(): DailyData[] {
  const meals = getMeals();
  const days: DailyData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayMeals = meals.filter(m => m.date === dateStr);
    days.push({
      date: dateStr,
      calories: dayMeals.reduce((s, m) => s + m.calories, 0),
      protein: dayMeals.reduce((s, m) => s + m.protein, 0),
      carbs: dayMeals.reduce((s, m) => s + m.carbs, 0),
      fat: dayMeals.reduce((s, m) => s + m.fat, 0),
    });
  }
  return days;
}

export function getStreak(): StreakData {
  const raw = localStorage.getItem(STREAK_KEY);
  if (raw) return JSON.parse(raw);
  return { currentStreak: 0, bestStreak: 0, lastLogDate: '' };
}

function saveStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

function updateStreak() {
  const streak = getStreak();
  const today = getToday();

  if (streak.lastLogDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (streak.lastLogDate === yesterdayStr) {
    streak.currentStreak += 1;
  } else {
    streak.currentStreak = 1;
  }

  streak.lastLogDate = today;
  streak.bestStreak = Math.max(streak.bestStreak, streak.currentStreak);
  saveStreak(streak);
}

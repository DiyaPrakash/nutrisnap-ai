export interface FoodAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
}

export interface MealEntry {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
}

export interface DailyData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastLogDate: string; // YYYY-MM-DD
}

export type TabId = 'home' | 'diary' | 'macros' | 'history' | 'streak';

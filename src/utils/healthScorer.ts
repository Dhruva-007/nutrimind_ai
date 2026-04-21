import { MealLog, FoodOption, UserProfile } from '../types';

export const calculateDailyHealthScore = (meals: MealLog[], target: number): number => {
  if (meals.length === 0) return 100;
  
  const consistencyScore = 30; // base score if no skips
  const skips = meals.filter(m => m.skipped).length;
  const consistency = Math.max(0, consistencyScore - (skips * 10));

  const totalCals = meals.reduce((sum, m) => sum + (m.skipped ? 0 : m.calories), 0);
  const diff = Math.abs(totalCals - target) / target;
  const goalAlignment = Math.max(0, 30 - (diff * 30));

  const avgHealth = meals.reduce((sum, m) => sum + m.healthScore, 0) / (meals.length || 1);
  const nutritionBalance = (avgHealth / 100) * 40;

  return Math.round(consistency + goalAlignment + nutritionBalance);
};

export const scoreMeal = (food: FoodOption, profile: UserProfile): number => {
  return food.healthScore; // using base food DB score for now
};

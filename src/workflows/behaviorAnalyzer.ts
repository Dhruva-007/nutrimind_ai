import { MealLog, BehaviorAnalysis } from '../types';

export const analyzeBehavior = (history: MealLog[]): BehaviorAnalysis => {
  if (!history || history.length === 0) {
    return {
      skippedMeals: 0,
      avgCaloriesPerMeal: 0,
      preferredFoods: [],
      avoidedFoods: [],
      consistencyScore: 100,
      compensationNeeded: false,
      calorieDebt: 0,
      lastSkippedMeal: null
    };
  }

  const skippedMeals = history.filter(m => m.skipped).length;
  
  const totalCalories = history.reduce((sum, m) => sum + (m.skipped ? 0 : m.calories), 0);
  const actualMeals = history.length - skippedMeals;
  const avgCaloriesPerMeal = actualMeals > 0 ? totalCalories / actualMeals : 0;

  const preferredFoods = history
    .filter(m => m.userFeedback === 'liked')
    .map(m => m.foodName);
    
  const avoidedFoods = history
    .filter(m => m.userFeedback === 'disliked')
    .map(m => m.foodName);

  const consistencyScore = (actualMeals / history.length) * 100;

  // Simple heuristic for calorie debt over last 8h
  const last8h = history.filter(m => Date.now() - m.timestamp <= 8 * 3600000);
  const expectedCalories8h = 800; // Arbitrary 8-hour expected burn
  const actualCalories8h = last8h.reduce((sum, m) => sum + (m.skipped ? 0 : m.calories), 0);
  const calorieDebt = Math.max(0, expectedCalories8h - actualCalories8h);

  const compensationNeeded = skippedMeals > 0 && calorieDebt > 200;
  
  const lastSkipped = history.find(m => m.skipped);
  const lastSkippedMeal = lastSkipped ? lastSkipped.foodName : null;

  return {
    skippedMeals,
    avgCaloriesPerMeal,
    preferredFoods: [...new Set(preferredFoods)],
    avoidedFoods: [...new Set(avoidedFoods)],
    consistencyScore,
    compensationNeeded,
    calorieDebt,
    lastSkippedMeal
  };
};

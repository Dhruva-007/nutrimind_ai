import { UserProfile } from '../types';

export const calculateBMR = (profile: UserProfile): number => {
  // Generic Mifflin-St Jeor (assuming male or generic)
  return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  switch (activityLevel) {
    case 'light': return bmr * 1.375;
    case 'moderate': return bmr * 1.55;
    case 'active': return bmr * 1.725;
    default: return bmr * 1.2;
  }
};

export const calculateDailyTarget = (tdee: number, goal: string): number => {
  if (goal === 'lose') return tdee - 500;
  if (goal === 'gain') return tdee + 300;
  return tdee;
};

export const calculateMealTarget = (dailyTarget: number, mealType: string): number => {
  switch (mealType) {
    case 'breakfast': return dailyTarget * 0.25;
    case 'lunch': return dailyTarget * 0.35;
    case 'dinner': return dailyTarget * 0.30;
    case 'snack': return dailyTarget * 0.10;
    default: return dailyTarget * 0.33;
  }
};

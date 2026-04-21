export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'lose' | 'gain' | 'maintain';
  diet: 'veg' | 'vegan' | 'omnivore' | 'keto' | 'diabetic';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  createdAt: number;
  updatedAt: number;
}

export interface MealLog {
  id: string;
  uid: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
  timestamp: number;
  skipped: boolean;
  userFeedback: 'liked' | 'ignored' | 'disliked' | null;
  imageUrl?: string;
}

export interface ContextState {
  state: 'hungry' | 'full' | 'neutral' | 'post-workout' | 'pre-workout';
  urgency: 'high' | 'medium' | 'low';
  context: 'morning_boost' | 'afternoon_low_energy' | 'evening_wind_down' | 'post_workout_recovery' | 'midnight_craving';
  timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  hoursSinceLastMeal: number;
  currentHour: number;
  activityToday: string;
}

export interface FoodOption {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
  prepTime: number;
  category: string;
}

export interface Recommendation {
  primary: FoodOption;
  alternative: FoodOption;
  avoid: string[];
  reasoning: string;
  contextUsed: ContextState;
  adaptationNote: string;
  generatedAt: number;
}

export interface BehaviorAnalysis {
  skippedMeals: number;
  avgCaloriesPerMeal: number;
  preferredFoods: string[];
  avoidedFoods: string[];
  consistencyScore: number;
  compensationNeeded: boolean;
  calorieDebt: number;
  lastSkippedMeal: string | null;
}

export interface WorkflowInput {
  userId: string;
  profile: UserProfile;
  context: ContextState;
  behaviorHistory: BehaviorAnalysis;
  foodOptions?: FoodOption[];
}

export interface WorkflowOutput {
  recommendation: Recommendation;
  pipeline: 'standard' | 'low-sugar' | 'high-protein' | 'low-carb';
  confidence: number;
}

export interface FoodClassification {
  foodName: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  confidence: number;
  healthScore: number;
}

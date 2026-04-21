import { ContextState } from '../types';

export const detectContext = (input: {
  currentHour: number;
  lastMealTimestamp: number | null;
  activityToday: string;
}): ContextState => {
  const now = Date.now();
  let hoursSinceLastMeal = 12; // Default if null
  
  if (input.lastMealTimestamp) {
    hoursSinceLastMeal = (now - input.lastMealTimestamp) / 3600000;
  }

  let timeOfDay: ContextState['timeOfDay'];
  if (input.currentHour >= 5 && input.currentHour < 11) timeOfDay = 'breakfast';
  else if (input.currentHour >= 11 && input.currentHour < 15) timeOfDay = 'lunch';
  else if (input.currentHour >= 15 && input.currentHour < 18) timeOfDay = 'snack';
  else if (input.currentHour >= 18 && input.currentHour < 22) timeOfDay = 'dinner';
  else timeOfDay = 'snack'; // Midnight snack

  let urgency: ContextState['urgency'];
  if (hoursSinceLastMeal > 6) urgency = 'high';
  else if (hoursSinceLastMeal > 3) urgency = 'medium';
  else urgency = 'low';

  let state: ContextState['state'];
  if (input.activityToday === 'active' && hoursSinceLastMeal > 2) {
    state = 'post-workout';
  } else if (urgency === 'high') {
    state = 'hungry';
  } else if (hoursSinceLastMeal < 1) {
    state = 'full';
  } else {
    state = 'neutral';
  }

  let context: ContextState['context'];
  if (timeOfDay === 'breakfast' && state === 'hungry') {
    context = 'morning_boost';
  } else if (timeOfDay === 'lunch' && (input.currentHour >= 14 && input.currentHour <= 16)) {
    context = 'afternoon_low_energy';
  } else if (timeOfDay === 'dinner') {
    context = 'evening_wind_down';
  } else if (state === 'post-workout') {
    context = 'post_workout_recovery';
  } else if (input.currentHour >= 22 || input.currentHour < 5) {
    context = 'midnight_craving';
  } else {
    // Default fallback mappings
    context = 'morning_boost'; 
  }

  return {
    state,
    urgency,
    context,
    timeOfDay,
    hoursSinceLastMeal,
    currentHour: input.currentHour,
    activityToday: input.activityToday
  };
};

import { WorkflowInput, WorkflowOutput } from '../types';
import { analyzeProfile } from './profileAnalyzer';
import { evaluateFoodOptions } from './nutritionEvaluator';

export const generateRecommendation = (input: WorkflowInput): WorkflowOutput => {
  const profileData = analyzeProfile(input.profile);
  
  let mealsPerDay = 3;
  if (input.context.timeOfDay === 'snack') mealsPerDay = 6; // Just treating snack as smaller chunk

  let mealTarget = profileData.dailyTarget / mealsPerDay;
  if (input.context.timeOfDay === 'breakfast') mealTarget = profileData.dailyTarget * 0.25;
  if (input.context.timeOfDay === 'lunch') mealTarget = profileData.dailyTarget * 0.35;
  if (input.context.timeOfDay === 'dinner') mealTarget = profileData.dailyTarget * 0.30;
  if (input.context.timeOfDay === 'snack') mealTarget = profileData.dailyTarget * 0.10;

  const evaluated = evaluateFoodOptions(
    profileData.pipeline,
    input.context,
    input.behaviorHistory,
    mealTarget
  );

  const primary = evaluated.ranked[0] || null;
  const alternative = evaluated.ranked[1] || null;

  let adaptationNote = "On track with daily goal";
  if (input.behaviorHistory.compensationNeeded) {
    adaptationNote = `Compensating for skipped ${input.behaviorHistory.lastSkippedMeal || 'meal'}`;
  }

  const reasoning = `Based on: ${input.context.state} state + ${profileData.pipeline} pipeline active. Target for this meal is ~${Math.round(mealTarget)} cal.`;

  return {
    recommendation: {
      primary,
      alternative,
      avoid: evaluated.avoid,
      reasoning,
      contextUsed: input.context,
      adaptationNote,
      generatedAt: Date.now()
    },
    pipeline: profileData.pipeline,
    confidence: 0.92
  };
};

import { WorkflowInput, WorkflowOutput } from '../types';
import { getUserProfile, getMealHistory } from '../services/firestore';
import { detectContext } from './contextDetector';
import { analyzeProfile } from './profileAnalyzer';
import { analyzeBehavior } from './behaviorAnalyzer';
import { generateRecommendation } from './decisionGenerator';
import { cacheSet, cacheGet } from '../utils/cache';
import { logEvent } from '../services/bigquery';

export const runMasterWorkflow = async (
  userId: string,
  input: Partial<WorkflowInput>
): Promise<WorkflowOutput> => {
  const currentHour = input.context?.currentHour ?? new Date().getHours();
  const cacheKey = `${userId}_${currentHour}`;
  
  const cached = cacheGet<WorkflowOutput>(cacheKey);
  if (cached) {
    return cached;
  }

  const profile = input.profile || await getUserProfile(userId);
  if (!profile) throw new Error('User profile not found');

  const recentMeals = await getMealHistory(userId, 20);
  const lastMealTimestamp = recentMeals.length > 0 ? recentMeals[0].timestamp : null;

  const context = input.context || detectContext({
    currentHour,
    lastMealTimestamp,
    activityToday: profile.activityLevel
  });

  const behavior = input.behaviorHistory || analyzeBehavior(recentMeals);

  const fullInput: WorkflowInput = {
    userId,
    profile,
    context,
    behaviorHistory: behavior
  };

  const output = generateRecommendation(fullInput);

  // Cache for 5 mins
  cacheSet(cacheKey, output, 5 * 60 * 1000);

  // BigQuery log
  await logEvent({
    event_type: 'recommendation_generated',
    timestamp: Date.now(),
    session_id: userId,
    pipeline_used: output.pipeline
  });

  return output;
};

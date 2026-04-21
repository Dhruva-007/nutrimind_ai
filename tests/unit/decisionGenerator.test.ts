import { generateRecommendation } from '../../src/workflows/decisionGenerator';
import { WorkflowInput, UserProfile } from '../../src/types';

describe('Decision Generator', () => {
  const profile: UserProfile = { uid: 'u', name: 'Test', age: 30, weight: 80, height: 180, goal: 'lose', diet: 'diabetic', activityLevel: 'sedentary', createdAt: 0, updatedAt: 0 };
  const input: WorkflowInput = {
    userId: 'u',
    profile,
    context: { currentHour: 13, state: 'neutral', urgency: 'low', context: 'afternoon_low_energy', timeOfDay: 'lunch', hoursSinceLastMeal: 3, activityToday: 'sedentary' },
    behaviorHistory: { skippedMeals: 0, avgCaloriesPerMeal: 500, preferredFoods: [], avoidedFoods: ['Pizza'], consistencyScore: 100, compensationNeeded: false, calorieDebt: 0, lastSkippedMeal: null }
  };

  it('diabetic profile routes to low-sugar pipeline', () => {
    const res = generateRecommendation(input);
    expect(res.pipeline).toBe('low-sugar');
  });

  it('active + gain goal routes to high-protein pipeline', () => {
    const activeProfile = { ...profile, goal: 'gain' as const, diet: 'omnivore' as const, activityLevel: 'active' as const };
    const res = generateRecommendation({ ...input, profile: activeProfile });
    expect(res.pipeline).toBe('high-protein');
  });

  it('avoid list excludes disliked foods', () => {
    const res = generateRecommendation({ ...input, behaviorHistory: { ...input.behaviorHistory, avoidedFoods: ['Pizza'] } });
    expect(res.recommendation.avoid).toContain('Pizza');
  });

  it('alternative is different from primary', () => {
    const res = generateRecommendation(input);
    expect(res.recommendation.primary.name).not.toBe(res.recommendation.alternative.name);
  });
});

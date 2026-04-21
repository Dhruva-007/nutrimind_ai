import { analyzeBehavior } from '../../src/workflows/behaviorAnalyzer';
import { MealLog } from '../../src/types';

describe('Behavior Analyzer', () => {
  const mockHistory: MealLog[] = [
    { id: '1', uid: 'u', foodName: 'Oats', calories: 400, protein: 10, carbs: 50, fat: 5, healthScore: 90, timestamp: Date.now() - 1*3600000, skipped: false, userFeedback: 'liked' },
    { id: '2', uid: 'u', foodName: 'Pizza', calories: 800, protein: 20, carbs: 100, fat: 30, healthScore: 40, timestamp: Date.now() - 6*3600000, skipped: false, userFeedback: 'disliked' },
    { id: '3', uid: 'u', foodName: 'Lunch', calories: 0, protein: 0, carbs: 0, fat: 0, healthScore: 0, timestamp: Date.now() - 10*3600000, skipped: true, userFeedback: null }
  ];

  it('skipped meal count is accurate', () => {
    const res = analyzeBehavior(mockHistory);
    expect(res.skippedMeals).toBe(1);
  });

  it('preferred foods extracted from liked feedback', () => {
    const res = analyzeBehavior(mockHistory);
    expect(res.preferredFoods).toContain('Oats');
  });

  it('avoided foods extracted from disliked feedback', () => {
    const res = analyzeBehavior(mockHistory);
    expect(res.avoidedFoods).toContain('Pizza');
  });

  it('consistencyScore is accurate', () => {
    const res = analyzeBehavior(mockHistory);
    expect(Math.round(res.consistencyScore)).toBe(67); // 2 out of 3 = 66.6%
  });

  it('empty history returns safe defaults', () => {
    const res = analyzeBehavior([]);
    expect(res.skippedMeals).toBe(0);
    expect(res.consistencyScore).toBe(100);
  });
});

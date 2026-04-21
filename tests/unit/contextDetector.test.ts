import { detectContext } from '../../src/workflows/contextDetector';

describe('Context Detector', () => {
  it('7am -> breakfast + morning_boost', () => {
    const ctx = detectContext({ currentHour: 7, lastMealTimestamp: Date.now() - 10*3600000, activityToday: 'sedentary' });
    expect(ctx.timeOfDay).toBe('breakfast');
    expect(ctx.context).toBe('morning_boost');
  });

  it('13pm + last meal 8h ago -> lunch + hungry + high urgency', () => {
    const ctx = detectContext({ currentHour: 13, lastMealTimestamp: Date.now() - 8*3600000, activityToday: 'sedentary' });
    expect(ctx.timeOfDay).toBe('lunch');
    expect(ctx.urgency).toBe('high');
    expect(ctx.state).toBe('hungry');
  });

  it('last meal 30min ago -> full + low urgency', () => {
    const ctx = detectContext({ currentHour: 14, lastMealTimestamp: Date.now() - 0.5*3600000, activityToday: 'sedentary' });
    expect(ctx.state).toBe('full');
    expect(ctx.urgency).toBe('low');
  });

  it('active + 3h since meal -> post-workout state', () => {
    const ctx = detectContext({ currentHour: 16, lastMealTimestamp: Date.now() - 3*3600000, activityToday: 'active' });
    expect(ctx.state).toBe('post-workout');
    expect(ctx.context).toBe('post_workout_recovery');
  });

  it('22pm -> snack + evening_wind_down (default fallback or midnight_craving depending on hour)', () => {
    const ctx = detectContext({ currentHour: 22, lastMealTimestamp: Date.now() - 4*3600000, activityToday: 'sedentary' });
    expect(['snack', 'dinner']).toContain(ctx.timeOfDay); // 22 triggers snack in logic
    expect(ctx.context).toBe('midnight_craving');
  });

  it('null lastMeal -> treated as 12h since last meal', () => {
    const ctx = detectContext({ currentHour: 12, lastMealTimestamp: null, activityToday: 'sedentary' });
    expect(ctx.hoursSinceLastMeal).toBe(12);
  });
});

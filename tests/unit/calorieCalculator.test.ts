import { calculateBMR, calculateTDEE, calculateDailyTarget, calculateMealTarget } from '../../src/utils/calorieCalculator';
import { UserProfile } from '../../src/types';

describe('Calorie Calculator', () => {
  const profileMale: UserProfile = {
    uid: '1', name: 'Bob', age: 30, weight: 80, height: 180, goal: 'lose', diet: 'omnivore', activityLevel: 'active', createdAt: 0, updatedAt: 0
  };

  const profileFemale: UserProfile = {
    uid: '2', name: 'Alice', age: 28, weight: 65, height: 165, goal: 'gain', diet: 'omnivore', activityLevel: 'light', createdAt: 0, updatedAt: 0
  };

  it('BMR calculation for male profile', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 
    // = 800 + 1125 - 150 + 5 = 1780
    expect(calculateBMR(profileMale)).toBe(1780);
  });

  it('BMR calculation for female profile', () => {
    // 10*65 + 6.25*165 - 5*28 + 5
    // = 650 + 1031.25 - 140 + 5 = 1546.25
    expect(calculateBMR(profileFemale)).toBe(1546.25);
  });

  it('TDEE applies correct activity multiplier', () => {
    expect(calculateTDEE(1000, 'sedentary')).toBe(1200);
    expect(calculateTDEE(1000, 'light')).toBe(1375);
    expect(calculateTDEE(1000, 'active')).toBe(1725);
  });

  it('Goal=lose reduces by 500 calories', () => {
    expect(calculateDailyTarget(2000, 'lose')).toBe(1500);
  });

  it('Goal=gain increases by 300 calories', () => {
    expect(calculateDailyTarget(2000, 'gain')).toBe(2300);
  });

  it('Meal target proportions sum to 100%', () => {
    const total = 1000;
    const p1 = calculateMealTarget(total, 'breakfast'); // 250
    const p2 = calculateMealTarget(total, 'lunch');     // 350
    const p3 = calculateMealTarget(total, 'dinner');    // 300
    const p4 = calculateMealTarget(total, 'snack');     // 100
    expect(p1 + p2 + p3 + p4).toBe(1000);
  });
});

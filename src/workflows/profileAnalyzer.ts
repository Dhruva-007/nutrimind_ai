import { UserProfile, WorkflowOutput } from '../types';

export const analyzeProfile = (profile: UserProfile): {
  bmr: number;
  tdee: number;
  dailyTarget: number;
  pipeline: WorkflowOutput['pipeline'];
} => {
  let bmr = 0;
  // Assume generic male/female calculation via an extended profile or simplified logic
  // We'll use male formula slightly adjusted if generic, or ask user later. 
  // For now using the male one as default baseline if gender isn't in UserProfile
  bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;

  let activityMultiplier = 1.2;
  switch (profile.activityLevel) {
    case 'light': activityMultiplier = 1.375; break;
    case 'moderate': activityMultiplier = 1.55; break;
    case 'active': activityMultiplier = 1.725; break;
  }

  const tdee = bmr * activityMultiplier;

  let dailyTarget = tdee;
  if (profile.goal === 'lose') dailyTarget = tdee - 500;
  if (profile.goal === 'gain') dailyTarget = tdee + 300;

  let pipeline: WorkflowOutput['pipeline'] = 'standard';
  if (profile.diet === 'diabetic' || profile.goal === 'lose') {
    pipeline = 'low-sugar';
  } else if (profile.activityLevel === 'active' && profile.goal === 'gain') {
    pipeline = 'high-protein';
  } else if (profile.diet === 'keto') {
    pipeline = 'low-carb';
  }

  return {
    bmr,
    tdee,
    dailyTarget,
    pipeline
  };
};

export interface MacroTargets {
  protein: number;
  carbs: number;
  fat: number;
}

export const getMacroTargets = (pipeline: string, totalCalories: number): MacroTargets => {
  let pPct = 0.25, cPct = 0.50, fPct = 0.25;
  
  if (pipeline === 'high-protein') {
    pPct = 0.40; cPct = 0.35; fPct = 0.25;
  } else if (pipeline === 'low-sugar') {
    pPct = 0.30; cPct = 0.30; fPct = 0.40;
  } else if (pipeline === 'low-carb') {
    pPct = 0.35; cPct = 0.10; fPct = 0.55;
  }

  return {
    protein: totalCalories * pPct,
    carbs: totalCalories * cPct,
    fat: totalCalories * fPct
  };
};

export const gramsFromCalories = (macroCalories: number, macroType: 'protein' | 'carbs' | 'fat'): number => {
  if (macroType === 'protein' || macroType === 'carbs') return macroCalories / 4;
  return macroCalories / 9;
};

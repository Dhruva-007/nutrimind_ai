import { FoodOption, ContextState, BehaviorAnalysis, WorkflowOutput } from '../types';

export const FOOD_DB: FoodOption[] = [
  // High protein
  { name:"Grilled Chicken Bowl", calories:420, protein:42, carbs:35, fat:8, healthScore:88, prepTime:15, category:"high-protein" },
  { name:"Greek Yogurt Parfait", calories:280, protein:20, carbs:32, fat:5, healthScore:85, prepTime:5, category:"high-protein" },
  { name:"Egg White Omelette", calories:180, protein:24, carbs:4, fat:3, healthScore:90, prepTime:10, category:"high-protein" },
  { name:"Salmon & Quinoa", calories:520, protein:45, carbs:40, fat:12, healthScore:92, prepTime:20, category:"high-protein" },
  { name:"Turkey Wrap", calories:380, protein:32, carbs:38, fat:9, healthScore:80, prepTime:8, category:"high-protein" },
  // Low sugar
  { name:"Avocado Toast (No Sugar)", calories:310, protein:8, carbs:28, fat:18, healthScore:82, prepTime:5, category:"low-sugar" },
  { name:"Vegetable Stir Fry", calories:240, protein:10, carbs:30, fat:6, healthScore:86, prepTime:15, category:"low-sugar" },
  { name:"Cucumber & Hummus", calories:150, protein:6, carbs:18, fat:7, healthScore:84, prepTime:2, category:"low-sugar" },
  { name:"Mixed Greens Salad", calories:180, protein:5, carbs:15, fat:10, healthScore:88, prepTime:5, category:"low-sugar" },
  { name:"Lentil Soup", calories:290, protein:18, carbs:38, fat:4, healthScore:87, prepTime:20, category:"low-sugar" },
  // Low carb / keto
  { name:"Keto Bacon & Eggs", calories:480, protein:32, carbs:2, fat:38, healthScore:72, prepTime:12, category:"low-carb" },
  { name:"Cheese & Nut Plate", calories:350, protein:16, carbs:8, fat:28, healthScore:70, prepTime:2, category:"low-carb" },
  { name:"Zucchini Noodles", calories:220, protein:12, carbs:18, fat:8, healthScore:85, prepTime:15, category:"low-carb" },
  // Standard balanced
  { name:"Oatmeal & Berries", calories:320, protein:10, carbs:58, fat:6, healthScore:88, prepTime:5, category:"standard" },
  { name:"Brown Rice & Dal", calories:380, protein:16, carbs:62, fat:5, healthScore:86, prepTime:25, category:"standard" },
  { name:"Whole Wheat Pasta", calories:440, protein:18, carbs:72, fat:7, healthScore:78, prepTime:20, category:"standard" },
  { name:"Banana Smoothie", calories:260, protein:8, carbs:48, fat:4, healthScore:80, prepTime:3, category:"standard" },
  { name:"Veggie Sandwich", calories:340, protein:14, carbs:52, fat:8, healthScore:79, prepTime:7, category:"standard" },
  { name:"Paneer Tikka", calories:360, protein:22, carbs:18, fat:20, healthScore:76, prepTime:20, category:"standard" },
  { name:"Fruit Bowl", calories:180, protein:3, carbs:42, fat:1, healthScore:91, prepTime:3, category:"standard" },
  // Snacks
  { name:"Protein Bar", calories:200, protein:20, carbs:22, fat:6, healthScore:72, prepTime:0, category:"snack" },
  { name:"Mixed Nuts", calories:170, protein:5, carbs:8, fat:15, healthScore:82, prepTime:0, category:"snack" },
  { name:"Apple & Almond Butter", calories:220, protein:5, carbs:28, fat:12, healthScore:85, prepTime:2, category:"snack" },
  { name:"Rice Cakes", calories:130, protein:3, carbs:26, fat:1, healthScore:70, prepTime:0, category:"snack" },
  { name:"Dark Chocolate (1 sq)", calories:60, protein:1, carbs:8, fat:4, healthScore:65, prepTime:0, category:"snack" },
  // Morning
  { name:"Poha", calories:250, protein:6, carbs:48, fat:4, healthScore:81, prepTime:10, category:"breakfast" },
  { name:"Idli Sambar", calories:280, protein:10, carbs:52, fat:3, healthScore:87, prepTime:15, category:"breakfast" },
  { name:"Upma", calories:230, protein:7, carbs:42, fat:5, healthScore:80, prepTime:10, category:"breakfast" },
  { name:"Sprouts Salad", calories:160, protein:12, carbs:22, fat:2, healthScore:93, prepTime:5, category:"breakfast" },
  { name:"Whole Grain Cereal", calories:290, protein:9, carbs:54, fat:4, healthScore:78, prepTime:2, category:"breakfast" }
];

export const evaluateFoodOptions = (
  pipeline: WorkflowOutput['pipeline'],
  context: ContextState,
  behavior: BehaviorAnalysis,
  targetCalories: number
): { ranked: FoodOption[]; avoid: string[] } => {
  const filtered = FOOD_DB.filter(
    food => food.category === pipeline || food.category === 'standard' || 
            (context.timeOfDay === 'snack' && food.category === 'snack') ||
            (context.timeOfDay === 'breakfast' && food.category === 'breakfast')
  );

  const scored = filtered.map(food => {
    // 1 - abs(food.cal - target)/target
    const calorieMatch = Math.max(0, 1 - Math.abs(food.calories - targetCalories) / Math.max(targetCalories, 1));
    
    let contextFit = 0.5;
    if (context.state === 'post-workout' && (food.category === 'high-protein' || food.protein > 20)) contextFit += 0.3;
    if (context.timeOfDay === 'breakfast' && food.category === 'breakfast') contextFit += 0.3;

    let userPref = 0.5;
    if (behavior.preferredFoods.includes(food.name)) userPref += 0.3;

    let bonus = 0;
    if (behavior.compensationNeeded && food.calories > targetCalories) {
      bonus += 0.2; 
    }

    const score = (food.healthScore / 100) * 0.4 + calorieMatch * 0.3 + contextFit * 0.2 + userPref * 0.1 + bonus;
    return { food, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const ranked = scored.map(s => s.food).filter(f => !behavior.avoidedFoods.includes(f.name));

  return {
    ranked,
    avoid: behavior.avoidedFoods
  };
};

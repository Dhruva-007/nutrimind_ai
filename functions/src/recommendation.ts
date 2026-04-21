import { onCall, HttpsError } from 'firebase-functions/v2/https';
// In a real setup, we'd import the master workflow logic from shared folder or rewritten here.
// For this demo, we'll emulate the masterWorkflow processing on backend.
import * as admin from 'firebase-admin';

export const getRecommendation = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'User must log in');
  
  const uid = request.auth.uid;
  const { currentHour, lastMealTimestamp, activityToday } = request.data;

  // Emulation of the workflow output
  try {
    const db = admin.firestore();
    let targetCals = 450; 
    let pipeline = 'standard';
    
    // Simulate user logic
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      if (data?.diet === 'keto') pipeline = 'low-carb';
      if (data?.goal === 'lose') pipeline = 'low-sugar';
      if (data?.activityLevel === 'active') pipeline = 'high-protein';
    }

    // Mock response fitting WorkflowOutput
    return {
      recommendation: {
        primary: { name: "Greek Yogurt Parfait", calories: 280, protein: 20, carbs: 32, fat: 5, healthScore: 85, prepTime: 5, category: pipeline },
        alternative: { name: "Fruit Bowl", calories: 180, protein: 3, carbs: 42, fat: 1, healthScore: 91, prepTime: 3, category: pipeline },
        avoid: ["Donut", "Soda"],
        reasoning: "Based on your context, a light snack is recommended.",
        contextUsed: { timeOfDay: currentHour > 12 ? 'snack' : 'breakfast', state: 'neutral' },
        adaptationNote: "On track with daily goal",
        generatedAt: Date.now()
      },
      pipeline,
      confidence: 0.95
    };
  } catch (err) {
    console.error(err);
    throw new HttpsError('internal', 'Failed analysis');
  }
});

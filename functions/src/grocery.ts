import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export const getGroceryList = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'User must log in');
  const uid = request.auth.uid;
  
  const db = admin.firestore();
  const mealsSnap = await db.collection('users').doc(uid).collection('meals')
    .orderBy('timestamp', 'desc').limit(50).get();

  const preferences: Record<string, number> = {};
  mealsSnap.forEach(doc => {
    const data = doc.data();
    if (data.userFeedback !== 'disliked' && !data.skipped) {
      preferences[data.foodName] = (preferences[data.foodName] || 0) + 1;
    }
  });

  return {
    categories: {
      produce: ['Spinach', 'Berries', 'Avocado', 'Apples'],
      protein: ['Chicken Breast', 'Eggs', 'Greek Yogurt'],
      grains: ['Oats', 'Brown Rice'],
      dairy: ['Almond Milk'],
      other: ['Almonds', 'Olive Oil']
    },
    estimatedServings: 14
  };
});

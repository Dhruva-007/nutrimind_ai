import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
// import { ImageAnnotatorClient } from '@google-cloud/vision';

export const scanFood = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'User must log in');
  const { imageBase64 } = request.data;
  
  if (!imageBase64) throw new HttpsError('invalid-argument', 'Image required');
  
  // Mocking Vertex AI / Vision API classification
  // In production: const client = new ImageAnnotatorClient(); ...
  
  const classification = {
    foodName: 'Avocado Toast',
    calories: 310,
    macros: { protein: 8, carbs: 28, fat: 18 },
    healthScore: 82,
    confidence: 0.94
  };

  const db = admin.firestore();
  await db.collection('users').doc(request.auth.uid).collection('meals').add({
    uid: request.auth.uid,
    foodName: classification.foodName,
    calories: classification.calories,
    protein: classification.macros.protein,
    carbs: classification.macros.carbs,
    fat: classification.macros.fat,
    healthScore: classification.healthScore,
    timestamp: Date.now(),
    skipped: false,
    userFeedback: null
  });

  return { ...classification, saved: true };
});

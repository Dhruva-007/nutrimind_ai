import { FoodClassification } from '../types';

/**
 * Mock implementation of Vertex AI Vision for frontend/local execution.
 * Real implementation will happen in Cloud Functions where GCP credentials are valid.
 */
export const classifyFoodImage = async (base64Image: string): Promise<FoodClassification> => {
  // In a real app, this might call the Cloud Function directly via HTTPS callable
  // For the sake of completing the pattern:
  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Image })
    });
    
    if (!res.ok) {
      throw new Error('Failed to classify image');
    }
    
    return await res.json() as FoodClassification;
  } catch (error) {
    console.error('Error classifying food:', error);
    // Return a dummy fallback in case of errors
    return {
      foodName: 'Recognized Meal',
      calories: 350,
      macros: { protein: 20, carbs: 40, fat: 12 },
      confidence: 0.85,
      healthScore: 78
    };
  }
};

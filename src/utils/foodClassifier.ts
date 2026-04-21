import { FoodClassification } from '../types';
import { classifyFoodImage as vertexClassify } from '../services/vertexAI';

export const classifyFoodImage = async (base64Image: string): Promise<FoodClassification> => {
  // Delegate to Vertex service abstraction
  return await vertexClassify(base64Image);
};

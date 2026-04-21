import { useState, useEffect } from 'react';
import { MealLog } from '../types';
import { getCurrentUser } from '../services/auth';
import { getMealHistory, saveMealLog, updateFeedback } from '../services/firestore';

export const useFoodHistory = () => {
  const [history, setHistory] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    const user = getCurrentUser();
    if (!user) return;
    setLoading(true);
    const data = await getMealHistory(user.uid, 20);
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const logMeal = async (meal: Omit<MealLog, 'id'>) => {
    const user = getCurrentUser();
    if (!user) return;
    await saveMealLog(user.uid, meal);
    await fetchHistory();
  };

  const skipMeal = async () => {
    const user = getCurrentUser();
    if (!user) return;
    await saveMealLog(user.uid, {
      uid: user.uid,
      foodName: 'Skipped Meal',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      healthScore: 0,
      timestamp: Date.now(),
      skipped: true,
      userFeedback: null,
    });
    await fetchHistory();
  };

  const giveFeedback = async (mealId: string, feedback: MealLog['userFeedback']) => {
    const user = getCurrentUser();
    if (!user) return;
    await updateFeedback(user.uid, mealId, feedback);
    await fetchHistory();
  };

  return { history, logMeal, skipMeal, giveFeedback, loading, refresh: fetchHistory };
};

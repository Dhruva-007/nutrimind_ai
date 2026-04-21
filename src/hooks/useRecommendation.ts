import { useState, useEffect } from 'react';
import { WorkflowOutput } from '../types';
import { getCurrentUser } from '../services/auth';
import { getRealtimeContext } from '../services/contextEngine';

export const useRecommendation = (lastMealTimestamp: number | null, activityToday: string) => {
  const [recommendation, setRecommendation] = useState<WorkflowOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRec = async () => {
    const user = getCurrentUser();
    if (!user) return;
    setLoading(true);
    try {
      const context = getRealtimeContext(lastMealTimestamp, activityToday);
      const res = await fetch(`https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/getRecommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          userId: user.uid,
          currentHour: context.currentHour,
          lastMealTimestamp,
          activityToday
        })
      });

      if (!res.ok) throw new Error('Failed to fetch recommendation');
      const data = await res.json();
      setRecommendation(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRec();
    const interval = setInterval(fetchRec, 30 * 60 * 1000); // 30 min refresh
    return () => clearInterval(interval);
  }, [lastMealTimestamp, activityToday]);

  return { recommendation, loading, error, refresh: fetchRec };
};

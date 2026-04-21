import { useState, useEffect } from 'react';
import { ContextState } from '../types';
import { getRealtimeContext } from '../services/contextEngine';

export const useContextState = (lastMealTimestamp: number | null, activityToday: string) => {
  const [contextState, setContextState] = useState<ContextState>(
    getRealtimeContext(lastMealTimestamp, activityToday)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setContextState(getRealtimeContext(lastMealTimestamp, activityToday));
    }, 5 * 60 * 1000); // 5 min
    return () => clearInterval(interval);
  }, [lastMealTimestamp, activityToday]);

  return { contextState };
};

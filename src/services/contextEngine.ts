import { ContextState } from '../types';
import { detectContext } from '../workflows/contextDetector';

export const getRealtimeContext = (lastMealTimestamp: number | null, activityToday: string): ContextState => {
  const currentHour = new Date().getHours();
  return detectContext({ currentHour, lastMealTimestamp, activityToday });
};

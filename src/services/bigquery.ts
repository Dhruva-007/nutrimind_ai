// Mock bigquery analytics reporter for frontend use
// Actual bigquery insertion runs in Cloud Functions securely

export interface AnalyticsEvent {
  event_type: string;
  timestamp: number;
  session_id: string;
  pipeline_used?: string;
  recommendation_accepted?: boolean;
}

export const logEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event })
    });
  } catch (error) {
    console.warn('Silent failure on analytics logging', error);
  }
};

export interface TrendData {
  avgCalories: number;
  mostLoggedFoods: string[];
  skipRate: number;
}

export const getEatingTrends = async (userId: string): Promise<TrendData> => {
  // Normally this would call an API powered by BigQuery.
  return {
    avgCalories: 2100,
    mostLoggedFoods: ['Oatmeal', 'Chicken Salad', 'Protein Bar'],
    skipRate: 0.1
  };
};

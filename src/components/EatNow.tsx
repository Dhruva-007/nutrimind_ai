import React from 'react';
import { useRecommendation } from '../hooks/useRecommendation';
import { useFoodHistory } from '../hooks/useFoodHistory';

interface EatNowProps {
  lastMealTimestamp: number | null;
  activityToday: string;
}

const EatNow: React.FC<EatNowProps> = ({ lastMealTimestamp, activityToday }) => {
  const { recommendation, loading, error, refresh } = useRecommendation(lastMealTimestamp, activityToday);
  const { logMeal } = useFoodHistory();

  if (loading) return (
    <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm text-center border border-gray-100 flex flex-col items-center gap-4 dark:border-gray-700 h-64 justify-center" role="status" aria-label="Loading recommendation">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Analyzing real-time context...</p>
    </div>
  );
  if (error) return <div className="text-danger p-4">Error: {error}</div>;
  if (!recommendation) return null;

  const { primary, alternative, avoid, reasoning, adaptationNote } = recommendation.recommendation;

  const handleLog = (food: typeof primary) => {
    logMeal({ uid: '', foodName: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat, healthScore: food.healthScore, timestamp: Date.now(), skipped: false, userFeedback: null });
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'bg-green-100 text-green-700';
    if (score > 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="w-full space-y-6" aria-live="polite">
      <div className="bg-gradient-to-br from-primary to-green-400 p-1 flex rounded-3xl shadow-lg">
        <div className="bg-white dark:bg-gray-900 rounded-[22px] w-full p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
            {recommendation.pipeline === 'low-sugar' ? '🩺 Diabetic Safe' : 
             recommendation.pipeline === 'high-protein' ? '🧬 High Protein Mode' : '⚖️ Balanced Pipeline'}
          </div>
          
          <h2 className="text-3xl font-black mb-2 text-gray-900 dark:text-white mt-2">What Should I Eat Now?</h2>
          
          {adaptationNote && adaptationNote !== "On track with daily goal" && (
            <div className="bg-yellow-50 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 p-3 rounded-xl text-sm font-medium mb-6 flex gap-2">
              <span>⚠️</span> {adaptationNote}
            </div>
          )}

          <div className="mt-8 mb-6">
            <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-3">Optimal Match</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-2xl font-bold dark:text-white">{primary.name}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300">{primary.calories} cal</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300">P:{primary.protein}g</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getScoreColor(primary.healthScore)}`}>Score {primary.healthScore}</span>
                </div>
              </div>
              <button onClick={() => handleLog(primary)} className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105" aria-label={`Log ${primary.name}`}>
                Log Meal
              </button>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-4 italic mb-6">🤖 {reasoning}</p>
          
          <div className="flex gap-2">
            <button className="flex-1 py-3 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors" aria-label="Like recommendation">👍 Like</button>
            <button className="flex-1 py-3 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors" aria-label="Dislike recommendation">👎 Dislike</button>
            <button onClick={refresh} className="flex-1 py-3 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors" aria-label="Refresh recommendation">🔄 Refresh</button>
          </div>
        </div>
      </div>
      
      {alternative && (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Alternative</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{alternative.name}</p>
            </div>
            <button onClick={() => handleLog(alternative)} className="text-sm font-semibold text-primary hover:underline">Choose</button>
         </div>
      )}
    </div>
  );
};

export default EatNow;

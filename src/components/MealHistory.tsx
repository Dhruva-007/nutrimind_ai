import React from 'react';
import { useFoodHistory } from '../hooks/useFoodHistory';

const MealHistory: React.FC = () => {
  const { history, loading, giveFeedback } = useFoodHistory();

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading history...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Meal History</h2>
      
      {history.length === 0 ? (
        <div className="text-center py-10 opacity-60">
          <span className="text-6xl mb-4 block animate-bounce">🍽️</span>
          <p className="dark:text-white text-lg font-medium">No meals logged yet!</p>
          <p className="text-sm dark:text-gray-400 mt-2">Your timeline awaits.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(meal => (
            <div key={meal.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center ${meal.skipped ? 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700 opacity-60' : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 shadow-sm'}`}>
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                  <span className="text-xl">{meal.skipped ? '🚫' : '🍲'}</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${meal.skipped ? 'line-through text-gray-400' : 'dark:text-white text-gray-800'}`}>{meal.foodName}</h3>
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(meal.timestamp).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})} 
                    {!meal.skipped && ` • ${meal.calories} cal`}
                  </p>
                </div>
              </div>
              
              {!meal.skipped && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => giveFeedback(meal.id, 'liked')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${meal.userFeedback === 'liked' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >👍</button>
                  <button 
                    onClick={() => giveFeedback(meal.id, 'disliked')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${meal.userFeedback === 'disliked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >👎</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealHistory;

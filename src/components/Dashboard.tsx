import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useContextState } from '../hooks/useContextState';
import { useFoodHistory } from '../hooks/useFoodHistory';
import EatNow from './EatNow';
import HealthScore from './HealthScore';

const Dashboard: React.FC = () => {
  const { profile } = useProfile();
  const { contextState } = useContextState(null, profile?.activityLevel || 'sedentary');
  const { history } = useFoodHistory();

  const getGreeting = () => {
    const hr = contextState.currentHour;
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCalsRemaining = () => {
    // Basic remaining cals
    const dailyTarget = 2000; // Mock calculation
    const currentCals = history.filter(h => !h.skipped && Date.now() - h.timestamp < 86400000)
                               .reduce((sum, m) => sum + m.calories, 0);
    return Math.max(0, dailyTarget - currentCals);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 sm:p-6" role="main">
      <header className="flex justify-between items-center rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {profile?.name || 'Explorer'}
          </h1>
          <p className="text-gray-500 mt-1">Context: {contextState.context.replace(/_/g, ' ')}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-4xl font-black text-primary">{getCalsRemaining()}</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Cals Left</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <HealthScore target={2000} meals={history.filter(m => Date.now() - m.timestamp < 86400000)} />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Today's Timeline</h2>
          <div className="space-y-4">
            {history.slice(0, 3).map((meal, idx) => (
              <div key={idx} className="flex relative items-start gap-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg">{meal.skipped ? '🚫' : '🍽️'}</span>
                </div>
                <div>
                  <p className="font-semibold dark:text-white">{meal.foodName}</p>
                  <p className="text-sm text-gray-500">{new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {meal.calories} cal</p>
                </div>
              </div>
            ))}
            {history.length === 0 && <p className="text-gray-400 italic">No meals logged today yet.</p>}
          </div>
        </div>
      </div>

      <section aria-labelledby="cta-heading" className="w-full mt-4">
        <h2 id="cta-heading" className="sr-only">Recommendation Section</h2>
        <EatNow lastMealTimestamp={history[0]?.timestamp || null} activityToday={profile?.activityLevel || 'sedentary'} />
      </section>
    </div>
  );
};

export default Dashboard;

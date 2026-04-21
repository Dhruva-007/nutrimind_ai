import React from 'react';
import { calculateDailyHealthScore } from '../utils/healthScorer';
import { MealLog } from '../types';

interface HealthScoreProps {
  meals: MealLog[];
  target: number;
}

const HealthScore: React.FC<HealthScoreProps> = ({ meals, target }) => {
  const score = calculateDailyHealthScore(meals, target);
  
  // Create circular SVG logic
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#EF4444'; // Red
  if (score >= 80) color = '#22C55E'; // Green
  else if (score >= 60) color = '#F59E0B'; // Yellow

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold mb-6 dark:text-white w-full text-left">Daily Health Score</h2>
      <div className="relative flex items-center justify-center">
        <svg height="120" width="120" className="transform -rotate-90">
          <circle
            stroke="#f3f4f6"
            fill="transparent"
            strokeWidth="12"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx="60"
            cy="60"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <span className="absolute text-3xl font-black" style={{ color }}>{score}</span>
      </div>
      <p className="mt-4 font-medium text-gray-600 dark:text-gray-300">
        {score >= 80 ? "🔥 4 day streak!" : "A bit off balance today"}
      </p>
      <div className="mt-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-full">
        Tip: Focus on hitting your protein target
      </div>
    </div>
  );
};

export default HealthScore;

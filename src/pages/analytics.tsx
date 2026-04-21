import React from 'react';
import Head from 'next/head';
import GroceryList from '../components/GroceryList';

export default function AnalyticsPage() {
  return (
    <>
      <Head>
        <title>Analytics & Groceries | NutriMind</title>
      </Head>
      <div className="animate-fade-in py-6 space-y-8">
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <h2 className="text-2xl font-bold dark:text-white mb-2">Trend Analytics</h2>
            <p className="text-gray-500 mb-8">BigQuery integration running in background.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Cals/Day</p>
                 <p className="text-3xl font-black text-primary">2,105</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Skip Rate</p>
                 <p className="text-3xl font-black text-danger">4.2%</p>
              </div>
            </div>
        </div>
        
        <GroceryList />
      </div>
    </>
  );
}

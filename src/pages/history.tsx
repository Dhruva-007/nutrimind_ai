import React from 'react';
import Head from 'next/head';
import MealHistory from '../components/MealHistory';

export default function HistoryPage() {
  return (
    <>
      <Head>
        <title>History | NutriMind</title>
      </Head>
      <div className="animate-fade-in py-6">
        <MealHistory />
      </div>
    </>
  );
}

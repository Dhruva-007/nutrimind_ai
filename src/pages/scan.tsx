import React from 'react';
import Head from 'next/head';
import FoodScanner from '../components/FoodScanner';

export default function ScanPage() {
  return (
    <>
      <Head>
        <title>Scan Food | NutriMind</title>
      </Head>
      <div className="animate-fade-in py-10">
        <FoodScanner />
      </div>
    </>
  );
}

import React from 'react';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard | NutriMind</title>
      </Head>
      <div className="animate-fade-in">
        <Dashboard />
      </div>
    </>
  );
}

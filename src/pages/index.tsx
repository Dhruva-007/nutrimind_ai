import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, signInWithGoogle, onAuthChange } from '../services/auth';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (user) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    await signInWithGoogle();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin text-primary text-4xl">🥗</div></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 flex flex-col items-center to-white dark:from-gray-900 dark:to-black">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl text-center">
        <div className="text-6xl mb-6 inline-block p-4 bg-green-100 rounded-full">🥗</div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">NutriMind AI</h1>
        <p className="text-gray-500 mb-8 font-medium">Real-time, behavior-adaptive food intelligence</p>
        
        <button 
          onClick={handleLogin}
          className="w-full bg-primary hover:bg-green-600 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 transition-all font-bold text-white p-4 rounded-xl text-lg flex items-center justify-center gap-3"
          aria-label="Sign in with Google"
        >
          <svg className="w-6 h-6 bg-white rounded-full p-1 text-black" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.36,22 12.2,22C17.53,22 22,18.33 22,12.08C22,11.08 21.35,11.1 21.35,11.1V11.1Z"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

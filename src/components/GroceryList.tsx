import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth';

interface GroceryData {
  categories: Record<string, string[]>;
  estimatedServings: number;
}

const GroceryList: React.FC = () => {
  const [data, setData] = useState<GroceryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchGroceries = async () => {
      const user = getCurrentUser();
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch(`https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/getGroceryList`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await user.getIdToken()}` },
          body: JSON.stringify({ data: { uid: user.uid } })
        });
        const result = await res.json();
        setData(result.result || result);
      } catch (e) {
        // Fallback for UI if functions not deployed
        setData({
          categories: {
            produce: ['Spinach', 'Berries', 'Avocado', 'Apples'],
            protein: ['Chicken Breast', 'Eggs', 'Greek Yogurt'],
            grains: ['Oats', 'Brown Rice'],
            dairy: ['Almond Milk'],
            other: ['Almonds', 'Olive Oil']
          },
          estimatedServings: 14
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGroceries();
  }, []);

  const toggleCheck = (item: string) => {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const parseCatIcon = (cat: string) => {
    const icons: Record<string, string> = { produce:'🥦', protein:'🍗', grains:'🌾', dairy:'🥛', other:'📦' };
    return icons[cat.toLowerCase()] || '🛒';
  };

  if (loading || !data) return <div className="p-8 text-center text-gray-500 animate-pulse">Generating your list...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Smart Grocery List</h2>
        <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-bold">{data.estimatedServings} Meals</span>
      </div>
      
      <div className="space-y-6">
        {Object.entries(data.categories).map(([cat, items]) => (
           <div key={cat}>
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               {parseCatIcon(cat)} {cat}
             </h3>
             <ul className="space-y-2">
               {items.map(item => (
                 <li key={item} 
                     className={`flex items-center gap-3 p-3 rounded-xl border ${checked[item] ? 'bg-gray-50 dark:bg-gray-800/50 border-transparent text-gray-400 line-through' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 dark:text-gray-200'} cursor-pointer transition-all`}
                     onClick={() => toggleCheck(item)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${checked[item] ? 'bg-primary border-primary outline-none text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                      {checked[item] && <span className="text-xs">✓</span>}
                    </div>
                    <span className="font-medium select-none">{item}</span>
                 </li>
               ))}
             </ul>
           </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryList;

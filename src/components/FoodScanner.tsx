import React, { useState, useRef } from 'react';
import { classifyFoodImage } from '../utils/foodClassifier';
import { FoodClassification } from '../types';

const FoodScanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodClassification | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please upload an image file (jpeg, png, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setPreviewUrl(base64);
      setLoading(true);
      setResult(null);
      
      try {
        const cls = await classifyFoodImage(base64);
        setResult(cls);
      } catch (err) {
        console.error(err);
        alert('Failed to analyze food.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">AI Food Scanner</h2>
      
      <div 
        className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Food preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <span className="text-4xl mb-2 block">📷</span>
            <p className="font-medium text-gray-600 dark:text-gray-300">Tap to snap or upload</p>
            <p className="text-sm text-gray-400 mt-1">JPEG, PNG up to 5MB</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg, image/png, image/webp" 
          onChange={handleFileChange}
          aria-label="Upload food image"
        />
      </div>

      {loading && (
        <div className="mt-6 p-4 rounded-xl bg-gray-50 flex items-center gap-3 dark:bg-gray-800 animate-pulse w-full">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <span className="text-sm font-medium dark:text-gray-300">Vertex AI analyzing macros...</span>
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold dark:text-white capitalize">{result.foodName}</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{(result.confidence * 100).toFixed(0)}% Match</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-6">
             <div className="bg-gray-50 items-center justify-center dark:bg-gray-900 p-2 rounded-lg text-center"><span className="block text-xs text-gray-500 uppercase">Cal</span><span className="font-bold">{result.calories}</span></div>
             <div className="bg-gray-50 items-center justify-center dark:bg-gray-900 p-2 rounded-lg text-center"><span className="block text-xs text-gray-500 uppercase">Pro</span><span className="font-bold">{result.macros.protein}g</span></div>
             <div className="bg-gray-50 items-center justify-center dark:bg-gray-900 p-2 rounded-lg text-center"><span className="block text-xs text-gray-500 uppercase">Carb</span><span className="font-bold">{result.macros.carbs}g</span></div>
             <div className="bg-gray-50 items-center justify-center dark:bg-gray-900 p-2 rounded-lg text-center"><span className="block text-xs text-gray-500 uppercase">Fat</span><span className="font-bold">{result.macros.fat}g</span></div>
          </div>
          
          <button className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all">
            Log This Meal
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodScanner;

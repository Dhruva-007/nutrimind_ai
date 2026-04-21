import React, { useState, useEffect } from 'react';

const AccessibilityBar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    html.classList.remove('text-base', 'text-lg', 'text-xl');
    if (fontSize === 'large') html.classList.add('text-lg');
    if (fontSize === 'xlarge') html.classList.add('text-xl');
    if (fontSize === 'normal') html.classList.add('text-base');

  }, [highContrast, fontSize]);

  if (!visible) return null;

  return (
    <div className="w-full bg-blue-900 text-white p-2 text-sm flex flex-wrap justify-between items-center z-50 relative px-4" aria-label="Accessibility options">
      <div className="flex gap-4 items-center">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:text-black focus:p-2 focus:z-50 rounded">Skip to content</a>
        <button 
          onClick={() => setHighContrast(!highContrast)} 
          className={`flex items-center gap-2 px-3 py-1 rounded border border-blue-700 hover:bg-blue-800 ${highContrast ? 'bg-blue-600' : ''}`}
          aria-pressed={highContrast}
        >
          🌗 High Contrast
        </button>
        
        <div className="flex gap-1 items-center bg-blue-800 rounded px-2">
          <span className="mr-2">A</span>
          <button onClick={() => setFontSize('normal')} className={`px-2 py-1 ${fontSize === 'normal' ? 'font-bold underline' : ''}`} aria-label="Normal text size">A</button>
          <button onClick={() => setFontSize('large')} className={`px-2 py-1 text-lg ${fontSize === 'large' ? 'font-bold underline' : ''}`} aria-label="Large text size">A</button>
          <button onClick={() => setFontSize('xlarge')} className={`px-2 py-1 text-xl ${fontSize === 'xlarge' ? 'font-bold underline' : ''}`} aria-label="Extra large text size">A</button>
        </div>
      </div>
      <button onClick={() => setVisible(false)} className="text-blue-300 hover:text-white px-2 py-1" aria-label="Dismiss accessibility bar">✕ Dismiss</button>
    </div>
  );
};

export default AccessibilityBar;

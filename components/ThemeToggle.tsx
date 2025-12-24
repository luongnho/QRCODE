
import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-primary-500 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <i className="fas fa-sun text-lg text-yellow-500 animate-pulse"></i>
      ) : (
        <i className="fas fa-moon text-lg text-primary-600"></i>
      )}
    </button>
  );
};

export default ThemeToggle;

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle color theme"
      className={`p-2 rounded-xl transition-all duration-300 border ${
        isDark
          ? 'bg-dark-850 border-slate-700/60 text-amber-300 hover:bg-dark-800 hover:border-amber-400/40'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-brand-300 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-700" />
        )}
      </div>
    </button>
  );
}

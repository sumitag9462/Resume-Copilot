import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDark
          ? 'bg-[#172033] border-[#334155] text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] focus:ring-offset-[#0F172A]'
          : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] focus:ring-offset-white'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
      )}
    </button>
  );
}


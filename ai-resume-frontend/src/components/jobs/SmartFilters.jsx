import React, { useState } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const filterCategories = [
  { id: 'type', label: 'Job Type', options: ['Full-time', 'Contract', 'Internship'] },
  { id: 'location', label: 'Location', options: ['Remote', 'Hybrid', 'On-site'] },
  { id: 'experience', label: 'Experience', options: ['Entry Level', 'Mid-Level', 'Senior', 'Staff'] },
  { id: 'salary', label: 'Salary', options: ['$100k+', '$150k+', '$200k+'] },
];

export default function SmartFilters() {
  const [activeFilters, setActiveFilters] = useState({
    location: 'Remote',
    experience: 'Senior'
  });

  const toggleFilter = (category, option) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category] === option) {
        delete newFilters[category];
      } else {
        newFilters[category] = option;
      }
      return newFilters;
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-b border-white/5">
      <div className="flex items-center gap-2 mr-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Filters</span>
      </div>

      {filterCategories.map(category => (
        <div key={category.id} className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-sm font-medium text-slate-300 transition-colors">
            {activeFilters[category.id] || category.label}
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1c29] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1">
            {category.options.map(option => {
              const isActive = activeFilters[category.id] === option;
              return (
                <button
                  key={option}
                  onClick={() => toggleFilter(category.id, option)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors hover:bg-white/5 ${isActive ? 'text-white font-semibold' : 'text-slate-300'}`}
                >
                  {option}
                  {isActive && <Check className="w-4 h-4 text-accent-violet" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="w-px h-6 bg-white/10 mx-2" />
      
      <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <SlidersHorizontal className="w-3.5 h-3.5" /> More Filters
      </button>

      {Object.keys(activeFilters).length > 0 && (
        <button 
          onClick={() => setActiveFilters({})}
          className="ml-auto text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

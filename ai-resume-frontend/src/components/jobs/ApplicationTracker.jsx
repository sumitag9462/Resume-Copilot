import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, DollarSign, GripVertical } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const initialColumns = {
  saved: {
    id: 'saved',
    title: 'Saved',
    color: 'slate',
    items: [
      { id: 'job-1', role: 'Staff UI Developer', company: 'Vercel', salary: '$180k', color: 'slate' }
    ]
  },
  applied: {
    id: 'applied',
    title: 'Applied',
    color: 'blue',
    items: [
      { id: 'job-2', role: 'Senior Frontend', company: 'Stripe', salary: '$160k', color: 'blue' }
    ]
  },
  interview: {
    id: 'interview',
    title: 'Interview',
    color: 'amber',
    items: [
      { id: 'job-3', role: 'React Engineer', company: 'Netflix', salary: '$200k', color: 'amber' }
    ]
  },
  offer: {
    id: 'offer',
    title: 'Offer',
    color: 'emerald',
    items: []
  }
};

export default function ApplicationTracker() {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item, sourceColId) => {
    setDraggedItem({ item, sourceColId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, sourceColId } = draggedItem;
    if (sourceColId === targetColId) return;

    setColumns(prev => {
      const newCols = { ...prev };
      newCols[sourceColId].items = newCols[sourceColId].items.filter(i => i.id !== item.id);
      
      const updatedItem = { ...item, color: newCols[targetColId].color };
      newCols[targetColId].items = [...newCols[targetColId].items, updatedItem];
      return newCols;
    });
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex gap-4 h-[170px] overflow-x-auto pb-4 scrollbar-hide">
      {Object.values(columns).map(column => (
        <div 
          key={column.id}
          onDrop={(e) => handleDrop(e, column.id)}
          onDragOver={handleDragOver}
          className="flex-shrink-0 w-72 flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.01] p-3"
        >
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className={`text-xs font-bold uppercase tracking-widest text-${column.color}-400`}>{column.title}</h3>
            <span className="text-xs font-semibold text-slate-500 bg-white/5 px-2 py-0.5 rounded">{column.items.length}</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
            {column.items.map(item => (
              <motion.div
                key={item.id}
                layoutId={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item, column.id)}
                className={`p-4 rounded-xl border cursor-grab active:cursor-grabbing border-${item.color}-500/20 bg-${item.color}-500/10 hover:border-${item.color}-500/40 transition-colors`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{item.role}</h4>
                  <GripVertical className="w-4 h-4 text-slate-500 opacity-50" />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {item.company}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {item.salary}</span>
                </div>
              </motion.div>
            ))}
            
            {column.items.length === 0 && (
              <div className="h-24 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-slate-500 font-medium">
                Drop job here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Briefcase, FileText, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({ icon: Icon, title, description, actionText, actionLink, actionIcon: ActionIcon = PlusCircle, color = "violet" }) {
  const colorMap = {
    violet: "text-accent-violet border-accent-violet/20 bg-accent-violet/10 hover:bg-accent-violet/20",
    teal: "text-accent-teal border-accent-teal/20 bg-accent-teal/10 hover:bg-accent-teal/20",
    blue: "text-[#8FB3FF] border-[#8FB3FF]/20 bg-[#8FB3FF]/10 hover:bg-[#8FB3FF]/20",
  };

  const btnStyle = colorMap[color] || colorMap.violet;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
    >
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-white/5 bg-white/[0.02]`}>
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      
      <h3 className="text-xl font-display font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
        {description}
      </p>

      {actionLink && (
        <Link 
          to={actionLink}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-bold text-sm transition-all duration-300 ${btnStyle}`}
        >
          <ActionIcon className="w-4 h-4" />
          {actionText}
        </Link>
      )}
    </motion.div>
  );
}

export function NoResumesState() {
  return (
    <EmptyState 
      icon={FileText}
      title="No Resumes Found"
      description="You haven't uploaded or created any resumes yet. Start building your AI-optimized profile to unlock insights."
      actionText="Create New Resume"
      actionLink="/builder"
      color="violet"
    />
  );
}

export function NoJobsState() {
  return (
    <EmptyState 
      icon={Briefcase}
      title="No Job Matches Yet"
      description="We couldn't find any roles matching your exact criteria right now. Try adjusting your filters or expanding your search."
      actionText="Clear Filters"
      actionLink="/jd-match"
      color="teal"
    />
  );
}

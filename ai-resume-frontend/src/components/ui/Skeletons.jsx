import React from 'react';
import { motion } from 'framer-motion';

const shimmerVariants = {
  hidden: { x: '-100%' },
  visible: { 
    x: '100%', 
    transition: { 
      repeat: Infinity, 
      duration: 1.5, 
      ease: 'linear' 
    }
  }
};

export function SkeletonBase({ className = "", rounded = "rounded-xl" }) {
  return (
    <div className={`relative overflow-hidden bg-white/[0.02] border border-white/5 ${rounded} ${className}`}>
      <motion.div
        variants={shimmerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent w-[200%]"
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonBase className="w-12 h-12" rounded="rounded-xl" />
        <div className="space-y-2 flex-1">
          <SkeletonBase className="h-4 w-1/3" />
          <SkeletonBase className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonBase className="h-3 w-full" />
      <SkeletonBase className="h-3 w-5/6" />
      <SkeletonBase className="h-3 w-4/6" />
    </div>
  );
}

export function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-32 flex flex-col justify-between">
          <SkeletonBase className="h-4 w-1/2" />
          <SkeletonBase className="h-8 w-1/3" />
        </div>
      ))}
    </div>
  );
}

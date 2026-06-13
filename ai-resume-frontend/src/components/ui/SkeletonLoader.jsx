import React from 'react';

const SkeletonLoader = ({ variant = 'default' }) => {
  
  if (variant === 'card') return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-3/5 rounded" />
      </div>
    </div>
  )

  if (variant === 'result') return (
    <div className="space-y-3">
      <div className="skeleton h-8 w-24 rounded-lg" />
      <div className="card p-5 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton w-2 h-2 rounded-full flex-shrink-0" />
            <div className="skeleton h-3 rounded"
              style={{ width: `${70 + Math.random() * 25}%` }} 
            />
          </div>
        ))}
      </div>
    </div>
  )

  if (variant === 'score') return (
    <div className="flex flex-col items-center gap-4">
      <div className="skeleton w-32 h-32 rounded-full" />
      <div className="space-y-2 text-center">
        <div className="skeleton h-5 w-20 rounded mx-auto" />
        <div className="skeleton h-3 w-32 rounded mx-auto" />
      </div>
    </div>
  )

  if (variant === 'table') return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <div className="skeleton h-4 w-8 rounded" />
          <div className="skeleton h-4 flex-1 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-6 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  )

  // default
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  )
}

export default SkeletonLoader;

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }
  return (
    <div
      className={`rounded-full border-brand-200 border-t-brand-600 animate-spin ${sizes[size]} ${className}`}
    />
  )
}

export const PageLoader = ({ message = 'Analyzing with AI…' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
    </div>
    <div className="text-center">
      <p className="text-slate-700 font-semibold font-heading text-sm">{message}</p>
      <p className="text-slate-400 text-xs mt-1">This may take 10–20 seconds</p>
    </div>
  </div>
)

export default LoadingSpinner
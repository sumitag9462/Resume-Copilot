const variants = {
  blue:    'bg-brand-50 text-brand-700 border-brand-200',
  green:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  red:     'bg-red-50 text-red-600 border-red-200',
  amber:   'bg-amber-50 text-amber-700 border-amber-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
  slate:   'bg-slate-50 text-slate-600 border-slate-200',
  indigo:  'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const Badge = ({ children, variant = 'blue', className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
      border ${variants[variant] || variants.blue} ${className}
    `}
  >
    {children}
  </span>
)

export default Badge
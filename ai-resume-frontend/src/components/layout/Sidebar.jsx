import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  BrainCircuit,
  Briefcase,
  Files,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Sparkles,
  TrendingUp,
  Send,
  Split,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const navGroups = [
  {
    title: 'Foundation',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/resumes', label: 'My Resumes', icon: Files },
    ]
  },
  {
    title: 'Evaluate',
    items: [
      { path: '/analysis/1', label: 'ATS Analysis', icon: BarChart3 },
      { path: '/jd-match', label: 'JD Match', icon: Briefcase },
    ]
  },
  {
    title: 'Improve',
    items: [
      { path: '/resume-boost', label: 'Resume Boost', icon: Sparkles },
      { path: '/version-compare', label: 'Version Compare', icon: TrendingUp },
      { path: '/resume-comparison', label: 'Resume Compare', icon: Split },
    ]
  },
  {
    title: 'Apply',
    items: [
      { path: '/cover-letter', label: 'Cover Letters', icon: Mail },
      { path: '/outreach', label: 'Cold Outreach', icon: Send },
      { path: '/interview-prep', label: 'Interview Prep', icon: BrainCircuit },
    ]
  },
  {
    title: 'Account',
    items: [
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  }
]

const Sidebar = ({ isOpen, onClose }) => {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Signed out successfully')
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface border-r border-white/[0.06] shadow-[20px_0_40px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_8px_20px_rgba(124,111,247,0.3)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-display text-[17px] font-bold tracking-tight text-white leading-tight">Resume Copilot</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-accent-violet-light">Career OS</p>
          </div>
        </Link>
        {onClose && (
          <button aria-label="Close mobile menu" onClick={onClose} className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6 scrollbar-hide">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map(({ path, label, icon: Icon }) => {
                const active = pathname === path || (path === '/analysis/1' && pathname.startsWith('/analysis'))
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={`nav-link group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                      active
                        ? 'text-white'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-violet/15 to-transparent border border-accent-violet/20"
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`relative z-10 h-[18px] w-[18px] ${active ? 'text-accent-violet-light' : 'text-slate-500 group-hover:text-slate-400'}`} />
                    <span className="relative z-10">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="shrink-0 border-t border-white/[0.06] p-4 bg-[#0A0B0F]/50">
        <div className="flex items-center gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.03] p-3 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-violet to-accent-teal text-[11px] font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-white">{user?.name || 'Rahul Sharma'}</p>
            <p className="truncate text-[11px] font-medium text-slate-400">{user?.email || 'rahul@resumecopilot.ai'}</p>
          </div>
          <span className="shrink-0 rounded-full bg-accent-teal/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-accent-teal shadow-[0_0_10px_rgba(46,203,173,0.1)]">
            Pro
          </span>
        </div>
        <button 
          onClick={handleLogout} 
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-transparent py-2.5 text-[13px] font-semibold text-slate-400 transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
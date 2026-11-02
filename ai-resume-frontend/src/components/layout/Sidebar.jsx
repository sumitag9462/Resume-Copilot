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
  Split,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/resumes', label: 'My Resumes', icon: Files },
      { path: '/copilot', label: 'AI Copilot', icon: Sparkles },
    ]
  },
  {
    title: 'Analyze & Match',
    items: [
      { path: '/analyzer', label: 'ATS Analysis', icon: BarChart3 },
      { path: '/jd-match', label: 'Job Matcher', icon: Briefcase },
      { path: '/resume-comparison', label: 'Resume Compare', icon: Split },
    ]
  },
  {
    title: 'Enhance & Prepare',
    items: [
      { path: '/resume-boost', label: 'Resume Boost', icon: Sparkles },
      { path: '/cover-letter', label: 'Cover Letters', icon: Mail },
      { path: '/interview-prep', label: 'Interview Prep', icon: BrainCircuit, badge: 'Soon' },
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
    <div className="flex h-full w-full flex-col bg-[#0A0B10] border-r border-white/[0.08] relative">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-white/[0.06]">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_4px_16px_rgba(124,111,247,0.3)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold tracking-tight text-white leading-tight">Resume Copilot</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal">
              ATS Suite
            </p>
          </div>
        </Link>
        {onClose && (
          <button aria-label="Close mobile menu" onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 scrollbar-hide">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon, badge }) => {
                const active = pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? 'bg-accent-violet/15 text-white font-semibold'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent-violet rounded-r-full shadow-[0_0_8px_rgba(124,111,247,0.8)]" />
                    )}
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-accent-violet-light' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="truncate flex-1">{label}</span>
                    {badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-1.5 py-0.5 rounded border border-accent-teal/20">
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Pinned Real User Profile Footer */}
      <div className="shrink-0 p-3 border-t border-white/[0.06] bg-[#0A0B10]">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-violet to-accent-teal text-xs font-bold text-white shadow-inner">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white leading-tight">{user?.name || 'Account'}</p>
              <p className="truncate text-[11px] text-slate-500 leading-tight">{user?.email || ''}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Docked Sidebar */}
      <aside className="sticky top-0 z-30 hidden h-screen w-64 shrink-0 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar

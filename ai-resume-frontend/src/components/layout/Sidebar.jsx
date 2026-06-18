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
  X,
  CreditCard,
  HardDrive,
  Mic
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const navGroups = [
  {
    title: 'Foundation',
    items: [
      { path: '/copilot', label: 'AI Copilot', icon: Sparkles },
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/resumes', label: 'My Resumes', icon: Files },
    ]
  },
  {
    title: 'Evaluate',
    items: [
      { path: '/analyzer', label: 'ATS Analysis', icon: BarChart3 },
      { path: '/jd-match', label: 'Job Description Match', icon: Briefcase },
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
      { path: '/voice-interview', label: 'AI Voice Interview', icon: Mic },
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
    <div className="flex h-full flex-col bg-[#111318]/40 backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.2)] lg:rounded-3xl lg:h-[calc(100vh-32px)] lg:m-4 overflow-hidden relative">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-white/[0.05]">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_8px_20px_rgba(124,111,247,0.3)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-[14px] bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20 mix-blend-overlay" />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-white leading-tight">Resume Copilot</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
              Career OS
            </p>
          </div>
        </Link>
        {onClose && (
          <button aria-label="Close mobile menu" onClick={onClose} className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6 scrollbar-hide relative z-10">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map(({ path, label, icon: Icon }) => {
                const active = pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={`nav-link group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-300 ${
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
                      >
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-accent-violet rounded-r-full shadow-[0_0_10px_rgba(124,111,247,0.8)]" />
                      </motion.div>
                    )}
                    <Icon className={`relative z-10 h-5 w-5 transition-transform duration-300 ${active ? 'text-accent-violet-light scale-110' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-110'}`} />
                    <span className="relative z-10">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Premium Profile Footer */}
      <div className="shrink-0 p-4 relative z-10">
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/[0.04]">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-violet to-accent-teal text-xs font-bold text-white shadow-inner">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#151720]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white leading-none mb-1">{user?.name || 'Rahul Sharma'}</p>
              <span className="inline-flex items-center rounded bg-accent-teal/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-accent-teal shadow-[0_0_10px_rgba(46,203,173,0.1)]">
                Pro Plan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-black/20 rounded-lg p-2 border border-white/5 flex flex-col items-center justify-center">
              <HardDrive className="w-3 h-3 text-slate-400 mb-1" />
              <span className="text-[10px] font-semibold text-slate-300">4/10 Resumes</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 border border-white/5 flex flex-col items-center justify-center">
              <Sparkles className="w-3 h-3 text-accent-violet mb-1" />
              <span className="text-[10px] font-semibold text-slate-300">820 Credits</span>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 z-40 hidden h-screen w-[280px] shrink-0 lg:block">
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
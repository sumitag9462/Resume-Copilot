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
  Split
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  // 1. Foundation & Upload
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resumes', label: 'My Resumes', icon: Files },
  
  // 2. Evaluate Current Resume
  { path: '/analysis/1', label: 'ATS Analysis', icon: BarChart3 },
  { path: '/jd-match', label: 'JD Match', icon: Briefcase },
  
  // 3. Improve & Iterate
  { path: '/resume-boost', label: 'Resume Boost', icon: Sparkles },
  { path: '/version-compare', label: 'Version Compare', icon: TrendingUp },
  { path: '/resume-comparison', label: 'Resume Comparison', icon: Split },
  
  // 4. Application Assets & Prep
  { path: '/cover-letter', label: 'Cover Letters', icon: Mail },
  { path: '/outreach', label: 'Outreach', icon: Send },
  { path: '/interview-prep', label: 'Interview Prep', icon: BrainCircuit },

  // 5. Account
  { path: '/settings', label: 'Settings', icon: Settings },
]

const Sidebar = () => {
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

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-border-subtle bg-bg-surface lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border-subtle px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_12px_30px_rgba(124,111,247,0.22)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-display text-[20px] font-semibold text-text-primary">Resume Copilot</p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-text-muted font-display">Career OS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="text-text-muted text-[10px] tracking-widest uppercase px-4 mb-2 mt-2 font-display">Navigation</div>
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path || (path === '/analysis/1' && pathname.startsWith('/analysis'))
          return (
            <Link
              key={path}
              to={path}
              className={`group flex items-center gap-3 py-2.5 px-4 rounded-xl mx-2 text-[14px] font-medium transition-all duration-150 ${
                active
                  ? 'text-text-primary border-l-2 border-accent-violet'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`}
              style={active ? { background: 'linear-gradient(90deg, rgba(124, 111, 247, 0.15), rgba(46, 203, 173, 0.08))' } : {}}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-accent-violet' : 'text-inherit'}`} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border-subtle p-4">
        <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet to-accent-teal text-[12px] font-semibold text-white">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-text-primary">{user?.name || 'Rahul Sharma'}</p>
            <p className="truncate text-[11px] text-text-secondary">{user?.email || 'rahul@resumecopilot.ai'}</p>
          </div>
          <span className="rounded-full bg-accent-teal/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-teal">Pro</span>
        </div>
        <button onClick={handleLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-transparent px-3 py-3 text-[13px] font-semibold text-text-secondary transition hover:border-red-500/40 hover:text-red-400">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
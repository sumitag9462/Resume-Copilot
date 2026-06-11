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
  UserCheck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resumes', label: 'My Resumes', icon: Files },
  { path: '/resume-boost', label: 'Resume Boost', icon: Sparkles },
  { path: '/interview-prep', label: 'Interview Prep', icon: BrainCircuit },
  { path: '/analysis/1', label: 'ATS Analysis', icon: BarChart3 },
  { path: '/jd-match', label: 'JD Match', icon: Briefcase },
  { path: '/cover-letter', label: 'Cover Letters', icon: Mail },
  { path: '/version-compare', label: 'Version Compare', icon: TrendingUp },

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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/10 bg-[#0D0D14] lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#5B8FFF] shadow-[0_12px_30px_rgba(124,92,252,0.22)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-heading text-[20px] font-bold text-white">Resume Copilot</p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Career OS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path || (path === '/analysis/1' && pathname.startsWith('/analysis'))
          return (
            <Link
              key={path}
              to={path}
              className={`group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-[14px] font-medium transition-all duration-200 ${
                active
                  ? 'border-[#7C5CFC]/30 bg-[#7C5CFC]/12 text-[#A78BFA] shadow-[inset_2px_0_0_#7C5CFC]'
                  : 'text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#00D4AA] text-[12px] font-semibold text-white">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{user?.name || 'Rahul Sharma'}</p>
            <p className="truncate text-[11px] text-slate-400">{user?.email || 'rahul@resumecopilot.ai'}</p>
          </div>
          <span className="rounded-full bg-[#00D4AA]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00D4AA]">Pro</span>
        </div>
        <button onClick={handleLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] font-semibold text-slate-200 transition hover:bg-red-500/10 hover:text-red-200">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
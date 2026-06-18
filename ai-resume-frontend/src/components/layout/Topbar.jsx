import { useLocation } from 'react-router-dom'
import { Bell, Search, Cpu, Menu } from 'lucide-react'
import { useModel } from '../../context/ModelContext'

const titles = {
  '/dashboard': 'Executive Dashboard',
  '/resumes': 'My Resumes',
  '/resume-boost': 'Resume Boost',
  '/interview-prep': 'Interview Prep',
  '/analyzer': 'ATS Analyzer',
  '/analysis': 'ATS Analyzer',
  '/jd-match': 'JD Match',
  '/cover-letter': 'Cover Letters',
  '/version-compare': 'Version Compare',
  '/resume-comparison': 'Resume Comparison',
  '/settings': 'Settings',
  '/outreach': 'Cold Outreach',
}

const Topbar = ({ onMenuClick }) => {
  const location = useLocation()
  const key = location.pathname.startsWith('/analysis') ? '/analysis' : location.pathname
  const title = titles[key] || 'Resume Copilot Workspace'

  const { selectedModel, setSelectedModel, compareMode, setCompareMode } = useModel()

  return (
    <header className="sticky top-0 z-30 pt-6 px-6 lg:px-10 pb-4 transition-all duration-300">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between rounded-2xl bg-[#111318]/40 backdrop-blur-2xl border border-white/[0.08] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.3)] transition-all hover:bg-[#111318]/60">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            aria-label="Toggle mobile menu"
            className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden -ml-2"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-accent-violet sm:block">Resume Copilot Workspace</p>
            <h1 className="text-xl font-bold tracking-tight text-white font-display sm:text-2xl sm:mt-0.5">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Global Model Selector */}
          <div className="relative group hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-sm text-slate-300 transition-all hover:border-accent-violet/40 hover:bg-white/[0.04] focus-within:border-accent-violet/60 focus-within:ring-1 focus-within:ring-accent-violet sm:flex shadow-inner">
            <Cpu className="h-4 w-4 text-accent-violet-light" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent font-semibold text-white outline-none cursor-pointer"
            >
              <option value="auto" className="bg-[#0E101A] text-white">Auto</option>
              <option value="gemini-2.5-flash-lite" className="bg-[#0E101A] text-white">Flash Lite</option>
              <option value="gemini-2.5-flash" className="bg-[#0E101A] text-white">Flash</option>
              <option value="gemini-flash-latest" className="bg-[#0E101A] text-white">Flash Latest</option>
              <option value="gemini-pro" className="bg-[#0E101A] text-white">Gemini Pro</option>
            </select>
            <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1a1a2e] px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50 shadow-lg border border-white/10">
              Auto: Claude automatically selects the best AI model for each task
            </div>
          </div>

          {/* Model Comparison Toggle */}
          <label className="relative group hidden cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-sm transition-all hover:border-accent-violet/40 hover:bg-white/[0.04] sm:flex shadow-inner">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="accent-accent-violet h-4.5 w-4.5 cursor-pointer rounded-lg bg-white/[0.05]"
            />
            <span className="font-semibold text-white">Compare</span>
            <div className="absolute top-full left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap rounded-xl bg-[#111318]/90 backdrop-blur-md px-4 py-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10">
              Compare two resume versions side by side
            </div>
          </label>

          <label className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-slate-400 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] focus-within:border-accent-violet/50 focus-within:bg-white/[0.05] focus-within:ring-2 focus-within:ring-accent-violet/20 md:flex group shadow-inner">
            <Search className="h-4 w-4 transition-colors group-focus-within:text-accent-violet" />
            <input
              type="text"
              placeholder="Search command (⌘K)..."
              className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 transition-all duration-300 focus:w-64"
            />
          </label>
          
          <button aria-label="Notifications" className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white shadow-inner group">
            <Bell className="h-[18px] w-[18px] transition-transform group-hover:rotate-12" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-teal shadow-[0_0_12px_rgba(46,203,173,1)] animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar

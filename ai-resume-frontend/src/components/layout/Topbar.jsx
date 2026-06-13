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
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            aria-label="Toggle mobile menu"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white lg:hidden -ml-2"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-accent-violet-light sm:block">Resume Copilot</p>
            <h1 className="text-xl font-bold tracking-tight text-white font-display sm:text-2xl sm:mt-0.5">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Model Selector */}
          <div className="relative group hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0E101A] px-3 py-2 text-sm text-slate-400 transition-all hover:border-accent-violet/30 focus-within:border-accent-violet/60 focus-within:ring-1 focus-within:ring-accent-violet sm:flex">
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
          <label className="relative group hidden cursor-pointer items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0E101A] px-3 py-2 text-sm transition-all hover:border-accent-violet/30 sm:flex">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="accent-accent-violet h-4.5 w-4.5 cursor-pointer rounded-lg bg-white/[0.05]"
            />
            <span className="font-semibold text-white">Compare</span>
            <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1a1a2e] px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50 shadow-lg border border-white/10">
              Compare two resume versions side by side
            </div>
          </label>

          <label className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0E101A] px-3 py-2 text-slate-400 transition-all focus-within:border-accent-violet/50 focus-within:ring-1 focus-within:ring-accent-violet/20 md:flex">
            <Search className="h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-24 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 xl:w-32"
            />
          </label>
          
          <button aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#0E101A] text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent-teal shadow-[0_0_8px_rgba(46,203,173,0.8)]" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar

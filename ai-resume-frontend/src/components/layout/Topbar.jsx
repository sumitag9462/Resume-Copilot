import { useLocation } from 'react-router-dom'
import { Bell, Search, Sparkles, Cpu, GitCompare } from 'lucide-react'
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
  '/settings': 'Settings',
  '/career-mentor': 'Career Mentor',
  '/project-analyzer': 'Project & Portfolio',
  '/recruiter-simulator': 'Recruiter Simulator',
  '/arena-history': 'Arena History Logs',
}

const Topbar = () => {
  const location = useLocation()
  const key = location.pathname.startsWith('/analysis') ? '/analysis' : location.pathname
  const title = titles[key] || 'Resume Copilot Workspace'

  const { selectedModel, setSelectedModel, compareMode, setCompareMode } = useModel()

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-base/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-text-muted font-display">Resume Copilot</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary font-display">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Model Selector */}
          <div className="flex items-center gap-2 rounded-xl border border-border-normal bg-bg-elevated px-3 py-2 text-sm text-text-secondary hover:border-border-strong transition">
            <Cpu className="h-4 w-4 text-accent-violet" />
            <span className="font-semibold text-text-muted">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent font-medium text-text-primary outline-none cursor-pointer"
            >
              <option value="auto" className="bg-[#0F1326] text-white">Auto</option>
              <option value="gemini-2.5-flash-lite" className="bg-[#0F1326] text-white">Flash Lite</option>
              <option value="gemini-2.5-flash" className="bg-[#0F1326] text-white">Flash</option>
              <option value="gemini-flash-latest" className="bg-[#0F1326] text-white">Flash Latest</option>
              <option value="gemini-pro" className="bg-[#0F1326] text-white">Gemini Pro</option>
            </select>
          </div>

          {/* Model Comparison Toggle */}
          <label className="flex items-center gap-2 rounded-xl border border-border-normal bg-bg-elevated px-3 py-2 text-sm text-text-secondary cursor-pointer hover:border-accent-violet/50 transition duration-150">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="accent-accent-violet h-4.5 w-4.5 cursor-pointer rounded-lg border-white/20 bg-white/5"
            />
            <span className="font-semibold text-text-primary">Compare Models</span>
          </label>

          <label className="hidden items-center gap-2 rounded-xl border border-border-subtle bg-bg-elevated px-3 py-2 text-text-secondary md:flex focus-within:border-accent-violet/50 focus-within:ring-1 focus-within:ring-accent-violet/20 transition duration-150">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search insights"
              className="w-32 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>
          <button className="relative rounded-xl border border-border-normal bg-bg-elevated p-2 text-text-secondary transition hover:bg-bg-muted hover:text-text-primary">
            <Bell className="h-4 w-4" />
            <span className="w-1.5 h-1.5 bg-accent-teal rounded-full absolute top-1 right-1" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar

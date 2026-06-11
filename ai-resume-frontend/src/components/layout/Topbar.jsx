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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0F]/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8B7CFF]">Resume Copilot</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Model Selector */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-slate-300">
            <Cpu className="h-4 w-4 text-[#A78BFA]" />
            <span className="font-semibold text-slate-400">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent font-medium text-white outline-none cursor-pointer"
            >
              <option value="auto" className="bg-[#0F1326] text-white">Auto</option>
              <option value="gemini-2.5-flash-lite" className="bg-[#0F1326] text-white">Flash Lite</option>
              <option value="gemini-2.5-flash" className="bg-[#0F1326] text-white">Flash</option>
              <option value="gemini-flash-latest" className="bg-[#0F1326] text-white">Flash Latest</option>
              <option value="gemini-pro" className="bg-[#0F1326] text-white">Gemini Pro</option>
            </select>
          </div>

          {/* Model Comparison Toggle */}
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-slate-300 cursor-pointer hover:bg-white/10 transition">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="accent-[#7C5CFC] h-4.5 w-4.5 cursor-pointer rounded-lg border-white/20 bg-white/5"
            />
            <span className="font-semibold text-slate-200">Compare Models</span>
          </label>

          <label className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search insights"
              className="w-32 bg-transparent text-[13px] text-white outline-none placeholder:text-slate-400"
            />
          </label>
          <button className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar

import { useLocation, Link } from 'react-router-dom'
import { Bell, Search, Sparkles, Menu, UploadCloud } from 'lucide-react'

const titles = {
  '/dashboard': 'Dashboard',
  '/resumes': 'My Resumes',
  '/copilot': 'AI Career Copilot',
  '/resume-boost': 'Resume Boost',
  '/interview-prep': 'Interview Prep',
  '/analyzer': 'ATS Analyzer',
  '/analysis': 'ATS Analyzer',
  '/jd-match': 'Job Description Matcher',
  '/cover-letter': 'Cover Letters',
  '/resume-comparison': 'Resume Comparison',
  '/settings': 'Settings',
}

const Topbar = ({ onMenuClick, title }) => {
  const location = useLocation()
  const key = location.pathname.startsWith('/analysis') ? '/analysis' : location.pathname
  const displayTitle = title || titles[key] || 'Resume Copilot'

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-white/[0.06] bg-[#07080B]/80 backdrop-blur-xl px-6 lg:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          aria-label="Toggle mobile menu"
          className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white lg:hidden -ml-2"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-white font-display tracking-tight">{displayTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={openCommandPalette}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400 hover:border-white/20 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search tools (⌘K)</span>
        </button>

        {/* Quick Upload Action */}
        <Link
          to="/resumes"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-violet to-accent-teal px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(124,111,247,0.25)] hover:opacity-90 transition-opacity"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Upload Resume</span>
        </Link>
      </div>
    </header>
  )
}

export default Topbar

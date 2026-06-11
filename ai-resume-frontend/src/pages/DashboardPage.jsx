// =============================================================
// src/pages/DashboardPage.jsx — DASHBOARD HOME
//
// Shows:
//   - Greeting + date
//   - Stats cards (resume count, analyses run)
//   - Quick action cards (links to key features)
//   - Recent resumes list
// =============================================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ArrowRight,
  BrainCircuit,
  Briefcase,
  Clock,
  FileText,
  Files,
  ScanText,
  Sparkles,
  TrendingUp,
  Upload,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { getAllResumes } from '../api/resumeApi'

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <motion.div whileHover={{ y: -4 }} className="card p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[13px] uppercase tracking-[0.28em] text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </div>
      <div className={`rounded-2xl p-3 ${tone.badge}`}>
        <Icon className={`h-5 w-5 ${tone.icon}`} />
      </div>
    </div>
  </motion.div>
)

const QuickAction = ({ to, icon: Icon, title, desc, tone }) => (
  <Link to={to} className="card group flex items-start gap-4 p-5 transition hover:-translate-y-1 hover:border-[#7C5CFC]/30">
    <div className={`rounded-2xl p-3 ${tone.badge}`}>
      <Icon className={`h-5 w-5 ${tone.icon}`} />
    </div>
    <div className="flex-1">
      <p className="text-[15px] font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{desc}</p>
    </div>
    <ArrowRight className="mt-1 h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-[#8B7CFF]" />
  </Link>
)

const scoreTrend = [
  { label: 'Mon', score: 72 },
  { label: 'Tue', score: 76 },
  { label: 'Wed', score: 79 },
  { label: 'Thu', score: 82 },
  { label: 'Fri', score: 81 },
  { label: 'Sat', score: 85 },
]

const DashboardPage = () => {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    getAllResumes()
      .then((d) => setResumes(d.resumes || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const quickActions = [
    { to: '/resumes', icon: Upload, title: 'Upload Resume', desc: 'Add a new PDF or DOCX resume and keep every version in one place.', tone: { badge: 'bg-[#7C5CFC]/10', icon: 'text-[#A78BFA]' } },
    { to: '/resume-boost', icon: Sparkles, title: 'Resume Boost', desc: 'Enhance bullets and scan weak language to make your resume stronger.', tone: { badge: 'bg-[#00D4AA]/10', icon: 'text-[#5DE8C5]' } },
    { to: '/interview-prep', icon: BrainCircuit, title: 'Interview Prep', desc: 'Generate role-based questions and answer frameworks from your resume.', tone: { badge: 'bg-[#5B8FFF]/10', icon: 'text-[#8FB3FF]' } },
    { to: '/analyzer', icon: ScanText, title: 'Run ATS Check', desc: 'Review keyword gaps, ATS score, and content quality instantly.', tone: { badge: 'bg-[#FBBF24]/10', icon: 'text-[#FDE68A]' } },
    { to: '/jd-match', icon: Briefcase, title: 'Match with Job', desc: 'See how your resume maps to the requirements in any JD.', tone: { badge: 'bg-[#7C5CFC]/10', icon: 'text-[#A78BFA]' } },
    { to: '/cover-letter', icon: FileText, title: 'Cover Letter', desc: 'Generate a tailored letter that speaks to the role you want.', tone: { badge: 'bg-[#00D4AA]/10', icon: 'text-[#5DE8C5]' } },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8 page-enter">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.45)] lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#9A8CFF]">AI Career Workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white lg:text-4xl">{greeting}, {firstName} 👋</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Track all resume versions, run ATS checks, and see how your profile aligns with target roles in one premium workspace.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Score Trend</p>
                <h2 className="mt-1 text-xl font-semibold text-white">ATS performance this week</h2>
              </div>
              <span className="rounded-full bg-[#00D4AA]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5DE8C5]">+6.8%</span>
            </div>
            <div className="mt-6 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrend}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.10)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip cursor={{ stroke: 'rgba(124,92,252,0.15)' }} contentStyle={{ background: '#0F1326', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#E5E7EB' }} />
                  <Area type="monotone" dataKey="score" stroke="#8B7CFF" strokeWidth={3} fill="url(#scoreFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <StatCard icon={Files} label="Resumes Uploaded" value={loading ? '—' : resumes.length} tone={{ badge: 'bg-[#7C5CFC]/10', icon: 'text-[#A78BFA]' }} />
              <StatCard icon={ScanText} label="Analyses Run" value="12" tone={{ badge: 'bg-[#00D4AA]/10', icon: 'text-[#5DE8C5]' }} />
              <StatCard icon={Briefcase} label="Jobs Matched" value="8" tone={{ badge: 'bg-[#5B8FFF]/10', icon: 'text-[#8FB3FF]' }} />
              <StatCard icon={TrendingUp} label="Avg ATS Score" value="84" tone={{ badge: 'bg-[#FBBF24]/10', icon: 'text-[#FDE68A]' }} />
            </div>
          </motion.section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Quick Actions</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Jump back into your workflow</h2>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">Ready</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {quickActions.map((action) => <QuickAction key={action.to} {...action} />)}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Highlights</p>
                <h2 className="mt-1 text-xl font-semibold text-white">This week at a glance</h2>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Your average ATS score improved by 6.8% after adding quantified impact bullets.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">JD Match now highlights the missing skills that matter most for your target companies.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Cover-letter drafts are available in professional, startup, and creative tones.</div>
            </div>
          </motion.section>
        </div>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-8 card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Recent Resumes</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Latest uploads</h2>
            </div>
            <Link to="/resumes" className="text-sm font-semibold text-[#A78BFA] hover:text-[#C4B5FD]">View all</Link>
          </div>

          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="card p-4"><div className="skeleton h-12 w-full rounded-2xl" /></div>)}</div>
          ) : resumes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
              <Files className="mx-auto h-10 w-10 text-[#A78BFA]" />
              <p className="mt-3 text-lg font-semibold text-white">No resumes yet</p>
              <p className="mt-1 text-sm text-slate-400">Upload your first resume to activate ATS, JD match, and cover-letter workflows.</p>
              <Link to="/resumes" className="btn-primary mt-5">Upload Resume</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 4).map((r) => (
                <Link key={r._id} to={`/analyzer?resumeId=${r._id}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#7C5CFC]/30 hover:bg-white/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C5CFC]/10 text-[#A78BFA]"><Files className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-white">{r.originalName}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" /> {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className="rounded-full bg-[#00D4AA]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5DE8C5]">{r.fileType}</span>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
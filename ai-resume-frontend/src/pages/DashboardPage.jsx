import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, ReferenceLine } from 'recharts'
import {
  ArrowRight,
  BrainCircuit,
  Briefcase,
  FileText,
  Files,
  ScanText,
  Sparkles,
  TrendingUp,
  Upload,
  Calendar,
  ChevronRight,
  Lightbulb,
  Award
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { getAllResumes } from '../api/resumeApi'
import StatCard from '../components/ui/StatCard'
import ScoreRing from '../components/ui/ScoreRing'

const QuickAction = ({ to, icon: Icon, title, desc, delay }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} className="h-full">
      <Link to={to} className="card group relative flex h-full flex-col justify-between overflow-hidden p-5 transition-all duration-300">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent-violet/10 to-transparent" />
        <div className="relative z-10">
          <div className="mb-4 inline-flex rounded-xl bg-muted p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] group-hover:shadow-[0_0_0_1px_rgba(124,111,247,0.3),0_0_12px_rgba(124,111,247,0.2)] transition-shadow animate-float">
            <Icon className="h-5 w-5 text-accent-violet" />
          </div>
          <p className="text-md font-display font-bold text-white">{title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{desc}</p>
        </div>
        <div className="relative z-10 mt-5 flex items-center text-xs font-semibold text-accent-violet transition-colors group-hover:text-accent-teal">
          Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

const scoreTrend = [
  { label: 'Week 1', score: 62 },
  { label: 'Week 2', score: 68 },
  { label: 'Week 3', score: 74 },
  { label: 'Week 4', score: 81 },
  { label: 'Week 5', score: 86 },
  { label: 'Current', score: 92 },
]

const activityFeed = [
  { id: 1, type: 'analyze', title: 'ATS Analysis Complete', desc: 'Software Engineer Resume scored 92%', time: '2 hours ago', icon: ScanText, color: 'text-accent-teal' },
  { id: 2, type: 'cover', title: 'Cover Letter Generated', desc: 'Tailored for Google Frontend role', time: '5 hours ago', icon: FileText, color: 'text-accent-violet' },
  { id: 3, type: 'boost', title: 'Resume Boost Applied', desc: '14 bullet points optimized', time: '1 day ago', icon: Sparkles, color: 'text-warning' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const DashboardPage = () => {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllResumes()
      .then((d) => setResumes(d.resumes || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] relative">
        
        {/* Executive Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-white/[0.06] bg-surface p-6 sm:flex-row sm:items-center sm:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-violet">Executive Workspace</p>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-white">
              <span className="gradient-text-warm">{greeting}, {firstName}</span> 👋
            </h1>
            <p className="mt-2 text-sm text-slate-400">Your AI career co-pilot is ready. Let's optimize your next application.</p>
          </div>
          
          <div className="relative z-10 flex shrink-0 items-center gap-4">
            <div className="hidden items-center gap-1.5 sm:flex">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-glow-pulse" />
              <span className="text-xs text-slate-400">AI Ready</span>
            </div>
            <Link to="/resumes" className="btn-primary group magnetic-zone py-3 text-sm font-semibold rounded-lg">
              <Upload className="h-4 w-4" /> New Upload
            </Link>
          </div>
        </motion.div>

        {/* Top Metrics Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 z-10 relative"
        >
          <StatCard 
            icon={TrendingUp} 
            label="ATS Score" 
            value={92} 
            trend="+6% this week" 
            trendDirection="up" 
            iconColor="violet" 
          />
          <StatCard 
            icon={Award} 
            label="Profile Strength" 
            value={85} 
            trend="Top 15%" 
            trendDirection="up" 
            iconColor="teal" 
          />
          <StatCard 
            icon={Files} 
            label="Resumes Uploaded" 
            value={resumes.length} 
            iconColor="amber" 
          />
          <StatCard 
            icon={FileText} 
            label="Cover Letters Generated" 
            value={12} 
            iconColor="violet" 
          />
        </motion.div>

        {/* Main Grid: Charts & Feed */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] z-10 relative">
          
          {/* Progress Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.5 }} 
            className="flex flex-col h-full"
          >
            <div className="card p-6 flex flex-col h-full">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Optimization Timeline</p>
                  <h2 className="mt-1 text-md font-display font-bold text-white">ATS Score Growth</h2>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400">
                  <Calendar className="h-3.5 w-3.5" /> Last 6 Weeks
                </div>
              </div>
              <div className="h-[240px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(124,111,247,0.3)" stopOpacity={1}/>
                        <stop offset="95%" stopColor="rgba(124,111,247,0)" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                    <ReferenceLine y={75} stroke="rgba(124,111,247,0.3)" label={{ position: 'insideTopRight', value: 'Target', fill: '#7C6FF7', fontSize: 10 }} strokeDasharray="4 4" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#181C24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }}
                      itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#7C6FF7" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#2ECBAD', stroke: '#111318', strokeWidth: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Activity & Resumes */}
          <div className="flex flex-col gap-6">
            
            <motion.div initial="hidden" animate="show" variants={containerVariants} className="card p-6 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-4">Recent Activity</p>
              <div className="space-y-4">
                {activityFeed.map((activity, i) => (
                  <motion.div 
                    key={activity.id} 
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-default"
                  >
                    <div className="relative flex flex-col items-center mt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08]">
                        <activity.icon className={`h-3.5 w-3.5 ${activity.color}`} />
                      </div>
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-display font-bold text-white">{activity.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{activity.desc}</p>
                      <p className="mt-1 text-[10px] font-medium uppercase text-slate-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>

        {/* AI Insight and Score Ring */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_2fr] z-10 relative">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6 flex flex-col items-center justify-center">
             <ScoreRing 
               score={92}
               size={120}
               label="Current ATS Score"
               sublabel="Excellent Fit"
             />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-6 border-l-2 border-l-accent-violet flex flex-col justify-center relative overflow-hidden group">
            <div className="flex items-center gap-3 relative z-10">
              <div className="rounded-xl bg-accent-violet/10 p-2.5">
                <Lightbulb className="h-5 w-5 text-accent-violet" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">AI Insight of the Day</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 relative z-10">
              <span className="text-white font-bold">Action required:</span> Your recent tech resume is missing quantified impact metrics in your latest role. Adding metrics like "improved by X%" boosts ATS scores by an average of 14%.
            </p>
            <div className="mt-4 flex items-center justify-between relative z-10">
              <span className="text-xs text-slate-500">Generated just now</span>
              <Link to="/boost" className="flex items-center text-xs font-bold text-accent-violet hover:text-accent-violet-dim transition-colors w-max">
                Fix with Resume Boost <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Quick Actions Grid */}
        <div className="mb-4 z-10 relative">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">Workspace Tools</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction to="/analyzer" icon={ScanText} title="ATS Analyzer" desc="Score your resume against applicant tracking systems." delay={0.35} />
            <QuickAction to="/jd-match" icon={Briefcase} title="JD Matcher" desc="Compare your profile against specific job requirements." delay={0.4} />
            <QuickAction to="/cover-letter" icon={FileText} title="Cover Letters" desc="Generate AI cover letters tailored to your target role." delay={0.45} />
            <QuickAction to="/interview-prep" icon={BrainCircuit} title="Interview Prep" desc="Practice with AI-generated role-specific questions." delay={0.5} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
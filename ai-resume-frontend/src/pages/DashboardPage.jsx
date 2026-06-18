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
  Mic,
  ScanText,
  Sparkles,
  TrendingUp,
  Upload,
  Calendar,
  ChevronRight,
  Lightbulb,
  Award,
  Activity,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { getAllResumes } from '../api/resumeApi'
import { getDashboardStats } from '../api/analysisApi'
import StatCard from '../components/ui/StatCard'
import ScoreRing from '../components/ui/ScoreRing'
import GlassCard from '../components/ui/GlassCard'
import GradientButton from '../components/ui/GradientButton'

const iconMap = {
  ScanText: ScanText,
  FileText: FileText,
  Sparkles: Sparkles,
  Briefcase: Briefcase
}

const QuickAction = ({ to, icon: Icon, title, desc, delay }) => {
  return (
    <GlassCard animated hoverEffect delay={delay} className="h-full p-5 group cursor-pointer">
      <Link to={to} className="relative z-10 flex h-full flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/0 to-accent-teal/0 group-hover:from-accent-violet/10 group-hover:to-accent-teal/10 transition-colors duration-500 rounded-3xl pointer-events-none -m-5" />
        <div>
          <div className="mb-4 inline-flex rounded-xl bg-white/[0.04] p-3 border border-white/[0.05] group-hover:border-accent-violet/50 group-hover:shadow-[0_0_20px_rgba(124,111,247,0.2)] transition-all duration-300">
            <Icon className="h-5 w-5 text-accent-violet-light group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-md font-display font-bold text-white tracking-wide">{title}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{desc}</p>
        </div>
        <div className="relative z-10 mt-5 flex items-center text-[11px] font-bold uppercase tracking-wider text-accent-violet transition-colors group-hover:text-accent-teal">
          Launch Tool <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </GlassCard>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const DashboardPage = () => {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAllResumes().then((d) => setResumes(d.resumes || [])),
      getDashboardStats().then((d) => setStats(d.stats || null))
    ])
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const hasData = stats && resumes.length > 0

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
        
        {/* Main Content Area */}
        <div className="flex flex-col gap-8">
          
          {/* Executive Header */}
          <GlassCard animated className="p-8 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-violet/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex flex-col sm:flex-row justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent-teal animate-pulse shadow-[0_0_10px_rgba(46,203,173,0.8)]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal">System Online</p>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{greeting}, {firstName}.</span>
                </h1>
                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                  Your AI career co-pilot is ready. You've uploaded <span className="text-white font-semibold">{resumes.length} resumes</span> and completed <span className="text-white font-semibold">{hasData ? stats.recentActivity?.length || 0 : 0} actions</span> this week. Let's optimize your next application.
                </p>
              </div>
              
              <div className="flex items-center sm:items-start shrink-0">
                <Link to="/resumes">
                  <GradientButton className="h-12 px-6">
                    <Upload className="h-4 w-4" />
                    New Upload
                  </GradientButton>
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* Top Metrics Row */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatCard 
              icon={TrendingUp} 
              label="Highest ATS Score" 
              value={hasData ? stats.atsScore : 0} 
              trend={hasData ? `Top score` : "Needs Analysis"} 
              trendDirection="up" 
              iconColor="violet" 
              suffix="%"
            />
            <StatCard 
              icon={Award} 
              label="Profile Strength" 
              value={hasData ? stats.profileStrength : 0} 
              trend={hasData ? "AI Calculated" : "N/A"} 
              trendDirection="up" 
              iconColor="teal" 
              suffix="/100"
            />
            <StatCard 
              icon={Files} 
              label="Resumes Uploaded" 
              value={resumes.length} 
              iconColor="amber" 
            />
            <StatCard 
              icon={FileText} 
              label="Cover Letters" 
              value={hasData ? stats.totalCoverLetters : 0} 
              iconColor="violet" 
            />
          </motion.div>

          {/* Main Grid: Charts & AI Insight */}
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            
            {/* Progress Chart */}
            <GlassCard animated delay={0.2} className="p-6 flex flex-col min-h-[360px]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Optimization Timeline</h2>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">Recent ATS Scores</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 border border-white/[0.05]">
                  <Calendar className="h-3.5 w-3.5" /> Recent Scans
                </div>
              </div>
              <div className="flex-1 w-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hasData && stats.scoreTrend.length > 0 ? stats.scoreTrend : [{label: 'Scan 1', score: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(124,111,247,0.4)" stopOpacity={1}/>
                        <stop offset="95%" stopColor="rgba(124,111,247,0)" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <ReferenceLine y={75} stroke="rgba(46,203,173,0.4)" label={{ position: 'insideTopRight', value: 'Target 75%', fill: '#2ECBAD', fontSize: 10, fontWeight: 'bold' }} strokeDasharray="4 4" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(17,19,24,0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                      itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#7C6FF7" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#2ECBAD', stroke: '#111318', strokeWidth: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* AI Insight & Score Ring */}
            <div className="flex flex-col gap-6 w-full lg:w-[320px]">
              <GlassCard animated delay={0.3} className="p-6 flex flex-col items-center justify-center flex-1">
                 <ScoreRing 
                   score={hasData ? stats.atsScore : 0}
                   size={160}
                   label="Highest ATS Score"
                   sublabel={hasData ? "Keep Optimizing!" : "Needs Analysis"}
                 />
              </GlassCard>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="z-10 relative mt-2">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-accent-violet" />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Workspace Tools</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction to="/analyzer" icon={ScanText} title="ATS Analyzer" desc="Score your resume against applicant tracking systems." delay={0.35} />
              <QuickAction to="/jd-match" icon={Briefcase} title="JD Matcher" desc="Compare your profile against specific job requirements." delay={0.4} />
              <QuickAction to="/cover-letter" icon={FileText} title="Cover Letters" desc="Generate AI cover letters tailored to your target role." delay={0.45} />
              <QuickAction to="/interview-prep" icon={BrainCircuit} title="Interview Prep" desc="Practice with AI-generated role-specific questions." delay={0.5} />
              <QuickAction to="/voice-interview" icon={Mic} title="AI Interview" desc="Real-time voice interview with adaptive AI evaluation." delay={0.55} />
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          
          <GlassCard animated delay={0.4} className="p-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-violet to-accent-teal" />
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-accent-violet/10 p-2.5 shadow-inner">
                <Lightbulb className="h-5 w-5 text-accent-violet" />
              </div>
              <h3 className="font-display font-bold text-white">AI Suggestion</h3>
            </div>
            <div className="prose prose-sm prose-invert">
              <p className="text-slate-300 leading-relaxed">
                {hasData ? (
                  <>Your tech resume is missing quantified metrics. Adding metrics like <span className="text-white font-bold bg-white/10 px-1 rounded">"improved by X%"</span> boosts ATS scores by an average of 14%.</>
                ) : (
                  <>Please upload your first resume to receive AI-powered insights and actionable feedback.</>
                )}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.05]">
              <Link to={resumes.length > 0 ? '/resume-boost' : '/resumes'} className="flex items-center justify-between text-xs font-bold text-accent-teal hover:text-accent-teal-light transition-colors">
                <span>{resumes.length > 0 ? 'Launch Resume Boost' : 'Upload Resume'}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </GlassCard>

          <GlassCard animated delay={0.5} className="p-6 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-4 w-4 text-slate-400" />
              <h3 className="font-display font-bold text-white">Recent Activity</h3>
            </div>
            
            <div className="space-y-5">
              {!hasData || stats.recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Clock className="h-8 w-8 text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-400">No activity yet</p>
                  <p className="text-xs text-slate-500 mt-1">Upload a resume to begin tracking</p>
                </div>
              ) : (
                stats.recentActivity.map((activity, i) => {
                  const IconComponent = iconMap[activity.icon] || ScanText;
                  return (
                  <motion.div 
                    key={activity.id} 
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (i * 0.1), duration: 0.35 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] shadow-inner group-hover:bg-white/[0.08] transition-colors">
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      {i !== stats.recentActivity.length - 1 && (
                        <div className="absolute top-9 bottom-[-20px] w-px bg-gradient-to-b from-white/[0.08] to-transparent" />
                      )}
                    </div>
                    <div className="pb-2 pt-1">
                      <p className="text-sm font-bold text-white group-hover:text-accent-violet transition-colors">{activity.title}</p>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{activity.desc}</p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{new Date(activity.time).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                )})
              )}
            </div>
          </GlassCard>

        </div>

      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
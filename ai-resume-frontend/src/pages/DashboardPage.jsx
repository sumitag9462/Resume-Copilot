import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Briefcase, FileText, Mic, ScanText, Target } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getAllResumes } from '../api/resumeApi';
import { getDashboardStats } from '../api/analysisApi';
import GlassCard from '../components/ui/GlassCard';

// Phase 8 Components
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import AIWorkspaceOverview from '../components/dashboard/AIWorkspaceOverview';
import ResumeHealth from '../components/dashboard/ResumeHealth';
import JobMatchWidget from '../components/dashboard/JobMatchWidget';
import AICareerInsights from '../components/dashboard/AICareerInsights';
import AIActivityFeed from '../components/dashboard/AIActivityFeed';

const QuickAction = ({ to, icon: Icon, title, desc, delay }) => (
  <GlassCard animated delay={delay} className="h-full p-5 group cursor-pointer border-white/5 hover:border-white/20 transition-all duration-300">
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllResumes().then((d) => setResumes(d.resumes || [])),
      getDashboardStats().then((d) => setStats(d.stats || null))
    ])
      .catch((err) => {
        toast.error(err.message || 'Failed to load dashboard data');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
        
        {/* Welcome & AI Brief */}
        <WelcomeBanner />

        {/* Global Stats Overview */}
        <AIWorkspaceOverview />

        {/* Core Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
          {/* Main Focus: Resume Health */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ResumeHealth />
          </div>
          {/* Secondary Focus: Job Matches */}
          <div className="flex flex-col gap-6">
            <JobMatchWidget />
          </div>
        </div>

        {/* Feed & Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AICareerInsights />
          </div>
          <div>
            <AIActivityFeed />
          </div>
        </div>

        {/* Tools Section */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-accent-violet" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">AI Tool Suite</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction to="/analyzer" icon={ScanText} title="ATS Analyzer" desc="Score resume against trackers." delay={0.1} />
            <QuickAction to="/jd-match" icon={Briefcase} title="JD Matcher" desc="Compare vs Job Description." delay={0.2} />
            <QuickAction to="/cover-letter" icon={FileText} title="Cover Letters" desc="Generate AI tailored letters." delay={0.3} />
            <QuickAction to="/interview-prep" icon={BrainCircuit} title="Interview Prep" desc="Practice AI generated Q&A." delay={0.4} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
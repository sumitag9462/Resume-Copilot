import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Activity } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';

// Workspace Components
import AISearchBar from '../components/jobs/AISearchBar';
import SmartFilters from '../components/jobs/SmartFilters';
import JobCard from '../components/jobs/JobCard';
import JobDetailsPanel from '../components/jobs/JobDetailsPanel';
import ApplicationTracker from '../components/jobs/ApplicationTracker';
import AICareerCoach from '../components/jobs/AICareerCoach';

// Mock Data
const MOCK_JOBS = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "Stripe",
    location: "Remote, US",
    salary: "$160k - $210k",
    matchScore: 94,
    missingSkills: ["GraphQL"],
    matchedSkills: ["React", "TypeScript", "Performance Optimization", "Redux"],
    timePosted: "2h ago",
    aiInsight: "Excellent match. Improve GraphQL keywords before applying."
  },
  {
    id: 2,
    role: "Staff UI Developer",
    company: "Vercel",
    location: "Remote",
    salary: "$180k - $230k",
    matchScore: 88,
    missingSkills: ["Rust", "WebGL"],
    matchedSkills: ["Next.js", "React Server Components", "Tailwind CSS"],
    timePosted: "5h ago",
    aiInsight: "Strong Next.js alignment. Emphasize full-stack capabilities."
  },
  {
    id: 3,
    role: "Frontend Architect",
    company: "Linear",
    location: "San Francisco, CA",
    salary: "$170k - $240k",
    matchScore: 82,
    missingSkills: ["MobX", "C++ (WASM)"],
    matchedSkills: ["React", "State Management", "Framer Motion"],
    timePosted: "1d ago",
    aiInsight: "Great fit for motion design, but lacks heavy state architecture."
  }
];

export default function JDMatchPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    // Simulate AI Search delay
    setTimeout(() => setIsSearching(false), 800);
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <DashboardLayout fullScreen>
      <div className="h-full flex flex-col relative">
        
        {/* Floating AI Coach */}
        <AICareerCoach />

        {/* Top Section: Search & Kanban (Collapsible/Fixed) */}
        <div className="shrink-0 p-6 lg:px-10 lg:pt-8 bg-gradient-to-b from-[#0A0B0F] to-transparent z-20">
          
          <div className="max-w-[1600px] mx-auto">
            {/* Header / Search */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8">
              <div className="w-full lg:w-1/3">
                <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                  Job Intelligence
                  <span className="px-2.5 py-1 rounded-lg bg-accent-violet/20 border border-accent-violet/30 text-[10px] uppercase tracking-widest text-accent-violet-light flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> AI Workspace
                  </span>
                </h1>
                <p className="text-sm text-slate-400">Discover roles, match skills, and optimize applications.</p>
              </div>
              <div className="w-full lg:w-1/2">
                <AISearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* Kanban Application Tracker (Mini View) */}
            <div className="mb-2">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-accent-teal" /> Application Pipeline
              </h2>
              <ApplicationTracker />
            </div>
            
            <SmartFilters />
          </div>
        </div>

        {/* Bottom Section: Split Screen Workspace */}
        <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full px-6 lg:px-10 pb-6 gap-6 relative z-10">
          
          {/* Left Column: Job Feed */}
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col bg-[#121422]/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <span className="text-xs font-bold text-slate-300">{jobs.length} Opportunities found</span>
              {isSearching && <Activity className="w-4 h-4 text-accent-violet animate-pulse" />}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              <AnimatePresence>
                {jobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isActive={selectedJobId === job.id} 
                    onClick={() => setSelectedJobId(job.id)} 
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Job Details / Intelligence Panel */}
          <div className="hidden lg:flex flex-1 flex-col h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedJobId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <JobDetailsPanel job={selectedJob} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
import React, { useState } from 'react';
import { Briefcase, Building, MapPin, DollarSign, Target, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const jobMatches = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "Stripe",
    location: "Remote, US",
    salary: "$160k - $210k",
    matchScore: 94,
    missingSkills: ["GraphQL"],
    matchedSkills: ["React", "TypeScript", "Performance Optimization", "Redux"],
    timePosted: "2h ago"
  },
  {
    id: 2,
    role: "Staff UI Developer",
    company: "Vercel",
    location: "Remote",
    salary: "$180k - $230k",
    matchScore: 88,
    missingSkills: ["Rust (Basic)", "WebGL"],
    matchedSkills: ["Next.js", "React Server Components", "Tailwind CSS"],
    timePosted: "5h ago"
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
    timePosted: "1d ago"
  }
];

export default function JobMatchWidget() {
  const [expandedId, setExpandedId] = useState(1);

  return (
    <GlassCard animated className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-teal" />
          <h2 className="text-lg font-display font-bold text-white">Top JD Matches</h2>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-white/5 px-2 py-1 rounded">Based on 'Frontend Dev_v4'</span>
      </div>

      <div className="flex-1 space-y-3">
        {jobMatches.map((job) => (
          <div 
            key={job.id} 
            className={`rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${expandedId === job.id ? 'border-accent-teal/30 bg-white/[0.04]' : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'}`}
            onClick={() => setExpandedId(job.id === expandedId ? null : job.id)}
          >
            {/* Header / Summary */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-accent-teal transition-colors">{job.role}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-lg font-display font-bold ${job.matchScore >= 90 ? 'text-emerald-400' : job.matchScore >= 80 ? 'text-accent-teal' : 'text-amber-400'}`}>
                  {job.matchScore}%
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500">Match</span>
              </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
              {expandedId === job.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 border-t border-white/5 pt-3"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold">{job.salary}</span>
                    <span className="text-slate-600 mx-1">•</span>
                    <span className="text-slate-500">Posted {job.timePosted}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 block">Matched Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.matchedSkills.map(skill => (
                          <span key={skill} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 block mt-2">Missing Requirements</span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.missingSkills.map(skill => (
                          <span key={skill} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-2.5 h-2.5" /> {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-accent-teal text-[#121422] hover:bg-accent-teal-light transition-colors flex items-center justify-center gap-1">
                      Analyze Gap <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button className="flex-1 py-2 text-xs font-bold rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors">
                      View JD
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

import React from 'react';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import { User, Briefcase, Target, Layers } from 'lucide-react';

export default function InterviewSetup({ 
  role, setRole, 
  experience, setExperience,
  interviewMode, setInterviewMode,
  handleGenerate, isLoading 
}) {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-bold text-white mb-6">Interview Setup</h3>
      <form onSubmit={handleGenerate} className="space-y-5">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Target Role</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet transition-colors" />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50"
              placeholder="e.g. Frontend Engineer"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Experience Level</label>
          <div className="relative group">
            <Layers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet transition-colors" />
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 appearance-none"
            >
              <option value="entry">0-2 Years (Entry)</option>
              <option value="mid">3-5 Years (Mid)</option>
              <option value="senior">5+ Years (Senior)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Interview Mode</label>
          <div className="relative group">
            <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet transition-colors" />
            <select
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 appearance-none"
            >
              <option value="technical">Technical Round</option>
              <option value="behavioral">Behavioral / HR</option>
              <option value="resume">Resume Deep-Dive</option>
              <option value="system_design">System Design</option>
            </select>
          </div>
        </div>

        <GradientButton
          type="submit"
          disabled={isLoading}
          className="w-full h-12 mt-4"
        >
          {isLoading ? "Preparing..." : "Start Interview"}
        </GradientButton>
      </form>
    </GlassCard>
  );
}

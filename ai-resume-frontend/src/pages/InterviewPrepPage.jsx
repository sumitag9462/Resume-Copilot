import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Mic, 
  Cpu, 
  Target, 
  ShieldCheck, 
  Layers,
  ArrowLeft,
  ScanText,
  Briefcase
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function InterviewPrepPage() {
  return (
    <DashboardLayout title="Interview Simulator">
      <div className="max-w-5xl mx-auto pb-12 flex flex-col gap-8">
        
        {/* ── TOP HERO BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121424] via-[#0E101A] to-[#0A0B10] p-8 sm:p-12">
          {/* Background Ambient Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-accent-violet/15 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-accent-teal/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent-teal/30 bg-accent-teal/10 text-accent-teal text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
              Roadmap Milestone • In Active Engineering
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center text-white shadow-[0_8px_30px_rgba(124,111,247,0.35)] mb-6">
              <BrainCircuit className="w-8 h-8" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight max-w-2xl">
              AI Voice & Technical Interview Simulator
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              This feature is currently in progress and will be functional soon. It represents the next major milestone on the product roadmap, expanding Resume Copilot into an interactive, end-to-end interview coaching environment.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.1] transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </Link>
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(124,111,247,0.3)]"
              >
                <ScanText className="w-4 h-4" />
                <span>Explore ATS Analyzer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── PLANNED CAPABILITIES GRID ── */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold font-display text-white">Upcoming Architecture & Capabilities</h2>
            <p className="text-xs text-slate-400">Planned system design for candidate interview preparation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet-light mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Resume-Grounded Questions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of generic question lists, the LLM parses your uploaded resume's projects, architecture decisions, and metrics to craft realistic deep-dive technical questions.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-[11px] text-accent-teal font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Context-aware LLM prompts
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Real-Time Voice & STAR Scoring</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive voice input via browser SpeechRecognition with automatic scoring on the STAR method (Situation, Task, Action, Result) and filler word analysis.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-[11px] text-accent-teal font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Behavioral speech evaluation
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Adaptive Follow-Up Probing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Simulates a Staff+ technical interviewer by dynamically challenging candidate answers on edge cases, scalability trade-offs, and failure recovery.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-[11px] text-accent-teal font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dynamic multi-turn dialogue
              </div>
            </div>
          </div>
        </div>

        {/* ── ENGINEERING ROADMAP TIMELINE ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white font-display">Product Engineering Roadmap</h2>
              <p className="text-xs text-slate-400 mt-0.5">Development phases and milestone tracking</p>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white/[0.04] px-3 py-1 rounded-lg border border-white/5">
              Engineering Version 2.0
            </span>
          </div>

          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Phase 1: Resume Intelligence Engine</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Shipped & Operational
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full text extraction (PDF & DOCX), strict ATS parser compliance scoring, keyword gap identification, STAR-method bullet optimization, and tailored cover letter generation.
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-accent-teal/30 bg-accent-teal/5">
              <div className="p-2 rounded-lg bg-accent-teal/10 text-accent-teal shrink-0 mt-0.5">
                <Clock className="w-4 h-4 animate-spin" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Phase 2: Live AI Interview Simulator</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full">
                    In Active Progress
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Speech-to-text integration, dynamic technical rubric scoring, behavioral STAR coaching, and personalized performance heatmaps.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
              <div className="p-2 rounded-lg bg-white/[0.04] text-slate-500 shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-300">Phase 3: Multi-Agent Recruiter Consensus</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded-full">
                    Planned Milestone
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Multi-agent simulations evaluating candidates against distinct recruiter, engineering manager, and bar-raiser personas simultaneously.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA TO WORKING TOOLS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/analyzer"
            className="group p-5 rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 hover:border-accent-violet/40 hover:bg-[#121422] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet-light">
                <ScanText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-accent-violet-light transition-colors">
                  Run ATS Resume Analyzer
                </h4>
                <p className="text-xs text-slate-400">Score machine parsability & keyword density</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          <Link
            to="/jd-match"
            className="group p-5 rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 hover:border-accent-teal/40 hover:bg-[#121422] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-accent-teal transition-colors">
                  Run Job Description Matcher
                </h4>
                <p className="text-xs text-slate-400">Analyze missing skills against any job post</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}

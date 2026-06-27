import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScanText, ChevronDown, CheckCircle, XCircle, AlertTriangle, Lightbulb, BookOpen, Tag, AlertCircle, FileText, Cpu, ChevronRight, BarChart2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";
import ScoreRing from "../components/ui/ScoreRing";

const AnalyzerPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || '');
  const [loadingResumes, setLoadingResumes] = useState(true);

  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["ats_analysis"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  const { selectedModel, compareMode } = useModel();

  // Clear state when navigating away from this page
  useEffect(() => {
    return () => {
      if (clearRun) {
        clearRun("ats_analysis");
      }
    };
  }, [clearRun]);

  useEffect(() => {
    getAllResumes()
      .then((d) => {
        setResumes(d.resumes || []);
        if (d.resumes?.length > 0 && !preselectedId) {
          setSelectedResumeId(d.resumes[0]._id);
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load resumes");
        console.error(err);
      })
      .finally(() => setLoadingResumes(false));
  }, [preselectedId]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error("Please select a resume");
      return;
    }

    await executeRun("ats_analysis", {
      feature: 'ats_analysis',
      inputs: {
        resumeId: selectedResumeId
      },
      model: selectedModel,
      compareMode
    });
  };

  const renderResult = (output) => {
    if (!output) return null;

    return (
      <div className="space-y-6">
        
        {/* Core Scores */}
        <div className="grid gap-6 sm:grid-cols-2">
          <GlassCard className="p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-violet/10 to-transparent opacity-50" />
            <ScoreRing 
              score={output.atsScore || 0}
              size={160}
              label="ATS Match Score"
              sublabel="Machine Parsability"
              color="#7C6FF7"
            />
          </GlassCard>
          
          <GlassCard className="p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-teal/10 to-transparent opacity-50" />
            <ScoreRing 
              score={output.overallScore || 0}
              size={160}
              label="Overall Quality"
              sublabel="Content & Impact"
              color="#2ECBAD"
            />
          </GlassCard>
        </div>

        {/* Formatting & Missing Keywords */}
        <div className="grid gap-6 lg:grid-cols-2">
          {output.formattingAnalysis && (
            <GlassCard className="p-6 border-t-2 border-t-accent-violet">
              <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-violet-light">
                <FileText className="h-4 w-4" /> Formatting Analysis
              </h5>
              <p className="text-sm leading-relaxed text-slate-300">
                {output.formattingAnalysis}
              </p>
            </GlassCard>
          )}

          {output.missingKeywords?.length > 0 && (
            <GlassCard className="p-6 border-t-2 border-t-rose-500/50">
              <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">
                <Tag className="h-4 w-4" /> Missing Keywords
              </h5>
              <div className="flex flex-wrap gap-2">
                {output.missingKeywords.map((kw, i) => (
                  <span key={i} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 shadow-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid gap-6 sm:grid-cols-2">
          {output.strengths?.length > 0 && (
            <GlassCard className="p-6 border-l-2 border-l-emerald-500/50">
              <h5 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                <CheckCircle className="h-4 w-4" /> Profile Strengths
              </h5>
              <ul className="space-y-4">
                {output.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] text-slate-300">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle className="h-2.5 w-2.5" />
                    </span>
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {output.weaknesses?.length > 0 && (
            <GlassCard className="p-6 border-l-2 border-l-rose-500/50">
              <h5 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">
                <XCircle className="h-4 w-4" /> Profile Weaknesses
              </h5>
              <ul className="space-y-4">
                {output.weaknesses.map((wk, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] text-slate-300">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                      <XCircle className="h-2.5 w-2.5" />
                    </span>
                    <span className="leading-relaxed">{wk}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>

        {/* AI Suggestions */}
        {output.suggestions?.length > 0 && (
          <GlassCard className="p-8 border border-accent-violet/20 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-violet/10 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
            <h5 className="mb-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-accent-violet-light relative z-10">
              <Lightbulb className="h-5 w-5" /> AI Coaching Suggestions
            </h5>
            <ul className="grid gap-4 sm:grid-cols-2 relative z-10">
              {output.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 text-[13px] text-slate-300 transition-colors hover:border-accent-violet/30 hover:bg-white/[0.04] shadow-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent-violet/20 text-xs font-black text-accent-violet-light border border-accent-violet/20">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5">{sug}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        {/* Section Feedback */}
        {output.sectionFeedback && (
          <GlassCard className="p-8">
            <h5 className="mb-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">
              <BookOpen className="h-5 w-5" /> Section-by-Section Feedback
            </h5>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(output.sectionFeedback).map(([section, feedback]) => (
                <div key={section} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 transition-colors hover:border-[#8FB3FF]/30 shadow-sm">
                  <span className="inline-block mb-3 px-2 py-1 rounded border border-[#8FB3FF]/20 bg-[#8FB3FF]/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB3FF]">{section}</span>
                  <p className="text-sm leading-relaxed text-slate-300">{feedback}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1200px]">
        
        {/* Premium Contextual Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-accent-violet/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-violet/20 bg-accent-violet/10 px-3 py-1.5 shadow-inner">
                <ScanText className="h-4 w-4 text-accent-violet-light" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-violet-light">ATS Intelligence</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                Resume Analyzer
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Execute a deep-scan on your resume to simulate an Applicant Tracking System. Find formatting flaws, keyword gaps, and receive section-by-section optimization plans.
              </p>
            </div>

            <div className="hidden lg:flex gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <BarChart2 className="w-5 h-5 text-accent-violet mb-2" />
                <p className="text-xs font-bold text-white">Score Analysis</p>
                <p className="text-[10px] text-slate-400 mt-1">0-100 Rating</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <Tag className="w-5 h-5 text-accent-teal mb-2" />
                <p className="text-xs font-bold text-white">Keyword Gaps</p>
                <p className="text-[10px] text-slate-400 mt-1">SEO for Resumes</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Action Form */}
        <form onSubmit={handleAnalyze} className="mb-8">
          <GlassCard animated delay={0.1} className="p-6 relative overflow-hidden">
            {isLoading && (
              <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent-violet to-transparent animate-shimmer" />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full">
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Select Target Resume
                </label>
                {loadingResumes ? (
                  <div className="skeleton h-[52px] w-full rounded-2xl" />
                ) : resumes.length === 0 ? (
                  <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <p className="text-[13px] text-amber-200">
                      No resumes found. <Link to="/resumes" className="font-bold underline hover:text-amber-100">Upload one first</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full h-[52px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50"
                      required
                    >
                      <option value="" className="bg-[#111318]">-- Choose Resume --</option>
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                )}
              </div>

              <div className="w-full sm:w-auto">
                <GradientButton
                  type="submit"
                  disabled={isLoading || !selectedResumeId}
                  className="w-full sm:w-auto h-[52px] px-8"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Cpu className="h-4 w-4" /> Run Deep Scan
                    </span>
                  )}
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        </form>

        {/* Results Workspace */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {(arenaRun || isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ArenaWorkspace
                  isLoading={isLoading}
                  arenaRun={arenaRun}
                  onRegenerate={handleAnalyze}
                  renderResult={renderResult}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyzerPage;
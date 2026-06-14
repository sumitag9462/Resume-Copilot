import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScanText, ChevronDown, CheckCircle, XCircle, AlertTriangle, Lightbulb, BookOpen, Tag, AlertCircle, FileText, Cpu, ChevronRight, BarChart2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";
import EmptyState from "../components/ui/EmptyState";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

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
      .catch(console.error)
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card relative overflow-hidden p-6 text-center shadow-[0_10px_30px_rgba(124,111,247,0.15)] ring-1 ring-accent-violet/20">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-violet/10 to-transparent opacity-50" />
            <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">ATS Score</span>
            <p className="relative z-10 mt-1 text-4xl font-black text-accent-violet-light drop-shadow-[0_0_15px_rgba(124,92,252,0.5)]">{output.atsScore || 0}/100</p>
          </div>
          <div className="card relative overflow-hidden p-6 text-center shadow-[0_10px_30px_rgba(0,212,170,0.15)] ring-1 ring-accent-teal/20">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-teal/10 to-transparent opacity-50" />
            <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Overall Quality</span>
            <p className="relative z-10 mt-1 text-4xl font-black text-accent-teal drop-shadow-[0_0_15px_rgba(46,203,173,0.5)]">{output.overallScore || 0}/100</p>
          </div>
        </div>

        {output.formattingAnalysis && (
          <div className="card p-6 border-l-2 border-l-slate-500">
            <h5 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Formatting Analysis</h5>
            <p className="text-[13px] leading-relaxed text-slate-300">
              {output.formattingAnalysis}
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {output.strengths?.length > 0 && (
            <div className="card p-5 border-t-2 border-t-emerald-500/50">
              <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                <CheckCircle className="h-4 w-4" /> Profile Strengths
              </h5>
              <ul className="space-y-3">
                {output.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    {str}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {output.weaknesses?.length > 0 && (
            <div className="card p-5 border-t-2 border-t-rose-500/50">
              <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">
                <XCircle className="h-4 w-4" /> Profile Weaknesses
              </h5>
              <ul className="space-y-3">
                {output.weaknesses.map((wk, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                    {wk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {output.suggestions?.length > 0 && (
          <div className="card p-6 border border-accent-violet/10">
            <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-violet-light">
              <Lightbulb className="h-4 w-4" /> AI Coaching Suggestions
            </h5>
            <ul className="grid gap-3 sm:grid-cols-2">
              {output.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-[#0A0B0F] p-3 text-[13px] text-slate-300 transition-colors hover:border-accent-violet/20 hover:bg-white/[0.02]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-violet/10 text-[10px] font-black text-accent-violet-light">
                    {idx + 1}
                  </span>
                  {sug}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {output.missingKeywords?.length > 0 && (
            <div className="card p-5">
              <h5 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">
                <Tag className="h-4 w-4" /> Missing Keywords
              </h5>
              <div className="flex flex-wrap gap-2">
                {output.missingKeywords.map((kw, i) => (
                  <span key={i} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h5 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
              <AlertTriangle className="h-4 w-4" /> Grammar Checks
            </h5>
            {output.grammarIssues?.length > 0 ? (
              <ul className="space-y-2">
                {output.grammarIssues.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {g}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <p className="text-[12px] font-medium text-emerald-200">No spelling or grammar issues detected.</p>
              </div>
            )}
          </div>
        </div>

        {output.sectionFeedback && (
          <div className="card p-6">
            <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">
              <BookOpen className="h-4 w-4" /> Section Feedback
            </h5>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(output.sectionFeedback).map(([section, feedback]) => (
                <div key={section} className="rounded-xl border border-white/[0.04] bg-[#0A0B0F] p-4 transition-colors hover:border-[#8FB3FF]/30">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8FB3FF]">{section}</span>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-300">{feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header with AI Visualizer */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl sm:flex-row sm:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-accent-violet/10 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-violet/20 bg-accent-violet/5 px-3 py-1">
              <ScanText className="h-3.5 w-3.5 text-accent-violet-light" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-violet-light">ATS Optimization</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Resume Analyzer</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Audit formatting, score grammar structure, find missing keywords, and get AI-powered section-by-section critiques.
            </p>
          </div>

            <div className="relative z-10 hidden lg:block w-[450px] shrink-0">
              <div className="relative overflow-hidden rounded-2xl border border-accent-violet/20 bg-[#0A0B0F]/80 p-6 backdrop-blur-md shadow-[0_0_40px_rgba(124,111,247,0.15)] transition-transform hover:-translate-y-1">
                {/* Decorative background glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-violet/20 blur-3xl pointer-events-none"></div>
                
                <div className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet/20 to-accent-teal/20 border border-white/10 shadow-inner">
                    <BarChart2 className="h-5 w-5 text-accent-violet drop-shadow-[0_0_8px_rgba(124,111,247,0.8)]" />
                  </div>
                  
                  <div>
                    <h3 className="text-[13px] font-bold text-white tracking-wide">Upload Your Resume to Begin</h3>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                      ATS score, keyword analysis, and improvement suggestions will appear here.
                    </p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/5 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-violet shadow-[0_0_4px_#7C5CFC]"></span> ATS Score
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/5 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-teal shadow-[0_0_4px_#00D4AA]"></span> Keyword Gaps
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/5 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#FBBF24]"></span> Section Ratings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Full-width Layout */}
        <div className="flex flex-col gap-8">
          {/* Top Control Form */}
          <form onSubmit={handleAnalyze} className="card p-6 sm:p-8 relative overflow-hidden">
            {isLoading && (
              <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent-violet to-transparent animate-shimmer" />
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Select Target Resume
                </label>
                {loadingResumes ? (
                  <div className="skeleton h-[52px] w-full rounded-xl" />
                ) : resumes.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <p className="text-[13px] text-amber-200">
                      No resumes found. <Link to="/resumes" className="font-bold underline">Upload one first</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="input-base w-full appearance-none pr-10 text-[14px]"
                      required
                    >
                      <option value="">-- Choose Resume --</option>
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>{r.originalName}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !selectedResumeId}
                  className={`btn-primary relative w-full h-[52px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ScanText className="h-4 w-4" /> Run ATS Audit
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Results Area */}
          <div className="w-full">
            {(arenaRun || isLoading) && (
              <ArenaWorkspace
                isLoading={isLoading}
                arenaRun={arenaRun}
                onRegenerate={handleAnalyze}
                renderResult={renderResult}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyzerPage;
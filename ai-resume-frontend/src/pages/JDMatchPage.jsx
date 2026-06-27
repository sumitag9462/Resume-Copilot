import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown, CheckCircle, XCircle, Target, Lightbulb, AlertCircle, ArrowRight, Activity, Code, Cpu } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from '../context/ArenaContext';
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";
import ScoreRing from "../components/ui/ScoreRing";

const MIN_JD_LENGTH = 50;

const verdictConfig = {
  "Strong Match": { bg: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30", icon: "🎯", color: "#34D399" },
  "Good Match": { bg: "from-[#8FB3FF]/20 to-[#8FB3FF]/5 text-[#8FB3FF] border-[#8FB3FF]/30", icon: "👍", color: "#8FB3FF" },
  "Moderate Match": { bg: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30", icon: "⚠️", color: "#FBBF24" },
  "Weak Match": { bg: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30", icon: "❌", color: "#FB7185" }
};

const JDMatchPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(preselectedId || "");
  const [jdText, setJdText] = useState("");
  const [loadingList, setLoadingList] = useState(true);

  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["jd_match"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  const { selectedModel, compareMode } = useModel();

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("jd_match");
    };
  }, [clearRun]);

  useEffect(() => {
    getAllResumes()
      .then((d) => {
        setResumes(d.resumes || []);
        if (d.resumes?.length > 0 && !preselectedId) {
          setSelectedId(d.resumes[0]._id);
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load resumes");
        console.error(err);
      })
      .finally(() => setLoadingList(false));
  }, [preselectedId]);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      toast.error("Please select a resume");
      return;
    }
    if (jdText.trim().length < MIN_JD_LENGTH) {
      toast.error("Job description is too short");
      return;
    }

    await executeRun("jd_match", {
      feature: "jd_match",
      inputs: {
        resumeId: selectedId,
        jobDescription: jdText
      },
      model: selectedModel,
      compareMode
    });
  };

  const renderResult = (output) => {
    if (!output) return null;
    const verdict = output.verdict || "Moderate Match";
    const cfg = verdictConfig[verdict] || { bg: "from-slate-500/20 to-slate-500/5 text-slate-400 border-slate-500/30", icon: "📊", color: "#94A3B8" };
    
    const matchScore = output.matchScore || 0;
    const skillScore = output.skillCoverage || 0;

    return (
      <div className="space-y-6">
        
        {/* Top Analytics Row */}
        <div className="grid gap-6 sm:grid-cols-2">
          <GlassCard className="p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#8FB3FF]/10 to-transparent opacity-50" />
            <ScoreRing 
              score={matchScore}
              size={140}
              label="Overall Match"
              sublabel={verdict}
              color={cfg.color}
            />
          </GlassCard>

          <GlassCard className="p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-teal/10 to-transparent opacity-50" />
            <ScoreRing 
              score={skillScore}
              size={140}
              label="Skill Coverage"
              sublabel="Hard Skills Match"
              color="#2ECBAD"
            />
          </GlassCard>
        </div>

        {/* Executive Summary */}
        {output.summary && (
          <GlassCard className="p-6 border-l-2 border-l-[#8FB3FF]">
            <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">
              <Target className="h-4 w-4" /> Executive Summary
            </h5>
            <p className="text-sm leading-relaxed text-slate-300">
              {output.summary}
            </p>
          </GlassCard>
        )}

        {/* Skills Split */}
        <div className="grid gap-6 xl:grid-cols-2">
          {output.matchedSkills?.length > 0 && (
            <GlassCard className="p-6 border-t-2 border-t-emerald-500/50">
              <h5 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                <CheckCircle className="h-4 w-4" /> Verified Skills
              </h5>
              <div className="flex flex-wrap gap-2">
                {output.matchedSkills.map((s, idx) => (
                  <span key={idx} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-200 shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {output.missingSkills?.length > 0 && (
            <GlassCard className="p-6 border-t-2 border-t-rose-500/50">
              <h5 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">
                <XCircle className="h-4 w-4" /> Critical Missing Skills
              </h5>
              <div className="flex flex-wrap gap-2">
                {output.missingSkills.map((s, idx) => (
                  <span key={idx} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-200 shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Actionable Recommendations */}
        {output.recommendations?.length > 0 && (
          <GlassCard className="p-8 border border-accent-violet/20 relative overflow-hidden group">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent-violet/10 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
            <h5 className="mb-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-accent-violet-light relative z-10">
              <Lightbulb className="h-5 w-5" /> Optimization Roadmap
            </h5>
            <ul className="grid gap-4 relative z-10">
              {output.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 text-sm text-slate-300 transition-colors hover:border-accent-violet/30 hover:bg-white/[0.04] shadow-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent-violet/20 text-xs font-black text-accent-violet-light border border-accent-violet/20">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5">{rec}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )}
      </div>
    );
  };

  const jdCharsLeft = Math.max(0, MIN_JD_LENGTH - jdText.trim().length);
  const isButtonEnabled = selectedId && jdText.trim().length >= MIN_JD_LENGTH;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* Premium Contextual Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#8FB3FF]/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8FB3FF]/20 bg-[#8FB3FF]/10 px-3 py-1.5 shadow-inner">
                <Target className="h-4 w-4 text-[#8FB3FF]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">Applicant Tracking</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                JD Match Arena
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Cross-reference your resume with job requirements, mapping skills gap, keywords matches, and generating optimization plans.
              </p>
            </div>

            <div className="hidden lg:flex gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <Activity className="w-5 h-5 text-[#8FB3FF] mb-2" />
                <p className="text-xs font-bold text-white">Live Matching</p>
                <p className="text-[10px] text-slate-400 mt-1">Real-time AI</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <Code className="w-5 h-5 text-accent-teal mb-2" />
                <p className="text-xs font-bold text-white">Skill Extraction</p>
                <p className="text-[10px] text-slate-400 mt-1">Semantic NLP</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Split Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Input Parameters */}
          <div className="sticky top-24">
            <form onSubmit={handleMatch}>
              <GlassCard animated delay={0.1} className="p-8 relative overflow-hidden h-full flex flex-col">
                {isLoading && (
                  <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                    <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#8FB3FF] to-transparent animate-shimmer" />
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-white">Match Parameters</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure your target profile and JD.</p>
                </div>

                {/* Step 1: Resume */}
                <div className="mb-8">
                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    1. Base Resume
                  </label>
                  {loadingList ? (
                    <div className="skeleton h-[56px] w-full rounded-2xl" />
                  ) : resumes.length === 0 ? (
                    <div className="flex h-[56px] items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      <p className="text-[13px] text-amber-200">
                        No resumes. <Link to="/resumes" className="font-bold underline hover:text-amber-100">Upload one</Link>.
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-[#8FB3FF]/50 focus:ring-1 focus:ring-[#8FB3FF]/50"
                        required
                      >
                        <option value="" className="bg-[#111318]">Choose Resume...</option>
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Step 2: JD Text */}
                <div className="flex-1 flex flex-col mb-8">
                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    2. Job Description
                  </label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the target JD here..."
                    className="w-full flex-1 min-h-[320px] rounded-2xl border border-white/10 bg-white/5 p-4 text-[14px] text-slate-200 outline-none transition-all focus:border-[#8FB3FF]/50 focus:ring-1 focus:ring-[#8FB3FF]/50 resize-none"
                    required
                  />
                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                    <p className="text-slate-500">{jdText.length} chars</p>
                    {jdText.length > 0 && jdText.length < MIN_JD_LENGTH && (
                      <p className="text-amber-500">{jdCharsLeft} more needed</p>
                    )}
                    {jdText.length >= MIN_JD_LENGTH && (
                      <p className="flex items-center gap-1 text-[#8FB3FF]"><CheckCircle className="h-3.5 w-3.5" /> Ready</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <GradientButton
                  type="submit"
                  disabled={isLoading || !isButtonEnabled}
                  className="w-full h-[56px] text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Cross-Referencing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Cpu className="h-5 w-5" /> Execute Match Engine
                    </span>
                  )}
                </GradientButton>
              </GlassCard>
            </form>
          </div>

          {/* Right: Output Workspace */}
          <div className="min-h-[600px] flex flex-col">
            <AnimatePresence mode="wait">
              {!(arenaRun || isLoading) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#8FB3FF]/10 mb-6 border border-[#8FB3FF]/20 shadow-[0_0_30px_rgba(143,179,255,0.15)]">
                    <Target className="h-8 w-8 text-[#8FB3FF]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Parameters</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Configure your resume and job description on the left to generate a live match analysis.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ArenaWorkspace
                    isLoading={isLoading}
                    arenaRun={arenaRun}
                    onRegenerate={handleMatch}
                    renderResult={renderResult}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default JDMatchPage;
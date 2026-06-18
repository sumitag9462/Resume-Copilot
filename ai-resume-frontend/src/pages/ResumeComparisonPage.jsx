import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, ChevronDown, AlertCircle, Award, Target, FileText, CheckCircle, ArrowRight, Activity, Zap, Sparkles } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";

const ResumeComparisonPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedIdA, setSelectedIdA] = useState("");
  const [selectedIdB, setSelectedIdB] = useState("");
  const [loadingList, setLoadingList] = useState(true);

  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["resume_comparison"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;
  
  const { selectedModel, compareMode } = useModel();

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("resume_comparison");
    };
  }, [clearRun]);

  useEffect(() => {
    getAllResumes()
      .then((d) => {
        setResumes(d.resumes || []);
        if (d.resumes?.length > 1) {
          setSelectedIdA(d.resumes[0]._id);
          setSelectedIdB(d.resumes[1]._id);
        } else if (d.resumes?.length === 1) {
          setSelectedIdA(d.resumes[0]._id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingList(false));
  }, []);

  const handleCompare = async (e) => {
    if (e) e.preventDefault();
    if (!selectedIdA || !selectedIdB) {
      toast.error("Please select two resumes to compare");
      return;
    }
    if (selectedIdA === selectedIdB) {
      toast.error("Please select two DIFFERENT resumes to compare");
      return;
    }

    await executeRun("resume_comparison", {
      feature: "resume_comparison",
      inputs: {
        resumeIdA: selectedIdA,
        resumeIdB: selectedIdB
      },
      model: selectedModel,
      compareMode
    });
  };

  const renderResult = (output) => {
    if (!output) return null;

    return (
      <div className="space-y-8">
        {/* Winner Banner */}
        <GlassCard className="p-8 border border-[#A78BFA]/30 bg-[#A78BFA]/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#A78BFA]/20 to-transparent pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#A78BFA]/20 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-[#A78BFA]/20 flex items-center justify-center flex-shrink-0 border border-[#A78BFA]/30 shadow-[0_0_30px_rgba(167,139,250,0.3)]">
              <Award className="w-10 h-10 text-[#A78BFA]" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-[12px] font-bold text-[#A78BFA] uppercase tracking-[0.2em] mb-2 flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4" /> Overall Winner
              </h4>
              <p className="text-4xl font-display font-black text-white drop-shadow-md">{output.winner}</p>
            </div>
          </div>
        </GlassCard>

        {/* Feature Comparison */}
        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard className="p-6 border-t-4 border-t-[#00D4AA]/50 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center border border-[#00D4AA]/20">
                <Target className="w-5 h-5 text-[#00D4AA]" />
              </div>
            </div>
            <h5 className="font-bold text-[12px] uppercase tracking-[0.1em] text-[#00D4AA] mb-3">ATS Performance</h5>
            <p className="text-sm text-slate-300 leading-relaxed">{output.atsComparison}</p>
          </GlassCard>

          <GlassCard className="p-6 border-t-4 border-t-[#8FB3FF]/50 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#8FB3FF]/10 flex items-center justify-center border border-[#8FB3FF]/20">
                <FileText className="w-5 h-5 text-[#8FB3FF]" />
              </div>
            </div>
            <h5 className="font-bold text-[12px] uppercase tracking-[0.1em] text-[#8FB3FF] mb-3">Readability</h5>
            <p className="text-sm text-slate-300 leading-relaxed">{output.readabilityComparison}</p>
          </GlassCard>

          <GlassCard className="p-6 border-t-4 border-t-amber-400/50 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                <CheckCircle className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <h5 className="font-bold text-[12px] uppercase tracking-[0.1em] text-amber-400 mb-3">Keyword Coverage</h5>
            <p className="text-sm text-slate-300 leading-relaxed">{output.keywordComparison}</p>
          </GlassCard>
        </div>

        {/* Detailed Feedback & Recommendations */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-8 border-l-2 border-l-[#7C5CFC]">
            <h5 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC] mb-5">
              <Activity className="w-4 h-4" /> Detailed Feedback
            </h5>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {output.detailedFeedback}
            </div>
          </GlassCard>

          <GlassCard className="p-8 border border-emerald-500/20 bg-emerald-500/5">
            <h5 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-5">
              <Zap className="w-4 h-4" /> Final Recommendation
            </h5>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {output.recommendation}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px]">
        
        {/* Premium Contextual Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#A78BFA]/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/10 px-3 py-1.5 shadow-inner">
                <GitCompare className="h-4 w-4 text-[#A78BFA]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA]">A/B Testing</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                Resume Comparison
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Select two different resumes to have an AI recruiter compare their strengths, weaknesses, and ATS optimization side-by-side.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8 items-start">
          
          {/* Setup Panel */}
          <div className="sticky top-24">
            <form onSubmit={handleCompare}>
              <GlassCard animated delay={0.1} className="p-8 relative overflow-hidden h-full flex flex-col">
                {isLoading && (
                  <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                    <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent animate-shimmer" />
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-white">Comparison Setup</h2>
                  <p className="text-xs text-slate-400 mt-1">Select profiles to evaluate against each other.</p>
                </div>

                {loadingList ? (
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="skeleton h-[56px] w-full rounded-2xl" />
                        <div className="skeleton h-[56px] w-full rounded-2xl" />
                    </div>
                ) : resumes.length < 2 ? (
                  <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-200">
                      You need at least 2 resumes to compare. <Link to="/resumes" className="font-bold underline hover:text-white">Upload more</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 mb-8 relative">
                    <div>
                      <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">
                        Resume A
                      </label>
                      <div className="relative">
                        <select
                          value={selectedIdA}
                          onChange={(e) => setSelectedIdA(e.target.value)}
                          className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-[#8FB3FF]/50 focus:ring-1 focus:ring-[#8FB3FF]/50"
                          required
                        >
                          <option value="" className="bg-[#111318]">-- Choose Resume A --</option>
                          {resumes.map((r) => (
                            <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>

                    {/* VS Badge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <div className="bg-[#111318] border border-white/10 rounded-full h-10 w-10 flex items-center justify-center shadow-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">VS</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-accent-teal mt-2">
                        Resume B
                      </label>
                      <div className="relative">
                        <select
                          value={selectedIdB}
                          onChange={(e) => setSelectedIdB(e.target.value)}
                          className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-accent-teal/50 focus:ring-1 focus:ring-accent-teal/50"
                          required
                        >
                          <option value="" className="bg-[#111318]">-- Choose Resume B --</option>
                          {resumes.map((r) => (
                            <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>
                  </div>
                )}

                <GradientButton
                  type="submit"
                  disabled={isLoading || resumes.length < 2 || !selectedIdA || !selectedIdB || selectedIdA === selectedIdB}
                  className="w-full h-[56px] text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Comparing Resumes...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <GitCompare className="w-5 h-5" /> Run Comparison Engine
                    </span>
                  )}
                </GradientButton>
              </GlassCard>
            </form>
          </div>

          {/* Output Workspace */}
          <div className="min-h-[600px] flex flex-col w-full">
            <AnimatePresence mode="wait">
              {!(arenaRun || isLoading) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#A78BFA]/10 mb-6 border border-[#A78BFA]/20 shadow-[0_0_30px_rgba(167,139,250,0.15)]">
                    <GitCompare className="h-8 w-8 text-[#A78BFA]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Parameters</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Select two different resumes from the left panel and execute the comparison engine.
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
                    onRegenerate={handleCompare}
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

export default ResumeComparisonPage;

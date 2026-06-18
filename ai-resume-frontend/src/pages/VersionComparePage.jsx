import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, ChevronDown, CheckCircle, Lightbulb, AlertCircle, Sparkles, ArrowRight, Cpu, Layers } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";

const VersionComparePage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(preselectedId || "");

  const [loadingList, setLoadingList] = useState(true);

  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["version_compare"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;
  
  const { selectedModel, compareMode } = useModel();

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("version_compare");
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
      .catch(console.error)
      .finally(() => setLoadingList(false));
  }, [preselectedId]);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      toast.error("Please select a resume");
      return;
    }

    try {
      await executeRun("version_compare", {
        feature: 'version_compare',
        inputs: {
          resumeId: selectedId
        },
        model: selectedModel,
        compareMode
      });
      toast.success("Version optimization audit complete! 🎯");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to compare versions");
    }
  };

  const renderResult = (output) => {
    if (!output) return null;

    return (
      <div className="space-y-6">
        {/* Top Analytics */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "ATS Score", val: output.atsScore, color: "text-[#7C5CFC]", border: "border-[#7C5CFC]" },
            { label: "Readability", val: output.readability, color: "text-accent-teal", border: "border-accent-teal" },
            { label: "Length", val: output.length, color: "text-[#8FB3FF]", border: "border-[#8FB3FF]" },
            { label: "Recruiter", val: output.recruiterScore, color: "text-[#A78BFA]", border: "border-[#A78BFA]" },
            { label: "Keywords", val: output.keywordDensity, color: "text-amber-400", border: "border-amber-400" }
          ].map((sc, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={sc.label}
            >
              <GlassCard className={`p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg border-b-4 ${sc.border}/50`}>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">{sc.label}</span>
                <p className={`text-3xl font-black font-display mt-2 ${sc.color} drop-shadow-sm`}>{sc.val}<span className="text-xs text-slate-500 ml-1">/100</span></p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Detailed Insights */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <GlassCard className="p-8 border-l-2 border-l-[#8FB3FF] relative overflow-hidden group">
            <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-[#8FB3FF]/10 blur-[60px] rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-150" />
            <h5 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF] mb-4 relative z-10">
              <Sparkles className="w-5 h-5" /> Model Optimization Opinion
            </h5>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap relative z-10">
              {output.explanation}
            </p>
          </GlassCard>

          <GlassCard className="p-8 border border-accent-teal/20 bg-accent-teal/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/0 to-accent-teal/10 pointer-events-none" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-teal/10 text-accent-teal mb-5 border border-accent-teal/20 relative z-10">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="font-display font-bold text-white text-lg mb-2 relative z-10">Next Steps</p>
            <p className="text-sm text-slate-300 leading-relaxed relative z-10">
              Check this model's suggestions inside the Rebuilder tab. This will help you resolve the exact keyword gaps and length constraints highlighted above.
            </p>
          </GlassCard>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px]">
        
        {/* Premium Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#8FB3FF]/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8FB3FF]/20 bg-[#8FB3FF]/10 px-3 py-1.5 shadow-inner">
                <Layers className="h-4 w-4 text-[#8FB3FF]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">Model Optimization</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                Version Audits
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Audit optimization metrics for your resume, identifying how different LLMs evaluate readability, length, and keyword density.
              </p>
            </div>

            <div className="hidden lg:flex gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <Cpu className="w-5 h-5 text-[#8FB3FF] mb-2" />
                <p className="text-xs font-bold text-white">Multi-Model</p>
                <p className="text-[10px] text-slate-400 mt-1">Cross-Validation</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
          
          {/* Settings Sidebar */}
          <div className="flex flex-col gap-6 sticky top-24">
            <form onSubmit={handleCompare}>
              <GlassCard animated delay={0.1} className="p-8 relative overflow-hidden h-full flex flex-col">
                {isLoading && (
                  <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                    <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#8FB3FF] to-transparent animate-shimmer" />
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-white">Audit Setup</h2>
                  <p className="text-xs text-slate-400 mt-1">Select the profile you want to evaluate.</p>
                </div>

                <div className="mb-8">
                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Target Resume
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
                        <option value="" className="bg-[#111318]">-- Choose Resume --</option>
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  )}
                </div>

                <GradientButton
                  type="submit"
                  disabled={isLoading || !selectedId}
                  className="w-full h-[56px] text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Auditing Profile...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <GitCompare className="h-5 w-5" /> Run Profile Audit
                    </span>
                  )}
                </GradientButton>
              </GlassCard>
            </form>

            <GlassCard animated delay={0.2} className="p-8">
              <h3 className="font-bold text-[14px] text-white flex items-center gap-2 mb-4">
                <GitCompare className="h-4 w-4 text-[#8FB3FF]" />
                Optimization Metrics
              </h3>
              <p className="text-[13px] text-slate-400 leading-relaxed mb-4">
                Understand model benchmarks:
              </p>
              <div className="space-y-4 text-[13px] leading-relaxed text-slate-300">
                <p className="flex gap-3 items-start"><span className="text-[#8FB3FF] flex-shrink-0">✓</span> <strong>Lite</strong> isolates readability and keyword density scores.</p>
                <p className="flex gap-3 items-start"><span className="text-[#8FB3FF] flex-shrink-0">✓</span> <strong>Flash</strong> gauges alignment of projects, skills, and target job titles.</p>
                <p className="flex gap-3 items-start"><span className="text-[#8FB3FF] flex-shrink-0">✓</span> <strong>Pro</strong> highlights formatting critique and gives advanced career suggestions.</p>
              </div>
            </GlassCard>
          </div>

          {/* Results Workspace */}
          <div className="min-h-[600px] flex flex-col w-full">
            <AnimatePresence mode="wait">
              {!(arenaRun || isLoading) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#8FB3FF]/10 mb-6 border border-[#8FB3FF]/20 shadow-[0_0_30px_rgba(143,179,255,0.15)]">
                    <Layers className="h-8 w-8 text-[#8FB3FF]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Parameters</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Select a resume from the left panel and click "Run Profile Audit" to generate insights.
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

export default VersionComparePage;

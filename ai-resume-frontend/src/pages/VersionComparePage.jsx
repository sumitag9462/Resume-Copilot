import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompare, ChevronDown, CheckCircle, Lightbulb, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";
import EmptyState from "../components/ui/EmptyState";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

const VersionComparePage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(preselectedId || "");

  const [loadingList, setLoadingList] = useState(true);

  const { activeRuns, executeRun } = useArena();
  const runState = activeRuns["version_compare"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;
  
  const { selectedModel, compareMode } = useModel();

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
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2">
          {[
            { label: "ATS Score", val: output.atsScore, color: "text-[#7C5CFC]" },
            { label: "Readability", val: output.readability, color: "text-[#00D4AA]" },
            { label: "Length", val: output.length, color: "text-[#8FB3FF]" },
            { label: "Recruiter", val: output.recruiterScore, color: "text-[#A78BFA]" },
            { label: "Keywords", val: output.keywordDensity, color: "text-amber-400" }
          ].map((sc) => (
            <div key={sc.label} className="rounded-xl border border-white/[0.06] bg-[#0A0B0F] p-4 text-center transition-colors hover:border-white/[0.15]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{sc.label}</span>
              <p className={`text-2xl font-black mt-1 ${sc.color}`}>{sc.val}<span className="text-[12px] text-slate-500 ml-1">/100</span></p>
            </div>
          ))}
        </div>

        <div className="card p-5 border-l-2 border-l-[#8FB3FF]">
          <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#8FB3FF] mb-2">Model Optimization Opinion</h5>
          <p className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">
            {output.explanation}
          </p>
        </div>

        <div className="card p-5 border border-[#00D4AA]/20 bg-[#00D4AA]/5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00D4AA]/10 text-[#00D4AA]">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-white text-[14px]">Optimization Tip</p>
              <p className="mt-1 text-[13px] text-slate-300 leading-relaxed">
                Check this model's suggestions inside the Rebuilder tab. This will help you resolve the exact keyword gaps and length constraints highlighted above.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl sm:flex-row sm:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#8FB3FF]/10 to-transparent opacity-40" />
          
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8FB3FF]/20 bg-[#8FB3FF]/5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-[#8FB3FF]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">Model Optimization</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Version Audits</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Audit optimization metrics for your resume, identifying how different Gemini models evaluate readability, length, and keyword density.
            </p>
          </div>
        </div>

        {/* 60/40 Responsive Workspace */}
        <WorkspaceLayout
          rightEmpty={!arenaRun && !isLoading}
          left={
            <div className="space-y-6">
              <form onSubmit={handleCompare} className="card p-6 sm:p-8 space-y-8">
                <div className="border-b border-white/[0.06] pb-4">
                  <h2 className="text-[15px] font-bold text-white">Audit Setup</h2>
                  <p className="text-[12px] text-slate-400 mt-1">Select the profile you want to evaluate.</p>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Target Resume
                  </label>
                  {loadingList ? (
                    <div className="skeleton h-[52px] w-full rounded-xl" />
                  ) : resumes.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      <p className="text-[12px] text-amber-200">
                        No resumes found. <Link to="/resumes" className="font-bold underline">Upload one first</Link>.
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="input-base w-full appearance-none pr-10 cursor-pointer text-[14px]"
                        required
                      >
                        <option value="">-- Choose Resume --</option>
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id}>{r.originalName}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    disabled={isLoading || !selectedId}
                    className={`btn-primary relative w-full h-[56px] text-[15px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Auditing Profile...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <GitCompare className="w-5 h-5" /> Run Profile Audit <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </div>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="card p-6 sm:p-8"
              >
                <h3 className="font-bold text-[14px] text-white flex items-center gap-2 mb-4">
                  <GitCompare className="h-4 w-4 text-[#8FB3FF]" />
                  Optimization Metrics
                </h3>
                <p className="text-[13px] text-slate-400 leading-relaxed mb-4">
                  Understand model benchmarks:
                </p>
                <div className="space-y-3 text-[13px] leading-relaxed text-slate-300">
                  <p className="flex gap-2 items-start"><span className="text-[#8FB3FF]">✓</span> <strong>Lite</strong> isolates readability and keyword density scores.</p>
                  <p className="flex gap-2 items-start"><span className="text-[#8FB3FF]">✓</span> <strong>Flash</strong> gauges alignment of projects, skills, and target job titles.</p>
                  <p className="flex gap-2 items-start"><span className="text-[#8FB3FF]">✓</span> <strong>Pro</strong> highlights formatting critique and gives advanced career suggestions.</p>
                </div>
              </motion.div>
            </div>
          }
          right={
            <div className="min-w-0 w-full">
              {!arenaRun && !isLoading ? (
                <EmptyState
                  icon={GitCompare}
                  title="Audit Results Will Appear Here"
                  subtitle="Audit optimization metrics for your resume, identifying how different Gemini models evaluate readability, length, and keyword density."
                  chips={[
                    { label: "ATS Score", color: "violet" },
                    { label: "Readability", color: "teal" },
                    { label: "Length", color: "amber" }
                  ]}
                />
              ) : (
                <ArenaWorkspace
                  isLoading={isLoading}
                  arenaRun={arenaRun}
                  onRegenerate={handleCompare}
                  renderResult={renderResult}
                />
              )}
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
};

export default VersionComparePage;

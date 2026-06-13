import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompare, ChevronDown, AlertCircle, Award, Target, FileText, CheckCircle, ArrowRight } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";
import EmptyState from "../components/ui/EmptyState";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

const ResumeComparisonPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedIdA, setSelectedIdA] = useState("");
  const [selectedIdB, setSelectedIdB] = useState("");
  const [loadingList, setLoadingList] = useState(true);

  const { activeRuns, executeRun } = useArena();
  const runState = activeRuns["resume_comparison"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;
  
  const { selectedModel, compareMode } = useModel();

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
      <div className="space-y-6">
        <div className="flex items-center gap-5 bg-gradient-to-r from-[#A78BFA]/10 to-[#8FB3FF]/10 border border-[#A78BFA]/20 p-6 rounded-2xl shadow-lg">
          <div className="w-14 h-14 rounded-full bg-[#A78BFA]/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Award className="w-7 h-7 text-[#A78BFA]" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Winner</h4>
            <p className="text-2xl font-black text-white">{output.winner}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-[#0A0B0F] p-5 space-y-3 transition-colors hover:border-[#00D4AA]/30">
            <div className="flex items-center gap-2 text-[#00D4AA]">
              <Target className="w-4 h-4" />
              <h5 className="font-bold text-[12px] uppercase tracking-widest">ATS Comparison</h5>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed">{output.atsComparison}</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#0A0B0F] p-5 space-y-3 transition-colors hover:border-[#8FB3FF]/30">
            <div className="flex items-center gap-2 text-[#8FB3FF]">
              <FileText className="w-4 h-4" />
              <h5 className="font-bold text-[12px] uppercase tracking-widest">Readability</h5>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed">{output.readabilityComparison}</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#0A0B0F] p-5 space-y-3 transition-colors hover:border-amber-400/30">
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle className="w-4 h-4" />
              <h5 className="font-bold text-[12px] uppercase tracking-widest">Keyword Coverage</h5>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed">{output.keywordComparison}</p>
          </div>
        </div>

        <div className="space-y-6 pt-2">
            <div className="card p-5 border-l-2 border-l-[#7C5CFC]">
                <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#7C5CFC] mb-2">Detailed Feedback</h5>
                <div className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {output.detailedFeedback}
                </div>
            </div>

            <div className="card p-5 border-l-2 border-l-emerald-400">
                <h5 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Final Recommendation</h5>
                <div className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {output.recommendation}
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
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#A78BFA]/10 to-transparent opacity-40" />
          
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/5 px-3 py-1">
              <GitCompare className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA]">A/B Testing</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Resume Comparison</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Select two different resumes to have an AI recruiter compare their strengths, weaknesses, and ATS optimization side-by-side.
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
                  <h2 className="text-[15px] font-bold text-white">Comparison Setup</h2>
                  <p className="text-[12px] text-slate-400 mt-1">Select the profiles you want to evaluate against each other.</p>
                </div>

                {loadingList ? (
                    <div className="flex flex-col gap-6">
                        <div className="skeleton h-[52px] w-full rounded-xl" />
                        <div className="skeleton h-[52px] w-full rounded-xl" />
                    </div>
                ) : resumes.length < 2 ? (
                  <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <p className="text-[12px] text-amber-200">
                      You need at least 2 resumes to compare. <Link to="/resumes" className="font-bold underline text-white">Upload more</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#8FB3FF]">
                        Resume A
                      </label>
                      <div className="relative">
                        <select
                          value={selectedIdA}
                          onChange={(e) => setSelectedIdA(e.target.value)}
                          className="input-base w-full appearance-none pr-10 cursor-pointer border-[#8FB3FF]/30 focus:border-[#8FB3FF] text-[14px]"
                          required
                        >
                          <option value="">-- Choose Resume A --</option>
                          {resumes.map((r) => (
                            <option key={r._id} value={r._id}>{r.originalName}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex justify-center -my-2 relative z-10">
                      <div className="bg-[#0E101A] border border-white/[0.08] rounded-full p-2 text-slate-500">
                        <span className="text-[10px] font-black uppercase tracking-widest">VS</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-accent-teal">
                        Resume B
                      </label>
                      <div className="relative">
                        <select
                          value={selectedIdB}
                          onChange={(e) => setSelectedIdB(e.target.value)}
                          className="input-base w-full appearance-none pr-10 cursor-pointer border-accent-teal/30 focus:border-accent-teal text-[14px]"
                          required
                        >
                          <option value="">-- Choose Resume B --</option>
                          {resumes.map((r) => (
                            <option key={r._id} value={r._id}>{r.originalName}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    disabled={isLoading || resumes.length < 2 || !selectedIdA || !selectedIdB || selectedIdA === selectedIdB}
                    className={`btn-primary relative w-full h-[56px] text-[15px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Comparing Resumes...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <GitCompare className="w-5 h-5" /> Run Comparison <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          }
          right={
            <div className="min-w-0 w-full">
              {!arenaRun && !isLoading ? (
                <EmptyState
                  icon={GitCompare}
                  title="Comparison Results Will Appear Here"
                  subtitle="Select two different resumes to have an AI recruiter compare their strengths, weaknesses, and ATS optimization side-by-side."
                  chips={[
                    { label: "ATS Score", color: "violet" },
                    { label: "Readability", color: "teal" },
                    { label: "Keyword Coverage", color: "amber" }
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

export default ResumeComparisonPage;

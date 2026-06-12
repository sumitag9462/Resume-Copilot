// src/pages/ResumeComparisonPage.jsx — RESUME COMPARISON PAGE
//
// Allows the user to select two different resumes and run a side-by-side
// comparison to see which one performs better across ATS, readability, and keywords.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompare, ChevronDown, AlertCircle, Award, Target, FileText, CheckCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { runArena } from "../api/arenaApi";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

const ResumeComparisonPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedIdA, setSelectedIdA] = useState("");
  const [selectedIdB, setSelectedIdB] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [arenaRun, setArenaRun] = useState(null);

  const { selectedModel } = useModel();

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
    e.preventDefault();
    if (!selectedIdA || !selectedIdB) {
      toast.error("Please select two resumes to compare");
      return;
    }
    if (selectedIdA === selectedIdB) {
      toast.error("Please select two DIFFERENT resumes to compare");
      return;
    }

    setArenaRun(null);
    setIsLoading(true);

    try {
      const data = await runArena({
        feature: "resume_comparison",
        inputs: {
          resumeIdA: selectedIdA,
          resumeIdB: selectedIdB
        },
        model: selectedModel,
        compareMode: false // Compare mode runs multiple models, we just want one model to compare two resumes
      });
      setArenaRun(data.arenaRun);
      toast.success("Resume comparison complete! ⚖️");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to compare resumes");
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = (output) => {
    if (!output) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 p-5 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">Overall Winner</h4>
            <p className="text-2xl font-bold text-white">{output.winner}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#00D4AA]">
              <Target className="w-5 h-5" />
              <h5 className="font-semibold text-sm">ATS Comparison</h5>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{output.atsComparison}</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/2 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#8FB3FF]">
              <FileText className="w-5 h-5" />
              <h5 className="font-semibold text-sm">Readability</h5>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{output.readabilityComparison}</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/2 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle className="w-5 h-5" />
              <h5 className="font-semibold text-sm">Keyword Coverage</h5>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{output.keywordComparison}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Detailed Feedback</h5>
                <div className="text-xs text-slate-200 leading-relaxed bg-white/2 p-5 rounded-2xl border border-white/5 whitespace-pre-wrap h-full">
                    {output.detailedFeedback}
                </div>
            </div>

            <div className="space-y-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Final Recommendation</h5>
                <div className="text-xs text-slate-200 leading-relaxed bg-white/2 p-5 rounded-2xl border border-white/5 whitespace-pre-wrap h-full">
                    {output.recommendation}
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.45)] lg:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-purple-400">A/B Testing</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Side-by-Side Resume Comparison</h1>
          <p className="mt-2 text-sm text-slate-400">
            Select two different resumes to have an AI recruiter compare their strengths, weaknesses, and ATS optimization side-by-side.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr] items-start mb-8">
          <form onSubmit={handleCompare} className="card p-6 space-y-6">
            {loadingList ? (
                <div className="flex gap-4 w-full">
                    <div className="skeleton h-11 w-full rounded-xl" />
                    <div className="skeleton h-11 w-full rounded-xl" />
                </div>
            ) : resumes.length < 2 ? (
              <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-slate-300">
                  You need at least 2 resumes to compare. <Link to="/resumes" className="font-semibold underline text-white">Upload more</Link>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">
                    Resume A
                  </label>
                  <div className="relative">
                    <select
                      value={selectedIdA}
                      onChange={(e) => setSelectedIdA(e.target.value)}
                      className="input-base appearance-none pr-10 cursor-pointer border-indigo-500/30 focus:border-indigo-500"
                      required
                    >
                      <option value="">-- Choose Resume A --</option>
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>{r.originalName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">
                    Resume B
                  </label>
                  <div className="relative">
                    <select
                      value={selectedIdB}
                      onChange={(e) => setSelectedIdB(e.target.value)}
                      className="input-base appearance-none pr-10 cursor-pointer border-teal-500/30 focus:border-teal-500"
                      required
                    >
                      <option value="">-- Choose Resume B --</option>
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>{r.originalName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || resumes.length < 2 || !selectedIdA || !selectedIdB || selectedIdA === selectedIdB}
              className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <><GitCompare className="w-5 h-5" /> Compare Resumes</>
              )}
            </button>
          </form>
        </div>

        <ArenaWorkspace
          isLoading={isLoading}
          arenaRun={arenaRun}
          onRegenerate={handleCompare}
          renderResult={renderResult}
        />
      </div>
    </DashboardLayout>
  );
};

export default ResumeComparisonPage;

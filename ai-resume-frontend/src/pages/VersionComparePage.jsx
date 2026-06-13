// src/pages/VersionComparePage.jsx — RESUME VERSION OPTIMIZATION COMPARE
//
// Runs parallel optimization evaluations on a single resume, comparing ATS score,
// readability, recruiter score, length efficiency, and keyword density across models.

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompare, ChevronDown, CheckCircle, Lightbulb, AlertCircle, Sparkles } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {[
            { label: "ATS Score", val: output.atsScore, color: "text-[#7C5CFC]" },
            { label: "Readability", val: output.readability, color: "text-[#00D4AA]" },
            { label: "Length Efficiency", val: output.length, color: "text-[#8FB3FF]" },
            { label: "Recruiter Score", val: output.recruiterScore, color: "text-[#A78BFA]" },
            { label: "Keyword Density", val: output.keywordDensity, color: "text-amber-400" }
          ].map((sc) => (
            <div key={sc.label} className="rounded-xl border border-white/5 bg-white/3 p-3 text-center">
              <span className="text-[10px] uppercase text-slate-400">{sc.label}</span>
              <p className={`text-xl font-bold mt-1.5 ${sc.color}`}>{sc.val}/100</p>
            </div>
          ))}
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Model Optimization Opinion</h5>
          <p className="text-xs text-slate-200 leading-relaxed bg-white/2 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
            {output.explanation}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#00D4AA]/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#00D4AA]/15">
              <CheckCircle className="h-4 w-4 text-[#00D4AA]" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Optimization Tip</p>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
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
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.45)] lg:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8FB3FF]">Model Optimization</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Version Optimization Compare</h1>
          <p className="mt-2 text-sm text-slate-400">
            Audit optimization metrics for your resume, identifying how different Gemini models evaluate readability, length, and keyword density.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start mb-8">
          <form onSubmit={handleCompare} className="card p-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Choose Target Resume
              </label>
              {loadingList ? (
                <div className="skeleton h-11 w-full rounded-xl" />
              ) : resumes.length === 0 ? (
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-slate-300">
                    No resumes found. <Link to="/resumes" className="font-semibold underline text-white">Upload one first</Link>.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="input-base appearance-none pr-10 cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Resume --</option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>{r.originalName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedId}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <><GitCompare className="w-4 h-4" /> Compare Model Projections</>
              )}
            </button>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-white/5 bg-white/2 p-6 text-sm text-slate-300 space-y-4"
          >
            <h3 className="font-semibold text-white flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-[#8FB3FF]" />
              Optimization Audits
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand model benchmarks:
            </p>
            <div className="space-y-2 text-xs leading-relaxed text-slate-300">
              <p>✓ <strong>Lite</strong> isolates readability and keyword density scores.</p>
              <p>✓ <strong>Flash</strong> gauges alignment of projects, skills, and target job titles.</p>
              <p>✓ <strong>Pro</strong> highlights formatting critique and gives advanced career suggestions.</p>
            </div>
          </motion.div>
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

export default VersionComparePage;

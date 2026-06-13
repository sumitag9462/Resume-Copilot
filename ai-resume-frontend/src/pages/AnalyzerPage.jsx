// src/pages/AnalyzerPage.jsx — RESUME COPILOT (ATS ANALYSIS)
//
// Performs full ATS audit and scores candidate profiles, visualizing
// suggestions, strengths, weaknesses, and key scores across models.

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanText, ChevronDown, Zap, CheckCircle, XCircle, AlertTriangle, Lightbulb, BookOpen, Tag, AlertCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
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

  const { activeRuns, executeRun } = useArena();
  const runState = activeRuns["ats_analysis"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  const { selectedModel, compareMode } = useModel();

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
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <span className="text-[10px] uppercase text-slate-400">ATS Score</span>
            <p className="text-3xl font-extrabold text-[#7C5CFC] mt-1">{output.atsScore || 0}/100</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <span className="text-[10px] uppercase text-slate-400">Overall Quality</span>
            <p className="text-3xl font-extrabold text-[#00D4AA] mt-1">{output.overallScore || 0}/100</p>
          </div>
        </div>

        {output.formattingAnalysis && (
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Formatting Analysis</h5>
            <p className="text-xs text-slate-200 leading-relaxed bg-white/2 p-4 rounded-xl border border-white/5">
              {output.formattingAnalysis}
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {output.strengths?.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-white/2 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle className="h-4 w-4" /> Profile Strengths
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {output.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400" />
                    {str}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {output.weaknesses?.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-white/2 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
                <XCircle className="h-4 w-4" /> Profile Weaknesses
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {output.weaknesses.map((wk, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-rose-400" />
                    {wk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {output.suggestions?.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA] flex items-center gap-1.5 mb-3">
              <Lightbulb className="h-4 w-4" /> AI Coaching Suggestions
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              {output.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-[#A78BFA]/10 text-[10px] font-bold text-[#A78BFA]">
                    {idx + 1}
                  </span>
                  {sug}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {output.missingKeywords?.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-white/2 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
                <Tag className="h-4 w-4" /> Missing Keywords
              </h5>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {output.missingKeywords.map((kw, i) => (
                  <span key={i} className="rounded bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs text-slate-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/5 bg-white/2 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-4 w-4" /> Grammar Checks
            </h5>
            {output.grammarIssues?.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-300 mt-2">
                {output.grammarIssues.map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400" />
                    {g}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 mt-2 italic">No spelling or grammar issues detected.</p>
            )}
          </div>
        </div>

        {output.sectionFeedback && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#8FB3FF] flex items-center gap-1.5 mb-3">
              <BookOpen className="h-4 w-4" /> Section Feedback
            </h5>
            <div className="space-y-3.5 mt-2">
              {Object.entries(output.sectionFeedback).map(([section, feedback]) => (
                <div key={section} className="rounded-lg bg-white/2 p-3 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-[#8FB3FF] tracking-wider">{section}</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{feedback}</p>
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
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.45)] lg:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#7C5CFC]">ATS Optimization</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">ATS Analyzer</h1>
          <p className="mt-2 text-sm text-slate-400">
            Audit formatting, score grammar structure, find missing keywords, and retrieve section-by-section analysis logs across multiple models.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start mb-8">
          <form onSubmit={handleAnalyze} className="card p-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Choose Target Resume
              </label>
              {loadingResumes ? (
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
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
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
              disabled={isLoading || !selectedResumeId}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <><ScanText className="w-4 h-4" /> Run ATS Audit</>
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
              <ScanText className="h-5 w-5 text-[#7C5CFC]" />
              ATS Benchmarking
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              How model outputs compare:
            </p>
            <div className="space-y-2 text-xs leading-relaxed text-slate-300">
              <p>✓ <strong>Lite</strong> isolates readability and keyword density scores.</p>
              <p>✓ <strong>Flash</strong> determines section-by-section details and suggestions.</p>
              <p>✓ <strong>Pro</strong> highlights formatting critique and gives advanced career suggestions.</p>
            </div>
          </motion.div>
        </div>

        <ArenaWorkspace
          isLoading={isLoading}
          arenaRun={arenaRun}
          onRegenerate={handleAnalyze}
          renderResult={renderResult}
        />
      </div>
    </DashboardLayout>
  );
};

export default AnalyzerPage;
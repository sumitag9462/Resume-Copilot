import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, ChevronDown, CheckCircle, XCircle, Target, Lightbulb, AlertCircle, ArrowRight, Percent } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";
import EmptyState from "../components/ui/EmptyState";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from '../context/ArenaContext';
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

const MIN_JD_LENGTH = 50;

const verdictConfig = {
  "Strong Match": { bg: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30", icon: "🎯" },
  "Good Match": { bg: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30", icon: "👍" },
  "Moderate Match": { bg: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30", icon: "⚠️" },
  "Weak Match": { bg: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30", icon: "❌" }
};

const ProgressBar = ({ value, colorClass, bgClass }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.04] mt-2">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full rounded-full ${colorClass} ${bgClass}`}
    />
  </div>
);

const JDMatchPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(preselectedId || "");
  const [jdText, setJdText] = useState("");
  const [loadingList, setLoadingList] = useState(true);

  const { activeRuns, executeRun } = useArena();
  const runState = activeRuns["jd_match"] || { isLoading: false, arenaRun: null };
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
    const cfg = verdictConfig[verdict] || { bg: "from-slate-500/20 to-slate-500/5 text-slate-400 border-slate-500/30", icon: "📊" };
    
    const matchScore = output.matchScore || 0;
    const skillScore = output.skillCoverage || 0;

    return (
      <div className="space-y-6">
        
        {/* Top Analytics Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={`col-span-1 rounded-2xl border bg-gradient-to-b p-5 ${cfg.bg} flex flex-col justify-center items-center text-center shadow-lg`}>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Verdict</span>
            <p className="mt-1 text-[18px] font-black">{cfg.icon} {verdict}</p>
          </div>
          
          <div className="col-span-1 card p-5 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Match Score</span>
              <span className="text-xl font-black text-white">{matchScore}%</span>
            </div>
            <ProgressBar value={matchScore} colorClass="bg-[#8FB3FF]" bgClass="shadow-[0_0_10px_rgba(143,179,255,0.5)]" />
          </div>

          <div className="col-span-1 card p-5 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Skill Coverage</span>
              <span className="text-xl font-black text-accent-teal">{skillScore}%</span>
            </div>
            <ProgressBar value={skillScore} colorClass="bg-accent-teal" bgClass="shadow-[0_0_10px_rgba(46,203,173,0.5)]" />
          </div>
        </div>

        {/* Executive Summary */}
        {output.summary && (
          <div className="card p-6 border-l-2 border-l-[#8FB3FF]">
            <h5 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#8FB3FF]">Match Summary</h5>
            <p className="text-[13px] leading-relaxed text-slate-300">
              {output.summary}
            </p>
          </div>
        )}

        {/* Skills Split */}
        <div className="grid gap-6 sm:grid-cols-2">
          {output.matchedSkills?.length > 0 && (
            <div className="card p-5 border-t-2 border-t-emerald-500/50">
              <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                <CheckCircle className="h-4 w-4" /> Matched Requirements
              </h5>
              <div className="flex flex-wrap gap-2">
                {output.matchedSkills.map((s, idx) => (
                  <span key={idx} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {output.missingSkills?.length > 0 && (
            <div className="card p-5 border-t-2 border-t-rose-500/50">
              <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-rose-400">
                <XCircle className="h-4 w-4" /> Missing Requirements
              </h5>
              <div className="flex flex-wrap gap-2">
                {output.missingSkills.map((s, idx) => (
                  <span key={idx} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actionable Recommendations */}
        {output.recommendations?.length > 0 && (
          <div className="card p-6 border border-accent-violet/10">
            <h5 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent-violet-light">
              <Lightbulb className="h-4 w-4" /> Optimization Plan
            </h5>
            <ul className="grid gap-3 sm:grid-cols-2">
              {output.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-[#0A0B0F] p-4 text-[13px] text-slate-300 transition-colors hover:border-accent-violet/20">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-violet/10 text-[10px] font-black text-accent-violet-light">
                    {idx + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const jdCharsLeft = Math.max(0, MIN_JD_LENGTH - jdText.trim().length);
  const isButtonEnabled = selectedId && jdText.trim().length >= MIN_JD_LENGTH;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl sm:flex-row sm:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#8FB3FF]/10 to-transparent opacity-40" />
          
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8FB3FF]/20 bg-[#8FB3FF]/5 px-3 py-1">
              <Target className="h-3.5 w-3.5 text-[#8FB3FF]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8FB3FF]">Applicant Tracking</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">JD Match Arena</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Cross-reference your resume with job requirements, mapping skills gap, keywords matches, and generating optimization plans.
            </p>
          </div>
        </div>
         {/* Full-width Layout */}
        <div className="flex flex-col gap-8">
          {/* Top Control Form */}
          <form onSubmit={handleMatch} className="card p-6 sm:p-8 relative overflow-hidden">
            {isLoading && (
              <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#8FB3FF] to-transparent animate-shimmer" />
              </div>
            )}

            <div className="border-b border-white/[0.06] pb-4 mb-6">
              <h2 className="text-[15px] font-bold text-white">Match Parameters</h2>
              <p className="text-[12px] text-slate-400 mt-1">Configure your scan settings.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Step 1: Resume */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  1. Base Resume
                </label>
                {loadingList ? (
                  <div className="skeleton h-[52px] w-full rounded-xl" />
                ) : resumes.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <p className="text-[12px] text-amber-200">
                      No resumes. <Link to="/resumes" className="font-bold underline">Upload one</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      className="input-base w-full appearance-none pr-10 text-[14px]"
                      required
                    >
                      <option value="">Choose Resume...</option>
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>{r.originalName}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                )}
              </div>

              {/* Submit Button (Moved here for better grid layout if desired, but let's keep it below JD Text) */}
              <div className="hidden md:block"></div>
            </div>

            {/* Step 2: JD Text */}
            <div className="mt-6">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                2. Job Description
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the target JD here..."
                rows={8}
                className="input-base w-full resize-none text-[14px] leading-relaxed min-h-[160px]"
                required
              />
              <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
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
            <div className="pt-6 mt-6 border-t border-white/[0.06]">
              <button
                type="submit"
                disabled={isLoading || !isButtonEnabled}
                className={`btn-primary relative w-full h-[56px] text-[15px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
                style={!isLoading ? { backgroundImage: 'linear-gradient(to right, #5B8FFF, #3B6FD9)' } : {}}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Scanning JD...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Run Match Analysis <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Results Area */}
          <div className="w-full">
            {!arenaRun && !isLoading ? (
              <EmptyState
                icon={Target}
                title="Match Results Will Appear Here"
                subtitle="Paste a job description and run the analysis to see your match score, keyword gaps, and optimization roadmap."
                chips={[
                  { label:'Match Score', color:'violet' },
                  { label:'Missing Keywords', color:'red' },
                  { label:'Optimization Tips', color:'teal' }
                ]}
              />
            ) : (
              <ArenaWorkspace
                isLoading={isLoading}
                arenaRun={arenaRun}
                onRegenerate={handleMatch}
                renderResult={renderResult}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JDMatchPage;
// src/pages/JDMatchPage.jsx — JOB DESCRIPTION MATCH ARENA
//
// Matches a candidate's resume with a target job description, comparing
// skill sets, match ratios, and improvements across models.

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Briefcase, ChevronDown, CheckCircle, XCircle, Target, Lightbulb, AlertCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { runArena } from "../api/arenaApi";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

const MIN_JD_LENGTH = 50;

const verdictConfig = {
  "Strong Match": { bg: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400", emoji: "🎯" },
  "Good Match": { bg: "bg-blue-400/10 border-blue-400/20 text-blue-400", emoji: "👍" },
  "Moderate Match": { bg: "bg-amber-400/10 border-amber-400/20 text-amber-400", emoji: "⚠️" },
  "Weak Match": { bg: "bg-red-400/10 border-red-400/20 text-red-400", emoji: "❌" }
};

const JDMatchPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(preselectedId || "");
  const [jdText, setJdText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [arenaRun, setArenaRun] = useState(null);

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

    setArenaRun(null);
    setIsLoading(true);

    try {
      const data = await runArena({
        feature: "jd_match",
        inputs: {
          resumeId: selectedId,
          jobDescription: jdText
        },
        model: selectedModel,
        compareMode
      });
      setArenaRun(data.arenaRun);
      toast.success("Match analysis complete! 🎯");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to analyze match");
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = (output) => {
    if (!output) return null;
    const verdict = output.verdict || "Moderate Match";
    const cfg = verdictConfig[verdict] || { bg: "bg-slate-400/10 border-white/10 text-slate-400", emoji: "📊" };

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={`rounded-xl border p-4 text-center ${cfg.bg}`}>
            <span className="text-[10px] uppercase text-slate-400">Verdict</span>
            <p className="text-lg font-extrabold mt-1">{cfg.emoji} {verdict}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <span className="text-[10px] uppercase text-slate-400">Match score</span>
            <p className="text-xl font-bold text-white mt-1">{output.matchScore || 0}%</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <span className="text-[10px] uppercase text-slate-400">Skill Coverage</span>
            <p className="text-xl font-bold text-[#00D4AA] mt-1">{output.skillCoverage || 0}%</p>
          </div>
        </div>

        {output.summary && (
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Match Summary</h5>
            <p className="text-xs text-slate-200 leading-relaxed bg-white/2 p-4 rounded-xl border border-white/5">
              {output.summary}
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {output.matchedSkills?.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-white/2 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                <CheckCircle className="h-4 w-4" /> Matched Skills
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {output.matchedSkills.map((s, idx) => (
                  <span key={idx} className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs text-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {output.missingSkills?.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-white/2 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-3">
                <XCircle className="h-4 w-4" /> Missing Skills
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {output.missingSkills.map((s, idx) => (
                  <span key={idx} className="rounded bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs text-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {output.recommendations?.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA] flex items-center gap-1.5 mb-3">
              <Lightbulb className="h-4 w-4" /> Optimization Recommendations
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              {output.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-[#A78BFA]/10 text-[10px] font-bold text-[#A78BFA]">
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
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.45)] lg:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8FB3FF]">Job Fit</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">JD Match Arena</h1>
          <p className="mt-2 text-sm text-slate-400">
            Cross-reference your resume with job requirements, mapping skills gap, keywords matches, and recommendations across multiple models.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start mb-8">
          <form onSubmit={handleMatch} className="card p-6 space-y-5">
            {/* Step 1: Resume selector */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                1. Choose Target Resume
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

            {/* Step 2: JD Text */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                2. Paste Job Description
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste responsibilities, tools, frameworks, and job specs..."
                rows={7}
                className="input-base resize-none leading-relaxed text-xs"
                required
              />
              <div className="flex items-center justify-between mt-1.5 text-[10px]">
                <p className="text-slate-400">{jdText.length} characters</p>
                {jdText.length > 0 && jdText.length < MIN_JD_LENGTH && (
                  <p className="text-amber-500 font-medium">
                    {jdCharsLeft} more chars required
                  </p>
                )}
                {jdText.length >= MIN_JD_LENGTH && (
                  <p className="text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Ready
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isButtonEnabled}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <><Target className="w-4 h-4" /> Run Match Analysis</>
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
              <Briefcase className="h-5 w-5 text-[#8FB3FF]" />
              Match Analytics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parallel evaluation checklist:
            </p>
            <div className="space-y-2 text-xs leading-relaxed text-slate-300">
              <p>✓ <strong>Lite</strong> cross-references syntax terms and tool names.</p>
              <p>✓ <strong>Flash</strong> determines match score weighting and calculates direct skill overlays.</p>
              <p>✓ <strong>Pro</strong> simulates deep recruitment queries, highlighting core narrative gaps and recommending contextual resume edits.</p>
            </div>
          </motion.div>
        </div>

        <ArenaWorkspace
          isLoading={isLoading}
          arenaRun={arenaRun}
          onRegenerate={handleMatch}
          renderResult={renderResult}
        />
      </div>
    </DashboardLayout>
  );
};

export default JDMatchPage;
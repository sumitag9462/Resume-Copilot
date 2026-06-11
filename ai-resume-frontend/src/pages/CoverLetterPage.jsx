// src/pages/CoverLetterPage.jsx — AI COVER LETTER GENERATOR
//
// Generates personalized, professional cover letters using multiple models
// in parallel and displays their outputs side-by-side.

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FileText, ChevronDown, Sparkles, Building2, Tag, AlertCircle, CheckCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { runArena } from "../api/arenaApi";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

const MIN_JD_LENGTH = 30;

const STYLES = [
  {
    key: "professional",
    label: "Professional",
    desc: "Formal and polished — ideal for MNCs and large corporations",
    emoji: "👔",
    color: "border-[#7C5CFC] bg-[#7C5CFC]/10 text-white",
    inactive: "border-white/10 hover:border-white/20 text-slate-400"
  },
  {
    key: "formal",
    label: "Formal",
    desc: "Traditional and structured — highly conservative language",
    emoji: "🏛️",
    color: "border-[#5B8FFF] bg-[#5B8FFF]/10 text-white",
    inactive: "border-white/10 hover:border-white/20 text-slate-400"
  },
  {
    key: "startup",
    label: "Startup",
    desc: "Conversational and energetic — shows innovation mindset",
    emoji: "🚀",
    color: "border-[#00D4AA] bg-[#00D4AA]/10 text-white",
    inactive: "border-white/10 hover:border-white/20 text-slate-400"
  },
  {
    key: "creative",
    label: "Creative",
    desc: "Personalized and engaging — shows unique personality",
    emoji: "🎨",
    color: "border-[#A78BFA] bg-[#A78BFA]/10 text-white",
    inactive: "border-white/10 hover:border-white/20 text-slate-400"
  }
];

const CoverLetterPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(preselectedId || "");
  const [company, setCompany] = useState("");
  const [jdText, setJdText] = useState("");
  const [style, setStyle] = useState("professional");

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

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      toast.error("Please select a resume");
      return;
    }
    if (!company.trim()) {
      toast.error("Please enter the company name");
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
        feature: "cover_letter",
        inputs: {
          resumeId: selectedId,
          companyName: company,
          jobDescription: jdText,
          style
        },
        model: selectedModel,
        compareMode
      });
      setArenaRun(data.arenaRun);
      toast.success("Cover letters generated! ✉️");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate cover letters");
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = (output) => {
    if (!output) return null;
    const letterText = output.coverLetter || output.coverLetterContent || "";
    const highlights = output.keyHighlights || [];
    const paragraphs = letterText.split(/\n\n|\r\n\r\n/).filter(Boolean);

    return (
      <div className="space-y-5">
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-3 py-1 text-xs text-[#A78BFA]">
                <Tag className="h-3 w-3" /> {h}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-200 bg-white/2 p-5 rounded-xl border border-white/5 whitespace-pre-wrap max-h-[500px] overflow-y-auto font-body">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="leading-7">{para}</p>
          ))}
        </div>
      </div>
    );
  };

  const jdCharsLeft = Math.max(0, MIN_JD_LENGTH - jdText.trim().length);
  const isButtonEnabled = selectedId && company.trim() && jdText.trim().length >= MIN_JD_LENGTH;

  const getHintText = () => {
    if (!selectedId) return { msg: "Select a resume to continue", color: "text-slate-400" };
    if (!company.trim()) return { msg: "Enter the company name to continue", color: "text-slate-400" };
    if (jdText.trim().length === 0) return { msg: "Paste a job description to continue", color: "text-slate-400" };
    if (jdText.trim().length < MIN_JD_LENGTH) return { msg: `Paste ${jdCharsLeft} more characters in the JD field`, color: "text-amber-500" };
    return null;
  };
  const hint = getHintText();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.45)] lg:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#00D4AA]">Cover Letters</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Cover Letter Arena</h1>
          <p className="mt-2 text-sm text-slate-400">
            Generate highly customizable, recruiter-ready cover letters from multiple models simultaneously and choose the winner.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start mb-8">
          <form onSubmit={handleGenerate} className="card p-6 space-y-5">
            {/* Step 1: Resume selector */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                1. Select Base Resume
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

            {/* Step 2: Company */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                2. Target Company Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Swiggy, Uber, Microsoft..."
                  className="input-base pl-10"
                  required
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Step 3: JD */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                3. Job Description
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the target job description here..."
                rows={5}
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

            {/* Step 4: Writing style */}
            <div>
              <label className="mb-3 block text-xs font-semibold text-slate-300">
                4. Tone / Writing Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setStyle(s.key)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      style === s.key ? s.color : s.inactive + " bg-[#0F1322]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{s.emoji}</span>
                      <span className="font-semibold text-xs">{s.label}</span>
                    </div>
                    <p className={`text-[10px] leading-tight ${style === s.key ? "text-slate-200" : "text-slate-400"}`}>
                      {s.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !isButtonEnabled}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Cover Letters</>
                )}
              </button>
              {!isLoading && !isButtonEnabled && hint && (
                <p className={`text-[10px] text-center mt-2 ${hint.color}`}>
                  ⬆ {hint.msg}
                </p>
              )}
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-white/5 bg-white/2 p-6 text-sm text-slate-300 space-y-4"
          >
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#00D4AA]" />
              Cover Letter Insights
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              How model outputs compare:
            </p>
            <div className="space-y-2 text-xs leading-relaxed text-slate-300">
              <p>✓ <strong>Lite</strong> focuses on fast standard structures, offering rapid, cover-all-bases letters.</p>
              <p>✓ <strong>Flash</strong> adds customization targeting specific company markers and tech frameworks.</p>
              <p>✓ <strong>Pro</strong> drafts customized copy, blending career narratives with strict factual accuracy matching your resume.</p>
            </div>
          </motion.div>
        </div>

        <ArenaWorkspace
          isLoading={isLoading}
          arenaRun={arenaRun}
          onRegenerate={handleGenerate}
          renderResult={renderResult}
        />
      </div>
    </DashboardLayout>
  );
};

export default CoverLetterPage;
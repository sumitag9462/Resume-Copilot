import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ChevronDown, Sparkles, Building2, Tag, AlertCircle, CheckCircle, PenTool, ArrowRight, Lightbulb } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";
import EmptyState from "../components/ui/EmptyState";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";

const MIN_JD_LENGTH = 30;

const STYLES = [
  {
    key: "professional",
    label: "Professional",
    desc: "Formal and polished — ideal for MNCs",
    emoji: "👔",
    color: "border-[#7C5CFC] bg-[#7C5CFC]/10 text-white",
    inactive: "border-white/10 hover:border-white/20 text-slate-400"
  },
  {
    key: "startup",
    label: "Startup",
    desc: "Energetic and innovative — highly engaging",
    emoji: "🚀",
    color: "border-[#00D4AA] bg-[#00D4AA]/10 text-white",
    inactive: "border-white/10 hover:border-white/20 text-slate-400"
  },
  {
    key: "creative",
    label: "Creative",
    desc: "Personalized — shows unique personality",
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

  const [loadingList, setLoadingList] = useState(true);
  
  const { activeRuns, executeRun } = useArena();
  const runState = activeRuns["cover_letter"] || { isLoading: false, arenaRun: null };
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
    await executeRun("cover_letter", {
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
  };

  const renderResult = (output) => {
    if (!output) return null;
    const letterText = output.coverLetter || output.coverLetterContent || "";
    const highlights = output.keyHighlights || [];
    const paragraphs = letterText.split(/\n\n|\r\n\r\n/).filter(Boolean);

    return (
      <div className="space-y-6">
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-accent-teal/20 bg-accent-teal/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-teal">
                <Tag className="h-3 w-3" /> {h}
              </span>
            ))}
          </div>
        )}

        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E101A] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_20px_60px_rgba(124,111,247,0.15)] max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 space-y-5 text-[14px] leading-relaxed text-slate-300 font-body">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-8">{para}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const jdCharsLeft = Math.max(0, MIN_JD_LENGTH - jdText.trim().length);
  const isButtonEnabled = selectedId && company.trim() && jdText.trim().length >= MIN_JD_LENGTH;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl lg:flex-row lg:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-accent-teal/10 to-transparent opacity-40" />
          
          <div className="relative z-10 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-teal/20 bg-accent-teal/5 px-3 py-1">
              <PenTool className="h-3.5 w-3.5 text-accent-teal" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal">Document Generator</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Cover Letter AI</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Generate highly personalized, recruiter-ready cover letters customized exactly to your target job description.
            </p>
          </div>

            <div className="relative z-10 hidden lg:block w-[450px] shrink-0">
              <div className="relative overflow-hidden rounded-2xl border border-accent-teal/20 bg-[#0A0B0F]/80 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,212,170,0.1)] transition-transform hover:-translate-y-1">
                {/* Decorative background glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-teal/20 blur-3xl pointer-events-none"></div>
                
                <div className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-teal/20 to-[#7C5CFC]/20 border border-white/10 shadow-inner">
                    <PenTool className="h-5 w-5 text-accent-teal drop-shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
                  </div>
                  
                  <div>
                    <h3 className="text-[13px] font-bold text-white tracking-wide">Dynamic Letter Generator</h3>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                      Provide your resume, company name, and job description to generate a highly personalized cover letter.
                    </p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/5 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-violet shadow-[0_0_4px_#7C5CFC]"></span> Professional
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/5 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-teal shadow-[0_0_4px_#00D4AA]"></span> Startup
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/5 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#FBBF24]"></span> Creative
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Full-width Layout */}
        <div className="flex flex-col gap-8">
          {/* Top Control Form */}
          <form onSubmit={handleGenerate} className="card p-6 sm:p-8 space-y-8">
            <div className="border-b border-white/[0.06] pb-4">
              <h2 className="text-[15px] font-bold text-white">Campaign Details</h2>
              <p className="text-[12px] text-slate-400 mt-1">Configure your generation parameters.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Step 1: Resume */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
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

              {/* Step 2: Company */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  2. Target Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Swiggy, Uber..."
                    className="input-base w-full pl-10 text-[14px]"
                    required
                  />
                  <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Step 3: JD */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                3. Job Description
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the JD here..."
                rows={8}
                className="input-base w-full resize-none text-[14px] leading-relaxed"
                required
              />
              <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                <p className="text-slate-500">{jdText.length} chars</p>
                {jdText.length > 0 && jdText.length < MIN_JD_LENGTH && (
                  <p className="text-amber-500">{jdCharsLeft} more needed</p>
                )}
                {jdText.length >= MIN_JD_LENGTH && (
                  <p className="flex items-center gap-1 text-emerald-400"><CheckCircle className="h-3.5 w-3.5" /> Ready</p>
                )}
              </div>
            </div>

            {/* Step 4: Style */}
            <div>
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                4. Tone Profile
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                {STYLES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setStyle(s.key)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 ${
                      style === s.key ? s.color + " shadow-lg" : s.inactive + " bg-[#0A0B0F]"
                    }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <p className="text-[13px] font-bold">{s.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-white/[0.06]">
              <button
                type="submit"
                disabled={isLoading || !isButtonEnabled}
                className={`btn-primary relative w-full h-[56px] text-[15px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Generate Cover Letter <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Results Area */}
          <div className="w-full">
              {(arenaRun || isLoading) && (
                <ArenaWorkspace
                  isLoading={isLoading}
                  arenaRun={arenaRun}
                  onRegenerate={handleGenerate}
                  renderResult={renderCoverLetterResult}
                  downloadHandler={handleDownloadPDF}
                />
              )}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoverLetterPage;
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, Sparkles, Building2, Tag, AlertCircle, CheckCircle, PenTool, ArrowRight, Lightbulb, Copy } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";

const MIN_JD_LENGTH = 30;

const STYLES = [
  {
    key: "professional",
    label: "Professional",
    desc: "Formal and polished — ideal for MNCs",
    emoji: "👔",
    color: "border-[#7C5CFC]/50 bg-[#7C5CFC]/10 text-white shadow-[0_0_15px_rgba(124,111,247,0.2)]",
    inactive: "border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-slate-400"
  },
  {
    key: "startup",
    label: "Startup",
    desc: "Energetic and innovative — highly engaging",
    emoji: "🚀",
    color: "border-[#00D4AA]/50 bg-[#00D4AA]/10 text-white shadow-[0_0_15px_rgba(0,212,170,0.2)]",
    inactive: "border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-slate-400"
  },
  {
    key: "creative",
    label: "Creative",
    desc: "Personalized — shows unique personality",
    emoji: "🎨",
    color: "border-[#A78BFA]/50 bg-[#A78BFA]/10 text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]",
    inactive: "border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-slate-400"
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
  
  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["cover_letter"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  const { selectedModel, compareMode } = useModel();

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("cover_letter");
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Cover letter copied to clipboard!");
  };

  const renderResult = (output) => {
    if (!output) return null;
    const letterText = output.coverLetter || output.coverLetterContent || "";
    const highlights = output.keyHighlights || [];
    const paragraphs = letterText.split(/\n\n|\r\n\r\n/).filter(Boolean);

    return (
      <div className="space-y-6 flex flex-col h-full">
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-accent-teal/20 bg-accent-teal/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-teal shadow-sm">
                <Tag className="h-3 w-3" /> {h}
              </span>
            ))}
          </div>
        )}

        <GlassCard className="flex-1 relative overflow-hidden group p-8 sm:p-10 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6 relative z-10 border-b border-white/5 pb-4">
             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Final Document
             </h3>
             <button
               onClick={() => copyToClipboard(letterText)}
               className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
             >
               <Copy className="w-3.5 h-3.5" /> Copy Text
             </button>
          </div>

          <div className="relative z-10 space-y-5 text-[15px] leading-relaxed text-slate-300 font-body overflow-y-auto custom-scrollbar pr-2 h-[500px]">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-8 text-slate-200">{para}</p>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  };

  const handleDownloadPDF = (output, model) => {
    const text = output.coverLetter || output.coverLetterContent || "No content available.";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CoverLetter_${company}_${model}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded cover letter successfully!");
  };

  const jdCharsLeft = Math.max(0, MIN_JD_LENGTH - jdText.trim().length);
  const isButtonEnabled = selectedId && company.trim() && jdText.trim().length >= MIN_JD_LENGTH;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* Premium Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-accent-teal/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-teal/20 bg-accent-teal/10 px-3 py-1.5 shadow-inner">
                <PenTool className="h-4 w-4 text-accent-teal" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-teal">Document Generator</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                Cover Letter AI
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Generate highly personalized, recruiter-ready cover letters customized exactly to your target job description and company.
              </p>
            </div>

            <div className="hidden lg:flex gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <FileText className="w-5 h-5 text-accent-teal mb-2" />
                <p className="text-xs font-bold text-white">ATS Compliant</p>
                <p className="text-[10px] text-slate-400 mt-1">Smart Parsing</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8 items-start">
          
          {/* Controls Form */}
          <div className="sticky top-24">
            <form onSubmit={handleGenerate}>
              <GlassCard animated delay={0.1} className="p-8 relative overflow-hidden h-full flex flex-col">
                {isLoading && (
                  <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                    <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent-teal to-transparent animate-shimmer" />
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-white">Campaign Details</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure your generation parameters.</p>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Step 1: Resume */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      1. Base Resume
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
                          className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-accent-teal/50 focus:ring-1 focus:ring-accent-teal/50 cursor-pointer shadow-inner"
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

                  {/* Step 2: Company */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      2. Target Company
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Swiggy, Uber..."
                        className="w-full h-[56px] rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-[14px] text-white outline-none transition-all focus:border-accent-teal/50 focus:ring-1 focus:ring-accent-teal/50 shadow-inner"
                        required
                      />
                      <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>

                  {/* Step 3: JD */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      3. Job Description
                    </label>
                    <textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste the full JD here..."
                      rows={6}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-[14px] text-slate-200 outline-none transition-all focus:border-accent-teal/50 focus:ring-1 focus:ring-accent-teal/50 resize-none shadow-inner"
                      required
                    />
                    <div className="mt-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
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
                    <div className="grid gap-3 sm:grid-cols-3">
                      {STYLES.map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setStyle(s.key)}
                          className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 ${
                            style === s.key ? s.color : s.inactive
                          }`}
                        >
                          <span className="text-2xl drop-shadow-sm">{s.emoji}</span>
                          <span className="text-xs font-bold">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <GradientButton
                  type="submit"
                  disabled={isLoading || !isButtonEnabled}
                  className="w-full h-[60px] text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Drafting Document...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <PenTool className="h-5 w-5" /> Generate Cover Letter
                    </span>
                  )}
                </GradientButton>
              </GlassCard>
            </form>
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-teal/10 mb-6 border border-accent-teal/20 shadow-[0_0_30px_rgba(0,212,170,0.15)]">
                    <FileText className="h-8 w-8 text-accent-teal" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Parameters</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Configure your parameters on the left and execute the engine to generate a fully formatted cover letter.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col"
                >
                  <ArenaWorkspace
                    isLoading={isLoading}
                    arenaRun={arenaRun}
                    onRegenerate={handleGenerate}
                    renderResult={renderResult}
                    downloadHandler={handleDownloadPDF}
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

export default CoverLetterPage;
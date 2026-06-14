import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Upload,
  X,
  Trash2,
  Lightbulb,
  ShieldCheck,
  ChevronDown,
  Zap
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";
import { getAllResumes, uploadResume } from "../api/resumeApi";
import { getArenaHistory, deleteArenaHistory } from "../api/arenaApi";
import { useModel } from "../context/ModelContext";
import { useArena } from "../context/ArenaContext";
import ResumePDFGenerator from "../components/ui/ResumePDFGenerator";
import EmptyState from "../components/ui/EmptyState";

const ResumeBoostPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  // DB & Inputs
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || "");
  const [role, setRole] = useState("Software Engineer");
  const [jobDescription, setJobDescription] = useState("");

  // Sub-feature tab
  const [activeTab, setActiveTab] = useState("boost"); // "boost" or "rebuilder"

  // Single bullet inputs
  const [bulletText, setBulletText] = useState(
    "Responsible for writing code and testing frontend features using React."
  );



  // Active Session State
  const { activeRuns, executeRun, clearRun } = useArena();
  const activeFeatureId = activeTab === "boost" ? "resume_boost" : "resume_rebuilder";
  const runState = activeRuns[activeFeatureId] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  // Side-history & UI States
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { selectedModel, compareMode } = useModel();

  // PDF Generator Ref and State
  const pdfRef = useRef();
  const [pdfContent, setPdfContent] = useState("");

  // Initialize
  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const fetchResumes = async () => {
    try {
      const res = await getAllResumes();
      if (res.success) {
        setResumes(res.resumes || []);
        if (res.resumes?.length > 0 && !preselectedId) {
          setSelectedResumeId(res.resumes[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to load resumes:", err);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      // Fetch either resume_boost or resume_rebuilder history
      const res = await getArenaHistory(activeTab === "boost" ? "resume_boost" : "resume_rebuilder");
      if (res.success) {
        setHistoryList(res.history || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Toggle active sub-feature
  const handleToggleSubFeature = (tab) => {
    setActiveTab(tab);
    clearRun(activeFeatureId); // Clear current run properly
    setHistoryList([]);
  };



  // Submit Boost or Rebuilder
  const handleRun = async (e) => {
    if (e) e.preventDefault();
    if (activeTab === "rebuilder" && !selectedResumeId) {
      return toast.error("Please upload or select a resume first.");
    }
    if (activeTab === "boost" && (!bulletText || bulletText.trim().length < 5)) {
      return toast.error("Please enter a valid bullet point.");
    }

    const feature = activeTab === "boost" ? "resume_boost" : "resume_rebuilder";
    const inputs = activeTab === "boost" 
      ? { bulletText, targetRole: role }
      : { resumeId: selectedResumeId, targetRole: role, jobDescription };

    await executeRun(feature, {
      feature,
      inputs,
      model: selectedModel,
      compareMode
    });
  };

  const handleDownloadPDF = (output, model) => {
    if (activeTab === "rebuilder" && output.improvedResume) {
      setPdfContent(output.improvedResume);
      // Give React a tiny moment to render the markdown text into the hidden DOM element
      setTimeout(() => {
        if (pdfRef.current) {
          pdfRef.current.generatePDF(`Rebuilt_Resume_${model}.pdf`);
        }
      }, 150);
    } else {
      // standard text download fallback for Boost mode (since it's just a single bullet)
      const text = typeof output === "string" ? output : JSON.stringify(output, null, 2);
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ResumeBoost_${model}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Downloaded file successfully!");
    }
  };

  // Delete History Record
  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this log record?")) return;
    try {
      const res = await deleteArenaHistory(id);
      if (res.success) {
        toast.success("Record deleted.");
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
        if (arenaRun?._id === id) {
          clearRun(activeFeatureId);
        }
      }
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  // Load a session from history
  const handleLoadHistoryItem = (item) => {
    // Requires backend changes to fully load into context, so we just set the inputs
    if (activeTab === "boost") {
      setBulletText(item.input.bulletText || "");
      setRole(item.input.targetRole || "");
    } else {
      setSelectedResumeId(item.input.resumeId || "");
      setRole(item.input.targetRole || "");
      setJobDescription(item.input.jobDescription || "");
    }
    toast.success(`Loaded inputs from past session. Click Generate to re-run.`);
  };

  // Render Resume Boost Output (single bullet)
  const renderBoostResult = (output) => {
    if (!output) return null;
    return (
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Original Bullet</span>
          <p className="text-[13px] text-slate-400 bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] line-through">{output.original}</p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-teal block mb-2">Enhanced Bullet</span>
          <p className="text-[14px] md:text-[15px] font-bold text-white bg-accent-teal/10 p-5 rounded-xl border border-accent-teal/30 leading-relaxed shadow-[0_0_15px_rgba(46,203,173,0.15)]">
            {output.enhanced}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#8FB3FF] mb-3">Action Verbs Used</h5>
            <div className="flex flex-wrap gap-2">
              {(output.actionVerbsUsed || []).map((v, i) => (
                <span key={i} className="rounded-lg bg-[#8FB3FF]/10 border border-[#8FB3FF]/20 px-2.5 py-1 text-[11px] font-bold text-[#8FB3FF]">{v}</span>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-accent-violet-light mb-3">ATS Keywords Added</h5>
            <div className="flex flex-wrap gap-2">
              {(output.atsKeywordsAdded || []).map((kw, i) => (
                <span key={i} className="rounded-lg bg-accent-violet/10 border border-accent-violet/20 px-2.5 py-1 text-[11px] font-bold text-accent-violet-light">{kw}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between rounded-xl bg-white/[0.04] p-4 text-[12px] text-slate-400 gap-2 border border-white/[0.06]">
          <span>Readability Score: <strong className="text-white ml-1">{output.readabilityScore || 0}/100</strong></span>
          <span>Grammar: <strong className="text-white ml-1">{output.grammarScore || 0}%</strong></span>
          <span className="rounded bg-white/[0.08] px-2.5 py-1 uppercase tracking-widest font-bold text-[10px] text-white">
            {output.tone} Tone
          </span>
        </div>
      </div>
    );
  };

  // Render Resume Rebuilder Output (complete resume rewrite)
  const renderRebuilderResult = (output) => {
    if (!output) return null;
    const rebuiltText = output.improvedResume || "";
    const changes = output.changes || [];
    const suggestions = output.suggestions || [];

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Rebuilt Resume Content (Markdown)</h4>
          <pre className="text-[13px] text-slate-300 leading-relaxed bg-[#0A0B0F] p-5 rounded-2xl border border-white/[0.08] whitespace-pre-wrap font-mono max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner">
            {rebuiltText}
          </pre>
        </div>

        {changes.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-accent-teal mb-4">Rebuild Changes Log</h4>
            <div className="space-y-3">
              {changes.map((ch, idx) => {
                const color = ch.type === "added" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" :
                  ch.type === "removed" ? "border-rose-500/30 bg-rose-500/5 text-rose-400" :
                    "border-amber-500/30 bg-amber-500/5 text-amber-400";
                return (
                  <div key={idx} className={`rounded-xl border p-4 ${color}`}>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span>Section: {ch.section}</span>
                      <span>{ch.type}</span>
                    </div>
                    {ch.original && (
                      <p className="text-[12px] line-through opacity-70 mb-2">"{ch.original}"</p>
                    )}
                    <p className="text-[13px] font-bold">"{ch.improved}"</p>
                    {ch.description && (
                      <p className="text-[11px] mt-2 italic opacity-80">{ch.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {output.recruiterFeedback && (
          <div className="card p-5 border-l-2 border-l-[#8FB3FF]">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#8FB3FF] flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4" /> Recruiter Perspective
            </h5>
            <p className="text-[13px] text-slate-300 leading-relaxed">{output.recruiterFeedback}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="card p-5 border border-amber-500/20 bg-amber-500/5">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4" /> Future Tweaks
            </h5>
            <ul className="space-y-2 text-[13px] text-amber-200/80">
              {suggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {sug}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl lg:flex-row lg:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-accent-teal/10 to-transparent opacity-40" />
          
          <div className="relative z-10 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-teal/20 bg-accent-teal/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-accent-teal" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">Content Optimization</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Resume Boost & Rebuilder</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Enhance single bullet points or trigger complete professional resume rewrites across multiple AI models.
            </p>
          </div>

          {!arenaRun && !isLoading && (
            <div className="relative z-10 hidden lg:block border-l border-white/[0.06] pl-8">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-violet/10 border border-accent-violet/20">
                  <Zap className="h-6 w-6 text-accent-violet" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Ready to Boost Your Resume</h3>
                  <p className="mt-1 text-[12px] text-slate-400 max-w-[250px] leading-relaxed">
                    Select a resume and we'll rewrite your bullet points with stronger action verbs and quantified impact.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md border border-accent-violet/20 bg-accent-violet/10 px-2 py-1 text-[10px] font-medium text-accent-violet">Stronger Bullets</span>
                    <span className="inline-flex items-center rounded-md border border-accent-teal/20 bg-accent-teal/10 px-2 py-1 text-[10px] font-medium text-accent-teal">Action Verbs</span>
                    <span className="inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-500">Impact Metrics</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full-width Layout */}
        <div className="flex flex-col gap-8">
          {/* Top Control Form */}
          <div className="card p-0 overflow-hidden">
            <div className="flex border-b border-white/[0.06] bg-[#0A0B0F]">
              <button
                onClick={() => handleToggleSubFeature("boost")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-[13px] font-bold border-b-2 transition-colors ${activeTab === "boost" ? "border-accent-teal text-white bg-white/[0.02]" : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]"
                  }`}
              >
                <Sparkles className="h-4 w-4" /> Boost Bullet Point
              </button>
              <button
                onClick={() => handleToggleSubFeature("rebuilder")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-[13px] font-bold border-b-2 transition-colors ${activeTab === "rebuilder" ? "border-accent-violet-light text-white bg-white/[0.02]" : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]"
                  }`}
              >
                <Wand2 className="h-4 w-4" /> Full Rebuild
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleRun} className="space-y-6">
                {activeTab === "boost" ? (
                  <>
                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">1. Original Bullet Point</label>
                      <textarea
                        rows={4}
                        value={bulletText}
                        onChange={(e) => setBulletText(e.target.value)}
                        placeholder="Paste single bullet point here (e.g. was coding React features)..."
                        className="input-base text-[13px] resize-none leading-relaxed"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span>2. Target Role</span>
                        <span className="text-[9px] border border-white/[0.08] px-1.5 py-0.5 rounded text-slate-600">OPTIONAL</span>
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="input-base text-[14px]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">1. Target Job Role</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. SDE II, DevOps Architect..."
                          className="input-base text-[14px]"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF]">2. Base Resume</label>
                        <div className="relative">
                          <select
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            className="input-base w-full appearance-none pr-10 text-[14px] cursor-pointer"
                            required
                          >
                            <option value="">-- Choose Resume --</option>
                            {resumes.map(r => (
                              <option key={r._id} value={r._id}>{r.originalName}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span>3. Target Job Description</span>
                        <span className="text-[9px] border border-white/[0.08] px-1.5 py-0.5 rounded text-[#8FB3FF]">RECOMMENDED</span>
                      </label>
                      <textarea
                        rows={6}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target JD here to rewrite the resume professionally..."
                        className="input-base text-[13px] resize-none leading-relaxed"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn-primary relative w-full h-[52px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
                    style={!isLoading && activeTab === "boost" ? { backgroundImage: 'linear-gradient(to right, #00D4AA, #00A68A)' } : {}}
                  >
                    {isLoading ? (
                       <span className="flex items-center gap-2">
                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                         Running enhancements...
                       </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        {activeTab === "boost" ? "Boost Bullet Point" : "Rebuild Entire Resume"}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className="w-full">
            <div className="min-w-0 space-y-6 w-full">
              {(arenaRun || isLoading) && (
                <ArenaWorkspace
                  isLoading={isLoading}
                  arenaRun={arenaRun}
                  onRegenerate={handleRun}
                  renderResult={activeTab === "boost" ? renderBoostResult : renderRebuilderResult}
                  downloadHandler={handleDownloadPDF}
                />
              )}

              {/* History Logs */}
              <div className="card p-6">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Recent Sessions</h3>
                {loadingHistory ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="skeleton h-[52px] w-full rounded-xl" />)}
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/[0.08] p-5 text-center">
                    <p className="text-[12px] text-slate-500">No past sessions found.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {historyList.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleLoadHistoryItem(item)}
                        className={`group flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                          arenaRun?._id === item._id
                            ? "border-accent-teal/40 bg-accent-teal/10 text-white"
                            : "border-white/[0.04] bg-[#0A0B0F] text-slate-400 hover:border-white/[0.1] hover:text-white"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-bold">
                            {activeTab === "boost" ? item.input.bulletText : item.input.targetRole}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">{new Date(item.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteHistory(item._id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-2 transition-colors rounded-lg hover:bg-white/[0.06]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <ResumePDFGenerator 
                ref={pdfRef} 
                markdownContent={pdfContent} 
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBoostPage;

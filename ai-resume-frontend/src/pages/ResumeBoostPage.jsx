import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Wand2, Upload, X, Trash2, Lightbulb, ShieldCheck, ChevronDown, Zap, FileText, CheckCircle, ArrowRight, History, Activity
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { getArenaHistory, deleteArenaHistory } from "../api/arenaApi";
import { useModel } from "../context/ModelContext";
import { useArena } from "../context/ArenaContext";
import ResumePDFGenerator from "../components/ui/ResumePDFGenerator";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";

const ResumeBoostPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || "");
  const [role, setRole] = useState("Software Engineer");
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState("boost"); // "boost" or "rebuilder"
  const [bulletText, setBulletText] = useState("Responsible for writing code and testing frontend features using React.");

  const { activeRuns, executeRun, clearRun } = useArena();
  const activeFeatureId = activeTab === "boost" ? "resume_boost" : "resume_rebuilder";
  const runState = activeRuns[activeFeatureId] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { selectedModel, compareMode } = useModel();

  const pdfRef = useRef();
  const [pdfContent, setPdfContent] = useState("");

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
      toast.error('Failed to load resumes');
      console.error("Failed to load resumes:", err);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await getArenaHistory(activeTab === "boost" ? "resume_boost" : "resume_rebuilder");
      if (res.success) {
        setHistoryList(res.history || []);
      }
    } catch (err) {
      toast.error('Failed to load history');
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggleSubFeature = (tab) => {
    setActiveTab(tab);
    clearRun(activeFeatureId);
    setHistoryList([]);
  };

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
      setTimeout(() => {
        if (pdfRef.current) {
          pdfRef.current.generatePDF(`Rebuilt_Resume_${model}.pdf`);
        }
      }, 150);
    } else {
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

  const handleLoadHistoryItem = (item) => {
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

  const renderBoostResult = (output) => {
    if (!output) return null;
    return (
      <div className="space-y-6">
        <GlassCard className="p-6 border-l-4 border-l-slate-600 bg-white/[0.01]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Original Content
          </span>
          <p className="text-[13px] text-slate-400 line-through leading-relaxed">{output.original}</p>
        </GlassCard>

        <GlassCard className="p-8 border border-accent-teal/30 bg-gradient-to-br from-accent-teal/10 to-transparent relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-accent-teal/20 blur-[60px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent-teal mb-3 flex items-center gap-2 relative z-10">
            <Zap className="w-4 h-4" /> AI Optimized Content
          </span>
          <p className="text-[15px] font-bold text-white leading-relaxed relative z-10 shadow-sm">
            {output.enhanced}
          </p>
        </GlassCard>

        <div className="grid gap-6 sm:grid-cols-2">
          <GlassCard className="p-6 border-t-2 border-t-[#8FB3FF]/50">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF] mb-4">Action Verbs Injected</h5>
            <div className="flex flex-wrap gap-2">
              {(output.actionVerbsUsed || []).map((v, i) => (
                <span key={i} className="rounded-lg bg-[#8FB3FF]/10 border border-[#8FB3FF]/20 px-3 py-1.5 text-xs font-bold text-[#8FB3FF] shadow-sm">{v}</span>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-6 border-t-2 border-t-accent-violet/50">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-violet-light mb-4">ATS Keywords Matched</h5>
            <div className="flex flex-wrap gap-2">
              {(output.atsKeywordsAdded || []).map((kw, i) => (
                <span key={i} className="rounded-lg bg-accent-violet/10 border border-accent-violet/20 px-3 py-1.5 text-xs font-bold text-accent-violet-light shadow-sm">{kw}</span>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            <span className="text-xs text-slate-400 font-medium">Readability: <strong className="text-white ml-1 text-[13px]">{output.readabilityScore || 0}/100</strong></span>
            <span className="text-xs text-slate-400 font-medium">Grammar: <strong className="text-emerald-400 ml-1 text-[13px]">{output.grammarScore || 0}%</strong></span>
          </div>
          <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 uppercase tracking-widest font-bold text-[10px] text-white shadow-sm">
            {output.tone} Tone
          </span>
        </GlassCard>
      </div>
    );
  };

  const renderRebuilderResult = (output) => {
    if (!output) return null;
    const rebuiltText = output.improvedResume || "";
    const changes = output.changes || [];
    const suggestions = output.suggestions || [];

    return (
      <div className="space-y-6">
        <GlassCard className="p-6 border border-accent-violet/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-violet-light flex items-center gap-2">
              <FileText className="w-4 h-4" /> Rebuilt Resume Output
            </h4>
            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-400 font-mono">MARKDOWN</span>
          </div>
          <pre className="text-sm text-slate-300 leading-relaxed bg-[#0A0B0F] p-6 rounded-2xl border border-white/5 whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto custom-scrollbar shadow-inner">
            {rebuiltText}
          </pre>
        </GlassCard>

        {changes.length > 0 && (
          <GlassCard className="p-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-teal mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Architecture Changes
            </h4>
            <div className="space-y-4">
              {changes.map((ch, idx) => {
                const isAdded = ch.type === "added";
                const isRemoved = ch.type === "removed";
                const colorBorder = isAdded ? "border-emerald-500/30" : isRemoved ? "border-rose-500/30" : "border-amber-500/30";
                const colorBg = isAdded ? "bg-emerald-500/5" : isRemoved ? "bg-rose-500/5" : "bg-amber-500/5";
                const colorText = isAdded ? "text-emerald-400" : isRemoved ? "text-rose-400" : "text-amber-400";
                
                return (
                  <div key={idx} className={`rounded-2xl border p-5 ${colorBorder} ${colorBg}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 bg-black/20 px-2 py-1 rounded border border-white/5">{ch.section}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${colorText} bg-current/10 px-2 py-1 rounded`}>{ch.type}</span>
                    </div>
                    {ch.original && (
                      <p className="text-xs line-through opacity-60 mb-3 pl-2 border-l border-white/10">"{ch.original}"</p>
                    )}
                    <p className="text-sm font-bold text-white shadow-sm leading-relaxed">"{ch.improved}"</p>
                    {ch.description && (
                      <p className="text-[11px] mt-3 pt-3 border-t border-white/10 text-slate-400 leading-relaxed">{ch.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {output.recruiterFeedback && (
            <GlassCard className="p-6 border-t-2 border-t-[#8FB3FF]">
              <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FB3FF] flex items-center gap-2 mb-4">
                <ShieldCheck className="h-4 w-4" /> Recruiter Perspective
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed">{output.recruiterFeedback}</p>
            </GlassCard>
          )}

          {suggestions.length > 0 && (
            <GlassCard className="p-6 border-t-2 border-t-amber-400">
              <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2 mb-4">
                <Lightbulb className="h-4 w-4" /> Future Tweaks
              </h5>
              <ul className="space-y-3 text-sm text-amber-100/80">
                {suggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <span className="leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* Premium Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-accent-violet/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-violet/20 bg-accent-violet/10 px-3 py-1.5 shadow-inner">
                <Sparkles className="h-4 w-4 text-accent-violet-light" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-violet-light">Content Optimization</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                Resume Builder
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Enhance single bullet points or trigger complete professional resume rewrites across multiple LLMs.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Builder Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-8 items-start">
          
          {/* Left Controls */}
          <div className="flex flex-col gap-6 sticky top-24">
            <GlassCard animated delay={0.1} className="p-0 overflow-hidden relative h-full flex flex-col">
              {isLoading && (
                <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                  <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent-violet to-transparent animate-shimmer" />
                </div>
              )}

              {/* Mode Toggle */}
              <div className="flex border-b border-white/[0.06] bg-[#0E101A]">
                <button
                  onClick={() => handleToggleSubFeature("boost")}
                  className={`flex-1 flex items-center justify-center gap-2 py-5 text-[12px] uppercase tracking-widest font-bold transition-all ${
                    activeTab === "boost" 
                    ? "border-b-2 border-accent-teal text-white bg-white/[0.04] shadow-[inset_0_-2px_10px_rgba(46,203,173,0.1)]" 
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                  }`}
                >
                  <Sparkles className="h-4 w-4" /> Bullet Boost
                </button>
                <button
                  onClick={() => handleToggleSubFeature("rebuilder")}
                  className={`flex-1 flex items-center justify-center gap-2 py-5 text-[12px] uppercase tracking-widest font-bold transition-all ${
                    activeTab === "rebuilder" 
                    ? "border-b-2 border-accent-violet-light text-white bg-white/[0.04] shadow-[inset_0_-2px_10px_rgba(124,111,247,0.1)]" 
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                  }`}
                >
                  <Wand2 className="h-4 w-4" /> Full Rebuild
                </button>
              </div>

              {/* Input Form */}
              <div className="p-8">
                <form onSubmit={handleRun} className="space-y-8">
                  {activeTab === "boost" ? (
                    <>
                      <div>
                        <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Original Bullet Point
                        </label>
                        <textarea
                          rows={5}
                          value={bulletText}
                          onChange={(e) => setBulletText(e.target.value)}
                          placeholder="Paste single bullet point here (e.g. was coding React features)..."
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-[14px] text-slate-200 outline-none transition-all focus:border-accent-teal/50 focus:ring-1 focus:ring-accent-teal/50 resize-none shadow-inner"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-3 flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          <span>Target Role</span>
                          <span className="text-[9px] border border-white/[0.08] px-2 py-1 rounded-md text-slate-500">OPTIONAL</span>
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. Senior Frontend Engineer"
                          className="w-full h-[56px] rounded-2xl border border-white/10 bg-white/5 px-4 text-[14px] text-white outline-none transition-all focus:border-accent-teal/50 focus:ring-1 focus:ring-accent-teal/50 shadow-inner"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Target Job Role
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. SDE II, DevOps Architect..."
                          className="w-full h-[56px] rounded-2xl border border-white/10 bg-white/5 px-4 text-[14px] text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 shadow-inner"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Base Resume
                        </label>
                        <div className="relative">
                          <select
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 cursor-pointer shadow-inner"
                            required
                          >
                            <option value="" className="bg-[#111318]">-- Choose Resume --</option>
                            {resumes.map(r => (
                              <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-3 flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          <span>Target Job Description</span>
                          <span className="text-[9px] border border-[#8FB3FF]/20 px-2 py-1 rounded-md text-[#8FB3FF]">RECOMMENDED</span>
                        </label>
                        <textarea
                          rows={6}
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Paste the target JD here to rewrite the resume professionally..."
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-[14px] text-slate-200 outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 resize-none shadow-inner"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-2">
                    <GradientButton
                      type="submit"
                      disabled={isLoading}
                      className={`w-full h-[60px] text-base ${activeTab === "boost" ? "bg-gradient-to-r from-[#00D4AA] to-[#00A68A]" : ""}`}
                    >
                      {isLoading ? (
                         <span className="flex items-center justify-center gap-2">
                           <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                           Compiling Output...
                         </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Wand2 className="h-5 w-5" />
                          {activeTab === "boost" ? "Boost Bullet Point" : "Execute Full Rebuild"}
                        </span>
                      )}
                    </GradientButton>
                  </div>
                </form>
              </div>
            </GlassCard>

            {/* Session History Mini-Pane */}
            <GlassCard animated delay={0.2} className="p-6">
              <h3 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <History className="h-4 w-4" /> Recent Operations
              </h3>
              {loadingHistory ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="skeleton h-[56px] w-full rounded-xl" />)}
                </div>
              ) : historyList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center bg-white/[0.01]">
                  <p className="text-[12px] text-slate-500">No session logs found.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {historyList.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleLoadHistoryItem(item)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        arenaRun?._id === item._id
                          ? "border-accent-teal/40 bg-accent-teal/10 shadow-[0_0_15px_rgba(46,203,173,0.1)]"
                          : "border-white/[0.04] bg-[#0A0B0F] hover:border-white/[0.15] hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-[13px] font-bold ${arenaRun?._id === item._id ? "text-white" : "text-slate-300"}`}>
                          {activeTab === "boost" ? item.input.bulletText : item.input.targetRole}
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteHistory(item._id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-2 transition-colors rounded-xl hover:bg-white/[0.06]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Output Workspace */}
          <div className="min-h-[600px] flex flex-col w-full">
             <AnimatePresence mode="wait">
              {!(arenaRun || isLoading) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-violet/10 mb-6 border border-accent-violet/20 shadow-[0_0_30px_rgba(124,111,247,0.15)]">
                    <Wand2 className="h-8 w-8 text-accent-violet-light" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Blueprint</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Configure your parameters on the left and execute the engine to generate highly optimized, ATS-friendly resume content.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ArenaWorkspace
                    isLoading={isLoading}
                    arenaRun={arenaRun}
                    onRegenerate={handleRun}
                    renderResult={activeTab === "boost" ? renderBoostResult : renderRebuilderResult}
                    downloadHandler={handleDownloadPDF}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden PDF Generator */}
            <ResumePDFGenerator 
              ref={pdfRef} 
              markdownContent={pdfContent} 
            />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBoostPage;

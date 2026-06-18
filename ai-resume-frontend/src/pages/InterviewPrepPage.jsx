import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, MessageSquareQuote, Copy, Code, User, Search, Bookmark, Trash2, ChevronDown, BookmarkCheck, AlertCircle, PlayCircle, History, Sparkles, Activity
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes } from "../api/resumeApi";
import { getArenaHistory, deleteArenaHistory } from "../api/arenaApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";
import ScoreRing from "../components/ui/ScoreRing";

const InterviewPrepPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || "");
  const [role, setRole] = useState("Software Engineer");
  const [jobDescription, setJobDescription] = useState("");
  const [questionCount, setQuestionCount] = useState(3);

  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["interview_prep"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { selectedModel, compareMode } = useModel();

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("interview_prep");
    };
  }, [clearRun]);

  useEffect(() => {
    fetchResumes();
    fetchHistory();
    loadLocalBookmarks();
  }, []);

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
      const res = await getArenaHistory("interview_prep");
      if (res.success) {
        setHistoryList(res.history || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadLocalBookmarks = () => {
    const saved = localStorage.getItem("interview_bookmarks");
    if (saved) {
      try {
        setBookmarkedQuestions(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing bookmarks:", e);
      }
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedResumeId) return toast.error("Please upload or select a resume first.");
    if (!role.trim()) return toast.error("Please enter a target job role.");

    await executeRun("interview_prep", {
      feature: "interview_prep",
      inputs: {
        resumeId: selectedResumeId,
        role,
        jobDescription,
        questionCount
      },
      model: selectedModel,
      compareMode
    });
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this prep log record?")) return;
    try {
      const res = await deleteArenaHistory(id);
      if (res.success) {
        toast.success("Prep history deleted.");
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
        if (arenaRun?._id === id) {
          clearRun("interview_prep");
          setExpandedIndex(null);
        }
      }
    } catch (err) {
      toast.error("Failed to delete history.");
    }
  };

  const handleLoadHistoryItem = (item) => {
    setRole(item.input.role);
    setJobDescription(item.input.jobDescription || "");
    setExpandedIndex(null);
    toast.success(`Loaded inputs for ${item.input.role}. Click generate to re-run.`);
  };

  const toggleBookmark = (qObj, e) => {
    e.stopPropagation();
    let updated = [...bookmarkedQuestions];
    const idx = updated.findIndex((item) => item.question === qObj.question);
    if (idx > -1) {
      updated.splice(idx, 1);
      toast.success("Removed bookmark");
    } else {
      updated.push(qObj);
      toast.success("Saved bookmark!");
    }
    setBookmarkedQuestions(updated);
    localStorage.setItem("interview_bookmarks", JSON.stringify(updated));
  };

  const copyQuestionDetails = (qObj, e) => {
    e.stopPropagation();
    const text = `Q: ${qObj.question}\n\nExpected Answer Hint:\n${qObj.expectedAnswer}\n\nFollow-up: ${qObj.followUpQuestion || ""}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied Q&A details!");
  };

  const getDifficultyStyles = (diff) => {
    if (diff?.toLowerCase() === "hard") return "bg-rose-500/10 border-rose-500/20 text-rose-400";
    if (diff?.toLowerCase() === "medium") return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  };

  const getTypeBadgeStyles = (type) => {
    if (type?.toLowerCase() === "technical") return "bg-[#5B8FFF]/10 border-[#5B8FFF]/20 text-[#8FB3FF]";
    if (type?.toLowerCase() === "behavioral") return "bg-[#7C5CFC]/10 border-[#7C5CFC]/20 text-[#A78BFA]";
    if (type?.toLowerCase() === "project") return "bg-[#00D4AA]/10 border-[#00D4AA]/20 text-[#5DE8C5]";
    return "bg-slate-500/10 border-slate-500/20 text-slate-400";
  };

  const getIconForType = (type) => {
    if (type?.toLowerCase() === "technical") return <Code className="h-3 w-3 inline mr-1" />;
    if (type?.toLowerCase() === "behavioral") return <MessageSquareQuote className="h-3 w-3 inline mr-1" />;
    return <User className="h-3 w-3 inline mr-1" />;
  };

  const renderPrepResult = (output) => {
    if (!output) return null;

    const list = output.questions || [];
    const categories = ["All", ...new Set(list.map((q) => q.type).filter(Boolean))];

    const filtered = list.filter((q) => {
      const matchesCategory = selectedCategory === "All" || q.type?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = q.question?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.expectedAnswer?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const matchScore = output.matchPercentage || 0;

    return (
      <div className="space-y-6">
        
        {/* Top Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          <GlassCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#7C5CFC]/10 to-transparent opacity-50" />
            <ScoreRing 
              score={matchScore}
              size={120}
              label="Confidence"
              color="#7C5CFC"
            />
          </GlassCard>

          <GlassCard className="p-6 border-t-2 border-t-emerald-500/50 flex flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4 block">Strong Areas</span>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-24 custom-scrollbar">
              {(output.strongSkills || []).map((s, i) => (
                <span key={i} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">{s}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-t-2 border-t-rose-500/50 flex flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-4 block">Review Needed</span>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-24 custom-scrollbar">
              {(output.weakSkills || []).map((s, i) => (
                <span key={i} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-200">{s}</span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Filters and Search box */}
        <GlassCard className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-white/5 bg-white/[0.01]">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#7C5CFC] text-white shadow-[0_4px_14px_rgba(124,92,252,0.4)]"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72 flex-shrink-0 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-[#7C5CFC]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[40px] rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/50 shadow-inner"
              placeholder="Search questions..."
            />
          </div>
        </GlassCard>

        {/* Question Cards */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">No questions match your filter criteria.</div>
        ) : (
          <div className="space-y-4 pr-2">
            {filtered.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              const isBookmarked = bookmarkedQuestions.some((b) => b.question === item.question);

              return (
                <GlassCard
                  animated delay={idx * 0.05}
                  key={idx}
                  className={`p-0 group overflow-hidden transition-all duration-300 cursor-pointer ${
                    isExpanded ? "border-[#7C5CFC]/50 shadow-[0_10px_30px_rgba(124,111,247,0.15)] ring-1 ring-[#7C5CFC]/20" : "hover:border-[#7C5CFC]/30 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="p-6 flex gap-4 items-start justify-between" onClick={() => setExpandedIndex(isExpanded ? null : idx)}>
                    <div className="space-y-3">
                      <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em]">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-slate-300">
                          {idx + 1}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md border ${getTypeBadgeStyles(item.type)}`}>
                          {getIconForType(item.type)} {item.type}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md border ${getDifficultyStyles(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-white leading-relaxed font-body pr-4">{item.question}</h4>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={(e) => copyQuestionDetails(item, e)}
                        className="p-2.5 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                        title="Copy Details"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(item, e)}
                        className={`p-2.5 rounded-xl transition-colors ${
                          isBookmarked ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20" : "text-slate-500 hover:text-white hover:bg-white/[0.06]"
                        }`}
                        title="Bookmark"
                      >
                        {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                      <div className="p-2.5 text-slate-500 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/5 bg-black/20"
                      >
                        <div className="p-6 space-y-5 text-sm leading-relaxed text-slate-300 font-body">
                          <div>
                            <span className="font-bold text-[#A78BFA] uppercase tracking-[0.2em] text-[10px] mb-2 block">Expected Answer Key</span>
                            <p className="text-slate-200 bg-white/[0.02] p-4 rounded-xl border border-white/5 shadow-inner">{item.expectedAnswer}</p>
                          </div>
                          {item.followUpQuestion && (
                            <div>
                              <span className="font-bold text-accent-teal uppercase tracking-[0.2em] text-[10px] mb-2 block">Suggested Follow-up</span>
                              <p className="text-slate-200 border-l-2 border-accent-teal pl-4 py-2 italic bg-accent-teal/5 rounded-r-lg">{item.followUpQuestion}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-4 pt-4 mt-2 border-t border-white/5 text-[11px] text-slate-400">
                            <span className="rounded-lg bg-white/5 px-3 py-1.5 font-medium border border-white/10">Resume Relevance: <strong className="text-white ml-1">{item.resumeRelevance || "High"}</strong></span>
                            {item.relevanceExplanation && (
                              <span className="flex-1 flex items-center gap-2"><PlayCircle className="h-4 w-4 text-[#7C5CFC]" /> <em>{item.relevanceExplanation}</em></span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* Premium Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#7C5CFC]/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-[#7C5CFC]/10 px-3 py-1.5 shadow-inner">
                <BrainCircuit className="h-4 w-4 text-[#7C5CFC]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC]">Interview Simulator</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                Interview Prep Arena
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Generate role-specific technical, behavioral, and resume-based questions to practice for your next interview.
              </p>
            </div>

            <div className="hidden lg:flex gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <MessageSquareQuote className="w-5 h-5 text-[#7C5CFC] mb-2" />
                <p className="text-xs font-bold text-white">Mock Interview</p>
                <p className="text-[10px] text-slate-400 mt-1">Interactive Q&A</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8 items-start">
          
          {/* Controls Form */}
          <div className="flex flex-col gap-6 sticky top-24">
            <form onSubmit={handleGenerate}>
              <GlassCard animated delay={0.1} className="p-8 relative overflow-hidden h-full flex flex-col">
                {isLoading && (
                  <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02]">
                    <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#7C5CFC] to-transparent animate-shimmer" />
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-white">Simulation Details</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure your mock interview parameters.</p>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Target Role */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      1. Target Role
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#7C5CFC]" />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Frontend Engineer"
                        className="w-full h-[56px] rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-[14px] text-white outline-none transition-all focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/50 shadow-inner"
                        required
                      />
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      2. Base Resume
                    </label>
                    {resumes.length === 0 ? (
                      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                        <p className="text-[13px] text-amber-200">
                          No resumes. <Link to="/resumes" className="font-bold underline hover:text-amber-100">Upload one</Link>.
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/50 cursor-pointer shadow-inner"
                          required
                        >
                          <option value="" className="bg-[#111318]">-- Choose Resume --</option>
                          {resumes.map(r => (
                            <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* JD */}
                  <div>
                    <label className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      <span>3. Job Description</span>
                      <span className="text-[9px] text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded">OPTIONAL</span>
                    </label>
                    <textarea
                      rows={5}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste JD to make questions highly specific..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-[14px] text-slate-200 outline-none transition-all focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/50 resize-none shadow-inner"
                    />
                  </div>

                  {/* Count */}
                  <div>
                    <label className="mb-4 flex text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 justify-between items-center">
                      <span>4. Question Count</span>
                      <span className="text-white bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 px-3 py-1 rounded-md text-[11px] shadow-sm">{questionCount} questions</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full accent-[#7C5CFC] cursor-pointer h-2 bg-white/10 rounded-full appearance-none outline-none"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-3">
                      <span>1 Question</span>
                      <span>10 Max</span>
                    </div>
                  </div>
                </div>

                <GradientButton
                  type="submit"
                  disabled={isLoading || !selectedResumeId}
                  className="w-full h-[60px] text-base bg-gradient-to-r from-[#8B5CF6] to-[#7C5CFC]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Simulating Interview...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <BrainCircuit className="h-5 w-5" /> Generate Mock Interview
                    </span>
                  )}
                </GradientButton>
              </GlassCard>
            </form>

            {/* Session History Mini-Pane */}
            <GlassCard animated delay={0.2} className="p-6">
              <h3 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <History className="h-4 w-4" /> Recent Sessions
              </h3>
              {loadingHistory ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="skeleton h-[56px] w-full rounded-xl" />)}
                </div>
              ) : historyList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center bg-white/[0.01]">
                  <p className="text-[12px] text-slate-500">No mock interviews saved.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {historyList.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleLoadHistoryItem(item)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        arenaRun?._id === item._id
                          ? "border-[#7C5CFC]/40 bg-[#7C5CFC]/10 shadow-[0_0_15px_rgba(124,92,252,0.1)]"
                          : "border-white/[0.04] bg-[#0A0B0F] hover:border-white/[0.15] hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-[13px] font-bold ${arenaRun?._id === item._id ? "text-white" : "text-slate-300"}`}>
                          {item.input.role}
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#7C5CFC]/10 mb-6 border border-[#7C5CFC]/20 shadow-[0_0_30px_rgba(124,92,252,0.15)]">
                    <MessageSquareQuote className="h-8 w-8 text-[#7C5CFC]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Parameters</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Configure your mock interview on the left and execute the engine to generate targeted questions.
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
                    onRegenerate={handleGenerate}
                    renderResult={renderPrepResult}
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

export default InterviewPrepPage;

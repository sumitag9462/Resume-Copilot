import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  MessageSquareQuote,
  Copy,
  Code,
  User,
  Search,
  Bookmark,
  Trash2,
  Upload,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  X,
  AlertCircle,
  PlayCircle
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import WorkspaceLayout from "../components/layout/WorkspaceLayout";
import { getAllResumes, uploadResume } from "../api/resumeApi";
import { getArenaHistory, deleteArenaHistory } from "../api/arenaApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import EmptyState from "../components/ui/EmptyState";

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

const InterviewPrepPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  // DB & Inputs
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || "");
  const [role, setRole] = useState("Software Engineer");
  const [jobDescription, setJobDescription] = useState("");
  const [questionCount, setQuestionCount] = useState(3);

  // File Upload State
  const [dragOver, setDragOver] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Active Session State
  const { activeRuns, executeRun } = useArena();
  const runState = activeRuns["interview_prep"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  // Side-history & UI States
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { selectedModel, compareMode } = useModel();

  // Initialize
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

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const isDoc = file.type === "application/pdf" || 
                  file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                  file.name.endsWith(".pdf") || 
                  file.name.endsWith(".docx");

    if (!isDoc) {
      return toast.error("Only PDF or DOCX files are allowed.");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size must be under 5MB.");
    }
    setUploadFile(file);
  };

  const handleUploadResume = async () => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      const res = await uploadResume(uploadFile);
      if (res.success) {
        toast.success("Resume uploaded and parsed!");
        setResumes((prev) => [res.resume, ...prev]);
        setSelectedResumeId(res.resume._id);
        setUploadFile(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  // Generate Questions
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

  // Delete History Item
  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this prep log record?")) return;
    try {
      const res = await deleteArenaHistory(id);
      if (res.success) {
        toast.success("Prep history deleted.");
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
        if (arenaRun?._id === id) {
          executeRun("interview_prep", null);
          setExpandedIndex(null);
        }
      }
    } catch (err) {
      toast.error("Failed to delete history.");
    }
  };

  // Load a session from history
  const handleLoadHistoryItem = (item) => {
    setRole(item.input.role);
    setJobDescription(item.input.jobDescription || "");
    setExpandedIndex(null);
    toast.success(`Loaded inputs for ${item.input.role}. Click generate to re-run.`);
  };

  // Bookmarking Toggle
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

  // Copy details
  const copyQuestionDetails = (qObj, e) => {
    e.stopPropagation();
    const text = `Q: ${qObj.question}\n\nExpected Answer Hint:\n${qObj.expectedAnswer}\n\nFollow-up: ${qObj.followUpQuestion || ""}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied Q&A details!");
  };

  // Helper styles
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

  // Render question list within workspace
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
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="col-span-1 card p-5 flex flex-col justify-center shadow-[0_10px_30px_rgba(124,111,247,0.1)]">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Match Confidence</span>
              <span className="text-xl font-black text-[#A78BFA]">{matchScore}%</span>
            </div>
            <ProgressBar value={matchScore} colorClass="bg-[#7C5CFC]" bgClass="shadow-[0_0_10px_rgba(124,92,252,0.5)]" />
          </div>

          <div className="col-span-1 card p-5 flex flex-col border-t-2 border-t-emerald-500/50">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">Strong Areas</span>
            <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-16">
              {(output.strongSkills || []).map((s, i) => (
                <span key={i} className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-200">{s}</span>
              ))}
            </div>
          </div>

          <div className="col-span-1 card p-5 flex flex-col border-t-2 border-t-rose-500/50">
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-400 mb-3 block">Review Needed</span>
            <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-16">
              {(output.weakSkills || []).map((s, i) => (
                <span key={i} className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-200">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search box */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-y border-white/[0.06] py-4 bg-[#0A0B0F]/50 px-4 rounded-xl">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#7C5CFC] text-white shadow-[0_4px_14px_rgba(124,92,252,0.4)]"
                    : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 flex-shrink-0 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-[#7C5CFC]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-9 py-2"
              placeholder="Search questions..."
            />
          </div>
        </div>

        {/* Question Cards */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-slate-500">No questions match your filter criteria.</div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {filtered.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              const isBookmarked = bookmarkedQuestions.some((b) => b.question === item.question);

              return (
                <motion.div
                  layout
                  key={idx}
                  className={`card group overflow-hidden transition-all duration-300 cursor-pointer ${
                    isExpanded ? "border-[#7C5CFC]/40 shadow-[0_10px_30px_rgba(124,111,247,0.15)] ring-1 ring-[#7C5CFC]/20" : "hover:border-[#7C5CFC]/30 hover:bg-white/[0.04]"
                  }`}
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <div className="p-5 flex gap-4 items-start justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.06] text-slate-400">
                          {idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md border ${getTypeBadgeStyles(item.type)}`}>
                          {getIconForType(item.type)} {item.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md border ${getDifficultyStyles(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>
                      <h4 className="text-[14px] md:text-[15px] font-bold text-white leading-relaxed font-body">{item.question}</h4>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={(e) => copyQuestionDetails(item, e)}
                        className="p-2 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                        title="Copy Details"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(item, e)}
                        className={`p-2 rounded-lg transition-colors ${
                          isBookmarked ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20" : "text-slate-500 hover:text-white hover:bg-white/[0.06]"
                        }`}
                        title="Bookmark"
                      >
                        {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                      <div className="p-2 text-slate-500 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
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
                        className="border-t border-white/[0.06] bg-[#0A0B0F]/50"
                      >
                        <div className="p-5 space-y-4 text-[13px] leading-relaxed text-slate-300 font-body">
                          <div>
                            <span className="font-bold text-[#A78BFA] uppercase tracking-wider text-[10px] mb-1.5 block">Expected Answer Key</span>
                            <p className="text-slate-200 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">{item.expectedAnswer}</p>
                          </div>
                          {item.followUpQuestion && (
                            <div>
                              <span className="font-bold text-[#5DE8C5] uppercase tracking-wider text-[10px] mb-1.5 block">Suggested Follow-up</span>
                              <p className="text-slate-200 border-l-2 border-[#5DE8C5] pl-3 py-1 italic">{item.followUpQuestion}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-4 pt-4 mt-2 border-t border-white/[0.06] text-[11px] text-slate-400">
                            <span className="rounded bg-white/[0.06] px-2 py-1">Resume Relevance: <strong className="text-white ml-1">{item.resumeRelevance || "High"}</strong></span>
                            {item.relevanceExplanation && (
                              <span className="flex-1 flex items-center gap-2"><PlayCircle className="h-3 w-3 text-[#7C5CFC]" /> <em>{item.relevanceExplanation}</em></span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl sm:flex-row sm:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#7C5CFC]/10 to-transparent opacity-40" />
          
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-[#7C5CFC]/5 px-3 py-1">
              <BrainCircuit className="h-3.5 w-3.5 text-[#7C5CFC]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC]">Interview Simulator</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Interview Prep Arena</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Generate role-specific technical, behavioral, and resume-based questions to practice for your next interview.
            </p>
          </div>
        </div>

        {/* 60/40 Responsive Workspace */}
        <WorkspaceLayout
          rightEmpty={!arenaRun && !isLoading}
          left={
            <form onSubmit={handleGenerate} className="card p-6 sm:p-8 space-y-8">
              <div className="border-b border-white/[0.06] pb-4">
                <h2 className="text-[15px] font-bold text-white">Simulation Details</h2>
                <p className="text-[12px] text-slate-400 mt-1">Configure your mock interview parameters.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Target Role */}
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    1. Target Role
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#7C5CFC]" />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                      className="input-base pl-11 text-[14px] w-full"
                      required
                    />
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    2. Base Resume
                  </label>
                  {resumes.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      <p className="text-[12px] text-amber-200">
                        No resumes. <Link to="/resumes" className="font-bold underline">Upload one</Link>.
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="input-base w-full appearance-none pr-10 text-[14px]"
                        required
                      >
                        <option value="">Choose Resume...</option>
                        {resumes.map(r => (
                          <option key={r._id} value={r._id}>{r.originalName}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* JD */}
              <div>
                <label className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <span>3. Job Description</span>
                  <span className="text-[9px] text-slate-600 border border-white/[0.08] px-1.5 py-0.5 rounded">OPTIONAL</span>
                </label>
                <textarea
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste JD to make questions highly specific..."
                  className="input-base w-full text-[14px] resize-none leading-relaxed"
                />
              </div>

              {/* Count */}
              <div>
                <label className="mb-4 flex text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 justify-between items-center">
                  <span>4. Question Count</span>
                  <span className="text-white bg-[#7C5CFC]/20 px-2 py-0.5 rounded text-[10px]">{questionCount} questions</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-[#7C5CFC] cursor-pointer h-2 bg-white/[0.08] rounded-full appearance-none outline-none"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-2">
                  <span>1 Question</span>
                  <span>10 Max</span>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-white/[0.06]">
                <button
                  type="submit"
                  disabled={isLoading || !selectedResumeId}
                  className={`btn-primary relative w-full h-[56px] text-[15px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
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
                </button>
              </div>
            </form>
          }
          right={
            <div className="min-w-0 space-y-6 w-full">
              {!arenaRun && !isLoading ? (
                <EmptyState
                  icon={MessageSquareQuote}
                  title="Interview Questions Will Appear Here"
                  subtitle="Role-specific technical and behavioral questions generated from your resume."
                  chips={[
                    { label: "Technical", color: "violet" },
                    { label: "Behavioral", color: "teal" },
                    { label: "Role-Specific", color: "amber" }
                  ]}
                />
              ) : (
                <ArenaWorkspace
                  isLoading={isLoading}
                  arenaRun={arenaRun}
                  onRegenerate={handleGenerate}
                  renderResult={renderPrepResult}
                />
              )}

              {/* History Logs */}
              <div className="card p-6">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  Recent Sessions
                </h3>
                {loadingHistory ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="skeleton h-[52px] w-full rounded-xl" />)}
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/[0.08] p-6 text-center">
                    <p className="text-[12px] text-slate-500">No mock interviews saved.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {historyList.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleLoadHistoryItem(item)}
                        className={`group flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer ${
                          arenaRun?._id === item._id
                            ? "border-[#7C5CFC]/40 bg-[#7C5CFC]/10 text-white"
                            : "border-white/[0.04] bg-[#0A0B0F] text-slate-400 hover:border-white/[0.1] hover:text-white"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-bold">{item.input.role}</p>
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
              
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrepPage;

// src/pages/InterviewPrepPage.jsx — AI INTERVIEW PREPARATION ARENA
//
// Generates role-based technical and behavioral questions from candidate resumes,
// highlighting strong areas, weak skills, and questions across multiple models.

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  X
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes, uploadResume } from "../api/resumeApi";
import { getArenaHistory, deleteArenaHistory } from "../api/arenaApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";

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
          setArenaRun(null);
          setExpandedIndex(null);
        }
      }
    } catch (err) {
      toast.error("Failed to delete history.");
    }
  };

  // Load a session from history
  const handleLoadHistoryItem = (item) => {
    setArenaRun(item);
    setRole(item.input.role);
    setJobDescription(item.input.jobDescription || "");
    setExpandedIndex(null);
    toast.success(`Loaded mock interview for ${item.input.role}`);
  };

  // Bookmarking Toggle
  const toggleBookmark = (qObj) => {
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
  const copyQuestionDetails = (qObj) => {
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
    if (type?.toLowerCase() === "technical") return "bg-blue-500/10 border-blue-500/20 text-blue-400";
    if (type?.toLowerCase() === "behavioral") return "bg-purple-500/10 border-purple-500/20 text-purple-400";
    if (type?.toLowerCase() === "project") return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
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

    // Filter questions based on category & search query
    const filtered = list.filter((q) => {
      const matchesCategory = selectedCategory === "All" || q.type?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = q.question?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.expectedAnswer?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <span className="text-[10px] uppercase text-slate-400">Match score</span>
            <p className="text-2xl font-bold text-white mt-1">{output.matchPercentage || 0}%</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/2 p-4">
            <span className="text-[10px] uppercase text-slate-400 block mb-1">Strong Skills Found</span>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {(output.strongSkills || []).map((s, i) => (
                <span key={i} className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/2 p-4">
            <span className="text-[10px] uppercase text-slate-400 block mb-1">Missing/Weak Skills</span>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {(output.weakSkills || []).map((s, i) => (
                <span key={i} className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-400 border border-rose-500/20">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search box */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/5 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition ${
                  selectedCategory === cat
                    ? "bg-[#7C5CFC] border-[#7C5CFC] text-white"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0E101D] pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-[#7C5CFC]"
              placeholder="Search questions..."
            />
          </div>
        </div>

        {/* Expandable question cards */}
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 italic">No questions match filter/search criteria.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              const isBookmarked = bookmarkedQuestions.some((b) => b.question === item.question);

              return (
                <div
                  key={idx}
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className={`rounded-2xl border bg-[#0E101D] cursor-pointer hover:border-[#7C5CFC]/30 transition overflow-hidden ${
                    isExpanded ? "border-[#7C5CFC]/40 shadow-lg" : "border-white/5"
                  }`}
                >
                  <div className="p-4 flex gap-4 items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center flex-wrap gap-2 text-[9px] font-bold">
                        <span className="text-slate-500">#{idx + 1}</span>
                        <span className={`px-2 py-0.5 rounded-full border ${getTypeBadgeStyles(item.type)}`}>
                          {getIconForType(item.type)} {item.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${getDifficultyStyles(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs md:text-sm font-semibold text-white leading-relaxed">{item.question}</h4>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => copyQuestionDetails(item)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                        title="Copy Details"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(item)}
                        className={`p-1.5 rounded-lg transition ${
                          isBookmarked ? "text-yellow-400 hover:text-yellow-300" : "text-slate-400 hover:text-white"
                        }`}
                        title="Bookmark"
                      >
                        {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                      </button>
                      <div className="p-1 text-slate-400">
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="border-t border-white/5 bg-[#080911]/50"
                      >
                        <div className="p-4 space-y-3 text-xs leading-relaxed text-slate-300">
                          <div>
                            <span className="font-bold text-[#A78BFA]">Expected Answer Key</span>
                            <p className="mt-1 text-slate-200">{item.expectedAnswer}</p>
                          </div>
                          {item.followUpQuestion && (
                            <div>
                              <span className="font-bold text-[#5DE8C5]">Suggested Follow-up</span>
                              <p className="mt-1 text-slate-200">{item.followUpQuestion}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                            <span>Relevance: <strong>{item.resumeRelevance || "High"}</strong></span>
                            {item.relevanceExplanation && (
                              <span className="flex-1">Detail: <em>{item.relevanceExplanation}</em></span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Left panel: history & uploads */}
          <div className="space-y-6">
            {/* Quick Upload */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-[#7C5CFC]" /> Upload Resume
              </h3>
              <div
                onDragOver={handleDrag}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition ${
                  dragOver ? "border-[#7C5CFC] bg-[#7C5CFC]/5" : "border-white/10 hover:border-white/20 bg-white/2"
                }`}
              >
                <Upload className="mx-auto h-6 w-6 text-slate-500 mb-2" />
                <p className="text-[10px] text-slate-400 leading-normal">Drag PDF/DOCX or click to browse</p>
                <input
                  type="file"
                  onChange={(e) => validateAndSetFile(e.target.files[0])}
                  className="hidden"
                  id="dropzone-file"
                />
                <label htmlFor="dropzone-file" className="absolute inset-0 cursor-pointer" />
              </div>
              {uploadFile && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs bg-white/5 rounded-xl p-2.5">
                    <span className="truncate max-w-[150px] text-slate-300 font-semibold">{uploadFile.name}</span>
                    <button onClick={() => setUploadFile(null)} className="text-rose-400"><X className="h-4 w-4" /></button>
                  </div>
                  <button
                    onClick={handleUploadResume}
                    disabled={uploading}
                    className="btn-primary w-full py-2 text-xs flex justify-center items-center gap-1.5"
                  >
                    {uploading ? "Uploading..." : "Parse File"}
                  </button>
                </div>
              )}
            </div>

            {/* History logs */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">Past Trials</h3>
              {loadingHistory ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}
                </div>
              ) : historyList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No prep runs logged.</p>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {historyList.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleLoadHistoryItem(item)}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                        arenaRun?._id === item._id
                          ? "border-[#7C5CFC]/40 bg-[#7C5CFC]/8 text-white"
                          : "border-white/5 bg-white/2 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">{item.input.role}</p>
                        <p className="text-[9px] text-slate-500 mt-1">{new Date(item.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteHistory(item._id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Form inputs and workspace */}
          <div className="space-y-6">
            {/* Introductory header */}
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-xl lg:p-7">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#8FB3FF]">Prep Arena</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Interview Prep Simulator</h1>
              <p className="mt-2 text-sm text-slate-400">
                Simulate role-specific technical, behavioral, and resume-based questions across multiple models in parallel.
              </p>
            </div>

            {/* Config inputs */}
            <form onSubmit={handleGenerate} className="card p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">1. Target Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer, DevOps..."
                    className="input-base text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">2. Select Resume Reference</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="input-base cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Resume --</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>{r.originalName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-300">3. Target Job Description (Recommended)</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the JD here to generate highly customized interview questions..."
                  className="input-base text-xs resize-none"
                />
              </div>
              
              <div>
                <label className="mb-2 flex text-xs font-semibold text-slate-300 justify-between items-center">
                  <span>4. Number of Questions</span>
                  <span className="text-[#00D4AA]">{questionCount} questions</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-[#7C5CFC] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1</span>
                  <span>10 (Max)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedResumeId}
                className="btn-primary w-full py-3.5 text-sm flex justify-center items-center gap-1.5"
              >
                <BrainCircuit className="h-4.5 w-4.5" /> Generate Tailored Questions
              </button>
            </form>

            <ArenaWorkspace
              isLoading={isLoading}
              arenaRun={arenaRun}
              onRegenerate={handleGenerate}
              renderResult={renderPrepResult}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrepPage;

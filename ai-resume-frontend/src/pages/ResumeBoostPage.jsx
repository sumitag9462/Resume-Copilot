// src/pages/ResumeBoostPage.jsx — RESUME BOOST & REBUILDER ARENA
//
// Combines:
//   1. Resume Boost: Enhances single bullet points for target roles.
//   2. Resume Rebuilder: Professional rewrite of entire resumes.

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Upload,
  X,
  Trash2,
  Lightbulb,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ArenaWorkspace from "../components/ui/ArenaWorkspace";
import { getAllResumes, uploadResume } from "../api/resumeApi";
import { runArena, getArenaHistory, deleteArenaHistory } from "../api/arenaApi";
import { useModel } from "../context/ModelContext";

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

  // File Upload State
  const [dragOver, setDragOver] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Active Session State
  const [isLoading, setIsLoading] = useState(false);
  const [arenaRun, setArenaRun] = useState(null);

  // Side-history & UI States
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { selectedModel, compareMode } = useModel();

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
    setArenaRun(null);
    setHistoryList([]);
  };

  // Handle Drag & Drop File Upload
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

  // Submit Boost or Rebuilder
  const handleRun = async (e) => {
    if (e) e.preventDefault();
    if (activeTab === "rebuilder" && !selectedResumeId) {
      return toast.error("Please upload or select a resume first.");
    }
    if (activeTab === "boost" && (!bulletText || bulletText.trim().length < 5)) {
      return toast.error("Please enter a valid bullet point.");
    }

    setIsLoading(true);
    setArenaRun(null);

    const feature = activeTab === "boost" ? "resume_boost" : "resume_rebuilder";
    const inputs = activeTab === "boost"
      ? { bulletText, targetRole: role }
      : { resumeId: selectedResumeId, targetRole: role, jobDescription };

    try {
      const data = await runArena({
        feature,
        inputs,
        model: selectedModel,
        compareMode
      });
      setArenaRun(data.arenaRun);
      toast.success(activeTab === "boost" ? "Bullet improved! ✨" : "Resume rebuilt successfully! 🚀");
      fetchHistory();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to boost");
    } finally {
      setIsLoading(false);
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
          setArenaRun(null);
        }
      }
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  // Load a session from history
  const handleLoadHistoryItem = (item) => {
    setArenaRun(item);
    if (activeTab === "boost") {
      setBulletText(item.input.bulletText || "");
      setRole(item.input.targetRole || "");
    } else {
      setSelectedResumeId(item.input.resumeId || "");
      setRole(item.input.targetRole || "");
      setJobDescription(item.input.jobDescription || "");
    }
    toast.success(`Loaded past session`);
  };

  // Render Resume Boost Output (single bullet)
  const renderBoostResult = (output) => {
    if (!output) return null;
    return (
      <div className="space-y-6">
        <div>
          <span className="text-[10px] uppercase text-slate-400 block mb-1">Original Bullet</span>
          <p className="text-xs text-slate-400 bg-white/2 p-3.5 rounded-xl border border-white/5 line-through">{output.original}</p>
        </div>

        <div>
          <span className="text-[10px] uppercase text-[#00D4AA] block mb-1">Enhanced Bullet</span>
          <p className="text-xs md:text-sm font-semibold text-slate-200 bg-white/2 p-4 rounded-xl border border-[#00D4AA]/20 leading-relaxed">
            {output.enhanced}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-white/2 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#8FB3FF] mb-2.5">Action Verbs Used</h5>
            <div className="flex flex-wrap gap-1.5">
              {(output.actionVerbsUsed || []).map((v, i) => (
                <span key={i} className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-slate-200">{v}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/2 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA] mb-2.5">ATS Keywords Added</h5>
            <div className="flex flex-wrap gap-1.5">
              {(output.atsKeywordsAdded || []).map((kw, i) => (
                <span key={i} className="rounded bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-2 py-0.5 text-[10px] text-slate-200">{kw}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between rounded-xl bg-white/3 p-3 text-xs text-slate-400 gap-2">
          <span>Readability Score: <strong>{output.readabilityScore || 0}/100</strong></span>
          <span>Grammar: <strong>{output.grammarScore || 0}%</strong></span>
          <span className="rounded bg-white/5 px-2 py-0.5 uppercase tracking-wider font-bold text-[9px] text-slate-300">
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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Rebuilt Resume Content (Markdown)</h4>
          <pre className="text-xs text-slate-200 leading-relaxed bg-white/2 p-4 rounded-xl border border-white/5 whitespace-pre-wrap font-mono max-h-[400px] overflow-y-auto">
            {rebuiltText}
          </pre>
        </div>

        {changes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#00D4AA] mb-3">Rebuild Changes Log</h4>
            <div className="space-y-3">
              {changes.map((ch, idx) => {
                const color = ch.type === "added" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" :
                  ch.type === "removed" ? "border-rose-500/30 bg-rose-500/5 text-rose-400" :
                    "border-amber-500/30 bg-amber-500/5 text-amber-400";
                return (
                  <div key={idx} className={`rounded-xl border p-4 ${color}`}>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span>Section: {ch.section}</span>
                      <span>{ch.type}</span>
                    </div>
                    {ch.original && (
                      <p className="text-xs line-through text-slate-400 mt-2">Original: "{ch.original}"</p>
                    )}
                    <p className="text-xs font-semibold mt-1">Improved: "{ch.improved}"</p>
                    {ch.description && (
                      <p className="text-[10px] mt-2 italic text-slate-300">Description: {ch.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {output.recruiterFeedback && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#8FB3FF] flex items-center gap-1.5 mb-2">
              <ShieldCheck className="h-4 w-4" /> Recruiter Perspective
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">{output.recruiterFeedback}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <Lightbulb className="h-4 w-4" /> Future Tweaks
            </h5>
            <ul className="space-y-1 text-xs text-slate-300">
              {suggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-1.5">
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
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Left Panel: Uploads and history */}
          <div className="space-y-6">
            {activeTab === "rebuilder" && (
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-[#7C5CFC]" /> Upload Resume
                </h3>
                <div
                  onDragOver={handleDrag}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition ${dragOver ? "border-[#7C5CFC] bg-[#7C5CFC]/5" : "border-white/10 hover:border-white/20 bg-white/2"
                    }`}
                >
                  <Upload className="mx-auto h-6 w-6 text-slate-500 mb-2" />
                  <p className="text-[10px] text-slate-400">Drag files here or click to browse</p>
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
            )}

            {/* Past logs list */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">Past Trials</h3>
              {loadingHistory ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="skeleton h-11 w-full rounded-xl" />)}
                </div>
              ) : historyList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No past sessions.</p>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {historyList.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleLoadHistoryItem(item)}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${arenaRun?._id === item._id
                          ? "border-[#7C5CFC]/40 bg-[#7C5CFC]/8 text-white"
                          : "border-white/5 bg-white/2 text-slate-400 hover:text-white"
                        }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">
                          {activeTab === "boost" ? item.input.bulletText : item.input.targetRole}
                        </p>
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

          {/* Right Panel: inputs + workspace display */}
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-xl lg:p-7">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#00D4AA]">Optimizations</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Resume Boost & Rebuilder Arena</h1>
              <p className="mt-2 text-sm text-slate-400">
                Enhance single bullet points or trigger complete professional resume rewrites across multiple models.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex border-b border-white/10 mb-6">
                <button
                  onClick={() => handleToggleSubFeature("boost")}
                  className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition ${activeTab === "boost" ? "border-[#7C5CFC] text-[#A78BFA]" : "border-transparent text-slate-400 hover:text-white"
                    }`}
                >
                  <Sparkles className="h-4.5 w-4.5" /> Resume Boost (Bullet)
                </button>
                <button
                  onClick={() => handleToggleSubFeature("rebuilder")}
                  className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition ${activeTab === "rebuilder" ? "border-[#7C5CFC] text-[#A78BFA]" : "border-transparent text-slate-400 hover:text-white"
                    }`}
                >
                  <Wand2 className="h-4.5 w-4.5" /> Resume Rebuilder (Full)
                </button>
              </div>

              <form onSubmit={handleRun} className="space-y-4">
                {activeTab === "boost" ? (
                  <>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300 font-heading">1. Paste Original Bullet Point</label>
                      <textarea
                        rows={3}
                        value={bulletText}
                        onChange={(e) => setBulletText(e.target.value)}
                        placeholder="Paste single bullet point here (e.g. was coding React features)..."
                        className="input-base text-xs resize-none leading-relaxed"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300">2. Target Role (Optional)</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="input-base text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-300">1. Target Job Role</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. SDE II, DevOps Architect..."
                          className="input-base text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-[#8FB3FF]">2. Select Resume Reference</label>
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
                        placeholder="Paste the target JD here to rewrite the resume professionally..."
                        className="input-base text-xs resize-none"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3.5 text-sm flex justify-center items-center gap-1.5"
                >
                  <Wand2 className="h-4.5 w-4.5" />
                  {isLoading ? "Running enhancements..." : activeTab === "boost" ? "Boost Bullet" : "Rebuild Entire Resume"}
                </button>
              </form>
            </div>

            <ArenaWorkspace
              isLoading={isLoading}
              arenaRun={arenaRun}
              onRegenerate={handleRun}
              renderResult={activeTab === "boost" ? renderBoostResult : renderRebuilderResult}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBoostPage;

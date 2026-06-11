// src/components/ui/ArenaWorkspace.jsx — REUSABLE MODEL ARENA WORKSPACE
//
// The central cockpit for comparing multiple Gemini models, visualizing scores,
// displaying custom badge awards (Winner, Fastest, etc.), and rendering comparisons.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Trophy,
  Zap,
  Clock,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Columns,
  Layers,
  Star,
  DollarSign,
  AlertTriangle,
  BadgeAlert,
  ThumbsUp,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";

// Config data matching config/models.js on backend
const MODEL_META = {
  "gemini-2.5-flash-lite": { displayName: "Flash Lite", stars: 4, cost: "$", ratingText: "Fast & Cheap" },
  "gemini-2.5-flash": { displayName: "Gemini 2.5 Flash", stars: 4.5, cost: "$$", ratingText: "Balanced" },
  "gemini-flash-latest": { displayName: "Flash Latest", stars: 4, cost: "$$", ratingText: "Stable Alternative" },
  "gemini-pro": { displayName: "Gemini Pro", stars: 5, cost: "$$$", ratingText: "Deep Analysis" }
};

const ArenaWorkspace = ({
  isLoading,
  arenaRun,
  onRegenerate,
  renderResult,
  downloadHandler
}) => {
  const [activeTab, setActiveTab] = useState("winner"); // "winner", or modelKeys
  const [layoutMode, setLayoutMode] = useState("side-by-side"); // "side-by-side" or "tabs"

  if (isLoading) {
    return (
      <div className="card flex flex-col items-center justify-center p-12 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-[#7C5CFC]/20" />
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#7C5CFC]" />
        </div>
        <p className="mt-6 text-lg font-semibold text-white">Engaging AI Model Arena…</p>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Running Gemini models in parallel, scoring results across grammar, ATS optimization, and recruiter feedback.
        </p>
        <div className="mt-6 w-64 space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#00D4AA]"
            />
          </div>
          <p className="text-[11px] text-slate-500">Retrieving tokens & validating JSON schemas</p>
        </div>
      </div>
    );
  }

  if (!arenaRun) {
    return null;
  }

  const { results = [], winner, bestResults = {}, compareMode } = arenaRun;

  // Resolve target outputs
  const getResultForModel = (modelKey) => results.find(r => r.model === modelKey);
  const winnerResult = getResultForModel(winner);

  // Fallback to first model if winner is null
  const selectedResult = activeTab === "winner" ? winnerResult || results[0] : getResultForModel(activeTab);

  const handleCopy = () => {
    if (!selectedResult || selectedResult.error) {
      toast.error("Nothing to copy");
      return;
    }
    
    // Extract textual version from result output
    const output = selectedResult.output;
    let textToCopy = "";
    if (typeof output === "string") {
      textToCopy = output;
    } else if (output.coverLetter) {
      textToCopy = output.coverLetter;
    } else if (output.improvedResume) {
      textToCopy = output.improvedResume;
    } else {
      textToCopy = JSON.stringify(output, null, 2);
    }

    navigator.clipboard.writeText(textToCopy);
    toast.success("Result copied to clipboard!");
  };

  const handleDownload = () => {
    if (!selectedResult || selectedResult.error) return;
    
    if (downloadHandler) {
      downloadHandler(selectedResult.output, selectedResult.model);
      return;
    }

    // Default downloader
    const output = selectedResult.output;
    const text = typeof output === "string" ? output : JSON.stringify(output, null, 2);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${arenaRun.feature}_${selectedResult.model}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded file successfully!");
  };

  // Render metric progress bar
  const ScoreBar = ({ label, value }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full ${
            value >= 85 ? "bg-emerald-400" : value >= 70 ? "bg-[#7C5CFC]" : "bg-rose-400"
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 page-enter">
      {/* ── SECTION 1: ARENA SCORECARD ── */}
      {compareMode && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-white/10 bg-[#0E0E16]/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00D4AA]">
                <Sparkles className="h-3.5 w-3.5" /> Performance Cockpit
              </span>
              <h2 className="mt-1 text-lg font-semibold text-white">AI Model Scorecard</h2>
            </div>
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setLayoutMode("side-by-side")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  layoutMode === "side-by-side" ? "bg-[#7C5CFC] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Columns className="h-3.5 w-3.5" /> Side-by-Side
              </button>
              <button
                onClick={() => setLayoutMode("tabs")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  layoutMode === "tabs" ? "bg-[#7C5CFC] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> Tabs
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {results.map((res) => {
              const meta = MODEL_META[res.model] || { displayName: res.model, stars: 4, cost: "$$", ratingText: "Gemini Model" };
              const isOverallWinner = bestResults.bestOverall === res.model;
              const isFastest = bestResults.bestSpeed === res.model;
              const isBestATS = bestResults.bestATS === res.model;
              const isBestRecruiter = bestResults.bestRecruiter === res.model;

              return (
                <div
                  key={res.model}
                  className={`relative flex flex-col rounded-2xl border p-5 transition ${
                    isOverallWinner
                      ? "border-[#7C5CFC]/40 bg-[#7C5CFC]/5 shadow-[0_8px_32px_rgba(124,92,252,0.08)]"
                      : "border-white/5 bg-white/2 hover:border-white/10"
                  }`}
                >
                  {/* Badges container */}
                  <div className="absolute -top-3.5 left-4 flex flex-wrap gap-1.5">
                    {isOverallWinner && (
                      <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#00D4AA] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                        <Trophy className="h-2.5 w-2.5" /> Overall Winner
                      </span>
                    )}
                    {isFastest && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/20">
                        <Zap className="h-2.5 w-2.5" /> Fastest
                      </span>
                    )}
                    {isBestATS && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-400/20">
                        Best ATS
                      </span>
                    )}
                    {isBestRecruiter && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-300 border border-blue-400/20">
                        Recruiter Choice
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{meta.displayName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{meta.ratingText}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3 w-3 ${
                              idx < Math.floor(meta.stars)
                                ? "fill-amber-400"
                                : idx < meta.stars
                                ? "fill-amber-400/50"
                                : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">{meta.cost} Cost</span>
                    </div>
                  </div>

                  {res.error ? (
                    <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl bg-red-500/5 border border-red-500/10 p-4 text-center">
                      <BadgeAlert className="h-6 w-6 text-red-400 mb-2" />
                      <p className="text-xs font-semibold text-red-300">Model Failed</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{res.error}</p>
                    </div>
                  ) : (
                    <>
                      {/* Metric scores */}
                      <div className="mt-5 space-y-3.5 flex-1">
                        <ScoreBar label="Grammar Quality" value={res.scores?.grammar || 0} />
                        <ScoreBar label="Readability & Formatting" value={res.scores?.readability || 0} />
                        <ScoreBar label="ATS Keyword Density" value={res.scores?.keywordDensity || 0} />
                        <ScoreBar label="Recruiter Impression" value={res.scores?.professionalism || 0} />
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {(res.executionTime / 1000).toFixed(2)}s</span>
                          <span>{res.tokenUsage?.totalTokens || 0} tokens</span>
                        </div>
                      </div>

                      {/* Overall Rating ring/tag */}
                      <div className="mt-5 flex items-center justify-between rounded-xl bg-white/3 p-3">
                        <span className="text-xs text-slate-400 font-medium">Overall Performance</span>
                        <span className={`text-base font-extrabold ${isOverallWinner ? "text-[#00D4AA]" : "text-white"}`}>
                          {res.scores?.overall || 0}/100
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ── SECTION 2: RESULTS PRESENTATION cockpit ── */}
      <div className="space-y-4">
        {/* Actions bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Winner tab option */}
            <button
              onClick={() => setActiveTab("winner")}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold tracking-wide transition ${
                activeTab === "winner"
                  ? "border-[#7C5CFC]/30 bg-[#7C5CFC]/12 text-[#A78BFA]"
                  : "border-white/5 bg-white/3 text-slate-300 hover:text-white"
              }`}
            >
              <Trophy className="h-3.5 w-3.5" /> Best Result (Winner)
            </button>

            {/* Individual model tabs */}
            {results.map(res => {
              const meta = MODEL_META[res.model] || { displayName: res.model };
              const isWinner = winner === res.model;

              return (
                <button
                  key={res.model}
                  onClick={() => setActiveTab(res.model)}
                  className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                    activeTab === res.model
                      ? "border-[#7C5CFC]/30 bg-[#7C5CFC]/12 text-[#A78BFA]"
                      : "border-white/5 bg-white/3 text-slate-300 hover:text-white"
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5 text-slate-400" /> {meta.displayName}
                  {isWinner && <Trophy className="h-3 w-3 text-amber-400 fill-amber-400/30" />}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary py-2 px-4 flex items-center gap-1.5 text-xs">
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
            <button onClick={handleDownload} className="btn-secondary py-2 px-4 flex items-center gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            {onRegenerate && (
              <button onClick={onRegenerate} className="btn-primary py-2 px-4 flex items-center gap-1.5 text-xs">
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </button>
            )}
          </div>
        </div>

        {/* Output rendering canvas */}
        <AnimatePresence mode="wait">
          {layoutMode === "side-by-side" && compareMode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {results.map(res => {
                const meta = MODEL_META[res.model] || { displayName: res.model };
                const isWinner = winner === res.model;

                return (
                  <div key={res.model} className="space-y-2">
                    <div className="flex items-center justify-between px-3">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                        <Cpu className="h-3.5 w-3.5 text-[#7C5CFC]" /> {meta.displayName}
                      </span>
                      {isWinner && (
                        <span className="flex items-center gap-1 rounded bg-[#00D4AA]/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#00D4AA]">
                          Winner
                        </span>
                      )}
                    </div>

                    <div className="card min-h-[400px] overflow-hidden p-6">
                      {res.error ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-red-300">
                          <AlertTriangle className="h-8 w-8 text-rose-400 mb-2" />
                          <p className="font-semibold">Execution Failed</p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{res.error}</p>
                        </div>
                      ) : (
                        renderResult(res.output, res.model)
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="card min-h-[400px] p-6 lg:p-8"
            >
              {selectedResult?.error ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-red-300">
                  <AlertTriangle className="h-10 w-10 text-rose-400 mb-3" />
                  <p className="font-semibold text-lg">Execution Failed</p>
                  <p className="text-sm text-slate-400 mt-1 max-w-md">{selectedResult.error}</p>
                </div>
              ) : selectedResult?.output ? (
                renderResult(selectedResult.output, selectedResult.model)
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
                  <Cpu className="h-10 w-10 mb-3 animate-pulse text-slate-600" />
                  <p className="font-semibold text-lg">No Results Available</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArenaWorkspace;

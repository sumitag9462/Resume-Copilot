import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScanText, Download, ChevronLeft } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";
import toast from "react-hot-toast";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";

// Phase 10 Components
import UploadExperience from "../components/analyzer/UploadExperience";
import AnalysisDashboard from "../components/analyzer/AnalysisDashboard";
import KeywordIntelligence from "../components/analyzer/KeywordIntelligence";
import RecruiterPerspective from "../components/analyzer/RecruiterPerspective";
import ImprovementRoadmap from "../components/analyzer/ImprovementRoadmap";
import AnalyzerAIAssistant from "../components/analyzer/AnalyzerAIAssistant";
import AnalyzerResumePreview from "../components/analyzer/AnalyzerResumePreview";

const AnalyzerPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || '');
  const [loadingResumes, setLoadingResumes] = useState(true);

  // UX States
  const [showUpload, setShowUpload] = useState(!preselectedId);
  
  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["ats_analysis"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;

  const { selectedModel, compareMode } = useModel();

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("ats_analysis");
    };
  }, [clearRun]);

  useEffect(() => {
    getAllResumes()
      .then((d) => {
        setResumes(d.resumes || []);
        if (d.resumes?.length > 0 && !preselectedId) {
          // If we have resumes but didn't come from one, show the upload/select screen
          setShowUpload(true);
        } else if (preselectedId) {
          // If preselected, trigger analysis automatically (simulated)
          handleAnalyze(preselectedId);
          setShowUpload(false);
        }
      })
      .catch((err) => {
        toast.error("Failed to load resumes");
      })
      .finally(() => setLoadingResumes(false));
  }, [preselectedId]);

  const handleAnalyze = async (resumeId) => {
    if (!resumeId) return;
    setSelectedResumeId(resumeId);
    setShowUpload(false);
    
    await executeRun("ats_analysis", {
      feature: 'ats_analysis',
      inputs: { resumeId },
      model: selectedModel,
      compareMode
    });
  };

  const handleUploadComplete = () => {
    // In a real app, the upload component would return the new resume ID.
    // Here we'll just mock it and trigger the analysis.
    if (resumes.length > 0) {
      handleAnalyze(resumes[0]._id);
    } else {
      handleAnalyze("mock-id");
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // UI Rendering
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen w-full bg-[#0A0B0F] text-slate-300 flex flex-col font-body selection:bg-accent-violet/30 selection:text-white">
      {/* Top Navigation */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#0A0B0F] shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <ScanText className="w-5 h-5 text-accent-violet-light" />
            <h1 className="text-sm font-bold text-white tracking-wide">AI Resume Intelligence</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {arenaRun && (
            <GradientButton className="h-9 px-4 text-xs rounded-xl flex items-center gap-2">
              <Download className="w-3.5 h-3.5" /> Export Report
            </GradientButton>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {showUpload ? (
            <motion.div
              key="upload-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center p-6 bg-[url('/noise.png')] relative"
            >
              <div className="absolute inset-0 bg-[#0A0B0F]/95" />
              <div className="relative z-10 w-full">
                <UploadExperience onUploadComplete={handleUploadComplete} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workspace-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex"
            >
              {/* Left Column: Resume Preview */}
              <div className="w-[400px] hidden xl:flex flex-col border-r border-white/[0.05] bg-[#0A0B0F]">
                <AnalyzerResumePreview />
              </div>

              {/* Middle Column: Analysis Dashboard */}
              <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-8 pb-32">
                <div className="max-w-4xl mx-auto w-full space-y-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                      <div className="w-16 h-16 rounded-2xl bg-accent-violet/10 flex items-center justify-center mb-6">
                        <ScanText className="w-8 h-8 text-accent-violet-light animate-pulse" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Analyzing Resume...</h2>
                      <p className="text-slate-400">Comparing against 10M+ successful profiles.</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <AnalysisDashboard results={arenaRun?.output} />
                      
                      <div className="grid lg:grid-cols-2 gap-6">
                        <RecruiterPerspective feedback={arenaRun?.output?.recruiterFeedback} />
                        <KeywordIntelligence keywords={arenaRun?.output?.keywords} />
                      </div>

                      <ImprovementRoadmap roadmap={arenaRun?.output?.roadmap} />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Assistant Drawer */}
              <div className="w-[380px] hidden lg:flex flex-col border-l border-white/[0.05] bg-[#0A0B0F]">
                <AnalyzerAIAssistant />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyzerPage;
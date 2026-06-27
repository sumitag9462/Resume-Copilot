import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ChevronLeft, LayoutPanelLeft } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/layout/DashboardLayout";
import { getAllResumes } from "../api/resumeApi";
import { useArena } from "../context/ArenaContext";
import { useModel } from "../context/ModelContext";

// Phase 13 Components
import AIInterviewerPanel from "../components/interview/AIInterviewerPanel";
import LiveTranscript from "../components/interview/LiveTranscript";
import InterviewSetup from "../components/interview/InterviewSetup";
import PerformanceDashboard from "../components/interview/PerformanceDashboard";

const InterviewPrepPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || "");
  
  // Setup States
  const [role, setRole] = useState("Software Engineer");
  const [experience, setExperience] = useState("mid");
  const [interviewMode, setInterviewMode] = useState("technical");
  
  // Interaction States
  const [isListening, setIsListening] = useState(false);

  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["interview_prep"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;
  const { selectedModel, compareMode } = useModel();

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("interview_prep");
    };
  }, [clearRun]);

  useEffect(() => {
    getAllResumes().then(res => {
      if (res.success) {
        setResumes(res.resumes || []);
        if (res.resumes?.length > 0 && !preselectedId) {
          setSelectedResumeId(res.resumes[0]._id);
        }
      }
    });
  }, [preselectedId]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedResumeId) return toast.error("Please select a resume.");
    if (!role.trim()) return toast.error("Please enter a target job role.");

    await executeRun("interview_prep", {
      feature: "interview_prep",
      inputs: {
        resumeId: selectedResumeId,
        role,
        experience,
        interviewMode,
        questionCount: 5
      },
      model: selectedModel,
      compareMode
    });
  };

  const currentQuestion = arenaRun?.output?.questions?.[0]?.question;

  return (
    <div className="h-screen w-full bg-[#0A0B0F] text-slate-300 flex flex-col font-body selection:bg-accent-violet/30 selection:text-white">
      {/* Top Navigation */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#0A0B0F] shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-accent-violet-light" />
            <h1 className="text-sm font-bold text-white tracking-wide">AI Interview Copilot</h1>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 overflow-hidden bg-[url('/noise.png')] relative">
        <div className="absolute inset-0 bg-[#0A0B0F]/95" />
        
        <div className="relative z-10 h-full flex flex-col lg:flex-row p-6 gap-6 max-w-[1600px] mx-auto">
          
          {/* Left Column: Setup & AI Panel */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-6 pr-2">
            <AIInterviewerPanel 
              isListening={isListening} 
              setIsListening={setIsListening}
              currentQuestion={currentQuestion}
            />
            <InterviewSetup 
              role={role} setRole={setRole}
              experience={experience} setExperience={setExperience}
              interviewMode={interviewMode} setInterviewMode={setInterviewMode}
              handleGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Middle Column: Live Workspace */}
          <div className="flex-1 flex flex-col min-w-[400px]">
             {(!arenaRun && !isLoading) ? (
               <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-12 bg-white/[0.01]">
                 <div className="w-20 h-20 bg-accent-violet/10 rounded-2xl flex items-center justify-center mb-6">
                   <LayoutPanelLeft className="w-8 h-8 text-accent-violet" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Configure Your Interview</h2>
                 <p className="text-slate-400 max-w-sm">Setup your target role and experience level on the left, then click Start Interview.</p>
               </div>
             ) : isLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 rounded-full border-t-2 border-accent-violet animate-spin mb-4" />
                 <p className="text-white font-bold animate-pulse">Initializing AI Interviewer...</p>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 className="flex flex-col h-full gap-6"
               >
                 <LiveTranscript 
                   questions={arenaRun?.output?.questions} 
                 />
                 
                 {/* Active Question Info Box */}
                 {currentQuestion && (
                   <div className="bg-accent-violet/10 border border-accent-violet/20 rounded-xl p-6">
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-violet-light mb-2">Active Question</h4>
                     <p className="text-sm font-bold text-white leading-relaxed">{currentQuestion}</p>
                   </div>
                 )}
               </motion.div>
             )}
          </div>

          {/* Right Column: Performance Analytics */}
          <div className="w-full lg:w-[350px] flex flex-col">
            <PerformanceDashboard />
          </div>

        </div>
      </div>
    </div>
  );
};

export default InterviewPrepPage;

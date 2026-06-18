import { useState, useEffect, useRef } from 'react';
import { Send, Building, Briefcase, MessageSquare, Copy, CheckCircle2, ChevronDown, AlertCircle, Rocket, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllResumes } from '../api/resumeApi';
import { useArena } from '../context/ArenaContext';
import { useModel } from '../context/ModelContext';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';

const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Direct and respectful' },
  { id: 'enthusiastic', label: 'Enthusiastic', desc: 'High energy and passion' },
  { id: 'casual', label: 'Casual', desc: 'Conversational and relaxed' }
];

const OutreachPage = () => {
  const [formData, setFormData] = useState({
    targetRole: '',
    companyName: '',
    tone: 'professional'
  });
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);

  const { activeRuns, executeRun, clearRun } = useArena();
  const runState = activeRuns["outreach"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun } = runState;
  const result = arenaRun?.results?.[0]?.output || null;
  const { selectedModel, compareMode } = useModel();

  const [copiedSection, setCopiedSection] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (clearRun) clearRun("outreach");
    };
  }, [clearRun]);

  useEffect(() => {
    if ((result || arenaRun?.results?.[0]?.error) && !isLoading && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [result, arenaRun, isLoading]);

  useEffect(() => {
    getAllResumes()
      .then((d) => {
        setResumes(d.resumes || []);
        if (d.resumes?.length > 0) {
          setSelectedResumeId(d.resumes[0]._id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingResumes(false));
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.targetRole || !formData.companyName) {
      toast.error('Please fill in both Role and Company Name.');
      return;
    }
    if (!selectedResumeId) {
      toast.error('Please select a target resume.');
      return;
    }

    await executeRun("outreach", {
      feature: "outreach",
      inputs: {
        resumeId: selectedResumeId,
        ...formData
      },
      model: selectedModel,
      compareMode
    });
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* Premium Header */}
        <GlassCard animated className="mb-8 p-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 shadow-inner">
                <Rocket className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Campaign Builder</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
                Outreach Generator
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Draft highly targeted cold emails and LinkedIn connection requests optimized for recruiter response rates.
              </p>
            </div>

            <div className="hidden lg:flex gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md min-w-[140px]">
                <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-white">Networking</p>
                <p className="text-[10px] text-slate-400 mt-1">High Conversion</p>
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
                    <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-shimmer" />
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-white">Target Parameters</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure your target persona for tailored messaging.</p>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Target Role */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      1. Target Role
                    </label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                      <input
                        type="text"
                        className="w-full h-[56px] rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-[14px] text-white outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
                        placeholder="e.g. Senior Frontend Engineer"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Target Company */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      2. Target Company
                    </label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                      <input
                        type="text"
                        className="w-full h-[56px] rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-[14px] text-white outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
                        placeholder="e.g. Stripe, Google..."
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Base Resume */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      3. Select Base Profile
                    </label>
                    {loadingResumes ? (
                      <div className="skeleton h-[56px] w-full rounded-2xl" />
                    ) : resumes.length === 0 ? (
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
                          className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 cursor-pointer shadow-inner"
                          required
                        >
                          <option value="" className="bg-[#111318]">-- Choose Base Profile --</option>
                          {resumes.map((r) => (
                            <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* Tone Selection */}
                  <div>
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      4. Message Tone
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {TONES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, tone: t.id })}
                          className={`flex flex-col w-full rounded-xl border p-4 text-center transition-all duration-200 ${
                            formData.tone === t.id
                              ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                          }`}
                        >
                          <p className={`text-xs font-bold ${formData.tone === t.id ? 'text-emerald-400' : 'text-slate-300'}`}>{t.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <GradientButton
                  type="submit"
                  disabled={isLoading || resumes.length === 0 || !selectedResumeId}
                  className="w-full h-[60px] text-base bg-gradient-to-r from-[#00D4AA] to-[#00A68A]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Drafting Messages...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-5 w-5" /> Generate Campaign
                    </span>
                  )}
                </GradientButton>
              </GlassCard>
            </form>
          </div>

          {/* Results Workspace */}
          <div className="min-h-[600px] flex flex-col w-full" ref={resultsRef}>
            <AnimatePresence mode="wait">
              {!(result || arenaRun?.results?.[0]?.error || isLoading) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <Send className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Awaiting Parameters</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Configure your parameters on the left and execute the engine to generate targeted networking messages.
                  </p>
                </motion.div>
              ) : isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center text-center mt-16">
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    <Send className="h-8 w-8 text-emerald-400 animate-pulse" />
                  </div>
                  <p className="mt-6 text-[14px] font-bold tracking-[0.2em] uppercase text-emerald-400">Drafting Campaigns...</p>
                </motion.div>
              ) : arenaRun?.results?.[0]?.error ? (
                <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center p-12 text-center card border-rose-500/20 bg-rose-500/5 w-full">
                  <AlertCircle className="h-10 w-10 text-rose-400 mb-3" />
                  <p className="font-semibold text-lg text-rose-300">Input Validation Failed</p>
                  <p className="text-sm text-rose-200/70 mt-2 max-w-md leading-relaxed">{arenaRun.results[0].error}</p>
                </motion.div>
              ) : result ? (
                <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 w-full">
                  
                  {/* Email Draft */}
                  <GlassCard className="p-0 overflow-hidden border border-white/10 relative group hover:border-emerald-500/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                           <span className="font-bold text-slate-500 uppercase tracking-[0.2em] text-[10px] block mb-1">Subject</span>
                           <span className="font-bold text-white text-sm">{result.emailSubject}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(result.emailSubject + '\n\n' + result.emailBody, 'email')}
                        className="flex items-center justify-center rounded-lg p-2.5 text-slate-400 transition-colors bg-white/5 hover:bg-white/10 hover:text-white border border-white/10"
                        title="Copy Email"
                      >
                        {copiedSection === 'email' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="p-8 text-[15px] leading-relaxed text-slate-300 whitespace-pre-wrap font-body relative z-10">
                      {result.emailBody}
                    </div>
                  </GlassCard>

                  {/* LinkedIn Draft */}
                  <GlassCard className="p-0 overflow-hidden border border-white/10 relative group hover:border-[#0077b5]/30 transition-colors">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     
                    <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/20">
                          <Linkedin className="h-5 w-5" />
                        </div>
                        <div>
                           <span className="font-bold text-[#0077b5] uppercase tracking-[0.2em] text-[10px] block mb-1">LinkedIn Connect</span>
                           <span className="font-bold text-white text-sm">Direct Message</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(result.linkedinMessage, 'linkedin')}
                        className="flex items-center justify-center rounded-lg p-2.5 text-slate-400 transition-colors bg-white/5 hover:bg-white/10 hover:text-white border border-white/10"
                        title="Copy LinkedIn Message"
                      >
                        {copiedSection === 'linkedin' ? <CheckCircle2 className="h-4 w-4 text-[#0077b5]" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="p-8 text-[15px] leading-relaxed text-slate-300 whitespace-pre-wrap font-body relative z-10">
                      {result.linkedinMessage}
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 bg-[#0A0B0F] px-8 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Character Limit</span>
                      <span className={`text-xs font-bold ${result.linkedinMessage.length > 300 ? 'text-red-400' : 'text-[#0077b5]'}`}>
                        {result.linkedinMessage.length} / 300
                      </span>
                    </div>
                  </GlassCard>

                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default OutreachPage;

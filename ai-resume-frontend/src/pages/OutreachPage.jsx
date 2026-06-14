import { useState, useEffect } from 'react';
import { Send, Building, Briefcase, MessageSquare, Copy, CheckCircle2, ChevronDown, AlertCircle, Rocket, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllResumes } from '../api/resumeApi';
import { useArena } from '../context/ArenaContext';
import { useModel } from '../context/ModelContext';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import EmptyState from '../components/ui/EmptyState';

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

  const { activeRuns, executeRun } = useArena();
  const runState = activeRuns["outreach"] || { isLoading: false, arenaRun: null };
  const { isLoading, arenaRun: result } = runState;
  const { selectedModel, compareMode } = useModel();

  const [copiedSection, setCopiedSection] = useState(null);

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
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl sm:flex-row sm:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent opacity-40" />
          
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
              <Rocket className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Campaign Builder</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">Outreach Generator</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Draft highly targeted cold emails and LinkedIn connection requests optimized for recruiter response rates.
            </p>
          </div>
        </div>

        {/* Full-width Layout */}
        <div className="flex flex-col gap-8">
          {/* Top Control Form */}
          <form onSubmit={handleGenerate} className="card p-6 sm:p-8 space-y-8">
            <div className="border-b border-white/[0.06] pb-4">
              <h2 className="text-[15px] font-bold text-white">Target Parameters</h2>
              <p className="text-[12px] text-slate-400 mt-1">Configure your target persona for tailored messaging.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Target Role */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  1. Target Role
                </label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type="text"
                    className="input-base pl-11 text-[14px] w-full"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Target Company */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  2. Target Company
                </label>
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type="text"
                    className="input-base pl-11 text-[14px] w-full"
                    placeholder="e.g. Stripe, Google..."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Base Resume */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                3. Select Base Profile
              </label>
              {loadingResumes ? (
                <div className="skeleton h-[52px] w-full rounded-xl" />
              ) : resumes.length === 0 ? (
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
                    <option value="">Choose Base Profile...</option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>{r.originalName}</option>
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
              <div className="grid gap-4 sm:grid-cols-3">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, tone: t.id })}
                    className={`flex flex-col w-full rounded-2xl border p-4 text-center transition-all duration-200 ${
                      formData.tone === t.id
                        ? 'border-emerald-500/50 bg-emerald-500/10 shadow-lg'
                        : 'border-white/[0.06] bg-[#0A0B0F] text-slate-400 hover:border-white/[0.15]'
                    }`}
                  >
                    <p className={`text-[13px] font-bold ${formData.tone === t.id ? 'text-emerald-400' : ''}`}>{t.label}</p>
                    <p className={`text-[11px] mt-1 ${formData.tone === t.id ? 'text-emerald-400/80' : 'text-slate-500'}`}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t border-white/[0.06]">
              <button
                type="submit"
                disabled={isLoading || resumes.length === 0 || !selectedResumeId}
                className={`btn-primary relative w-full h-[56px] text-[15px] overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}
                style={!isLoading ? { backgroundImage: 'linear-gradient(to right, #00D4AA, #00A68A)' } : {}}
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
              </button>
            </div>
          </form>

          {/* Results Area */}
          <div className="w-full">
            <div className="min-h-[600px] flex flex-col w-full">
              <AnimatePresence mode="wait">
                {!result && !isLoading ? (
                  <EmptyState
                    icon={Send}
                    title="Your Outreach Message Will Appear Here"
                    subtitle="Personalized cold outreach crafted from your resume and target role."
                    chips={[
                      { label: "Personalized", color: "violet" },
                      { label: "Concise", color: "teal" },
                      { label: "Recruiter-Ready", color: "amber" }
                    ]}
                  />
                ) : isLoading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center text-center mt-16">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                      <Send className="h-8 w-8 text-emerald-400 animate-pulse" />
                    </div>
                    <p className="mt-6 text-[14px] font-bold tracking-[0.2em] uppercase text-emerald-400">Drafting Campaigns...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 w-full">
                    
                    {/* Email Draft */}
                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <h3 className="text-[15px] font-bold text-white uppercase tracking-widest">Cold Email Draft</h3>
                      </div>
                      
                      <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E101A] shadow-lg transition-colors hover:border-emerald-500/30">
                        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0A0B0F] px-5 py-3.5">
                          <div className="text-[13px]">
                            <span className="font-bold text-slate-500 uppercase tracking-widest mr-3">Subject</span>
                            <span className="font-bold text-white">{result.emailSubject}</span>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(result.emailSubject + '\n\n' + result.emailBody, 'email')}
                            className="flex items-center justify-center rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-white"
                            title="Copy Email"
                          >
                            {copiedSection === 'email' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="p-5 text-[14px] leading-relaxed text-slate-300 whitespace-pre-wrap font-body">
                          {result.emailBody}
                        </div>
                      </div>
                    </div>

                    {/* LinkedIn Draft */}
                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0077b5]/10 text-[#0077b5]">
                          <Linkedin className="h-4 w-4" />
                        </div>
                        <h3 className="text-[15px] font-bold text-white uppercase tracking-widest">LinkedIn Connect</h3>
                      </div>
                      
                      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E101A] shadow-lg transition-colors hover:border-[#0077b5]/30">
                        <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                          <button 
                            onClick={() => copyToClipboard(result.linkedinMessage, 'linkedin')}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 backdrop-blur-md transition-colors hover:bg-[#0077b5]/20 hover:text-[#0077b5]"
                            title="Copy LinkedIn Message"
                          >
                            {copiedSection === 'linkedin' ? <CheckCircle2 className="h-4 w-4 text-[#0077b5]" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="p-5 pr-14 text-[14px] leading-relaxed text-slate-300 whitespace-pre-wrap font-body">
                          {result.linkedinMessage}
                        </div>
                        <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#0A0B0F] px-5 py-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Character Limit</span>
                          <span className={`text-[11px] font-bold ${result.linkedinMessage.length > 300 ? 'text-red-400' : 'text-[#0077b5]'}`}>
                            {result.linkedinMessage.length} / 300
                          </span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OutreachPage;

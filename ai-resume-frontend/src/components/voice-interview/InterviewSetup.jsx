// =============================================================
// src/components/voice-interview/InterviewSetup.jsx
//
// Full-screen setup form for the AI voice interview.
// Collects: Resume, Job Description, Company Name
// Features: Resume dropdown, JD textarea, company autocomplete,
// browser compatibility check, animated entrance.
// =============================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic, FileText, Building2, Briefcase, AlertCircle, ChevronDown, Sparkles, Shield, Zap, Brain, Settings2, Languages, Users, Code2, Phone, UserCheck
} from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '../ui/GlassCard'
import GradientButton from '../ui/GradientButton'
import { getAllResumes } from '../../api/resumeApi'
import { useVoiceInterview } from '../../context/VoiceInterviewContext'

const COMPANY_SUGGESTIONS = [
  'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix', 'Adobe',
  'Atlassian', 'Uber', 'Stripe', 'Shopify', 'Salesforce', 'Oracle',
  'IBM', 'Intel', 'Nvidia', 'Tesla', 'Twitter/X', 'LinkedIn', 'Spotify',
  'Airbnb', 'Snap', 'Pinterest', 'Dropbox', 'Figma', 'Vercel', 'Datadog',
  'Cloudflare', 'MongoDB', 'Twilio', 'Square', 'Palantir', 'Databricks',
  'Coinbase', 'Robinhood', 'DoorDash', 'Instacart', 'Notion', 'Canva'
]

const InterviewSetup = () => {
  const { handleStartInterview, isLoading, error } = useVoiceInterview()

  const [resumes, setResumes] = useState([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [pastedResume, setPastedResume] = useState('')
  const [resumeMode, setResumeMode] = useState('upload') // 'upload' | 'paste'
  const [jobDescription, setJobDescription] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [interviewType, setInterviewType] = useState('Technical')
  const [language, setLanguage] = useState('English')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

  const INTERVIEW_TYPES = [
    { id: 'Technical', title: 'Technical', icon: Code2, desc: 'DSA, System Design, Architecture' },
    { id: 'Behavioral', title: 'Behavioral', icon: Users, desc: 'STAR format, Leadership, Conflict' },
    { id: 'Recruiter', title: 'Recruiter Screen', icon: Phone, desc: 'Background, Motivation, Fit' },
    { id: 'Hiring Manager', title: 'Hiring Manager', icon: UserCheck, desc: 'Ownership, Impact, Deep-dive' }
  ]

  // Browser support check
  const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  const hasSpeechSynthesis = !!window.speechSynthesis

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const res = await getAllResumes()
      if (res.success) {
        setResumes(res.resumes || [])
        if (res.resumes?.length > 0) {
          setSelectedResumeId(res.resumes[0]._id)
        }
      }
    } catch (err) {
      toast.error('Failed to load resumes');
      console.error('Failed to load resumes:', err)
    } finally {
      setLoadingResumes(false)
    }
  }

  const handleCompanyChange = (e) => {
    const value = e.target.value
    setCompanyName(value)
    if (value.length > 0) {
      const filtered = COMPANY_SUGGESTIONS.filter(c =>
        c.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (company) => {
    setCompanyName(company)
    setShowSuggestions(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Safari requires TTS to be triggered synchronously by a user gesture first.
    // Priming the speech synthesis engine with a whitespace utterance unlocks it for async use later.
    if (hasSpeechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(' ')
      utterance.volume = 0
      window.speechSynthesis.speak(utterance)
    }

    // Validation
    if (resumeMode === 'upload' && !selectedResumeId) {
      return toast.error('Please select a resume.')
    }
    if (resumeMode === 'paste' && (!pastedResume || pastedResume.trim().length < 50)) {
      return toast.error('Please paste a valid resume (at least 50 characters).')
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return toast.error('Please provide a job description (at least 20 characters).')
    }
    if (!companyName || companyName.trim().length < 1) {
      return toast.error('Please enter a company name.')
    }

    try {
      // Determine if company is a special mode
      const faangList = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Stripe', 'OpenAI', 'Adobe'];
      const exactMatch = faangList.find(c => c.toLowerCase() === companyName.trim().toLowerCase());
      
      await handleStartInterview({
        resumeId: resumeMode === 'upload' ? selectedResumeId : undefined,
        resumeText: resumeMode === 'paste' ? pastedResume : undefined,
        jobDescription,
        companyName,
        interviewType,
        language,
        companyMode: exactMatch || 'General'
      })
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to start interview')
    }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto"
    >
      {/* Hero Header */}
      <motion.div variants={fadeUp} className="text-center mb-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          <Mic className="h-4 w-4 text-violet-400" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">AI Voice Interview</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Prepare for Your <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Dream Interview</span>
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
          Our AI interviewer simulates a senior recruiter conducting a real-time, personalized interview
          based on your resume and the target job description.
        </p>
      </motion.div>

      {/* Browser Compatibility Warning */}
      {!hasSpeechRecognition && (
        <motion.div variants={fadeUp}>
          <GlassCard className="mb-6 p-4 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-200">Speech Recognition Not Supported</p>
                <p className="text-xs text-amber-300/70 mt-1">
                  Your browser doesn't support voice input. For the best experience, please use <strong>Google Chrome</strong>.
                  You can still type your answers during the interview.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Feature Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Brain, title: 'Adaptive AI', desc: 'Questions adapt to your skill level in real-time', color: 'violet' },
          { icon: Shield, title: 'Hidden Scoring', desc: '10-dimension evaluation revealed after interview', color: 'emerald' },
          { icon: Zap, title: 'Voice Powered', desc: 'Natural conversation with speech recognition', color: 'amber' }
        ].map((feat, i) => (
          <GlassCard key={i} className="p-5 group hover:border-white/10 transition-all duration-300">
            <div className={`inline-flex p-2.5 rounded-xl bg-${feat.color}-500/10 border border-${feat.color}-500/20 mb-3`}
                 style={{ background: `rgba(var(--${feat.color}), 0.1)` }}>
              <feat.icon className={`h-5 w-5`} style={{ color: feat.color === 'violet' ? '#a78bfa' : feat.color === 'emerald' ? '#34d399' : '#fbbf24' }} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">{feat.desc}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Main Form */}
      <motion.form variants={fadeUp} onSubmit={handleSubmit}>
        <GlassCard className="p-8 md:p-10">
          {isLoading && (
            <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-white/[0.02] rounded-t-3xl z-50">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-shimmer" />
            </div>
          )}

          <div className="space-y-8">
            {/* Section 1: Resume */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <FileText className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Resume</h2>
                  <p className="text-[11px] text-slate-500">Select or paste your resume for context</p>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex gap-2 mb-4">
                {['upload', 'paste'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setResumeMode(mode)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                      resumeMode === mode
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                        : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10 hover:text-slate-300'
                    }`}
                  >
                    {mode === 'upload' ? 'Select Resume' : 'Paste Text'}
                  </button>
                ))}
              </div>

              {resumeMode === 'upload' ? (
                loadingResumes ? (
                  <div className="skeleton h-[56px] w-full rounded-2xl" />
                ) : resumes.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <p className="text-[13px] text-amber-200">
                      No resumes uploaded. <Link to="/resumes" className="font-bold underline hover:text-amber-100">Upload one</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 cursor-pointer shadow-inner"
                      required={resumeMode === 'upload'}
                    >
                      <option value="" className="bg-[#111318]">-- Choose Resume --</option>
                      {resumes.map(r => (
                        <option key={r._id} value={r._id} className="bg-[#111318]">{r.originalName}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                )
              ) : (
                <textarea
                  rows={6}
                  value={pastedResume}
                  onChange={(e) => setPastedResume(e.target.value)}
                  placeholder="Paste your full resume text here..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-[14px] text-slate-200 outline-none transition-all focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 resize-none shadow-inner placeholder:text-slate-600"
                />
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.04]" />

            {/* Section 2: Job Description */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Briefcase className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Job Description</h2>
                  <p className="text-[11px] text-slate-500">Paste the target role's JD for tailored questions</p>
                </div>
              </div>

              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. The AI will use this to ask targeted, relevant questions..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-[14px] text-slate-200 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none shadow-inner placeholder:text-slate-600"
                required
              />
              <div className="mt-2 text-right">
                <span className={`text-[10px] font-bold tracking-wider ${jobDescription.length < 20 ? 'text-slate-600' : 'text-emerald-500/60'}`}>
                  {jobDescription.length} characters
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.04]" />

            {/* Section 3: Company Name */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Building2 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Company</h2>
                  <p className="text-[11px] text-slate-500">The company you're interviewing for</p>
                </div>
              </div>

              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors peer-focus:text-blue-400 pointer-events-none" />
                <input
                  type="text"
                  value={companyName}
                  onChange={handleCompanyChange}
                  onFocus={() => {
                    if (companyName.length > 0) {
                      const filtered = COMPANY_SUGGESTIONS.filter(c =>
                        c.toLowerCase().includes(companyName.toLowerCase())
                      )
                      setShowSuggestions(filtered.length > 0)
                      setFilteredSuggestions(filtered)
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="e.g. Google, Amazon, Microsoft..."
                  className="peer w-full h-[56px] rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-[14px] text-white outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 shadow-inner"
                  required
                />

                {/* Autocomplete Suggestions */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-[#111318]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredSuggestions.slice(0, 8).map((company, i) => (
                      <button
                        key={company}
                        type="button"
                        onMouseDown={() => selectSuggestion(company)}
                        className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors flex items-center gap-3 border-b border-white/[0.03] last:border-0"
                      >
                        <Building2 className="h-3.5 w-3.5 text-blue-400/60" />
                        {company}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <p className="text-[13px] text-rose-200">{error}</p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/[0.04]" />

            {/* Section 4: Interview Configuration */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Settings2 className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Interview Settings</h2>
                  <p className="text-[11px] text-slate-500">Customize the AI persona and language</p>
                </div>
              </div>

              {/* Interview Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {INTERVIEW_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInterviewType(type.id)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                      interviewType === type.id
                        ? 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${interviewType === type.id ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-slate-400'}`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${interviewType === type.id ? 'text-white' : 'text-slate-300'}`}>
                        {type.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {type.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Language Selector */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="h-4 w-4 text-slate-400" />
                  <label className="text-sm font-bold text-slate-300">Language</label>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-[56px] appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-[14px] text-white outline-none transition-all focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 cursor-pointer shadow-inner"
                >
                  <option value="English" className="bg-[#111318]">English</option>
                  <option value="Spanish" className="bg-[#111318]">Spanish (Español)</option>
                  <option value="French" className="bg-[#111318]">French (Français)</option>
                  <option value="German" className="bg-[#111318]">German (Deutsch)</option>
                  <option value="Hindi" className="bg-[#111318]">Hindi (हिन्दी)</option>
                  <option value="Mandarin" className="bg-[#111318]">Mandarin (中文)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 bottom-4 h-4 w-4 text-slate-500" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.04]" />

            {/* Submit */}
            <GradientButton
              type="submit"
              disabled={isLoading || (resumeMode === 'upload' && !selectedResumeId && resumes.length > 0)}
              className="w-full h-[64px] text-base bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Initializing Interview...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  Start AI Interview
                </span>
              )}
            </GradientButton>
          </div>
        </GlassCard>
      </motion.form>
    </motion.div>
  )
}

export default InterviewSetup

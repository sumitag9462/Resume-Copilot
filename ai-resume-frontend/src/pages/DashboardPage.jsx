import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowRight, 
  BrainCircuit, 
  Briefcase, 
  FileText, 
  ScanText, 
  Sparkles, 
  UploadCloud, 
  Target, 
  Files, 
  Split, 
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getAllResumes } from '../api/resumeApi';
import { getDashboardStats } from '../api/analysisApi';

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  useEffect(() => {
    Promise.all([
      getAllResumes().then((d) => setResumes(d.resumes || [])),
      getDashboardStats().then((d) => setStats(d.stats || null))
    ])
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-8">
        
        {/* ── 1. WELCOME HERO CARD ── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#11131E] via-[#0E101A] to-[#0A0B10] p-6 lg:p-8">
          <div className="absolute right-0 top-0 w-96 h-96 bg-accent-violet/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-teal">
                  <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                {resumes.length > 0 
                  ? `You have ${resumes.length} ${resumes.length === 1 ? 'resume' : 'resumes'} ready for ATS audits, job matching, and interview practice.`
                  : "Upload your resume in PDF or DOCX to run your first ATS audit and discover missing keywords."}
              </p>
            </div>
            
            <Link
              to="/resumes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(124,111,247,0.3)] hover:opacity-90 transition-opacity shrink-0 self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume</span>
            </Link>
          </div>
        </div>

        {/* ── 2. REAL METRICS BAR ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Resumes */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resumes</span>
              <div className="p-2 rounded-xl bg-accent-teal/10 text-accent-teal">
                <Files className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-white">{resumes.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              {resumes.length > 0 ? `${resumes.length} active in workspace` : 'Upload your first resume'}
            </p>
          </div>

          {/* Metric 2: ATS Score */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best ATS Score</span>
              <div className="p-2 rounded-xl bg-accent-violet/10 text-accent-violet">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-white">
              {stats?.atsScore > 0 ? `${stats.atsScore}%` : (resumes.length > 0 ? 'Ready to Scan' : '—')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {stats?.atsScore > 0 ? 'Highest evaluated score' : 'Run ATS Audit to calculate'}
            </p>
          </div>

          {/* Metric 3: Cover Letters */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cover Letters</span>
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-white">
              {stats?.totalCoverLetters || 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Custom tailored letters
            </p>
          </div>

          {/* Metric 4: AI Status */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Copilot</span>
              <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-2xl font-bold font-display text-white">Active</p>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time career mentor
            </p>
          </div>
        </div>

        {/* ── 3. MAIN SECTION (2 COLUMNS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Resumes & Tools */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Recent Resumes Card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white font-display">Your Resumes</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage and run AI actions on your documents</p>
                </div>
                <Link
                  to="/resumes"
                  className="text-xs font-semibold text-accent-violet hover:text-accent-teal transition-colors flex items-center gap-1"
                >
                  Manage All ({resumes.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
                  <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 mb-3">
                    <Files className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">No resumes uploaded yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Upload your resume in PDF or DOCX format to unlock ATS scoring, job description matching, and AI bullet optimization.
                  </p>
                  <Link
                    to="/resumes"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.1] transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-accent-teal" />
                    <span>Upload Resume</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.slice(0, 3).map((resume) => (
                    <div 
                      key={resume._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-accent-violet/10 border border-accent-violet/20 text-accent-violet-light shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{resume.filename || 'Untitled Resume'}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Uploaded {formatDate(resume.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <Link
                          to={`/analyzer?resumeId=${resume._id}`}
                          className="px-2.5 py-1.5 rounded-lg border border-accent-violet/30 bg-accent-violet/10 text-xs font-semibold text-accent-violet-light hover:bg-accent-violet/20 transition-colors"
                        >
                          ATS Audit
                        </Link>
                        <Link
                          to={`/jd-match?resumeId=${resume._id}`}
                          className="px-2.5 py-1.5 rounded-lg border border-accent-teal/30 bg-accent-teal/10 text-xs font-semibold text-accent-teal hover:bg-accent-teal/20 transition-colors"
                        >
                          JD Match
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Tools Suite (2x2 Grid) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h2 className="text-base font-bold text-white font-display">AI Career Tools</h2>
                  <p className="text-xs text-slate-400">Launch specialized AI workflows for your resume</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tool 1 */}
                <Link
                  to="/analyzer"
                  className="group p-5 rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 hover:border-accent-violet/40 hover:bg-[#121422] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet-light mb-3 group-hover:scale-105 transition-transform">
                      <ScanText className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-violet-light transition-colors">
                      ATS Resume Analyzer
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Evaluate parser readability, keyword density, and get section-by-section scoring.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-accent-violet flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                    Launch Analyzer <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>

                {/* Tool 2 */}
                <Link
                  to="/jd-match"
                  className="group p-5 rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 hover:border-accent-teal/40 hover:bg-[#121422] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal mb-3 group-hover:scale-105 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-teal transition-colors">
                      Job Description Matcher
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Paste any job description to discover missing required skills and target alignment.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-accent-teal flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                    Match Job Description <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>

                {/* Tool 3 */}
                <Link
                  to="/resume-boost"
                  className="group p-5 rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 hover:border-accent-violet/40 hover:bg-[#121422] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet-light mb-3 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-violet-light transition-colors">
                      AI Resume Boost
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Rewrite weak experience bullet points into high-impact, quantifiable STAR statements.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-accent-violet flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                    Boost Bullets <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>

                {/* Tool 4 */}
                <Link
                  to="/cover-letter"
                  className="group p-5 rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 hover:border-amber-400/40 hover:bg-[#121422] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Cover Letter Generator
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Generate tailored, role-specific cover letters mapped directly to your experience.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                    Draft Letter <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: Copilot & Actions */}
          <div className="flex flex-col gap-5">
            
            {/* Copilot Spotlight Card */}
            <div className="relative overflow-hidden rounded-2xl border border-accent-violet/30 bg-gradient-to-br from-accent-violet/15 via-[#0E101A] to-[#0A0B10] p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-accent-violet/20 text-accent-violet">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">AI Career Copilot</h3>
                  <span className="text-[10px] uppercase tracking-wider text-accent-teal font-semibold">Interactive Chat</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chat in real-time with our streaming AI mentor to refine your resume bullet points, prepare for interviews, and get immediate feedback.
              </p>
              <Link
                to="/copilot"
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-md"
              >
                <span>Start Chat with Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Interview Prep Roadmap Card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent-violet/10 text-accent-violet">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">Interview Simulator</h3>
                    <p className="text-[11px] text-slate-500">Practice Q&A</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded-full border border-accent-teal/20">
                  Roadmap
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Interactive voice & behavioral mock interview simulator (in active engineering for Phase 2).
              </p>
              <Link
                to="/interview-prep"
                className="mt-3 text-xs font-semibold text-accent-violet hover:text-accent-teal transition-colors inline-flex items-center gap-1"
              >
                View Roadmap & Architecture <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Resume Comparison Card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E101A]/80 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-accent-teal/10 text-accent-teal">
                  <Split className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Resume Compare (A/B)</h3>
                  <p className="text-[11px] text-slate-500">A/B Testing</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Compare two versions of your resume side-by-side to choose the strongest one.
              </p>
              <Link
                to="/resume-comparison"
                className="mt-3 text-xs font-semibold text-accent-teal hover:text-accent-violet-light transition-colors inline-flex items-center gap-1"
              >
                Compare Resumes <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

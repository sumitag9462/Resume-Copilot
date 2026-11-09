import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, Mail, HelpCircle, Edit3, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const ctaLink = isAuthenticated ? '/dashboard' : '/register';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] transition-colors">
      <PublicNavbar />

      <main className="flex-1">
        {/* ── 1. HERO SECTION ── */}
        <section className="py-20 sm:py-28 lg:py-32 border-b border-[#E5E7EB] dark:border-[#334155]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC] leading-[1.15]">
                Improve Your Resume with AI
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#64748B] dark:text-[#CBD5E1] leading-relaxed max-w-2xl">
                Analyze your resume, compare it with job descriptions, and get practical suggestions to improve your applications.
              </p>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to={ctaLink}
                  className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-[#F8FAFC] dark:hover:bg-[#172033] text-[#111827] dark:text-[#F8FAFC] text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. THE PROBLEM SECTION ── */}
        <section className="py-16 sm:py-24 border-b border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033]/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                Make Resume Improvements Easier
              </h2>
              <div className="mt-6 space-y-4 text-base text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                <p>
                  Preparing a resume for different job applications can take time. It's not always obvious which skills to highlight, what information is missing, or how closely your resume matches a particular role.
                </p>
                <p>
                  Resume Copilot brings these tasks into one place and provides AI-assisted feedback to help you review your application.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. FEATURES SECTION ── */}
        <section id="features" className="py-20 sm:py-28 border-b border-[#E5E7EB] dark:border-[#334155]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                What You Can Do
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#64748B] dark:text-[#CBD5E1]">
                Tools to help review, adapt, and improve your resume.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033] transition-colors">
                <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 dark:bg-[#60A5FA]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Resume Analysis
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Review your resume's content, structure, and areas that could be improved.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033] transition-colors">
                <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 dark:bg-[#60A5FA]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Job Description Matching
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Compare your resume against a job description to identify relevant skills and potential gaps.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033] transition-colors">
                <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 dark:bg-[#60A5FA]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Cover Letter Generator
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Create a tailored cover-letter draft using your resume and the role you're applying for.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033] transition-colors">
                <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 dark:bg-[#60A5FA]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center mb-4">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Interview Preparation
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Generate practice questions based on your resume and target role.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033] transition-colors">
                <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 dark:bg-[#60A5FA]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center mb-4">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Resume Improvement
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Get suggestions for clearer, more effective descriptions of your experience and projects.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033] transition-colors">
                <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 dark:bg-[#60A5FA]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  AI Copilot
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Ask follow-up questions and explore suggestions about your resume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS SECTION ── */}
        <section id="how" className="py-20 sm:py-28 border-b border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033]/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                How Resume Copilot Works
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#64748B] dark:text-[#CBD5E1]">
                A simple three-step workflow to review and improve your resume.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A]">
                <span className="text-xs font-mono font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-wider uppercase">
                  Step 01
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Upload Your Resume
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Upload your resume in PDF or DOCX format.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A]">
                <span className="text-xs font-mono font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-wider uppercase">
                  Step 02
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Choose a Tool
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Select resume analysis, job matching, cover-letter drafting, or another available feature.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A]">
                <span className="text-xs font-mono font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-wider uppercase">
                  Step 03
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                  Review Your Results
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  Read the generated feedback and decide which improvements to apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. WHAT TO EXPECT / PRACTICAL LIMITATIONS ── */}
        <section className="py-20 sm:py-28 border-b border-[#E5E7EB] dark:border-[#334155]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                Useful Feedback, With You in Control
              </h2>
              <div className="mt-6 space-y-4 text-base text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                <p>
                  Resume Copilot provides AI-generated suggestions to help you review your applications.
                </p>
                <p>
                  You can use the feedback as a starting point, make your own decisions, and confirm the accuracy of any changes before submitting your resume.
                </p>
              </div>

              <div className="mt-8 p-4 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#172033] text-sm text-[#64748B] dark:text-[#CBD5E1]">
                <strong className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Please note: </strong>
                AI-generated scores and suggestions are estimates, not guarantees of hiring outcomes.
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. FINAL CALL TO ACTION ── */}
        <section className="py-20 sm:py-28 bg-[#F8FAFC] dark:bg-[#172033]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                Ready to Review Your Resume?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#CBD5E1]">
                Get started with Resume Copilot and explore the available tools.
              </p>
              <div className="mt-8">
                <Link
                  to={ctaLink}
                  className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

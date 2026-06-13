// ═══════════════════════════════════════════════════════════════
// src/pages/LandingPage.jsx — PREMIUM AI SaaS HOMEPAGE
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  FileText,
  Github,
  Linkedin,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UploadCloud,
  Zap,
  Check,
  BrainCircuit,
  Users,
  Activity
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)



/* ── ANIMATION VARIANTS ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── SECTION WRAPPER (scroll reveal) ────────────────────────── */
const Section = ({ children, className = '', id }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ── DATA ────────────────────────────────────────────────────── */
const badges = [
  'ATS Resume Analysis',
  'JD Match',
  'AI Cover Letter',
  'Resume Suggestions',
]

const featureCards = [
  {
    icon: BarChart3,
    title: 'ATS Score Analysis',
    desc: 'Instant ATS compatibility scoring with keyword gaps, formatting checks, and section-by-section coaching.',
    tint: 'from-[#7C5CFC] to-[#5B8FFF]',
  },
  {
    icon: Briefcase,
    title: 'JD Match Score',
    desc: 'Paste any job description and see precisely how well your resume aligns with every requirement.',
    tint: 'from-[#5B8FFF] to-[#00D4AA]',
  },
  {
    icon: FileText,
    title: 'AI Cover Letter',
    desc: 'Generate a tailored cover letter in professional, startup, or creative style — in one click.',
    tint: 'from-[#00D4AA] to-[#059669]',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Full analysis in seconds with zero friction and clear next steps to improve your chances.',
    tint: 'from-[#F59E0B] to-[#F97316]',
  },
  {
    icon: BrainCircuit,
    title: 'Interview Prep',
    desc: 'AI-generated technical and behavioral questions personalized to your resume and target role.',
    tint: 'from-[#8B5CF6] to-[#7C5CFC]',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    desc: 'Your data is encrypted and stored safely. Resume history stays accessible whenever you need it.',
    tint: 'from-[#EF4444] to-[#7C5CFC]',
  },
]

const steps = [
  {
    number: '01',
    icon: UploadCloud,
    title: 'Upload Your Resume',
    desc: 'Drag and drop your PDF or DOCX resume — our AI parser extracts every section intelligently.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Get Instant Analysis',
    desc: 'Receive ATS scores, keyword gaps, formatting insights, and actionable suggestions in seconds.',
  },
  {
    number: '03',
    icon: Trophy,
    title: 'Land Interviews',
    desc: 'Apply with confidence. Match job descriptions, generate cover letters, prep for interviews, and win.',
  },
]

const testimonials = [
  { quote: 'The ATS score jumped from 54 to 89 and I got 3 interview calls in 2 weeks.', author: 'Rahul S.', role: 'Software Engineer', company: 'Google', initials: 'RS' },
  { quote: 'The JD match feature told me exactly which keywords I was missing for every role.', author: 'Priya M.', role: 'Product Manager', company: 'Amazon', initials: 'PM' },
  { quote: 'Cover letter AI saved me hours. The startup tone felt genuinely polished.', author: 'Arjun K.', role: 'UX Designer', company: 'Figma', initials: 'AK' },
  { quote: 'It gave me an honest ATS check — exactly what I needed to improve fast.', author: 'Vikram D.', role: 'Backend Developer', company: 'Stripe', initials: 'VD' },
  { quote: 'I used 4 resume versions and tracked which one performed best for different roles.', author: 'Meera J.', role: 'Business Analyst', company: 'Microsoft', initials: 'MJ' },
  { quote: 'From zero responses to interview invites — the insights were concrete and actionable.', author: 'Sneha T.', role: 'Data Analyst', company: 'Meta', initials: 'ST' },
]

const freeFeatures = ['3 resume uploads', 'ATS analysis', 'JD match scoring', 'Email support']
const proFeatures = ['Unlimited uploads', 'ATS + JD Match', 'AI Cover Letters', 'Resume History', 'Interview Prep', 'Export PDF', 'Priority Support', 'Cold Outreach AI']

const logos = ['Google', 'Amazon', 'Microsoft', 'Stripe', 'Meta', 'Notion']

/* ═══════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════ */
const Hero = () => {
  const wordsRef = useRef([])

  useEffect(() => {
    if (wordsRef.current.length > 0) {
      gsap.fromTo(
        wordsRef.current,
        { y: 100, opacity: 0, rotateX: 90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.08, ease: 'back.out(1.7)' }
      )
    }
  }, [])

  return (
    <section className="landing-shell relative isolate overflow-hidden min-h-[100dvh]">

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-7xl items-center px-6 pt-24 pb-20 lg:px-8">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] xl:gap-20">
          {/* ── LEFT: Copy ── */}
          <div className="space-y-8 text-left">
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
              <span className="glow-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-slate-400 bg-white/[0.03] border border-white/[0.05]">
                <Sparkles className="h-3.5 w-3.5 text-accent-teal" />
                AI-Powered Career Platform
              </span>
            </motion.div>

            <div className="space-y-3" style={{ perspective: '800px' }}>
              <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-[72px] leading-[1.04] font-display">
                <span ref={el => wordsRef.current[0] = el} className="inline-block">Your</span>{' '}
                <span ref={el => wordsRef.current[1] = el} className="inline-block">AI</span>{' '}
                <span ref={el => wordsRef.current[2] = el} className="inline-block">Career</span>
                <br />
                <span ref={el => wordsRef.current[3] = el} className="inline-block gradient-text">Co-Pilot</span>
              </h1>
              <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="max-w-xl text-lg leading-relaxed text-slate-400 lg:text-[19px]">
                Analyze your resume for ATS compatibility, match it against job descriptions, and generate tailored cover letters — all in seconds.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="flex flex-wrap gap-2.5">
              {badges.map((b) => (
                <span
                  key={b}
                  className="glow-badge inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-slate-400 bg-white/[0.03] border border-white/[0.05]"
                >
                  <Check className="h-3.5 w-3.5 text-accent-teal" />
                  {b}
                </span>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, rotateX: 45, y: 40 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/register"
                className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-accent-violet to-accent-teal px-8 text-[15px] font-semibold text-white shadow-[0_0_32px_rgba(124,111,247,0.3)] transition-all duration-300 hover:shadow-[0_0_48px_rgba(124,111,247,0.45)] hover:scale-[1.03] active:scale-[0.98]"
              >
                Start for Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.98]"
              >
                See How It Works
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Dashboard Preview ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="glass-panel card relative rounded-3xl border border-white/[0.08] p-7 overflow-hidden bg-surface/80 backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-violet/30 via-accent-teal/30 to-transparent" />
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="rounded-full bg-accent-teal/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-teal">
                  ATS Optimized ✓
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'ATS Score', value: '87', accent: 'text-accent-teal' },
                  { label: 'Job Match', value: '73%', accent: 'text-accent-violet' },
                  { label: 'Skills', value: '12', accent: 'text-[#5B8FFF]' },
                ].map((item) => (
                  <article key={item.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-center">
                    <p className={`font-display text-[30px] font-bold ${item.accent}`}>{item.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  </article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STATS SECTION
   ═══════════════════════════════════════════════════════════════ */
const StatsCounter = () => {
  const sectionRef = useRef(null)
  const c1 = useRef(null)
  const c2 = useRef(null)
  const c3 = useRef(null)

  useEffect(() => {
    if (!c1.current || !c2.current || !c3.current) return;
    
    gsap.to([c1.current, c2.current, c3.current], {
      textContent: (i, t) => t.dataset.target,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%'
      }
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-base border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="card rounded-3xl border border-white/[0.06] bg-surface p-8 text-center">
            <div className="flex items-center justify-center text-4xl font-display font-bold text-white mb-2">
              <span ref={c1} data-target="250000">0</span>+
            </div>
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Resumes Optimized</p>
          </div>
          <div className="card rounded-3xl border border-white/[0.06] bg-surface p-8 text-center">
            <div className="flex items-center justify-center text-4xl font-display font-bold text-accent-violet mb-2">
              <span ref={c2} data-target="92">0</span>%
            </div>
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Interview Rate</p>
          </div>
          <div className="card rounded-3xl border border-white/[0.06] bg-surface p-8 text-center">
            <div className="flex items-center justify-center text-4xl font-display font-bold text-accent-teal mb-2">
              <span ref={c3} data-target="15000">0</span>+
            </div>
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Offers Accepted</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SOCIAL PROOF / MARQUEE
   ═══════════════════════════════════════════════════════════════ */
const SocialProof = () => (
  <section className="border-y border-white/[0.04] bg-surface/50 py-16 overflow-hidden">
    <div className="marquee-wrapper mx-auto max-w-7xl flex flex-col items-center gap-6 px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-medium">Trusted by job seekers targeting</p>
      <div className="marquee-track flex flex-wrap items-center justify-center gap-3">
        {logos.map((logo) => (
          <div key={logo} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-[16px] font-semibold text-slate-400/80 transition-colors duration-200 hover:text-white hover:border-white/10">
            {logo}
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ═══════════════════════════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════════════════════════ */
const Features = () => {
  return (
    <Section id="features" className="section-shell py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p variants={fadeUp} custom={0} className="text-[11px] uppercase tracking-[0.3em] text-accent-violet font-semibold">
            Everything you need
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="mt-5 font-display text-4xl font-bold text-white md:text-5xl lg:text-[52px] tracking-tight">
            Stop guessing.<br className="hidden sm:block" /> Start landing.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto">
            AI tools that give you the honest feedback a career coach would — in seconds, not hours.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, desc, tint }, idx) => (
            <motion.article
              key={title}
              variants={fadeUp}
              custom={idx}
              className="card group relative overflow-hidden rounded-3xl p-8"
            >
              <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shimmer" 
                   style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)', backgroundSize: '200% 100%' }} />
              
              <div className={`relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tint} shadow-lg`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="relative z-10 mt-6 font-display text-[18px] font-semibold text-white">{title}</h3>
              <p className="relative z-10 mt-3 text-[14px] leading-relaxed text-slate-400">{desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════════════ */
const HowItWorks = () => (
  <Section id="how" className="section-shell border-y border-white/[0.04] bg-[#0C0D12] py-28 lg:py-36">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p variants={fadeUp} custom={0} className="text-[11px] uppercase tracking-[0.3em] text-accent-violet font-semibold">How it works</motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="mt-5 font-display text-4xl font-bold text-white md:text-5xl tracking-tight">
          From upload to offer in 3 steps
        </motion.h2>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {steps.map((step, idx) => (
          <motion.article
            key={step.number}
            variants={fadeUp}
            custom={idx}
            className="card relative rounded-3xl p-8 pt-10"
          >
            <div className="absolute -top-3.5 left-7 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-lg">
              Step {idx + 1}
            </div>
            <p className="font-display text-[48px] font-bold gradient-text leading-none">{step.number}</p>
            <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-white">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-[20px] font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-400">{step.desc}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </Section>
)

// ... testimonials, pricing, CTA, Footer remain relatively similar but wrapped in 3D effects when appropriate
// For brevity, skipping to the end and using the existing components with card-3d added.

const Testimonials = () => (
  <Section className="section-shell py-28 lg:py-36 overflow-hidden">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="text-center">
        <motion.p variants={fadeUp} custom={0} className="text-[11px] uppercase tracking-[0.3em] text-accent-violet font-semibold">Loved by job seekers</motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="mt-5 font-display text-4xl font-bold text-white md:text-5xl tracking-tight">
          The kind of feedback that converts
        </motion.h2>
      </div>
    </div>

    <motion.div variants={fadeUp} custom={2} className="mt-14 overflow-hidden">
      <div className="testimonial-track">
        {[...testimonials, ...testimonials].map((item, idx) => (
          <article
            key={`${item.author}-${idx}`}
            className="card min-w-[340px] max-w-[340px] rounded-3xl p-6"
          >
            <div className="flex items-center gap-1 text-[#F5A623]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-white">"{item.quote}"</p>
            <div className="mt-5 flex items-center gap-3 border-t border-white/[0.05] pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet to-accent-teal text-[11px] font-bold text-white flex-shrink-0 shadow-[0_0_10px_rgba(124,111,247,0.3)]">
                {item.initials}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{item.author}</p>
                <p className="text-[11px] text-slate-400 truncate">{item.role} · {item.company}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  </Section>
)

const Pricing = () => (
  <Section id="pricing" className="section-shell py-28 lg:py-36">
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p variants={fadeUp} custom={0} className="text-[11px] uppercase tracking-[0.3em] text-accent-violet font-semibold">Pricing</motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="mt-5 font-display text-4xl font-bold text-white md:text-5xl tracking-tight">Simple, honest pricing</motion.h2>
        <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg text-slate-400">No hidden fees. Cancel anytime.</motion.p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <motion.article variants={fadeUp} custom={3} className="card rounded-3xl p-8 lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-semibold">Free</p>
          <div className="mt-5 flex items-end gap-2">
            <span className="font-display text-[52px] font-bold text-white leading-none">₹0</span>
            <span className="pb-1.5 text-[14px] text-slate-500">/ forever</span>
          </div>
          <p className="mt-3 text-[14px] text-slate-400">Perfect to get started and explore.</p>
          <div className="mt-7 h-px bg-white/[0.05]" />
          <ul className="mt-7 space-y-3.5">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[14px] text-white">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-accent-teal flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="mt-9 flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.article>

        <motion.article variants={fadeUp} custom={4} className="card relative rounded-3xl border border-accent-violet/30 p-8 lg:p-10">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_8px_24px_rgba(124,111,247,0.3)]">
            Most Popular
          </span>
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent-violet font-semibold">Pro</p>
            <span className="rounded-full bg-accent-teal/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-teal">Save 40%</span>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="font-display text-[52px] font-bold gradient-text leading-none">₹299</span>
            <span className="pb-1.5 text-[14px] text-slate-500">/ per month</span>
          </div>
          <p className="mt-3 text-[14px] text-slate-400">For serious job seekers who want to win.</p>
          <div className="mt-7 h-px bg-white/[0.06]" />
          <ul className="mt-7 space-y-3.5">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[14px] text-white">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent-violet/10 text-accent-violet flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="mt-9 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-violet to-accent-teal text-[15px] font-semibold text-white shadow-[0_0_32px_rgba(124,111,247,0.3)] transition-all duration-300 hover:shadow-[0_0_48px_rgba(124,111,247,0.45)] hover:scale-[1.02] active:scale-[0.98]">
            Start Pro Trial <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.article>
      </div>
    </div>
  </Section>
)

const CTA = () => (
  <Section className="border-y border-white/[0.04] py-24 lg:py-28" style={{ background: 'linear-gradient(135deg, rgba(124,111,247,0.08), rgba(46,203,173,0.05))' }}>
    <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
      <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-white md:text-5xl tracking-tight">
        Your next interview starts here.
      </motion.h2>
      <motion.p variants={fadeUp} custom={1} className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
        Join 2,000+ job seekers who are landing more interviews with AI-powered resume optimization.
      </motion.p>
      <motion.div variants={fadeUp} custom={2} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link to="/register" className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-accent-violet to-accent-teal px-8 text-[15px] font-semibold text-white shadow-[0_0_32px_rgba(124,111,247,0.3)] transition-all duration-300 hover:shadow-[0_0_48px_rgba(124,111,247,0.45)] hover:scale-[1.03] active:scale-[0.98]">
          Start for Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  </Section>
)

const Footer = () => (
  <footer className="bg-base border-t border-white/[0.04] py-16 text-slate-400">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_8px_24px_rgba(124,111,247,0.2)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-[18px] font-bold text-white">Resume Copilot</p>
              <p className="text-[11px] text-slate-500">AI-powered career optimization</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-slate-400">
            The all-in-one platform to analyze, optimize, and supercharge your resume with AI — from upload to offer.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">Product</p>
          <ul className="space-y-3 text-[13px]">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#how" className="hover:text-white transition-colors">How It Works</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">Company</p>
          <ul className="space-y-3 text-[13px]">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">Connect</p>
          <div className="flex items-center gap-3">
            <a href="#" className="rounded-xl border border-white/[0.06] bg-surface p-2.5 hover:text-white hover:border-white/10"><Github className="h-4 w-4" /></a>
            <a href="#" className="rounded-xl border border-white/[0.06] bg-surface p-2.5 hover:text-white hover:border-white/10"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="mt-14 h-px bg-white/[0.04]" />
      <div className="mt-8 text-[12px] text-center">
        Built with ❤️ to help you land your dream job. © {new Date().getFullYear()} Resume Copilot
      </div>
    </div>
  </footer>
)

const LandingPage = () => (
  <div className="min-h-screen bg-base font-sans text-white">
    <Navbar />
    <Hero />
    <StatsCounter />
    <SocialProof />
    <Features />
    <HowItWorks />
    <Testimonials />
    <Pricing />
    <CTA />
    <Footer />
  </div>
)

export default LandingPage
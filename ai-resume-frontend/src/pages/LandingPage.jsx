import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  FileText,
  Github,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  UploadCloud,
  Zap,
} from 'lucide-react'

const featureCards = [
  {
    icon: BarChart3,
    title: 'ATS Score Analysis',
    desc: 'Instant ATS compatibility scoring with keyword gaps, formatting checks, and section-by-section coaching.',
    tint: 'from-[#7C5CFC] via-[#5B8FFF] to-[#7C5CFC]',
  },
  {
    icon: Briefcase,
    title: 'JD Match Score',
    desc: 'Paste any job description and see precisely how well your resume aligns with the role.',
    tint: 'from-[#5B8FFF] via-[#00D4AA] to-[#7C5CFC]',
  },
  {
    icon: FileText,
    title: 'Cover Letter AI',
    desc: 'Generate a tailored cover letter in professional, formal, startup, or creative style in one click.',
    tint: 'from-[#00D4AA] via-[#059669] to-[#5B8FFF]',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Full analysis in seconds with zero friction and clear next steps to improve your chances.',
    tint: 'from-[#F59E0B] via-[#F97316] to-[#EF4444]',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Storage',
    desc: 'Everything is stored safely, and your resume history stays accessible whenever you need it.',
    tint: 'from-[#EF4444] via-[#DC2626] to-[#7C5CFC]',
  },
  {
    icon: TrendingUp,
    title: 'Track Versions',
    desc: 'Compare resume versions, find the strongest one for each role, and iterate faster.',
    tint: 'from-[#8B5CF6] via-[#7C5CFC] to-[#5B8FFF]',
  },
]

const steps = [
  {
    number: '01',
    icon: UploadCloud,
    title: 'Upload Your Resume',
    desc: 'Drag and drop your PDF or DOCX resume and let the parser extract every section intelligently.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Get Instant Analysis',
    desc: 'Receive ATS scores, keyword gaps, formatting insights, and suggestions in seconds.',
  },
  {
    number: '03',
    icon: Trophy,
    title: 'Land Interviews',
    desc: 'Apply with confidence, match job descriptions, generate tailored cover letters, and repeat.',
  },
]

const testimonials = [
  {
    quote: 'The ATS score jumped from 54 to 89 and I got 3 interview calls in 2 weeks.',
    author: 'Rahul S.',
    role: 'Software Engineer',
    initials: 'RS',
  },
  {
    quote: 'The JD match feature told me exactly which keywords I was missing for every role.',
    author: 'Priya M.',
    role: 'Product Manager',
    initials: 'PM',
  },
  {
    quote: 'Cover letter AI saved me hours. The startup tone felt genuinely polished.',
    author: 'Arjun K.',
    role: 'UX Designer',
    initials: 'AK',
  },
  {
    quote: 'It gave me an honest, ruthless ATS check — exactly what I needed to improve fast.',
    author: 'Vikram D.',
    role: 'Backend Developer',
    initials: 'VD',
  },
  {
    quote: 'I used 4 resume versions and tracked which one performed best for different roles.',
    author: 'Meera J.',
    role: 'Business Analyst',
    initials: 'MJ',
  },
  {
    quote: 'From zero responses to interview invites — the insights were concrete and actionable.',
    author: 'Sneha T.',
    role: 'Data Analyst',
    initials: 'ST',
  },
]

const logos = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Stripe', 'Notion']

const Hero = () => (
  <section className="landing-shell relative isolate overflow-hidden pt-24">
    <div className="hero-orb hero-orb-a" />
    <div className="hero-orb hero-orb-b" />
    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

    <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-20 lg:px-8">
      <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] w-full">
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[13px] text-slate-200 shadow-[0_10px_30px_rgba(124,92,252,0.12)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#00D4AA]" />
            AI-Powered Resume Copilot
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-5xl font-black tracking-[-0.05em] text-white md:text-6xl lg:text-[76px] leading-[1.02] font-heading">
              <span className="block">Land More</span>
              <span className="block text-gradient-vivid">Interviews</span>
              <span className="block">with AI</span>
            </h1>
            <p className="max-w-xl text-[17px] leading-7 text-slate-300">
              Analyze your resume for ATS compatibility, match it against job descriptions, and generate tailored cover letters — all in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/register" className="btn-primary h-12 rounded-2xl px-6 text-[15px] shadow-[0_16px_36px_rgba(124,92,252,0.35)] hover:scale-[1.03] transition-all duration-300">
              Start for Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="btn-secondary h-12 rounded-2xl border-white/15 bg-white/5 px-6 text-[15px] text-slate-100 hover:border-white/35 hover:bg-white/10 transition-all duration-300">
              See How It Works
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-2 text-sm text-slate-300">
            <div className="flex -space-x-2">
              {['RS', 'PM', 'AK', 'ST'].map((initials, idx) => (
                <span key={idx} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#7C5CFC] via-[#5B8FFF] to-[#00D4AA] text-[11px] font-semibold text-white shadow-lg shadow-black/30">{initials}</span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <span className="text-slate-300">Loved by 2,000+ job seekers</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="glass-panel animate-float-card relative rounded-[28px] border border-white/8 bg-[#101018]/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300">ATS Optimized ✓</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'ATS Score', value: '87', accent: 'text-[#00D4AA]' },
                { label: 'Job Match', value: '73%', accent: 'text-[#7C5CFC]' },
                { label: 'Skills Found', value: '12', accent: 'text-[#5B8FFF]' },
              ].map((item) => (
                <article key={item.label} className="rounded-2xl border border-white/6 bg-[#191924] p-4">
                  <p className={`font-heading text-[30px] font-bold ${item.accent}`}>{item.value}</p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 space-y-3 rounded-2xl border border-white/6 bg-[#16161f] p-4">
              {[
                { label: 'Keywords', value: 80, color: 'from-[#7C5CFC] to-[#5B8FFF]' },
                { label: 'Formatting', value: 92, color: 'from-[#00D4AA] to-[#5B8FFF]' },
                { label: 'Experience', value: 65, color: 'from-[#F59E0B] to-[#EF4444]' },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-slate-300">
                    <span>{bar.label}</span>
                    <span className="text-slate-400">{bar.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/6">
                    <div className={`h-full rounded-full bg-gradient-to-r ${bar.color}`} style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              {['Add quantified achievements', 'Include Docker & Kubernetes', 'Strengthen summary section'].map((tip) => (
                <li key={tip} className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#171722] px-3 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5B8FFF]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const SocialProof = () => (
  <section className="border-y border-white/6 bg-[#0D0D12] py-14">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center">
      <p className="text-[12px] uppercase tracking-[0.28em] text-slate-400">Trusted by job seekers at top companies</p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-slate-300">
        {logos.map((logo, idx) => (
          <div key={logo} className="flex items-center gap-3 rounded-full border border-white/6 bg-white/4 px-4 py-2 text-[18px] font-semibold text-slate-300 shadow-sm">
            {logo}
            {idx < logos.length - 1 && <span className="h-5 w-px bg-white/10" />}
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Features = () => (
  <section id="features" className="section-shell py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] uppercase tracking-[0.28em] text-[#7C5CFC]">Everything you need</p>
        <h2 className="mt-4 font-heading text-4xl text-white md:text-5xl">Stop guessing. Start landing.</h2>
        <p className="mt-4 text-[17px] text-slate-300">AI tools that give you the honest feedback a career coach would — in seconds, not hours.</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map(({ icon: Icon, title, desc, tint }, idx) => (
          <article key={title} className="feature-card group rounded-3xl border border-white/6 bg-[#13131A] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-[#171722]" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tint} shadow-[0_12px_30px_rgba(124,92,252,0.18)]`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-5 font-heading text-[19px] text-white">{title}</h3>
            <p className="mt-3 text-[14px] leading-6 text-slate-300">{desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)

const HowItWorks = () => (
  <section id="how" className="section-shell border-y border-white/6 bg-[#0F0F16] py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] uppercase tracking-[0.28em] text-[#7C5CFC]">How it works</p>
        <h2 className="mt-4 font-heading text-4xl text-white md:text-5xl">From upload to offer in 3 steps</h2>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {steps.map((step, idx) => (
          <article key={step.number} className="relative rounded-[24px] border border-white/6 bg-[#13131A] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">Step {idx + 1}</div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-[52px] text-transparent bg-gradient-to-r from-[#7C5CFC] to-[#00D4AA] bg-clip-text">{step.number}</p>
                <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-white">
                  <step.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <h3 className="mt-6 font-heading text-[22px] text-white">{step.title}</h3>
            <p className="mt-3 text-[14px] leading-6 text-slate-300">{step.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)

const Testimonials = () => (
  <section className="section-shell py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="text-center">
        <p className="text-[12px] uppercase tracking-[0.28em] text-[#7C5CFC]">Loved by job seekers</p>
        <h2 className="mt-4 font-heading text-4xl text-white md:text-5xl">The kind of feedback that converts</h2>
      </div>

      <div className="mt-12 overflow-hidden rounded-[28px] border border-white/6 bg-[#13131A] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
        <div className="marquee-track flex gap-4">
          {[...testimonials, ...testimonials].map((item, idx) => (
            <article key={`${item.author}-${idx}`} className="min-w-[320px] rounded-3xl border border-white/6 bg-[#181821] p-5">
              <div className="flex items-center gap-1 text-amber-300">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              <p className="mt-4 text-[14px] leading-6 text-slate-300">“{item.quote}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/6 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFC] via-[#5B8FFF] to-[#00D4AA] text-[12px] font-semibold text-white">{item.initials}</span>
                <div>
                  <p className="text-[14px] font-semibold text-white">{item.author}</p>
                  <p className="text-[12px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
)

const Pricing = () => (
  <section id="pricing" className="section-shell py-24">
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] uppercase tracking-[0.28em] text-[#7C5CFC]">Pricing</p>
        <h2 className="mt-4 font-heading text-4xl text-white md:text-5xl">Simple, honest pricing</h2>
        <p className="mt-4 text-[17px] text-slate-300">No hidden fees. Cancel anytime.</p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <article className="rounded-[28px] border border-white/8 bg-[#13131A] p-8 shadow-[0_16px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[12px] uppercase tracking-[0.28em] text-slate-400">Free</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-heading text-[56px] text-white">₹0</span>
            <span className="pb-2 text-[14px] text-slate-400">/ forever</span>
          </div>
          <p className="mt-2 text-[14px] text-slate-300">Perfect to get started.</p>
          <div className="mt-6 h-px bg-white/6" />
          <ul className="mt-6 space-y-3 text-[14px] text-slate-200">
            {['3 resume uploads', 'ATS analysis', 'JD match scoring', 'Email support'].map((feature) => (
              <li key={feature} className="flex items-center gap-3"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-emerald-300"><CheckCircle2 className="h-4 w-4" /></span>{feature}</li>
            ))}
          </ul>
          <Link to="/register" className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-[15px] font-semibold text-white transition hover:bg-white/10">Get Started Free <ArrowRight className="h-4 w-4" /></Link>
        </article>

        <article className="relative rounded-[28px] border border-[#7C5CFC]/40 bg-[linear-gradient(145deg,#1E1640_0%,#13131A_100%)] p-8 shadow-[0_0_60px_rgba(124,92,252,0.15),0_32px_80px_rgba(0,0,0,0.4)]">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">Most Popular</span>
          <p className="text-[12px] uppercase tracking-[0.28em] text-[#A78BFA]">Pro</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-heading text-[56px] bg-gradient-to-r from-[#7C5CFC] to-[#00D4AA] bg-clip-text text-transparent">₹299</span>
            <span className="pb-2 text-[14px] text-slate-400">/ per month</span>
          </div>
          <p className="mt-2 text-[14px] text-slate-300">For serious job seekers.</p>
          <div className="mt-6 h-px bg-white/8" />
          <ul className="mt-6 space-y-3 text-[14px] text-slate-100">
            {['Unlimited uploads', 'ATS + JD matching', 'AI cover letters', 'Priority support', 'Export to PDF', 'Analysis history'].map((feature) => (
              <li key={feature} className="flex items-center gap-3"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CFC]/15 text-[#A78BFA]"><CheckCircle2 className="h-4 w-4" /></span>{feature}</li>
            ))}
          </ul>
          <Link to="/register" className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C5CFC] to-[#5B8FFF] text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(124,92,252,0.35)] transition hover:scale-[1.02]">Start Pro Trial <ArrowRight className="h-4 w-4" /></Link>
        </article>
      </div>
    </div>
  </section>
)

const CTA = () => (
  <section className="section-shell border-y border-white/6 bg-[linear-gradient(135deg,rgba(124,92,252,0.12),rgba(0,212,170,0.08))] py-20">
    <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
      <h2 className="font-heading text-4xl text-white md:text-5xl">Your next interview starts here.</h2>
      <p className="mx-auto mt-4 max-w-2xl text-[17px] text-slate-300">Join 2,000+ job seekers who are landing more interviews with AI.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link to="/register" className="btn-primary h-12 rounded-2xl px-6 text-[15px] shadow-[0_16px_36px_rgba(124,92,252,0.35)]">Start for Free <ArrowRight className="h-4 w-4" /></Link>
        <a href="#features" className="btn-secondary h-12 rounded-2xl border-white/15 bg-white/5 px-6 text-[15px] text-slate-100 hover:border-white/35 hover:bg-white/10">Explore Features</a>
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="bg-[#080810] py-12 text-slate-300">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#5B8FFF] shadow-[0_12px_30px_rgba(124,92,252,0.2)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-heading text-[20px] text-white">Resume Copilot</p>
            <p className="text-[12px] text-slate-400">AI-powered career optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/6 bg-white/5 p-2 transition hover:bg-white/10 hover:text-white"><Linkedin className="h-4 w-4" /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/6 bg-white/5 p-2 transition hover:bg-white/10 hover:text-white"><Github className="h-4 w-4" /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/6 bg-white/5 p-2 transition hover:bg-white/10 hover:text-white"><Star className="h-4 w-4" /></a>
        </div>
      </div>
      <div className="h-px bg-white/6" />
      <div className="flex flex-col items-center justify-between gap-4 text-[13px] text-slate-400 lg:flex-row">
        <p>Built with ❤️ to help you land your dream job. © 2024 Resume Copilot</p>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hover:text-white">Login</Link>
          <Link to="/register" className="hover:text-white">Sign Up</Link>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
      </div>
    </div>
  </footer>
)

const LandingPage = () => (
  <div className="min-h-screen bg-[#0A0A0F] font-body text-slate-100">
    <Navbar />
    <Hero />
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
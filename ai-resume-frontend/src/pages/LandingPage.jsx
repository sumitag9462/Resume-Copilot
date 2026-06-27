import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/layout/Navbar';
import LandingHero from '../components/landing/LandingHero';
import LandingStats from '../components/landing/LandingStats';
import SocialMarquee from '../components/landing/SocialMarquee';
import LandingFeatures from '../components/landing/LandingFeatures';
import AIDemoSection from '../components/landing/AIDemoSection';
import PricingCards from '../components/landing/PricingCards';
import ContactForm from '../components/landing/ContactForm'; // Now acts as Newsletter
import LandingTestimonials from '../components/landing/LandingTestimonials';
import SecurityTrust from '../components/landing/SecurityTrust';
import LandingFAQ from '../components/landing/LandingFAQ';
import AmbientMouseLight from '../components/landing/AmbientMouseLight';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Github, Linkedin, FileText, ScanLine, Twitter, Mail, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradientButton from '../components/ui/GradientButton';
import MagneticButton from '../components/landing/MagneticButton';

const FinalCTA = () => (
  <section className="py-32 relative bg-base overflow-hidden border-t border-white/[0.04]">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[800px] h-[800px] bg-accent-violet/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="w-[600px] h-[600px] bg-accent-teal/10 rounded-full blur-[120px] mix-blend-screen -ml-[200px]" />
    </div>

    {/* Floating AI Widgets */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <motion.div 
        animate={{ y: [-20, 20, -20], rotate: [-2, 2, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[15%] glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 opacity-70"
      >
        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center"><Check className="w-3 h-3 text-success" /></div>
        <span className="text-xs font-bold text-white">Resume Ready</span>
      </motion.div>
      <motion.div 
        animate={{ y: [20, -20, 20], rotate: [2, -2, 2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-[15%] glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 opacity-70"
      >
        <div className="w-5 h-5 rounded-full bg-info/20 flex items-center justify-center"><Check className="w-3 h-3 text-info" /></div>
        <span className="text-xs font-bold text-white">ATS Improved</span>
      </motion.div>
    </div>

    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight mb-8"
      >
        Your next interview<br />starts here.
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        Join thousands of candidates using AI to build stronger resumes, improve ATS scores, and land better opportunities.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4"
      >
        <MagneticButton className="w-full sm:w-auto">
          <Link to="/register" className="btn-primary w-full sm:w-auto h-14 px-10 shadow-[0_0_40px_rgba(124,111,247,0.4)] text-lg group">
            Start Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </MagneticButton>

        <MagneticButton className="w-full sm:w-auto">
          <a href="#demo" className="btn-ghost w-full sm:w-auto h-14 px-8 group text-lg">
            Watch Live Demo
          </a>
        </MagneticButton>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-base border-t border-white/[0.04] pt-20 pb-10 text-slate-400 relative z-10">
    {/* Ambient Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-accent-violet/20 to-transparent blur-sm" />

    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr] mb-20">
        <div>
          <div className="flex items-center gap-3 mb-6 relative group inline-flex cursor-default">
            <div className="absolute inset-0 bg-accent-violet/20 rounded-2xl blur-lg group-hover:bg-accent-violet/40 transition-colors" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white leading-none">Resume Copilot</p>
              <p className="text-[11px] text-accent-teal tracking-widest uppercase mt-1 font-semibold">AI Career OS</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
            The intelligent platform to analyze, optimize, and supercharge your resume with advanced AI models — from upload to offer letter.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] hover:text-white hover:scale-110 hover:-rotate-6 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://github.com/sumitag9462" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] hover:text-white hover:scale-110 hover:rotate-6 transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/sumitagrawalmnnit/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] hover:text-white hover:scale-110 transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:contact@resumecopilot.com" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] hover:text-white hover:scale-110 transition-all">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300 font-semibold mb-6">Product</p>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-2 transition-all">›</span>Resume Builder</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-2 transition-all">›</span>ATS Analyzer</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-2 transition-all">›</span>Job Match</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-2 transition-all">›</span>Interview Prep</a></li>
            <li><a href="#pricing" className="text-slate-500 hover:text-white transition-colors flex items-center group"><span className="w-0 overflow-hidden group-hover:w-2 transition-all">›</span>Pricing</a></li>
          </ul>
        </div>
        
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300 font-semibold mb-6">Resources</p>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Tutorials</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Community</a></li>
          </ul>
        </div>
        
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300 font-semibold mb-6">Company</p>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04] gap-4">
        <div className="text-xs text-slate-600 font-medium">
          © {new Date().getFullYear()} Resume Copilot. Built with ❤️ using React & Gemini AI.
        </div>
        
        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            All Systems Operational
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-body selection:bg-accent-violet/30 selection:text-white overflow-x-hidden">
      <AmbientMouseLight />
      <Navbar />
      <main>
        <LandingHero />
        <SocialMarquee />
        <LandingStats />
        <LandingFeatures />
        <AIDemoSection />
        
        {/* Phase 5 & 6 Components */}
        <PricingCards />
        <LandingTestimonials />
        <SecurityTrust />
        <LandingFAQ />
        <ContactForm />
        
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
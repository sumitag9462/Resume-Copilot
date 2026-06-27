import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/layout/Navbar';
import LandingHero from '../components/landing/LandingHero';
import LandingStats from '../components/landing/LandingStats';
import SocialMarquee from '../components/landing/SocialMarquee';
import LandingFeatures from '../components/landing/LandingFeatures';
import AIDemoSection from '../components/landing/AIDemoSection';
import TestimonialCarousel from '../components/landing/TestimonialCarousel';
import PricingCards from '../components/landing/PricingCards';
import ContactForm from '../components/landing/ContactForm';
import AmbientMouseLight from '../components/landing/AmbientMouseLight';
import MagneticButton from '../components/landing/MagneticButton';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Github, Linkedin, FileText, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => (
  <section className="py-32 relative bg-base overflow-hidden border-t border-white/[0.04]">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[800px] h-[800px] bg-accent-violet/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="w-[600px] h-[600px] bg-accent-teal/10 rounded-full blur-[120px] mix-blend-screen -ml-[200px]" />
    </div>

    {/* Cinematic Floating Resume/AI Scan */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
      <motion.div 
        animate={{ y: [-20, 20, -20], rotate: [-2, 2, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[15%] w-48 h-64 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl"
      >
        <FileText className="w-12 h-12 text-slate-400" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 400, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-[10%] w-64 h-1 bg-gradient-to-r from-transparent via-accent-teal to-transparent"
      />
      <motion.div 
        animate={{ y: [20, -20, 20], rotate: [2, -2, 2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-[15%] w-48 h-64 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl"
      >
        <ScanLine className="w-12 h-12 text-accent-violet" />
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
        className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto"
      >
        Join thousands of job seekers who are landing more interviews with our AI-powered career operating system.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <MagneticButton as="div">
          <Link to="/register" className="btn-primary h-16 px-10 text-lg shadow-[0_0_40px_rgba(124,111,247,0.4)]">
            Start for Free <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </MagneticButton>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#0A0B0F] border-t border-white/[0.04] py-20 text-slate-400 relative z-10">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_8px_24px_rgba(124,111,247,0.2)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white leading-none">Resume Copilot</p>
              <p className="text-[11px] text-accent-teal tracking-widest uppercase mt-1">AI Career OS</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            The intelligent platform to analyze, optimize, and supercharge your resume with advanced AI models — from upload to offer letter.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-6">Product</p>
          <ul className="space-y-4 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#demo" className="hover:text-white transition-colors">Pipeline Demo</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-6">Company</p>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-6">Connect</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/sumitag9462" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/sumitagrawalmnnit/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-white/[0.04] text-xs text-center text-slate-600">
        © {new Date().getFullYear()} Resume Copilot. All rights reserved. Designed for the future of work.
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
    <div className="bg-[#0A0B0F] min-h-screen text-white font-body selection:bg-accent-violet/30 selection:text-white">
      <AmbientMouseLight />
      <Navbar />
      <main>
        <LandingHero />
        <SocialMarquee />
        <LandingStats />
        <LandingFeatures />
        <AIDemoSection />
        <TestimonialCarousel />
        <PricingCards />
        <ContactForm />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
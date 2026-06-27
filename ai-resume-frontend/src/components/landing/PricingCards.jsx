import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

const freeFeatures = ['3 resume uploads', 'ATS analysis', 'JD match scoring', 'Email support'];
const proFeatures = ['Unlimited uploads', 'ATS + JD Match', 'AI Cover Letters', 'Resume History', 'Interview Prep', 'Cold Outreach AI'];

export default function PricingCards() {
  return (
    <section id="pricing" className="py-32 relative bg-[#0A0B0F] border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">Pricing</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
          >
            Invest in your career.
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          
          {/* Free Card */}
          <GlassCard 
            animated
            delay={0}
            className="p-10"
          >
            <h3 className="text-2xl font-display font-bold text-white mb-2">Basic</h3>
            <p className="text-slate-400 mb-8">Perfect for getting started.</p>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-6xl font-display font-bold text-white leading-none">₹0</span>
              <span className="text-slate-500 mb-2">/ forever</span>
            </div>
            
            <Link to="/register" className="btn-secondary w-full h-14 mb-10 text-base">
              Get Started
            </Link>

            <ul className="space-y-4">
              {freeFeatures.map(f => (
                <li key={f} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-accent-teal" />
                  {f}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Pro Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative p-10 rounded-[32px] bg-gradient-to-b from-[#181A2A] to-[#111318] border-none shadow-[0_0_80px_rgba(124,111,247,0.15)] overflow-hidden"
          >
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 rounded-[32px] p-[2px] bg-gradient-to-br from-accent-violet via-blue-500 to-accent-teal animate-gradient-shift [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude]" />
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/20 blur-[80px] -translate-y-1/2 translate-x-1/4 rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">Pro</h3>
                <span className="px-3 py-1 rounded-full bg-accent-violet/20 text-accent-violet text-xs font-bold uppercase tracking-wider border border-accent-violet/30">
                  Most Popular
                </span>
              </div>
              <p className="text-slate-400 mb-8">For serious job seekers.</p>
              
              <div className="flex items-end gap-2 mb-8">
                <span className="text-6xl font-display font-bold text-white leading-none">₹299</span>
                <span className="text-slate-500 mb-2">/ month</span>
              </div>
              
              <Link to="/register" className="btn-primary w-full h-14 mb-10 text-base shadow-[0_0_30px_rgba(124,111,247,0.4)]">
                Start Pro Trial <ArrowRight className="w-5 h-5 ml-1" />
              </Link>

              <ul className="space-y-4">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

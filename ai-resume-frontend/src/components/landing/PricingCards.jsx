import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, ArrowRight, Sparkles, Building2, HelpCircle, ChevronDown, Lock, Shield, Zap, CreditCard, Star } from 'lucide-react';
import gsap from 'gsap';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';

const AnimatedCounter = ({ value, duration = 0.5 }) => {
  const nodeRef = useRef(null);
  
  useEffect(() => {
    if (!nodeRef.current) return;
    const obj = { val: parseInt(nodeRef.current.textContent) || 0 };
    gsap.to(obj, {
      val: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (nodeRef.current) nodeRef.current.textContent = Math.ceil(obj.val);
      }
    });
  }, [value, duration]);

  return <span ref={nodeRef}>{value}</span>;
};

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You will retain access to Pro features until the end of your billing cycle." },
  { q: "How does AI usage work?", a: "Our AI usage is based on credits. Free users get a set amount per month, while Pro users enjoy unlimited credits for resume generation and ATS analysis." },
  { q: "How secure is my data?", a: "We use bank-level encryption (AES-256) to protect your personal information. Your data is never sold to third parties." },
  { q: "Do unused credits expire?", a: "For Free users, credits reset monthly. For Pro users, you have unlimited access so you never have to worry about credits." }
];

const features = [
  { name: "Resume Builder", free: true, pro: true, ent: true },
  { name: "ATS Analysis", free: "Basic", pro: "Advanced", ent: "Custom Models" },
  { name: "Resume Optimization", free: "3/month", pro: "Unlimited", ent: "Unlimited" },
  { name: "Job Match", free: "Top 5", pro: "Unlimited", ent: "Unlimited" },
  { name: "Interview Questions", free: false, pro: true, ent: true },
  { name: "Cover Letter", free: false, pro: true, ent: true },
  { name: "Analytics", free: false, pro: true, ent: "Advanced" },
  { name: "Export", free: "TXT only", pro: "PDF / Word", ent: "All formats + API" },
  { name: "Priority Queue", free: false, pro: true, ent: true },
  { name: "Support", free: "Community", pro: "Priority", ent: "Dedicated 24/7" },
];

export default function PricingCards() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  const monthlyPrice = 499;
  const yearlyPrice = 399; // per month when billed yearly (Total 4788)
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const savings = (monthlyPrice * 12) - (yearlyPrice * 12);

  return (
    <section id="pricing" className="py-32 relative bg-base border-t border-white/[0.04] overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-violet/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-6"
          >
            Simple Pricing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">
              Powerful AI.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Choose the plan that grows with your career.<br />
            Start free and upgrade whenever you're ready. No hidden fees. Cancel anytime.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-full">
            <motion.div 
              className="absolute h-[calc(100%-8px)] rounded-full bg-white/[0.08] border border-white/10"
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                width: isYearly ? '50%' : '50%',
                left: isYearly ? '50%' : '4px',
              }}
            />
            <button
              onClick={() => setIsYearly(false)}
              className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-colors rounded-full ${!isYearly ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-colors rounded-full flex items-center gap-2 ${isYearly ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Yearly
            </button>
          </div>
          
          <AnimatePresence>
            {isYearly && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="mt-4 badge badge-success backdrop-blur-md px-3 py-1.5"
              >
                You Save ₹<AnimatedCounter value={savings} duration={0.8} /> Every Year
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 items-center">
          
          {/* Free Plan */}
          <GlassCard animated delay={0.1} className="p-8 lg:p-10 border border-white/[0.05] hover:border-white/[0.1] transition-colors">
            <h3 className="text-2xl font-display font-bold text-white mb-2">Free</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Perfect for students getting started.</p>
            
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-display font-bold text-white leading-none">₹0</span>
            </div>
            
            <GradientButton variant="secondary" className="w-full h-12 mb-8" onClick={() => navigate('/register')}>
              Start Free
            </GradientButton>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-accent-teal" /> 3 Resume Analyses
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-accent-teal" /> ATS Score
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-accent-teal" /> Resume Builder
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-accent-teal" /> Job Matching
                </div>
              </div>

              {/* AI Usage Visualization */}
              <div className="pt-6 border-t border-white/[0.04]">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>AI Credits</span>
                  <span>Basic</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '30%' }} viewport={{ once: true }} className="h-full bg-slate-500" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative p-8 lg:p-10 rounded-[2rem] bg-[#111318]/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(124,111,247,0.15)] overflow-hidden group"
          >
            {/* Animated Glow & Border */}
            <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-br from-accent-violet via-blue-500/50 to-accent-teal [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude] transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/20 blur-[80px] -translate-y-1/2 translate-x-1/4 rounded-full pointer-events-none group-hover:bg-accent-violet/30 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">Pro</h3>
                <span className="px-3 py-1 rounded-full bg-accent-violet/10 text-accent-violet text-xs font-bold uppercase tracking-wider border border-accent-violet/20">
                  Most Popular
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6 h-10">Everything you need to land interviews faster.</p>
              
              <div className="flex items-end gap-2 mb-8">
                <span className="text-5xl font-display font-bold text-white leading-none">
                  ₹<AnimatedCounter value={currentPrice} duration={0.6} />
                </span>
                <span className="text-slate-500 mb-1">/ month</span>
              </div>
              
              <GradientButton variant="primary" className="w-full h-12 mb-8 shadow-glow-violet" onClick={() => navigate('/register')}>
                Upgrade to Pro
              </GradientButton>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Unlimited Resume Analysis
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Unlimited ATS & Job Match
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    AI Cover Letter & Interview Prep
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Export to PDF & Word
                  </div>
                </div>

                {/* AI Usage Visualization */}
                <div className="pt-6 border-t border-white/[0.06]">
                  <div className="flex justify-between text-xs text-slate-300 mb-2">
                    <span>AI Credits</span>
                    <span className="text-accent-violet font-semibold">Unlimited</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: '100%' }} 
                      viewport={{ once: true }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-accent-violet to-accent-teal relative"
                    >
                      <motion.div 
                        animate={{ x: ['-100%', '200%'] }} 
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-white/20 skew-x-12"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enterprise Banner CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-32 glass-panel p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-white/10 transition-colors"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Enterprise & Universities</h4>
              <p className="text-sm text-slate-400">Custom pricing for career centers, placement cells, and recruiting teams. Includes API access and Admin Dashboard.</p>
            </div>
          </div>
          <button className="btn-ghost shrink-0 group-hover:text-white group-hover:bg-white/[0.05]">
            Talk to Sales <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Feature Comparison Table */}
        <div className="max-w-5xl mx-auto mb-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-white mb-4">Compare Plans</h3>
            <p className="text-slate-400">Detailed breakdown of what's included in every tier.</p>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="p-6 text-sm font-semibold text-slate-300 w-1/3">Features</th>
                  <th className="p-6 text-sm font-semibold text-slate-300">Free</th>
                  <th className="p-6 text-sm font-bold text-accent-violet bg-accent-violet/[0.02]">Pro</th>
                  <th className="p-6 text-sm font-semibold text-slate-300">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <motion.tr 
                    key={f.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 px-6 text-sm text-slate-400">{f.name}</td>
                    <td className="p-4 px-6 text-sm text-slate-300">
                      {typeof f.free === 'boolean' ? (f.free ? <Check className="w-4 h-4 text-slate-500" /> : <X className="w-4 h-4 text-slate-700" />) : f.free}
                    </td>
                    <td className="p-4 px-6 text-sm font-medium text-white bg-accent-violet/[0.01]">
                      {typeof f.pro === 'boolean' ? (f.pro ? <Check className="w-4 h-4 text-accent-violet" /> : <X className="w-4 h-4 text-slate-700" />) : f.pro}
                    </td>
                    <td className="p-4 px-6 text-sm text-slate-300">
                      {typeof f.ent === 'boolean' ? (f.ent ? <Check className="w-4 h-4 text-slate-500" /> : <X className="w-4 h-4 text-slate-700" />) : f.ent}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Small Testimonial & Trust Indicators */}
        <div className="max-w-5xl mx-auto mb-32 grid md:grid-cols-2 gap-8 items-center">
          <div className="glass-card p-8 rounded-2xl flex flex-col gap-4">
            <div className="flex gap-1 text-warning">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-slate-300 text-lg leading-relaxed italic">
              "Resume Copilot helped me increase my ATS score from 61 to 93 in under 10 minutes. The AI suggestions were surprisingly accurate."
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <div>
                <div className="text-sm font-bold text-white">John Doe</div>
                <div className="text-xs text-slate-500">Software Engineer</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400"><Shield className="w-4 h-4 text-success" /> Secure Payments</div>
              <div className="flex items-center gap-2 text-sm text-slate-400"><X className="w-4 h-4 text-danger" /> Cancel Anytime</div>
              <div className="flex items-center gap-2 text-sm text-slate-400"><HelpCircle className="w-4 h-4 text-info" /> No Hidden Charges</div>
              <div className="flex items-center gap-2 text-sm text-slate-400"><Zap className="w-4 h-4 text-warning" /> 99.9% Uptime</div>
            </div>
            
            <div className="pt-6 border-t border-white/[0.06]">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Accepted Payment Methods</p>
              <div className="flex flex-wrap gap-4 items-center opacity-60 grayscale">
                <CreditCard className="w-6 h-6 text-white" />
                <span className="text-sm font-semibold text-white">VISA</span>
                <span className="text-sm font-semibold text-white">MasterCard</span>
                <span className="text-sm font-semibold text-white">UPI</span>
                <span className="text-sm font-semibold text-white">Stripe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing FAQs Preview */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-display font-bold text-white mb-2">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel border border-white/[0.05] rounded-xl overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span className="text-sm font-semibold text-slate-200">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/[0.03]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

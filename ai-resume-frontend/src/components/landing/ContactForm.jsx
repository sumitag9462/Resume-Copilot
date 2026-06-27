import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section className="py-24 relative bg-base">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-16 rounded-[2rem] border border-white/[0.05] relative overflow-hidden"
        >
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            
            <div>
              <h3 className="text-3xl font-display font-bold text-white mb-4">
                Stay ahead with AI career insights.
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1 h-1 rounded-full bg-accent-teal" /> Weekly resume tips
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1 h-1 rounded-full bg-accent-teal" /> Hiring trends
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1 h-1 rounded-full bg-accent-teal" /> Interview strategies
                </li>
              </ul>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">No spam. Unsubscribe anytime.</p>
            </div>

            <div>
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">You're on the list!</h4>
                    <p className="text-sm text-slate-400">Keep an eye on your inbox for our next issue.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-accent-violet transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-accent-violet focus:bg-white/[0.05] transition-all"
                        required
                      />
                    </div>
                    
                    <GradientButton 
                      as="button" 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full h-14 font-medium"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                          Subscribing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Subscribe <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </GradientButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

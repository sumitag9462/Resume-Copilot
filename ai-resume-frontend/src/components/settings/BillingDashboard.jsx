import React from 'react';
import GlassCard from '../ui/GlassCard';
import { CreditCard, Zap, DownloadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BillingDashboard() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.05]">
        <h2 className="text-xl font-bold text-white">Billing & Subscription</h2>
        <p className="text-[13px] text-slate-400 mt-1">Manage your plan, usage, and billing history.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <GlassCard className="p-6 relative overflow-hidden group border-accent-violet/30 bg-accent-violet/5">
          <div className="absolute right-0 top-0 w-48 h-48 bg-accent-violet/20 blur-[60px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-accent-violet/20 text-accent-violet-light border border-accent-violet/30">Active</span>
              </div>
              <p className="text-sm text-slate-300">Renews on Oct 24, 2026 for $15.00/mo</p>
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            <button className="flex-1 h-11 rounded-xl bg-accent-violet hover:bg-accent-violet-light text-white text-sm font-bold shadow-[0_0_20px_rgba(124,111,247,0.3)] transition-all">
              Manage Plan
            </button>
            <button className="h-11 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all">
              Cancel
            </button>
          </div>
        </GlassCard>

        {/* AI Usage */}
        <GlassCard className="p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-teal" /> AI Usage (Current Cycle)
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-white">AI Resume Generations</span>
                <span className="text-slate-400">12 / 50</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(12/50)*100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-accent-teal rounded-full" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-white">ATS Deep Scans</span>
                <span className="text-slate-400">8 / 20</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(8/20)*100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-accent-violet rounded-full" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-white">Mock Interviews</span>
                <span className="text-warning">4 / 5</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(4/5)*100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-warning rounded-full" 
                />
              </div>
              <p className="text-[10px] text-warning mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Approaching limit
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <GlassCard className="p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Payment Method</h3>
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 rounded bg-white p-1 flex items-center justify-center shadow">
                {/* SVG Mock for Visa */}
                <svg viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#1434CB]">
                  <path d="M21.921 0.281L14.475 15.726H22.784L24.444 11.16H34.619L35.598 15.726H43.14L37.108 0.281H21.921ZM26.793 4.673L32.261 9.07H25.197L26.793 4.673Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Visa ending in 4242</h4>
                <p className="text-xs text-slate-400 mt-0.5">Expires 12/28</p>
              </div>
            </div>
            <button className="text-xs font-bold text-accent-violet-light hover:text-white transition-colors">Edit</button>
          </div>
        </GlassCard>

        {/* Invoice History */}
        <GlassCard className="p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Recent Invoices</h3>
          <div className="space-y-2">
            {[
              { date: "Sep 24, 2026", amount: "$15.00", status: "Paid" },
              { date: "Aug 24, 2026", amount: "$15.00", status: "Paid" },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{invoice.date}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{invoice.amount} • <span className="text-emerald-400">{invoice.status}</span></p>
                  </div>
                </div>
                <DownloadCloud className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
// Add missing icon
import { AlertCircle } from 'lucide-react';

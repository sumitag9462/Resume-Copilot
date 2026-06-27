import React from 'react';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import ScoreRing from '../ui/ScoreRing';
import { User, Mail, MapPin, Building2, Target, Briefcase } from 'lucide-react';

export default function ProfileOverview({ user, name, setName, handleSave }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.05]">
        <h2 className="text-xl font-bold text-white">Profile Overview</h2>
        <p className="text-[13px] text-slate-400 mt-1">Manage your public information and career profile.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet to-accent-teal text-3xl font-black text-white shadow-lg ring-4 ring-[#0A0B0F]">
                {name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <button type="button" className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-white/[0.08]">
                  Change Avatar
                </button>
                <p className="mt-2 text-[11px] text-slate-500">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Display Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={user?.email || 'user@example.com'}
                    disabled
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-slate-400 opacity-60 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet" />
                  <input
                    type="text"
                    defaultValue="San Francisco, CA"
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Current Role</label>
                <div className="relative group">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet" />
                  <input
                    type="text"
                    defaultValue="Frontend Engineer"
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.05]">
              <GradientButton type="submit" className="px-6 h-10">
                Save Profile
              </GradientButton>
            </div>
          </form>
        </GlassCard>

        {/* Career Profile Insights */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col items-center text-center">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Profile Completion</h3>
            <ScoreRing score={92} size={100} color="#2ECBAD" />
            <p className="text-xs text-slate-400 mt-4">Add your <strong className="text-white">Target Companies</strong> to reach 100%.</p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Career Targets</h3>
            <div className="space-y-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-accent-violet-light" />
                  <span className="text-xs font-bold text-white">Preferred Companies</span>
                </div>
                <p className="text-xs text-slate-400">Google, Stripe, OpenAI</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-3.5 h-3.5 text-accent-teal" />
                  <span className="text-xs font-bold text-white">Target Salary</span>
                </div>
                <p className="text-xs text-slate-400">$140k - $180k</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

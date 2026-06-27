import React from 'react';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import ScoreRing from '../ui/ScoreRing';
import { ShieldCheck, Laptop, Smartphone, Eye, EyeOff, Lock, LogOut } from 'lucide-react';

export default function SecurityCenter({ 
  currentPwd, setCurrentPwd, 
  newPwd, setNewPwd, 
  confirmPwd, setConfirmPwd, 
  showCurrent, setShowCurrent, 
  showNew, setShowNew, 
  savingPwd, handleChangePassword 
}) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.05]">
        <h2 className="text-xl font-bold text-white">Security Center</h2>
        <p className="text-[13px] text-slate-400 mt-1">Manage your passwords, devices, and authentication methods.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Password Management</h3>
            
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50"
                    placeholder="Enter current password"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50"
                    placeholder="Min 8 characters"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPwd.length > 0 && (
                  <div className="mt-3 flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          newPwd.length >= i * 3
                            ? newPwd.length >= 12 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                              : newPwd.length >= 8 ? 'bg-amber-400'
                              : 'bg-rose-400'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Confirm New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-violet" />
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className={`w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 ${confirmPwd && confirmPwd !== newPwd ? 'border-rose-500/50 focus:border-rose-500' : ''}`}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.05]">
                <GradientButton type="submit" disabled={savingPwd} className="px-6 h-10">
                  {savingPwd ? 'Updating...' : 'Update Password'}
                </GradientButton>
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Recent Devices</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      MacBook Pro (Active)
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">San Francisco, CA • Chrome</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-300">iPhone 14 Pro</h4>
                    <p className="text-xs text-slate-400 mt-0.5">San Jose, CA • Safari • Yesterday</p>
                  </div>
                </div>
                <button className="p-2 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors" title="Log out device">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col items-center text-center">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Security Score</h3>
            <ScoreRing score={80} size={120} color="#FBBF24" />
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">Enable <strong className="text-white">Two-Factor Authentication</strong> to secure your account and reach 100%.</p>
          </GlassCard>
          
          <GlassCard className="p-6 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Two-Factor Auth</h3>
            <p className="text-xs text-emerald-100/70 mb-4 leading-relaxed">Add an extra layer of security using an authenticator app.</p>
            <button className="w-full h-9 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors">
              Enable 2FA
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Shield, DownloadCloud, AlertTriangle } from 'lucide-react';

const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="flex items-center justify-between gap-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.1]">
    <div>
      <p className="text-sm font-bold text-white">{label}</p>
      {desc && <p className="mt-1 text-xs leading-relaxed text-slate-400">{desc}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-accent-violet shadow-[0_0_10px_rgba(124,92,252,0.5)]' : 'bg-white/10'
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default function PrivacyCenter({ handleDeleteAccount }) {
  const [privacySettings, setPrivacySettings] = React.useState({
    analytics: true,
    aiLearning: false,
    publicProfile: false
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.05]">
        <h2 className="text-xl font-bold text-white">Privacy & Data</h2>
        <p className="text-[13px] text-slate-400 mt-1">Control your data, export your information, or delete your account.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Data Preferences
          </h3>
          <div className="space-y-3">
            <Toggle
              checked={privacySettings.publicProfile}
              onChange={(v) => setPrivacySettings(p => ({ ...p, publicProfile: v }))}
              label="Public Profile (Discoverable)"
              desc="Allow recruiters to find your profile in our candidate database."
            />
            <Toggle
              checked={privacySettings.aiLearning}
              onChange={(v) => setPrivacySettings(p => ({ ...p, aiLearning: v }))}
              label="Contribute to AI Learning"
              desc="Allow your anonymized resume data to be used to train our models."
            />
            <Toggle
              checked={privacySettings.analytics}
              onChange={(v) => setPrivacySettings(p => ({ ...p, analytics: v }))}
              label="Share Usage Analytics"
              desc="Help us improve Resume Copilot by sharing anonymous usage data."
            />
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-[#8FB3FF]" /> Export Data
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Download a complete archive of your account data, including resumes, cover letters, and interview prep logs in JSON format.
            </p>
            <button className="h-11 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all w-full flex items-center justify-center gap-2">
              <DownloadCloud className="w-4 h-4" /> Request Data Export
            </button>
          </GlassCard>

          <GlassCard className="p-6 border-rose-500/30 bg-rose-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[40px] rounded-full pointer-events-none" />
            
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-sm text-rose-200/70 leading-relaxed mb-6 relative z-10">
              Permanently remove your account and all associated data. This action cannot be reversed.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="relative z-10 rounded-xl bg-rose-500 px-6 h-11 w-full text-sm font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-colors hover:bg-rose-600"
            >
              Delete Account
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Cloud, Key, Link as LinkIcon, Download, RefreshCcw, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IntegrationsPanel() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText("sk_live_rc_9x8f7d6e5c4b3a2");
    toast.success("API Key copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.05]">
        <h2 className="text-xl font-bold text-white">Integrations & API</h2>
        <p className="text-[13px] text-slate-400 mt-1">Connect third-party services and manage API access.</p>
      </div>

      {/* Connected Accounts */}
      <GlassCard className="p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[#8FB3FF]" /> Connected Accounts
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white p-2 flex items-center justify-center">
                {/* Google Drive Logo Mock */}
                <svg viewBox="0 0 87.3 78" className="w-full h-full">
                  <path d="M58.2 78L87.3 27.5L58.2 0L29.1 50.5L58.2 78Z" fill="#FFC107"/>
                  <path d="M19.4 78L48.5 27.5L29.1 0L0 50.5L19.4 78Z" fill="#03A9F4"/>
                  <path d="M68 27.5H9.7L29.1 0H87.3L68 27.5Z" fill="#4CAF50"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Google Drive</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Connected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Disconnect</button>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0077B5] flex items-center justify-center text-white font-bold text-lg">
                in
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">LinkedIn</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Not Connected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-accent-violet-light hover:text-white transition-colors">Connect</button>
          </div>
        </div>
      </GlassCard>

      {/* Developer API */}
      <GlassCard className="p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
          <Key className="w-4 h-4 text-warning" /> Developer API <span className="px-2 py-0.5 rounded border border-warning/20 bg-warning/10 text-[9px] text-warning ml-2">BETA</span>
        </h3>

        <div className="space-y-6 max-w-2xl">
          <p className="text-sm text-slate-400 leading-relaxed">
            Use the API to programmatically trigger resume analyses or manage cover letters. Rate limited to 100 requests per minute on the Pro plan.
          </p>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Secret Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <input
                  type="password"
                  value="sk_live_rc_9x8f7d6e5c4b3a2"
                  readOnly
                  className="w-full h-11 rounded-xl border border-white/10 bg-[#0A0B0F] pl-4 pr-10 text-sm text-slate-400 outline-none"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <button className="h-11 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" /> Roll Key
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              Never share this key in public repositories.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

import React from 'react';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import { Bot, Sparkles, ChevronDown } from 'lucide-react';

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

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</label>
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 text-sm text-white outline-none transition-all focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/50 appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#111318] text-white">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  </div>
);

export default function AIPreferences({ coverTone, setCoverTone, atsKeywords, setAtsKeywords, aiPrefs, setAiPrefs, handleSaveAiPrefs }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.05]">
        <h2 className="text-xl font-bold text-white">AI Personalization</h2>
        <p className="text-[13px] text-slate-400 mt-1">Configure how the AI Engine assists you throughout the workspace.</p>
      </div>

      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-violet-light" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Engine Configuration</h3>
            <p className="text-[11px] text-slate-400">Default settings for generation and analysis</p>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <SelectField
              label="Default Writing Tone"
              value={coverTone}
              onChange={setCoverTone}
              options={[
                { value: 'professional', label: 'Professional & Direct' },
                { value: 'formal',       label: 'Highly Formal (Corporate)' },
                { value: 'startup',      label: 'Startup / Casual' },
                { value: 'creative',     label: 'Creative & Bold' },
              ]}
            />
            <SelectField
              label="ATS Keyword Strategy"
              value={atsKeywords}
              onChange={setAtsKeywords}
              options={[
                { value: 'balanced',    label: 'Balanced (Recommended)' },
                { value: 'aggressive',  label: 'Aggressive (Maximize Match)' },
                { value: 'conservative', label: 'Conservative (Natural Flow)' },
              ]}
            />
            <SelectField
              label="AI Model (Future Ready)"
              value="gemini"
              onChange={() => {}}
              options={[
                { value: 'gemini',    label: 'Gemini 1.5 Pro (Default)' },
                { value: 'gpt4',  label: 'GPT-4o (Premium)' },
                { value: 'claude', label: 'Claude 3.5 Sonnet (Premium)' },
              ]}
            />
          </div>

          <div className="space-y-3">
            <Toggle
              checked={aiPrefs.autoSuggest}
              onChange={(v) => setAiPrefs((p) => ({ ...p, autoSuggest: v }))}
              label="Proactive AI Coaching"
              desc="AI will automatically suggest improvements while you are editing your resume."
            />
            <Toggle
              checked={aiPrefs.showConfidence}
              onChange={(v) => setAiPrefs((p) => ({ ...p, showConfidence: v }))}
              label="Show Confidence Scores"
              desc="Display match percentages and certainty metrics for AI-generated insights."
            />
            <Toggle
              checked={aiPrefs.strictAts}
              onChange={(v) => setAiPrefs((p) => ({ ...p, strictAts: v }))}
              label="Strict ATS Compliance Mode"
              desc="Enforce rigid formatting and penalize creative layouts suitable for older ATS systems."
            />
          </div>

          <div className="pt-6 border-t border-white/[0.05]">
            <GradientButton onClick={handleSaveAiPrefs} className="px-6 h-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Save AI Preferences
            </GradientButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

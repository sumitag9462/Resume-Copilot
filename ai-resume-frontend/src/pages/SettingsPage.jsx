// =============================================================
// src/pages/SettingsPage.jsx — WORKSPACE SETTINGS
//
// Sections:
//   1. Profile — name / email display + edit name
//   2. Change Password
//   3. AI Preferences — default cover-letter tone, ATS keyword focus
//   4. Notifications — toggle email alerts
//   5. Danger Zone — delete account
// =============================================================

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Lock,
  BrainCircuit,
  Bell,
  ShieldAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  ChevronDown,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ── Reusable section wrapper ─────────────────────────────────
const Section = ({ icon: Icon, title, subtitle, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card overflow-hidden"
  >
    {/* Section header */}
    <div className="flex items-center gap-3 border-b border-white/8 px-6 py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C5CFC]/10">
        <Icon className="h-4 w-4 text-[#A78BFA]" />
      </div>
      <div>
        <p className="font-semibold text-white">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
)

// ── Toggle switch ─────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      {desc && <p className="mt-0.5 text-xs text-slate-400">{desc}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#7C5CFC]' : 'bg-white/10'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
)

// ── Select dropdown ───────────────────────────────────────────
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base appearance-none pr-10 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  </div>
)

// ═════════════════════════════════════════════════════════════
const SettingsPage = () => {
  const { user, login, token } = useAuth()

  // ── Profile state ──────────────────────────────────────────
  const [name, setName]             = useState(user?.name || '')
  const [savingProfile, setSaving]  = useState(false)

  // ── Password state ─────────────────────────────────────────
  const [currentPwd,   setCurrentPwd]   = useState('')
  const [newPwd,       setNewPwd]       = useState('')
  const [confirmPwd,   setConfirmPwd]   = useState('')
  const [showCurrent,  setShowCurrent]  = useState(false)
  const [showNew,      setShowNew]      = useState(false)
  const [savingPwd,    setSavingPwd]    = useState(false)

  // ── AI Preferences state ───────────────────────────────────
  const [coverTone,   setCoverTone]   = useState('professional')
  const [atsKeywords, setAtsKeywords] = useState('balanced')
  const [aiPrefs, setAiPrefs] = useState({
    autoSuggest: true,
    showConfidence: true,
    strictAts: false,
  })

  // ── Notification state ─────────────────────────────────────
  const [notifs, setNotifs] = useState({
    atsComplete:   true,
    weeklyDigest:  false,
    matchAlerts:   true,
    coverReady:    true,
  })

  // ── Handlers ───────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    setSaving(true)
    try {
      // Optimistically update local auth state (API call would go here)
      // await updateProfile({ name })
      const updatedUser = { ...user, name: name.trim() }
      login(token, updatedUser)
      toast.success('Profile updated! ✅')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPwd.length < 8) { toast.error('New password must be at least 8 characters'); return }
    if (newPwd !== confirmPwd) { toast.error('Passwords do not match'); return }
    setSavingPwd(true)
    try {
      // await changePassword({ currentPassword: currentPwd, newPassword: newPwd })
      await new Promise((r) => setTimeout(r, 900))  // simulate API
      toast.success('Password changed successfully 🔐')
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
    } catch {
      toast.error('Incorrect current password')
    } finally {
      setSavingPwd(false)
    }
  }

  const handleSaveAiPrefs = () => {
    toast.success('AI preferences saved!')
  }

  const handleDeleteAccount = () => {
    if (!window.confirm('Are you sure? This will permanently delete all your resumes and analyses. This cannot be undone.')) return
    toast.error('Account deletion is disabled in demo mode.')
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl p-6 lg:p-8 page-enter">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#141420_0%,#0F1326_45%,#0F172A_100%)] p-6 shadow-[0_30px_60px_rgba(15,23,42,0.45)] lg:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#A78BFA]">Settings</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Workspace Preferences</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your profile, security, AI defaults, and notification preferences.
          </p>
        </motion.div>

        <div className="space-y-6">

          {/* ── 1. Profile ── */}
          <Section
            icon={User}
            title="Profile"
            subtitle="Your public display name and email address"
            delay={0.04}
          >
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Email (read-only) */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                <div className="input-base flex items-center gap-2 cursor-not-allowed opacity-60 select-none">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                  <span className="text-slate-300">{user?.email || 'user@example.com'}</span>
                  <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">Verified</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base"
                  placeholder="Your full name"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary"
                >
                  {savingProfile
                    ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <><Save className="h-4 w-4" /> Save Profile</>
                  }
                </button>
              </div>
            </form>
          </Section>

          {/* ── 2. Change Password ── */}
          <Section
            icon={Lock}
            title="Change Password"
            subtitle="Use a strong, unique password for this account"
            delay={0.07}
          >
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="input-base pr-10"
                    placeholder="Enter current password"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="input-base pr-10"
                    placeholder="Min 8 characters"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPwd.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          newPwd.length >= i * 3
                            ? newPwd.length >= 12 ? 'bg-emerald-400'
                              : newPwd.length >= 8 ? 'bg-amber-400'
                              : 'bg-red-400'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-[10px] text-slate-400">
                      {newPwd.length < 6 ? 'Weak' : newPwd.length < 10 ? 'Fair' : newPwd.length < 14 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className={`input-base ${confirmPwd && confirmPwd !== newPwd ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="Re-enter new password"
                />
                {confirmPwd && confirmPwd !== newPwd && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={savingPwd} className="btn-primary">
                  {savingPwd
                    ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <><Lock className="h-4 w-4" /> Update Password</>
                  }
                </button>
              </div>
            </form>
          </Section>

          {/* ── 3. AI Preferences ── */}
          <Section
            icon={BrainCircuit}
            title="AI Preferences"
            subtitle="Defaults used when running analysis and generating content"
            delay={0.10}
          >
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Default Cover Letter Tone"
                  value={coverTone}
                  onChange={setCoverTone}
                  options={[
                    { value: 'professional', label: 'Professional' },
                    { value: 'formal',       label: 'Formal' },
                    { value: 'startup',      label: 'Startup / Casual' },
                    { value: 'creative',     label: 'Creative' },
                  ]}
                />
                <SelectField
                  label="ATS Keyword Focus"
                  value={atsKeywords}
                  onChange={setAtsKeywords}
                  options={[
                    { value: 'balanced',    label: 'Balanced (Default)' },
                    { value: 'aggressive',  label: 'Aggressive — maximize matches' },
                    { value: 'conservative', label: 'Conservative — quality first' },
                  ]}
                />
              </div>

              <div className="space-y-2 pt-1">
                <Toggle
                  checked={aiPrefs.autoSuggest}
                  onChange={(v) => setAiPrefs((p) => ({ ...p, autoSuggest: v }))}
                  label="Auto-suggest improvements"
                  desc="Show quick tips after every analysis run"
                />
                <Toggle
                  checked={aiPrefs.showConfidence}
                  onChange={(v) => setAiPrefs((p) => ({ ...p, showConfidence: v }))}
                  label="Show AI confidence scores"
                  desc="Display how confident the AI is about each suggestion"
                />
                <Toggle
                  checked={aiPrefs.strictAts}
                  onChange={(v) => setAiPrefs((p) => ({ ...p, strictAts: v }))}
                  label="Strict ATS mode"
                  desc="Apply stricter formatting rules — recommended for large companies"
                />
              </div>

              <div className="flex justify-end">
                <button onClick={handleSaveAiPrefs} className="btn-primary">
                  <Save className="h-4 w-4" /> Save Preferences
                </button>
              </div>
            </div>
          </Section>

          {/* ── 4. Notifications ── */}
          <Section
            icon={Bell}
            title="Notifications"
            subtitle="Control which email alerts you receive"
            delay={0.13}
          >
            <div className="space-y-2">
              <Toggle
                checked={notifs.atsComplete}
                onChange={(v) => setNotifs((p) => ({ ...p, atsComplete: v }))}
                label="ATS analysis complete"
                desc="Get notified when your resume analysis is ready"
              />
              <Toggle
                checked={notifs.matchAlerts}
                onChange={(v) => setNotifs((p) => ({ ...p, matchAlerts: v }))}
                label="High match score alert"
                desc="Email me when a JD match exceeds 80%"
              />
              <Toggle
                checked={notifs.coverReady}
                onChange={(v) => setNotifs((p) => ({ ...p, coverReady: v }))}
                label="Cover letter generated"
                desc="Notify me when a new cover letter draft is ready"
              />
              <Toggle
                checked={notifs.weeklyDigest}
                onChange={(v) => setNotifs((p) => ({ ...p, weeklyDigest: v }))}
                label="Weekly performance digest"
                desc="A summary of your resume improvements each week"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => toast.success('Notification preferences saved!')} className="btn-primary">
                <Save className="h-4 w-4" /> Save Notifications
              </button>
            </div>
          </Section>

          {/* ── 5. Danger Zone ── */}
          <Section
            icon={ShieldAlert}
            title="Danger Zone"
            subtitle="Irreversible actions — proceed with caution"
            delay={0.16}
          >
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-red-400">Delete Account</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Permanently deletes your account, all uploaded resumes, and all analysis history.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </Section>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage

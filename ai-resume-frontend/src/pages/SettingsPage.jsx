import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// ── Toggle switch ─────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="flex items-center justify-between gap-6 rounded-xl border border-white/[0.06] bg-[#0A0B0F] px-5 py-4 transition-colors hover:border-white/[0.1]">
    <div>
      <p className="text-[14px] font-bold text-white">{label}</p>
      {desc && <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{desc}</p>}
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
)

// ── Select dropdown ───────────────────────────────────────────
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base w-full appearance-none pr-10 text-[14px] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  </div>
)

const SettingsPage = () => {
  const { user, login, token } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

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
      const updatedUser = { ...user, name: name.trim() }
      login(token, updatedUser)
      toast.success('Profile updated successfully!')
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
      await new Promise((r) => setTimeout(r, 900))  // simulate API
      toast.success('Password changed successfully')
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

  const TABS = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'ai', label: 'AI Settings', icon: BrainCircuit },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: ShieldAlert, color: 'text-rose-400' },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1280px] page-enter">
        
        {/* Contextual Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0E101A] p-6 shadow-2xl sm:flex-row sm:items-center sm:p-8 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-slate-500/10 to-transparent opacity-40" />
          
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-500/20 bg-slate-500/10 px-3 py-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace Settings</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">General Preferences</h1>
            <p className="mt-2 text-[14px] text-slate-400 max-w-lg">
              Manage your personal information, security protocols, AI model configurations, and workspace notifications.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">
          
          {/* Vertical Navigation Tabs */}
          <div className="flex flex-col gap-1 sticky top-24">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-accent-violet/10 text-accent-violet-light border border-accent-violet/20 shadow-[0_0_15px_rgba(124,92,252,0.1)]'
                    : `text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent ${tab.color || ''}`
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-accent-violet' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="card p-0 overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* Profile */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-8">
                  <div className="mb-6 border-b border-white/[0.06] pb-4">
                    <h2 className="text-xl font-bold text-white">My Profile</h2>
                    <p className="text-[13px] text-slate-400 mt-1">Manage your public information and email addresses.</p>
                  </div>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet to-accent-teal text-2xl font-black text-white shadow-lg ring-4 ring-[#0A0B0F]">
                        {name.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <button type="button" className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-white/[0.08]">
                          Change Avatar
                        </button>
                        <p className="mt-2 text-[11px] text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Email Address</label>
                      <div className="input-base flex items-center gap-3 cursor-not-allowed opacity-60">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-[14px] text-white font-medium">{user?.email || 'user@example.com'}</span>
                        <span className="ml-auto rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">Verified</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Display Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-base w-full text-[14px]"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="pt-4 border-t border-white/[0.06]">
                      <button type="submit" disabled={savingProfile} className="btn-primary">
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-8">
                  <div className="mb-6 border-b border-white/[0.06] pb-4">
                    <h2 className="text-xl font-bold text-white">Security</h2>
                    <p className="text-[13px] text-slate-400 mt-1">Update your password and secure your account.</p>
                  </div>
                  
                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          value={currentPwd}
                          onChange={(e) => setCurrentPwd(e.target.value)}
                          className="input-base w-full pr-10 text-[14px]"
                          placeholder="Enter current password"
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                          {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">New Password</label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPwd}
                          onChange={(e) => setNewPwd(e.target.value)}
                          className="input-base w-full pr-10 text-[14px]"
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
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        className={`input-base w-full text-[14px] ${confirmPwd && confirmPwd !== newPwd ? 'border-rose-500/50 focus:border-rose-500' : ''}`}
                        placeholder="Re-enter new password"
                      />
                    </div>

                    <div className="pt-4 border-t border-white/[0.06]">
                      <button type="submit" disabled={savingPwd} className="btn-primary">
                        {savingPwd ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* AI Preferences */}
              {activeTab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-8">
                  <div className="mb-6 border-b border-white/[0.06] pb-4">
                    <h2 className="text-xl font-bold text-white">AI Engine Settings</h2>
                    <p className="text-[13px] text-slate-400 mt-1">Configure defaults used during parsing and content generation.</p>
                  </div>
                  
                  <div className="space-y-8 max-w-2xl">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <SelectField
                        label="Default Letter Tone"
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
                        label="ATS Keyword Strategy"
                        value={atsKeywords}
                        onChange={setAtsKeywords}
                        options={[
                          { value: 'balanced',    label: 'Balanced' },
                          { value: 'aggressive',  label: 'Aggressive (Maximize)' },
                          { value: 'conservative', label: 'Conservative (Natural)' },
                        ]}
                      />
                    </div>

                    <div className="space-y-3">
                      <Toggle
                        checked={aiPrefs.autoSuggest}
                        onChange={(v) => setAiPrefs((p) => ({ ...p, autoSuggest: v }))}
                        label="Auto-suggest improvements"
                        desc="Automatically generate coaching tips after ATS analysis runs."
                      />
                      <Toggle
                        checked={aiPrefs.showConfidence}
                        onChange={(v) => setAiPrefs((p) => ({ ...p, showConfidence: v }))}
                        label="Show Confidence Scores"
                        desc="Display match percentages and certainty metrics for generated content."
                      />
                      <Toggle
                        checked={aiPrefs.strictAts}
                        onChange={(v) => setAiPrefs((p) => ({ ...p, strictAts: v }))}
                        label="Strict ATS Compliance"
                        desc="Enforce rigid formatting checks suitable for older applicant tracking systems."
                      />
                    </div>

                    <div className="pt-4 border-t border-white/[0.06]">
                      <button onClick={handleSaveAiPrefs} className="btn-primary">
                        Save AI Preferences
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-8">
                  <div className="mb-6 border-b border-white/[0.06] pb-4">
                    <h2 className="text-xl font-bold text-white">Email Notifications</h2>
                    <p className="text-[13px] text-slate-400 mt-1">Control which alerts get sent to your inbox.</p>
                  </div>
                  
                  <div className="space-y-3 max-w-2xl">
                    <Toggle
                      checked={notifs.atsComplete}
                      onChange={(v) => setNotifs((p) => ({ ...p, atsComplete: v }))}
                      label="ATS Analysis Complete"
                      desc="Receive an email when a large background analysis finishes."
                    />
                    <Toggle
                      checked={notifs.matchAlerts}
                      onChange={(v) => setNotifs((p) => ({ ...p, matchAlerts: v }))}
                      label="High Match Score Alert"
                      desc="Notify me immediately if a JD match exceeds an 80% threshold."
                    />
                    <Toggle
                      checked={notifs.coverReady}
                      onChange={(v) => setNotifs((p) => ({ ...p, coverReady: v }))}
                      label="Draft Generation Complete"
                      desc="Get alerted when cover letters or outreach messages are ready."
                    />
                    <Toggle
                      checked={notifs.weeklyDigest}
                      onChange={(v) => setNotifs((p) => ({ ...p, weeklyDigest: v }))}
                      label="Weekly Performance Digest"
                      desc="Receive a Sunday summary of your resume optimization progress."
                    />
                    
                    <div className="pt-6 border-t border-white/[0.06]">
                      <button onClick={() => toast.success('Notification preferences saved!')} className="btn-primary">
                        Update Notifications
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Danger Zone */}
              {activeTab === 'danger' && (
                <motion.div key="danger" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-8">
                  <div className="mb-6 border-b border-rose-500/20 pb-4">
                    <h2 className="text-xl font-bold text-rose-400">Danger Zone</h2>
                    <p className="text-[13px] text-slate-400 mt-1">Irreversible actions. Please proceed with absolute caution.</p>
                  </div>
                  
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
                    <h3 className="text-[16px] font-bold text-rose-400">Delete Account</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-rose-200/70 max-w-xl mb-6">
                      Permanently remove your account and all associated data. This includes all uploaded resumes, generated cover letters, analysis history, and interview prep logs. This action cannot be reversed.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="rounded-xl bg-rose-500 px-6 py-3 text-[13px] font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-colors hover:bg-rose-600"
                    >
                      Permanently Delete Account
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage

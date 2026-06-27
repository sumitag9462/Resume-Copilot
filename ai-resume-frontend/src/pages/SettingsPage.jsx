import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, BrainCircuit, ShieldAlert,
  CreditCard, Link as LinkIcon, Settings2, Bell, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';

// Phase 14 Components
import ProfileOverview from '../components/settings/ProfileOverview';
import AIPreferences from '../components/settings/AIPreferences';
import SecurityCenter from '../components/settings/SecurityCenter';
import BillingDashboard from '../components/settings/BillingDashboard';
import IntegrationsPanel from '../components/settings/IntegrationsPanel';
import PrivacyCenter from '../components/settings/PrivacyCenter';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Shared States
  const [name, setName] = useState(user?.name || '');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  // AI Preferences
  const [coverTone, setCoverTone] = useState(user?.settings?.ai?.coverTone || 'professional');
  const [atsKeywords, setAtsKeywords] = useState(user?.settings?.ai?.atsKeywords || 'balanced');
  const [aiPrefs, setAiPrefs] = useState({
    autoSuggest: user?.settings?.ai?.autoSuggest ?? true,
    showConfidence: user?.settings?.ai?.showConfidence ?? true,
    strictAts: user?.settings?.ai?.strictAts ?? false,
  });

  // Handlers
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name cannot be empty');
    try {
      const res = await userApi.updateProfile({ name: name.trim() });
      if (res.success) {
        updateUser(res.user);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(res.error || 'Failed to update profile');
      }
    } catch {
      toast.error('An error occurred while updating profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPwd.length < 8) return toast.error('New password must be at least 8 characters');
    if (newPwd !== confirmPwd) return toast.error('Passwords do not match');
    setSavingPwd(true);
    try {
      const res = await userApi.updatePassword({ currentPassword: currentPwd, newPassword: newPwd });
      if (res.success) {
        toast.success('Password changed successfully');
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      } else {
        toast.error(res.error || 'Failed to change password');
      }
    } catch {
      toast.error('An error occurred while updating password');
    } finally {
      setSavingPwd(false);
    }
  };

  const handleSaveAiPrefs = async () => {
    try {
      const newSettings = { coverTone, atsKeywords, ...aiPrefs };
      const res = await userApi.updateAiSettings(newSettings);
      if (res.success) {
        updateUser({ settings: res.settings });
        toast.success('AI preferences saved!');
      } else {
        toast.error(res.error || 'Failed to update AI preferences');
      }
    } catch {
      toast.error('An error occurred while saving AI preferences');
    }
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Are you sure? This action cannot be reversed.')) return;
    toast.error('Account deletion is disabled in demo mode.');
  };

  // OS-Style Tabs Structure
  const TAB_GROUPS = [
    {
      title: "Account",
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
      ]
    },
    {
      title: "Workspace",
      items: [
        { id: 'ai', label: 'AI Engine', icon: BrainCircuit },
        { id: 'integrations', label: 'Integrations & API', icon: LinkIcon },
      ]
    },
    {
      title: "Data & Privacy",
      items: [
        { id: 'privacy', label: 'Privacy Center', icon: Lock },
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] w-full flex flex-col md:flex-row overflow-hidden bg-[#0A0B0F] selection:bg-accent-violet/30 selection:text-white">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-[280px] shrink-0 border-r border-white/[0.05] bg-[#0A0B0F] flex flex-col p-4 overflow-y-auto custom-scrollbar">
          <div className="mb-8 px-2 mt-4">
            <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-accent-violet-light" />
              Settings
            </h1>
          </div>

          <div className="space-y-6">
            {TAB_GROUPS.map((group, idx) => (
              <div key={idx}>
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all relative ${
                          isActive 
                          ? 'bg-accent-violet/10 text-white' 
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <tab.icon className={`w-4 h-4 ${isActive ? 'text-accent-violet-light' : 'opacity-70'}`} />
                        {tab.label}
                        {isActive && (
                          <motion.div 
                            layoutId="activeTabIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-violet-light rounded-r-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[url('/noise.png')] relative">
          <div className="absolute inset-0 bg-[#0A0B0F]/95" />
          
          <div className="relative z-10 max-w-4xl mx-auto w-full p-8 pb-32">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ProfileOverview user={user} name={name} setName={setName} handleSave={handleSaveProfile} />
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SecurityCenter 
                    currentPwd={currentPwd} setCurrentPwd={setCurrentPwd}
                    newPwd={newPwd} setNewPwd={setNewPwd}
                    confirmPwd={confirmPwd} setConfirmPwd={setConfirmPwd}
                    showCurrent={showCurrent} setShowCurrent={setShowCurrent}
                    showNew={showNew} setShowNew={setShowNew}
                    savingPwd={savingPwd} handleChangePassword={handleChangePassword}
                  />
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <BillingDashboard />
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AIPreferences 
                    coverTone={coverTone} setCoverTone={setCoverTone}
                    atsKeywords={atsKeywords} setAtsKeywords={setAtsKeywords}
                    aiPrefs={aiPrefs} setAiPrefs={setAiPrefs}
                    handleSaveAiPrefs={handleSaveAiPrefs}
                  />
                </motion.div>
              )}

              {activeTab === 'integrations' && (
                <motion.div key="integrations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <IntegrationsPanel />
                </motion.div>
              )}

              {activeTab === 'privacy' && (
                <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <PrivacyCenter handleDeleteAccount={handleDeleteAccount} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

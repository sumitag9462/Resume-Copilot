import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingInput, PrimaryButton, AuthLayout, PasswordStrengthIndicator, ErrorMessage } from './AuthComponents';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { token, password });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-2">Create New Password</h2>
        <p className="text-[14px] text-slate-400">Choose a secure password for your workspace.</p>
      </div>

      <ErrorMessage message={error} />

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form key="form" onSubmit={handleResetPassword} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="space-y-4">
              <div>
                <FloatingInput label="New Password" type="password" value={password} onChange={e => {setPassword(e.target.value); setError('');}} required minLength="8" />
                <PasswordStrengthIndicator password={password} />
              </div>
              <FloatingInput label="Confirm New Password" type="password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value); setError('');}} required minLength="8" />
            </div>

            {password !== confirmPassword && confirmPassword && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center">
                <p className="text-[11px] uppercase tracking-widest font-semibold text-amber-400">Passwords do not match</p>
              </div>
            )}

            <div className="pt-2">
              <PrimaryButton type="submit" isLoading={isLoading} disabled={password !== confirmPassword || password.length < 8} loadingText="Securing Account...">
                Update Password <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </motion.form>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-20" />
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Password Updated</h3>
            <p className="text-sm text-slate-400">Redirecting you to login...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ResetPasswordPage;

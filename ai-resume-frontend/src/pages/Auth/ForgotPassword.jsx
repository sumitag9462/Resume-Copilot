import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { FloatingInput, PrimaryButton, OtpInput, AuthLayout, CountdownTimer, ErrorMessage } from './AuthComponents';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const navigate = useNavigate();

  const requestOtp = async () => {
    setIsLoading(true);
    setError('');
    setLoadingText("Sending Recovery Code...");
    try {
      await apiClient.post('/auth/request-password-reset-otp', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    requestOtp();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter a complete 6-digit code.');
      return;
    }
    setIsLoading(true);
    setError('');
    setLoadingText("Verifying Identity...");
    try {
      const res = await apiClient.post('/auth/verify-password-reset-otp', { email, otp });
      if (res.data.success) {
        navigate(`/reset-password/${res.data.resetToken}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col items-center text-center">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Recover Access</h2>
        <p className="text-[14px] text-slate-400">
          {step === 1 ? "Enter your email to receive a recovery code." : "Verify code to restore your workspace."}
        </p>
      </div>

      <ErrorMessage message={error} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form key="step1" onSubmit={handleRequestOtp} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FloatingInput label="Registered Email" type="email" value={email} onChange={e => {setEmail(e.target.value); setError('');}} icon={Mail} required />
            
            <div className="pt-2">
              <PrimaryButton type="submit" isLoading={isLoading} loadingText={loadingText}>
                Send Recovery Code <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
            
            <Link to="/login" className="flex w-full items-center justify-center gap-2 text-[13px] font-medium text-slate-400 transition-colors hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form key="step2" onSubmit={handleVerifyOtp} className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="w-12 h-12 bg-accent-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-accent-teal" />
              </div>
              <p className="text-[13px] text-slate-300">
                We've sent a 6-digit recovery code to<br />
                <strong className="text-white mt-1 inline-block text-sm">{email}</strong>
              </p>
            </div>

            <div className="flex justify-center py-2">
              <OtpInput length={6} value={otp} onChange={setOtp} />
            </div>
            
            <div className="pt-2">
              <PrimaryButton type="submit" isLoading={isLoading} loadingText={loadingText}>
                Verify Code <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>

            <CountdownTimer initialSeconds={60} onResend={requestOtp} />

            <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="mt-4 flex w-full items-center justify-center gap-2 text-[13px] font-medium text-slate-400 transition-colors hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Change email address
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

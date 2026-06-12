import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { FloatingInput, MagneticButton, OtpInput } from './AuthComponents';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await apiClient.post('/auth/request-password-reset-otp', { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            setError('Please enter a complete 6-digit code.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await apiClient.post('/auth/verify-password-reset-otp', { email, otp });
            if (res.data.success) {
                // Navigate to the reset password page with the short-lived recovery token
                navigate(`/reset-password/${res.data.resetToken}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto p-8 border border-slate-100 rounded-2xl shadow-xl bg-white">
                <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Recover Password</h2>
                <p className="text-sm text-slate-500 text-center mb-8">
                    {step === 1 ? "Enter your email to request a reset code." : "Verify code to restore access."}
                </p>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form key="step1" onSubmit={handleRequestOtp} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <FloatingInput label="Registered Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={Mail} required />
                            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
                            <MagneticButton type="submit" isLoading={isLoading}>Send Recovery Code</MagneticButton>
                            
                            <button type="button" onClick={() => navigate('/login')} className="w-full text-center text-sm text-slate-500 hover:text-slate-800 transition-colors">
                                Back to login
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form key="step2" onSubmit={handleVerifyOtp} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-slate-600 text-sm text-center">
                                Enter the 6-digit code sent to <b className="text-slate-800">{email}</b>
                            </p>
                            <OtpInput length={6} value={otp} onChange={setOtp} />
                            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
                            <MagneticButton type="submit" isLoading={isLoading}>Verify Code</MagneticButton>
                            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">Change email</button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

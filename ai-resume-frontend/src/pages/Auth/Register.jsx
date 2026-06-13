import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Sparkles, ArrowRight, Github, Edit2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { FloatingInput, PrimaryButton, OtpInput, AuthLayout, CountdownTimer } from './AuthComponents';

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', mobile: '', place: '', password: '',
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await apiClient.post('/auth/request-email-otp', { email: formData.email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            setError('Please enter a complete 6-digit code.');
            return;
        }
        setIsLoading(true);
        setError('');
        
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        
        try {
            const res = await apiClient.post('/auth/verify-email-otp', {
                name: fullName,
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,
                place: formData.place,
                otp: otp,
            });

            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="mb-8 flex flex-col items-center text-center">
                <Link to="/" className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_8px_30px_rgba(124,111,247,0.3)]">
                    <Sparkles className="h-6 w-6 text-white" />
                </Link>
                <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-2">Create Account</h2>
                <p className="text-[15px] text-slate-400">
                    {step === 1 ? "Start building your AI resume workspace." : "Verify your email to complete registration."}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form key="step1" onSubmit={handleRequestOtp} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FloatingInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            <FloatingInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                        </div>
                        <FloatingInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} icon={Mail} required />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FloatingInput label="Mobile" type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} icon={Phone} required />
                            <FloatingInput label="Location" name="place" value={formData.place} onChange={handleInputChange} icon={MapPin} required />
                        </div>
                        <FloatingInput label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength="8" />
                        
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center">
                                <p className="text-[13px] font-semibold text-red-400">{error}</p>
                            </div>
                        )}
                        
                        <div className="pt-2">
                            <PrimaryButton type="submit" isLoading={isLoading}>
                                Continue to Verification <ArrowRight className="h-4 w-4" />
                            </PrimaryButton>
                        </div>
                        
                        <p className="mt-8 text-center text-[14px] text-slate-400">
                            Already have an account? <Link to="/login" className="font-semibold text-accent-violet transition-colors hover:text-accent-teal hover:underline">Sign In</Link>
                        </p>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form key="step2" onSubmit={handleVerifyAndRegister} className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
                            <Mail className="mx-auto h-8 w-8 text-accent-teal opacity-80 mb-3" />
                            <p className="text-[14px] text-slate-300">
                                Enter the 6-digit code sent to<br />
                                <strong className="text-white mt-1 inline-block">{formData.email}</strong>
                            </p>
                        </div>
                        
                        <div className="flex justify-center py-2">
                            <OtpInput length={6} value={otp} onChange={setOtp} />
                        </div>

                        {message && (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                                <p className="text-[13px] font-semibold text-emerald-400">{message}</p>
                            </div>
                        )}
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center">
                                <p className="text-[13px] font-semibold text-red-400">{error}</p>
                            </div>
                        )}
                        
                        <div className="pt-2">
                            <PrimaryButton type="submit" isLoading={isLoading}>
                                Create Account <Sparkles className="h-4 w-4" />
                            </PrimaryButton>
                        </div>
                        
                        <CountdownTimer initialSeconds={60} onResend={handleRequestOtp} />

                        <button  
                            type="button" 
                            onClick={() => setStep(1)} 
                            className="flex w-full items-center justify-center gap-2 text-[13px] font-medium text-slate-400 transition-colors hover:text-white"
                        >
                            <Edit2 className="h-3.5 w-3.5" /> Edit registration details
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
};

export default RegisterPage;

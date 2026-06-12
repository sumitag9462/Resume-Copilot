import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Lock, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { FloatingInput, MagneticButton, OtpInput } from './AuthComponents';

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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto p-8 border border-slate-100 rounded-2xl shadow-xl bg-white">
                <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Create Account</h2>
                <p className="text-sm text-slate-500 text-center mb-8">
                    {step === 1 ? "Get started in moments." : "Verify your email to complete registration."}
                </p>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form key="step1" onSubmit={handleRequestOtp} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="flex gap-4">
                                <FloatingInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                <FloatingInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                            </div>
                            <FloatingInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} icon={Mail} required />
                            <div className="flex gap-4">
                                <FloatingInput label="Mobile" type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} icon={Phone} required />
                                <FloatingInput label="Location" name="place" value={formData.place} onChange={handleInputChange} icon={MapPin} required />
                            </div>
                            <FloatingInput label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength="8" />
                            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                            <MagneticButton type="submit" isLoading={isLoading}>Send Verification Code</MagneticButton>
                            
                            <p className="text-center text-sm text-slate-500 mt-4">
                                Already have an account? <button type="button" onClick={() => navigate('/login')} className="text-purple-600 font-bold hover:underline">Sign In</button>
                            </p>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form key="step2" onSubmit={handleVerifyAndRegister} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-slate-600 text-sm text-center">
                                Enter the 6-digit code sent to <b className="text-slate-800">{formData.email}</b>
                            </p>
                            <OtpInput length={6} value={otp} onChange={setOtp} />
                            {message && <p className="text-xs text-green-600 text-center font-bold">{message}</p>}
                            {error && <p className="text-xs text-red-500 text-center font-bold">{error}</p>}
                            <MagneticButton type="submit" isLoading={isLoading}>Verify & Create Account</MagneticButton>
                            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Edit registration details</button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RegisterPage;

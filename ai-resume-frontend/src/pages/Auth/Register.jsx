import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight, ArrowLeft, CheckCircle2, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { FloatingInput, PrimaryButton, OtpInput, AuthLayout, CountdownTimer, PasswordStrengthIndicator, ErrorMessage } from './AuthComponents';

const Stepper = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3].map((step) => (
      <div key={step} className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors duration-500 ${currentStep >= step ? 'bg-accent-violet text-white shadow-[0_0_15px_rgba(124,92,252,0.4)]' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
          {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
        </div>
        {step < 3 && (
          <div className={`w-8 h-[2px] rounded-full transition-colors duration-500 ${currentStep > step ? 'bg-accent-violet' : 'bg-white/10'}`} />
        )}
      </div>
    ))}
  </div>
);

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '', place: '', password: '',
    careerStage: '', experience: '', desiredRole: '', skills: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.email || !formData.password || formData.password.length < 8) {
        setError('Please complete all basic info and ensure password is secure.');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const requestOtp = async () => {
    setIsLoading(true);
    setError('');
    setLoadingText("Provisioning Workspace...");
    try {
      await apiClient.post('/auth/request-email-otp', { email: formData.email });
      setStep(4); // Move to OTP
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize workspace. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = (e) => {
    e.preventDefault();
    requestOtp();
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter a complete 6-digit code.');
      return;
    }
    setIsLoading(true);
    setError('');
    setLoadingText("Finalizing Setup...");
    
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    try {
      await apiClient.post('/auth/verify-email-otp', {
        name: fullName,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile || '0000000000',
        place: formData.place || 'Remote',
        otp: otp,
      });

      setStep(5); // Success State
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the code.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col items-center text-center">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Create Workspace</h2>
        <p className="text-[14px] text-slate-400">
          {step === 1 && "Start by securing your account."}
          {step === 2 && "Help AI understand your background."}
          {step === 3 && "Almost done. Finalize your profile."}
          {step === 4 && "Verify your email to complete setup."}
          {step === 5 && "Workspace Ready!"}
        </p>
      </div>

      {step <= 3 && <Stepper currentStep={step} />}
      <ErrorMessage message={error} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              <FloatingInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
            <FloatingInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} icon={Mail} required />
            <FloatingInput label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength="8" />
            <PasswordStrengthIndicator password={formData.password} />
            <div className="pt-4">
              <PrimaryButton onClick={nextStep}>Continue <ArrowRight className="h-4 w-4" /></PrimaryButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button onClick={() => setFormData({...formData, careerStage: 'Student'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.careerStage === 'Student' ? 'border-accent-violet bg-accent-violet/10 text-white' : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'}`}>
                <GraduationCap className="w-6 h-6" />
                <span className="text-xs font-semibold uppercase tracking-wider">Student</span>
              </button>
              <button onClick={() => setFormData({...formData, careerStage: 'Professional'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.careerStage === 'Professional' ? 'border-accent-teal bg-accent-teal/10 text-white' : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'}`}>
                <Briefcase className="w-6 h-6" />
                <span className="text-xs font-semibold uppercase tracking-wider">Professional</span>
              </button>
            </div>
            <FloatingInput label="Years of Experience (e.g. 3)" name="experience" value={formData.experience} onChange={handleInputChange} />
            <FloatingInput label="Desired Role (e.g. Frontend Engineer)" name="desiredRole" value={formData.desiredRole} onChange={handleInputChange} />
            
            <div className="pt-4 flex gap-3">
              <button onClick={prevStep} className="px-6 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
              <PrimaryButton onClick={nextStep} className="flex-1">Continue <ArrowRight className="h-4 w-4" /></PrimaryButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <FloatingInput label="Top Skills (comma separated)" name="skills" value={formData.skills} onChange={handleInputChange} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingInput label="Mobile Number" type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} icon={Phone} />
              <FloatingInput label="Location (City, Country)" name="place" value={formData.place} onChange={handleInputChange} icon={MapPin} />
            </div>
            <div className="p-4 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex gap-3 items-start mt-2">
              <Sparkles className="w-5 h-5 text-accent-violet flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                By creating this workspace, AI will actively analyze your profile to find high-match opportunities.
              </p>
            </div>
            
            <div className="pt-4 flex gap-3">
              <button onClick={prevStep} className="px-6 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
              <PrimaryButton onClick={handleCompleteProfile} isLoading={isLoading} loadingText={loadingText} className="flex-1">Create Workspace</PrimaryButton>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.form key="step4" onSubmit={handleVerifyAndRegister} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="w-12 h-12 bg-accent-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-accent-teal" />
              </div>
              <p className="text-[13px] text-slate-300">
                We've sent a secure 6-digit code to<br />
                <strong className="text-white mt-1 inline-block text-sm">{formData.email}</strong>
              </p>
            </div>
            
            <div className="flex justify-center py-2">
              <OtpInput length={6} value={otp} onChange={setOtp} />
            </div>
            
            <div className="pt-2">
              <PrimaryButton type="submit" isLoading={isLoading} loadingText={loadingText}>
                Verify & Enter <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
            
            <CountdownTimer initialSeconds={60} onResend={requestOtp} />
          </motion.form>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-20" />
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to Resume Copilot</h3>
            <p className="text-sm text-slate-400">Loading your intelligent AI dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 1 && (
        <p className="mt-8 text-center text-[13px] text-slate-400">
          Already have an account? <Link to="/login" className="font-semibold text-white hover:text-accent-teal transition-colors ml-1">Sign In</Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;

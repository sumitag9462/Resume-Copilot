import React, { useRef, useState, useEffect } from 'react';
import { Eye, EyeOff, Github, Linkedin, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Animated Floating Input field
export const FloatingInput = ({ label, type = "text", value, onChange, name, required, icon: Icon, minLength, title, readOnly }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const isFilled = value && value.toString().length > 0;

  return (
    <div className="relative w-full group">
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        title={title}
        readOnly={readOnly}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full rounded-xl border bg-white/[0.02] px-5 pb-3 pt-6 text-[15px] font-medium text-white outline-none transition-all duration-300
          ${isFocused || isFilled ? 'border-accent-violet/60 shadow-[0_0_15px_rgba(124,92,252,0.15)] bg-white/[0.04]' : 'border-white/[0.08] hover:border-white/[0.15]'}
        `}
      />
      <label 
        className={`pointer-events-none absolute left-5 transition-all duration-300 uppercase tracking-widest font-bold
          ${isFocused || isFilled ? 'top-2 text-[9px] text-accent-violet-light' : 'top-[18px] text-xs text-slate-500'}
        `}
      >
        {label}
      </label>
      {Icon && !isPassword && (
        <div className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300
          ${isFocused ? 'text-accent-violet' : 'text-slate-500 group-hover:text-slate-400'}
        `}>
          <Icon size={18} />
        </div>
      )}
      {isPassword && (
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 focus:outline-none
            ${isFocused ? 'text-accent-violet' : 'text-slate-500 hover:text-slate-300'}
          `}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

// Premium SaaS Primary Button
export const PrimaryButton = ({ children, type = "button", onClick, disabled, isLoading, loadingText = "Processing...", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal p-[1px] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 shadow-[0_0_20px_-5px_rgba(124,92,252,0.4)] hover:shadow-[0_0_30px_-5px_rgba(124,92,252,0.6)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent-violet to-accent-teal opacity-100 transition-opacity duration-300 group-hover:opacity-90" />
      <div className="relative flex h-[52px] w-full items-center justify-center gap-2 rounded-[11px] bg-transparent text-[15px] font-bold tracking-wide text-white transition-all">
        {isLoading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>{loadingText}</span>
          </>
        ) : children}
      </div>
    </button>
  );
};

// Premium Social Login Card
export const SocialLoginButton = ({ provider, icon: Icon, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex-1 flex items-center justify-center gap-3 h-14 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-[0_0_20px_-10px_rgba(255,255,255,0.2)]"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-300 group-hover:scale-110" />
      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors duration-300">
        {provider}
      </span>
    </button>
  );
};

// OTP Digits Coordinator
export const OtpInput = ({ length = 6, value, onChange }) => {
  const [otpArray, setOtpArray] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if(value === "") setOtpArray(new Array(length).fill(""));
  }, [value, length]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    
    const newArray = [...otpArray];
    newArray[index] = val.substring(val.length - 1);
    setOtpArray(newArray);
    onChange(newArray.join(""));

    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length).replace(/\D/g, "");
    if(!pastedData) return;
    const newArray = [...otpArray];
    for(let i=0; i<pastedData.length; i++) {
        newArray[i] = pastedData[i];
    }
    setOtpArray(newArray);
    onChange(newArray.join(""));
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex].focus();
  };

  return (
    <div className="flex w-full justify-between gap-2">
      {otpArray.map((digit, i) => (
        <motion.input
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="h-14 w-12 rounded-xl border border-white/[0.08] bg-white/[0.02] text-center text-xl font-bold text-white outline-none transition-all duration-300 focus:border-accent-violet focus:bg-[#151724] focus:shadow-[0_0_20px_rgba(124,92,252,0.2)] focus:-translate-y-1 sm:h-16 sm:w-14"
        />
      ))}
    </div>
  );
};

// Countdown Timer for OTP
export const CountdownTimer = ({ initialSeconds = 60, onResend }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [seconds]);

  const handleResend = () => {
    setSeconds(initialSeconds);
    if (onResend) onResend();
  };

  return (
    <div className="flex items-center justify-center gap-1.5 text-[13px] font-medium mt-6">
      <span className="text-slate-400">Didn't receive a code?</span>
      {seconds > 0 ? (
        <span className="text-slate-500">Resend in {seconds}s</span>
      ) : (
        <button 
          type="button" 
          onClick={handleResend}
          className="text-accent-violet font-semibold transition-colors hover:text-accent-teal hover:underline"
        >
          Resend Code
        </button>
      )}
    </div>
  );
};

// Password Strength Indicator
export const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-white/[0.08]' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score < 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score, label: 'Fair', color: 'bg-amber-400' };
    if (score === 3) return { score, label: 'Good', color: 'bg-blue-400' };
    return { score, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = calculateStrength(password);

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex justify-between items-center text-[12px]">
        <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Password strength</span>
        {strength.label && (
          <span className={`font-bold uppercase tracking-wider text-[10px] ${
            strength.score < 2 ? 'text-rose-500' :
            strength.score === 2 ? 'text-amber-400' :
            strength.score === 3 ? 'text-blue-400' : 'text-emerald-400'
          }`}>
            {strength.label}
          </span>
        )}
      </div>
      <div className="flex h-1 w-full gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 rounded-full transition-colors duration-500 ${
              level <= strength.score ? strength.color : 'bg-white/[0.08]'
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
        <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-emerald-400' : ''}`}>
          <CheckCircle2 className="w-3 h-3" /> Minimum 8 chars
        </div>
        <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-emerald-400' : ''}`}>
          <CheckCircle2 className="w-3 h-3" /> Uppercase letter
        </div>
        <div className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-emerald-400' : ''}`}>
          <CheckCircle2 className="w-3 h-3" /> Number
        </div>
        <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-emerald-400' : ''}`}>
          <CheckCircle2 className="w-3 h-3" /> Special character
        </div>
      </div>
    </div>
  );
};

// Immersive Error Message
export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-200 mb-6 flex flex-col gap-1"
    >
      <span className="font-bold text-rose-400">Authentication Failed</span>
      <span className="opacity-90">{message}</span>
    </motion.div>
  );
};

// Immersive Split-Screen Layout Shell for Auth Pages
export const AuthLayout = ({ children }) => {
  const [resumeCount, setResumeCount] = useState(49950);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setResumeCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex overflow-hidden">
      
      {/* Left Branding Panel (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,92,252,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,212,170,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet to-accent-teal p-[1px]">
            <div className="w-full h-full rounded-xl bg-[#0A0B0F] flex items-center justify-center">
              <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-br from-accent-violet to-accent-teal">RC</span>
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">Resume Copilot</span>
        </div>

        {/* Center Story */}
        <div className="relative z-10 max-w-md mt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl xl:text-5xl font-display font-bold text-white tracking-tight leading-[1.15] mb-6"
          >
            Build Better Resumes.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">Land Better Opportunities.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg leading-relaxed mb-12"
          >
            Resume Copilot helps you optimize resumes, increase ATS scores, match jobs, and prepare for interviews using an intelligent AI workspace.
          </motion.p>

          <div className="flex flex-col gap-4">
            {['ATS Optimization Engine', 'AI Resume Builder', 'Vector Job Matching', 'AI Interview Coach'].map((feature, i) => (
              <motion.div 
                key={feature}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-3 text-slate-300 font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
                </div>
                {feature}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 flex gap-12 mt-12 pt-8 border-t border-white/10">
          <div>
            <div className="text-3xl font-display font-bold text-white mb-1">{(resumeCount).toLocaleString()}+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Resumes Processed</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-accent-teal mb-1">94%</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Avg ATS Score</div>
          </div>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />
        
        {/* Mobile Logo Header */}
        <div className="absolute top-8 left-6 lg:hidden flex items-center gap-3 z-20">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet to-accent-teal p-[1px]">
            <div className="w-full h-full rounded-lg bg-[#0A0B0F] flex items-center justify-center">
              <span className="font-display font-bold text-sm text-transparent bg-clip-text bg-gradient-to-br from-accent-violet to-accent-teal">RC</span>
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">Resume Copilot</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[440px] p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
        >
          {children}
          
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Secure Encryption</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Privacy First</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

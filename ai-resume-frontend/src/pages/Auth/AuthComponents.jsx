import React, { useRef, useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

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
        className={`w-full rounded-xl border bg-[#0E101A] px-5 pb-3 pt-6 text-[15px] font-medium text-white outline-none transition-all duration-300
          ${isFocused || isFilled ? 'border-accent-violet/60 shadow-[0_0_15px_rgba(124,92,252,0.15)] bg-[#121422]' : 'border-white/[0.08] hover:border-white/[0.15]'}
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
export const PrimaryButton = ({ children, type = "button", onClick, disabled, isLoading, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal p-[1px] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 shadow-lg shadow-accent-violet/20 hover:shadow-xl hover:shadow-accent-violet/30 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent-violet to-accent-teal opacity-100 transition-opacity duration-300 group-hover:opacity-90" />
      <div className="relative flex h-[48px] w-full items-center justify-center gap-2 rounded-[11px] bg-transparent text-[15px] font-bold tracking-wide text-white transition-all">
        {isLoading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : children}
      </div>
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
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="h-[56px] w-[46px] rounded-xl border border-white/[0.08] bg-surface text-center text-xl font-bold text-white outline-none transition-all duration-300 focus:border-accent-violet focus:bg-[#151724] focus:shadow-[0_0_15px_rgba(124,92,252,0.15)] focus:ring-1 focus:ring-accent-violet sm:h-[60px] sm:w-[50px]"
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
    <div className="mt-3 flex flex-col gap-1.5">
      <div className="flex h-1.5 w-full gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 rounded-full transition-colors duration-300 ${
              level <= strength.score ? strength.color : 'bg-white/[0.08]'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-[12px]">
        <span className="text-slate-400 font-medium">Password strength</span>
        {strength.label && (
          <span className={`font-bold ${
            strength.score < 2 ? 'text-rose-500' :
            strength.score === 2 ? 'text-amber-400' :
            strength.score === 3 ? 'text-blue-400' : 'text-emerald-400'
          }`}>
            {strength.label}
          </span>
        )}
      </div>
    </div>
  );
};

// Layout Shell for Auth Pages
export const AuthLayout = ({ children }) => {
  return (
    <div className="landing-shell relative flex min-h-screen items-center justify-center p-6 overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="hero-orb hero-orb-a opacity-30" />
      <div className="hero-orb hero-orb-b opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="auth-card relative z-10 w-full max-w-[450px] p-8 sm:p-10 rounded-3xl"
      >
        {children}
      </motion.div>
    </div>
  );
};

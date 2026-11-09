import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordField({
  label = 'Password',
  id,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  autoComplete = 'current-password',
  error,
  disabled = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#111827] dark:text-[#F8FAFC]"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full h-11 pl-3.5 pr-10 rounded-md border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20 text-[#111827] dark:text-[#F8FAFC]'
              : 'border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] dark:placeholder-[#64748B]'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
          className="absolute right-0 top-0 h-11 px-3 text-[#64748B] dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}


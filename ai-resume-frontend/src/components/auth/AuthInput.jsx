import React from 'react';

export default function AuthInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  autoComplete,
  error,
  disabled = false,
  className = '',
  ...props
}) {
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
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full h-11 px-3.5 rounded-md border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20 text-[#111827] dark:text-[#F8FAFC]'
            : 'border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] dark:placeholder-[#64748B]'
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}


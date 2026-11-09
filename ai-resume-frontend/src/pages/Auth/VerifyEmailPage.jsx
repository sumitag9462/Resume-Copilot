import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import ErrorMessage from '../../components/auth/ErrorMessage';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (!email && user?.email) {
      setEmail(user.email);
    }
  }, [user, email]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    if (error) setError('');
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (error) setError('');
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    if (!email) {
      setError('Email address is required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/verify-otp', {
        email: email.trim(),
        otp: fullCode
      });

      if (res.data.success) {
        toast.success('Email verified successfully!');
        if (refreshUser) {
          await refreshUser().catch(() => {});
        }
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Verification failed. Please check the code.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setError('');

    if (!email) {
      setError('Please provide your email address to receive a new code.');
      return;
    }

    setIsResending(true);
    try {
      const res = await apiClient.post('/auth/request-email-otp', {
        email: email.trim()
      });
      if (res.data.success) {
        toast.success('A new verification code has been sent to your email.');
        setResendCooldown(60);
      } else {
        setError(res.data.message || 'Failed to resend code. Please wait a moment.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to resend code right now. Please wait before retrying.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the verification code sent to your email address."
    >
      <ErrorMessage message={error} />

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <AuthInput
            label="Email Address"
            id="verify-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading || isResending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] dark:text-[#F8FAFC] mb-2">
            6-Digit Verification Code
          </label>
          <div className="flex items-center justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isLoading}
                aria-label={`Digit ${i + 1}`}
                className="w-12 h-13 sm:w-13 sm:h-14 text-center text-xl font-mono font-semibold rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length < 6}
          className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className="flex items-center justify-between text-sm pt-2 border-t border-[#E5E7EB] dark:border-[#334155]">
          <span className="text-[#64748B] dark:text-[#CBD5E1]">
            Didn't receive the code?
          </span>
          {resendCooldown > 0 ? (
            <span className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#2563EB] dark:text-[#60A5FA] font-medium hover:underline disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[#64748B] dark:text-[#CBD5E1]">
        <Link
          to="/login"
          className="font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline"
        >
          &larr; Back to Log In
        </Link>
      </p>
    </AuthLayout>
  );
}


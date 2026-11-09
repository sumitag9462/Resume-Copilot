import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import ErrorMessage from '../../components/auth/ErrorMessage';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/request-password-reset-otp', {
        email: trimmedEmail
      });

      if (res.data.success) {
        toast.success('Password reset code sent to your email.');
        setStep(2);
      } else {
        setError(res.data.message || 'Unable to request reset code. Please try again.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send reset code. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedOtp = otp.trim();
    if (trimmedOtp.length < 6) {
      setError('Please enter the 6-digit recovery code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/verify-password-reset-otp', {
        email: email.trim(),
        otp: trimmedOtp
      });

      if (res.data.success && res.data.resetToken) {
        toast.success('Code verified successfully.');
        navigate(`/reset-password/${res.data.resetToken}`);
      } else {
        setError(res.data.message || 'Invalid or expired recovery code.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired recovery code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Your Password?"
      subtitle={
        step === 1
          ? "Enter your email address and we'll send you instructions to reset your password."
          : `Enter the 6-digit recovery code sent to ${email}.`
      }
    >
      <ErrorMessage message={error} />

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <AuthInput
            label="Email Address"
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="name@example.com"
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <AuthInput
            label="6-Digit Recovery Code"
            id="forgot-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''));
              if (error) setError('');
            }}
            placeholder="123456"
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying Code...' : 'Continue to Reset Password'}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={isLoading}
            className="w-full text-center text-xs text-[#64748B] dark:text-[#CBD5E1] hover:underline pt-1"
          >
            Change email address
          </button>
        </form>
      )}

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

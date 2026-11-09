import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordField from '../../components/auth/PasswordField';
import ErrorMessage from '../../components/auth/ErrorMessage';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing or invalid password reset token. Please request a new recovery link.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your confirm password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', {
        token,
        password
      });

      if (res.data.success) {
        setIsSuccess(true);
        toast.success('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password. This link may have expired or already been used.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set a New Password"
      subtitle="Choose a new password for your account."
    >
      <ErrorMessage message={error} />

      {isSuccess ? (
        <div className="py-4 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <p className="text-base font-semibold text-[#111827] dark:text-[#F8FAFC]">
            Password Updated
          </p>
          <p className="text-sm text-[#64748B] dark:text-[#CBD5E1]">
            Your password has been changed. Redirecting to login...
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium mt-2"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            label="New Password"
            id="reset-password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="At least 8 characters"
            required
            disabled={isLoading}
          />

          <PasswordField
            label="Confirm New Password"
            id="reset-confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="Repeat your new password"
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Updating Password...' : 'Set New Password'}
          </button>

          <p className="mt-6 text-center text-sm text-[#64748B] dark:text-[#CBD5E1]">
            <Link
              to="/login"
              className="font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              &larr; Back to Log In
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

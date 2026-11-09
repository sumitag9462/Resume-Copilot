import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import PasswordField from '../../components/auth/PasswordField';
import ErrorMessage from '../../components/auth/ErrorMessage';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const token = credentialResponse.access_token || credentialResponse.credential;
      const res = await loginWithGoogle(token);
      if (res && res.success) {
        toast.success(`Welcome back, ${res.user?.name ? res.user.name.split(' ')[0] : ''}!`);
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Google authentication failed. Please try again.');
      }
    } catch {
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setError('Google sign-in was cancelled or encountered an error.');
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(trimmedEmail, password);
      if (res && res.success) {
        toast.success(`Welcome back, ${res.user?.name ? res.user.name.split(' ')[0] : ''}!`);
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue using Resume Copilot."
    >
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email Address"
          id="login-email"
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[#111827] dark:text-[#F8FAFC]">
              Password <span className="text-red-500">*</span>
            </span>
            <Link
              to="/forgot-password"
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing In...' : 'Log In'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB] dark:border-[#334155]" />
        <span className="text-xs text-[#64748B] dark:text-[#CBD5E1] uppercase">Or</span>
        <div className="flex-1 h-px bg-[#E5E7EB] dark:border-[#334155]" />
      </div>

      <GoogleAuthButton
        onClick={() => {
          setError('');
          googleLogin();
        }}
        disabled={isLoading}
        text="Sign in with Google"
      />

      <p className="mt-6 text-center text-sm text-[#64748B] dark:text-[#CBD5E1]">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline"
        >
          Create an Account
        </Link>
      </p>
    </AuthLayout>
  );
}

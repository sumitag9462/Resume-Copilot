import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import PasswordField from '../../components/auth/PasswordField';
import ErrorMessage from '../../components/auth/ErrorMessage';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithToken, loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const token = credentialResponse.access_token || credentialResponse.credential;
      const res = await loginWithGoogle(token);
      if (res && res.success) {
        toast.success(`Welcome to Resume Copilot, ${res.user?.name ? res.user.name.split(' ')[0] : ''}!`);
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Google sign-up failed.');
      }
    } catch {
      setError('Google sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setError('Google sign-up was cancelled or encountered an error.');
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
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
      const response = await apiClient.post('/auth/register', {
        name: trimmedName,
        email: trimmedEmail,
        password
      });

      if (response.data.success) {
        if (response.data.token) {
          loginWithToken(response.data.token, response.data.user);
        }
        toast.success('Account created successfully!');
        // If email verification is requested by backend, navigate to verify-email
        if (response.data.requiresVerification || response.data.user?.isVerified === false) {
          navigate(`/verify-email?email=${encodeURIComponent(trimmedEmail)}`);
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Get started with Resume Copilot."
    >
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Full Name"
          id="register-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Jane Doe"
          required
          disabled={isLoading}
        />

        <AuthInput
          label="Email Address"
          id="register-email"
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

        <PasswordField
          label="Password"
          id="register-password"
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
          label="Confirm Password"
          id="register-confirm-password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError('');
          }}
          placeholder="Repeat your password"
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
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
        text="Sign up with Google"
      />

      <p className="mt-6 text-center text-sm text-[#64748B] dark:text-[#CBD5E1]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-[#2563EB] dark:text-[#60A5FA] hover:underline"
        >
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
}

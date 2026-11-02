import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import apiClient from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { FloatingInput, PrimaryButton, AuthLayout, PasswordStrengthIndicator, ErrorMessage } from './AuthComponents';

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Provisioning Workspace...');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { loginWithToken, loginWithGoogle } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    setLoadingText("Setting up with Google...");
    try {
      const token = credentialResponse.access_token || credentialResponse.credential;
      const res = await loginWithGoogle(token);
      if (res.success) {
        toast.success(`Welcome to Resume Copilot, ${res.user.name.split(' ')[0]}! 👋`);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Google authentication failed.');
      }
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (err) => {
      console.log('Google register failed or closed:', err);
      setError('Google sign-up was cancelled or encountered an error.');
      setIsLoading(false);
    }
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!firstName) {
      setError('Please enter your first name.');
      return;
    }
    if (!lastName) {
      setError('Please enter your last name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsLoading(true);
    setLoadingText("Provisioning Workspace...");

    const fullName = `${firstName} ${lastName}`.trim();

    try {
      const response = await apiClient.post('/auth/register', {
        name: fullName,
        email: email,
        password: password
      });

      if (response.data.success && response.data.token) {
        loginWithToken(response.data.token, response.data.user);
        setIsSuccess(true);
        toast.success(`Welcome to Resume Copilot, ${firstName}! 🎉`);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col items-center text-center">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Create Workspace</h2>
        <p className="text-[14px] text-slate-400">
          {isSuccess ? "Workspace Ready!" : "Start building your AI-optimized career portfolio"}
        </p>
      </div>

      <ErrorMessage message={error} />

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-20" />
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to Resume Copilot</h3>
            <p className="text-sm text-slate-400">Loading your intelligent AI dashboard...</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleRegister}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Google Authentication */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  googleLogin();
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  Continue with Google
                </span>
              </button>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <span className="relative bg-[#0d0e15] px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                or continue with email
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <FloatingInput
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <FloatingInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              icon={Mail}
              required
            />

            <FloatingInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
            />
            <PasswordStrengthIndicator password={formData.password} />

            <FloatingInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength="8"
            />

            <div className="pt-4">
              <PrimaryButton
                type="submit"
                isLoading={isLoading}
                loadingText={loadingText}
              >
                Create Workspace <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!isSuccess && (
        <p className="mt-8 text-center text-[13px] text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-white hover:text-accent-teal transition-colors ml-1"
          >
            Sign In
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;

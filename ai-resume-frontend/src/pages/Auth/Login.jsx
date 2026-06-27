import React, { useState } from 'react';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FloatingInput, PrimaryButton, AuthLayout } from './AuthComponents';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await login(formData.email, formData.password);
            if (res.success) {
                toast.success(`Welcome back, ${res.user.name.split(' ')[0]}! 👋`);
                navigate('/dashboard');
            } else {
                setError(res.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="mb-8 flex flex-col items-center text-center">
                <Link to="/" className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_8px_30px_rgba(124,111,247,0.3)]">
                    <Sparkles className="h-6 w-6 text-white" />
                </Link>
                <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
                <p className="text-[15px] text-slate-400">Continue your AI hiring journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <FloatingInput 
                    label="Email Address" 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    icon={Mail} 
                    required 
                />
                
                <div className="space-y-1.5">
                    <FloatingInput 
                        label="Password" 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <div className="flex justify-end">
                        <Link 
                            to="/forgot-password" 
                            className="text-[13px] font-semibold text-accent-violet-light transition-colors hover:text-accent-teal hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center">
                        <p className="text-[13px] font-semibold text-red-400">{error}</p>
                    </div>
                )}
                
                <div className="pt-2">
                    <PrimaryButton type="submit" isLoading={isLoading}>
                        Sign In <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-8 text-center text-[14px] text-slate-400">
                Don't have an account? <Link to="/register" className="font-semibold text-accent-violet transition-colors hover:text-accent-teal hover:underline">Create Account</Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;

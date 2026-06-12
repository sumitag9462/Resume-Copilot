import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FloatingInput, MagneticButton } from './AuthComponents';
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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto p-8 border border-slate-100 rounded-2xl shadow-xl bg-white">
                <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Welcome Back</h2>
                <p className="text-sm text-slate-500 text-center mb-8">Sign in to your account to continue</p>

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
                    
                    <div className="space-y-1">
                        <FloatingInput 
                            label="Password" 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                onClick={() => navigate('/forgot-password')} 
                                className="text-xs text-purple-600 font-bold hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
                    
                    <MagneticButton type="submit" isLoading={isLoading} className="mt-4">
                        Sign In
                    </MagneticButton>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account? <button type="button" onClick={() => navigate('/register')} className="text-purple-600 font-bold hover:underline">Create one</button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

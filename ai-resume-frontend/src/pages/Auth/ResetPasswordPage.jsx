import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import { FloatingInput, PrimaryButton, AuthLayout, PasswordStrengthIndicator } from './AuthComponents';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        setIsLoading(true);
        try {
            const res = await apiClient.post('/auth/reset-password', { token, password });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
            setIsLoading(false);
        }
    };
    
    return (
        <AuthLayout>
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_8px_30px_rgba(124,111,247,0.3)]">
                    <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-2">Create New Password</h2>
                <p className="text-[15px] text-slate-400">Choose a secure password for your account.</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <FloatingInput label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="8" />
                        <PasswordStrengthIndicator password={password} />
                    </div>
                    <FloatingInput label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength="8" />
                </div>

                {password !== confirmPassword && confirmPassword && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center">
                        <p className="text-[13px] font-semibold text-amber-400">Passwords do not match</p>
                    </div>
                )}

                {message && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                        <p className="text-[13px] font-semibold text-emerald-400">{message}</p>
                    </div>
                )}
                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center">
                        <p className="text-[13px] font-semibold text-red-400">{error}</p>
                    </div>
                )}

                <div className="pt-2">
                    <PrimaryButton type="submit" isLoading={isLoading} disabled={password !== confirmPassword || password.length < 8}>
                        Update Password <Sparkles className="h-4 w-4" />
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;

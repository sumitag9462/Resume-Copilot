import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { FloatingInput, MagneticButton } from './AuthComponents';

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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto p-8 border border-slate-100 rounded-2xl shadow-xl bg-white">
                <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Create New Password</h2>
                <p className="text-sm text-slate-500 text-center mb-8">Enter your new strong account credentials.</p>

                <form onSubmit={handleResetPassword} className="space-y-6">
                    <FloatingInput label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="8" />
                    <FloatingInput label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength="8" />

                    {password !== confirmPassword && confirmPassword && (
                        <p className="text-xs text-red-500 text-right font-semibold">Passwords do not match</p>
                    )}

                    {message && <p className="text-xs text-green-600 font-bold text-center">{message}</p>}
                    {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

                    <MagneticButton type="submit" isLoading={isLoading} disabled={password !== confirmPassword || password.length < 8}>
                        Reset Password
                    </MagneticButton>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

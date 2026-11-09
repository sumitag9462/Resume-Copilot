import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const hasStoredToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let initialUser = null;
    try {
        if (storedUserStr) initialUser = JSON.parse(storedUserStr);
    } catch (e) {
        console.error("Could not parse stored auth user", e);
    }

    const [authData, setAuthData] = useState({
        user: initialUser,
        isAuthenticated: false, // Never trust unvalidated local token as authenticated
        token: hasStoredToken ? localStorage.getItem('token') : null,
        isLoading: hasStoredToken // Validate on startup
    });

    // A35: Validate stored session via real /me endpoint before granting authenticated access
    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setAuthData(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
                return;
            }

            try {
                const profile = await authApi.getProfile();
                if (profile && (profile._id || profile.id)) {
                    const freshUser = {
                        id: profile._id || profile.id,
                        name: profile.name,
                        email: profile.email,
                        isVerified: profile.isVerified !== false,
                        photo: profile.photo || ''
                    };
                    localStorage.setItem('user', JSON.stringify(freshUser));
                    setAuthData({
                        user: freshUser,
                        isAuthenticated: true,
                        token,
                        isLoading: false
                    });
                } else {
                    throw new Error('Invalid profile payload');
                }
            } catch (err) {
                console.warn('Session verification failed on mount; clearing session:', err.message);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setAuthData({
                    user: null,
                    isAuthenticated: false,
                    token: null,
                    isLoading: false
                });
            }
        };

        validateSession();
    }, []);

    const login = async (email, password) => {
        const res = await authApi.login(email, password);
        if (res.success && res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            setAuthData({ user: res.user, isAuthenticated: true, token: res.token, isLoading: false });
        }
        return res;
    };

    const loginWithGoogle = async (credential) => {
        try {
            const res = await apiClient.post('/auth/google', { credential });
            if (res.data.success && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setAuthData({ user: res.data.user, isAuthenticated: true, token: res.data.token, isLoading: false });
                return res.data;
            }
            return res.data || { success: false, message: 'Google authentication failed' };
        } catch (error) {
            console.error('Google login error', error);
            return error.response?.data || { success: false, message: 'Google authentication failed' };
        }
    };

    const loginWithToken = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthData({ user, isAuthenticated: true, token, isLoading: false });
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            console.error('Logout error', e);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthData({ user: null, isAuthenticated: false, token: null, isLoading: false });
    };

    const updateUser = (partialUser) => {
        try {
            const currentStr = localStorage.getItem('user');
            const currentUser = currentStr ? JSON.parse(currentStr) : {};
            const updatedUser = { ...currentUser, ...(partialUser || {}) };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setAuthData(prev => ({ ...prev, user: updatedUser }));
        } catch (e) {
            console.error('Failed to update local user data', e);
        }
    };

    const value = { ...authData, login, loginWithGoogle, loginWithToken, logout, updateUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

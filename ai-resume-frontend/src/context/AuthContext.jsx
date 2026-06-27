import React, { createContext, useState, useContext } from 'react';
import { authApi } from '../api/authApi';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const getInitialState = () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                return { user: JSON.parse(userStr), isAuthenticated: true, token, isLoading: false };
            }
        } catch (error) {
            console.error("Could not parse stored auth data", error);
        }
        return { user: null, isAuthenticated: false, token: null, isLoading: false };
    };

    const [authData, setAuthData] = useState(getInitialState);

    const login = async (email, password) => {
        const res = await authApi.login(email, password);
        if (res.success) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            setAuthData({ user: res.user, isAuthenticated: true, token: res.token, isLoading: false });
        }
        return res;
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

    const value = { ...authData, login, loginWithToken, logout, updateUser };

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
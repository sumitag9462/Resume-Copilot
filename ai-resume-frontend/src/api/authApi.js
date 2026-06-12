import apiClient from './apiClient';

export const authApi = {
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            return response.data; 
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Invalid credentials" };
        }
    },

    register: async (name, email, password) => {
        try {
            const response = await apiClient.post('/auth/register', { name, email, password });
            return response.data;
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }
};

// Export individual functions to be backward-compatible with older code that might use getMe
export const getMe = authApi.getProfile;
export const loginUser = authApi.login;

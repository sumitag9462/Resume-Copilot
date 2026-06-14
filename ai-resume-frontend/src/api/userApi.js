import apiClient from './axiosConfig';

export const userApi = {
    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await apiClient.put('/user/profile', profileData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update profile'
            };
        }
    },

    // Update password
    updatePassword: async (passwordData) => {
        try {
            const response = await apiClient.put('/user/password', passwordData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update password'
            };
        }
    },

    // Update AI settings
    updateAiSettings: async (settingsData) => {
        try {
            const response = await apiClient.put('/user/settings/ai', settingsData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update AI settings'
            };
        }
    },

    // Update Notification settings
    updateNotificationSettings: async (settingsData) => {
        try {
            const response = await apiClient.put('/user/settings/notifications', settingsData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update notification settings'
            };
        }
    }
};

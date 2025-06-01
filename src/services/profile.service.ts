import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import { UserProfile } from '../contexts/profile-context';

export const profileService = {
  async getProfile() {
    const response = await api.get(API_ENDPOINTS.profile.get);
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const response = await api.put(API_ENDPOINTS.profile.update, data);
    return response.data;
  },

  async updatePreferences(preferences: Partial<UserProfile['preferences']>) {
    const response = await api.put(API_ENDPOINTS.profile.updatePreferences, {
      preferences,
    });
    return response.data;
  },
};
import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface SignupData {
  orga_desc: string;
  orga_code: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  orga_code: string;
  firstName: string;
  email: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.auth.login, data);
    return response.data;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.auth.signup, data);
    return response.data;
  },

  async logout() {
    const response = await api.post(API_ENDPOINTS.auth.logout);
    return response.data;
  },
};
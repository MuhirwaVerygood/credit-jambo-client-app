import { unauthorizedAPI, authorizedAPI } from '../api-client';

export interface LoginData {
  email: string;
  password: string;
  deviceId: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  deviceId: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  balance: number;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  deviceStatus: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await unauthorizedAPI.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await unauthorizedAPI.post('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await authorizedAPI.post('/auth/logout');
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await authorizedAPI.get('/user/profile');
    return response.data;
  },

  async updateProfile(data: { fullName?: string; email?: string; phoneNumber?: string }): Promise<User> {
    const response = await authorizedAPI.put('/user/profile', data);
    return response.data.user;
  },
};
import { authorizedAPI } from '../api-client';
import { User } from './auth.service';

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await authorizedAPI.get('/user/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await authorizedAPI.put('/user/profile', data);
    return response.data.user;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await authorizedAPI.put('/user/password', data);
    return response.data;
  },
};
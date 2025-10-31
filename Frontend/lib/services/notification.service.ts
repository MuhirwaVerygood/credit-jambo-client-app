import { authorizedAPI } from '../api-client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'system';
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    console.log('notificationService - Making API call to /notifications')
    const response = await authorizedAPI.get('/notifications');
    console.log('notificationService - API response:', response.data)
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await authorizedAPI.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await authorizedAPI.put('/notifications/read-all');
  },
};
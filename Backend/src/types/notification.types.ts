export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'system';
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'system';
}

export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'system';
  isRead: boolean;
  createdAt: string;
}
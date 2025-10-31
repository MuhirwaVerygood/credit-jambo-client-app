import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationData, NotificationDTO } from '../types/notification.types';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async createNotification(data: CreateNotificationData): Promise<NotificationDTO> {
    const notification = await this.notificationRepository.create(data);
    return this.notificationRepository.toDTO(notification);
  }

  async getUserNotifications(userId: string): Promise<NotificationDTO[]> {
    const notifications = await this.notificationRepository.findByUserId(userId);
    return Promise.all(
      notifications.map(notification => this.notificationRepository.toDTO(notification))
    );
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
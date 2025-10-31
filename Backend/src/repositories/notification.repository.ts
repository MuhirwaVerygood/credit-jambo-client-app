import { PrismaClient } from '@prisma/client';
import { Notification, CreateNotificationData, NotificationDTO } from '../types/notification.types';

export class NotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateNotificationData): Promise<Notification> {
    const result = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        isRead: false,
      },
    });

    return {
      ...result,
      type: result.type as 'transaction' | 'security' | 'system'
    };
  }


  async findByUserId(userId: string): Promise<Notification[]> {
    const results = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return results.map(result => ({
      ...result,
      type: result.type as 'transaction' | 'security' | 'system'
    }));
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async toDTO(notification: Notification): Promise<NotificationDTO> {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type as 'transaction' | 'security' | 'system',
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
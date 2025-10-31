import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { verifyToken } from '../utils/auth.utils';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      const notifications = await this.notificationService.getUserNotifications(payload.userId);

      res.status(200).json(notifications);
    } catch (error) {
      console.error('[NotificationController] Get notifications error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { notificationId } = req.params;
      await this.notificationService.markAsRead(notificationId);

      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('[NotificationController] Mark as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      await this.notificationService.markAllAsRead(payload.userId);

      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('[NotificationController] Mark all as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
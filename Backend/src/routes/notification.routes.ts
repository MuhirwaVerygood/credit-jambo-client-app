import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get('/', (req, res) => notificationController.getNotifications(req, res));
router.put('/:notificationId/read', (req, res) => notificationController.markAsRead(req, res));
router.put('/read-all', (req, res) => notificationController.markAllAsRead(req, res));

export default router;
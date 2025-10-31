import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { UserRepository } from '../repositories/user.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const notificationRepository = new NotificationRepository(prisma);
const transactionService = new TransactionService(userRepository, transactionRepository, notificationRepository);
const transactionController = new TransactionController(transactionService);

router.post('/deposit', (req, res) => transactionController.deposit(req, res));
router.post('/withdraw', (req, res) => transactionController.withdraw(req, res));
router.get('/history', (req, res) => transactionController.getHistory(req, res));

export default router;
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { DeviceRepository } from '../repositories/device.repository';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

const userRepository = new UserRepository(prisma);
const deviceRepository = new DeviceRepository(prisma);
const authService = new AuthService(userRepository, deviceRepository);
const authController = new AuthController(authService);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
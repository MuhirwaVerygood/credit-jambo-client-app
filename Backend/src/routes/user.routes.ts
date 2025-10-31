import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/profile', (req, res) => userController.getProfile(req, res));
router.put('/profile', (req, res) => userController.updateProfile(req, res));
router.put('/password', (req, res) => userController.changePassword(req, res));

export default router;
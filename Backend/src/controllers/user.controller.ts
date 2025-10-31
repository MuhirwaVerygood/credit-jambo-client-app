import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { verifyToken } from '../utils/auth.utils';

export class UserController {
  constructor(private userService: UserService) {}

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // Check for token in Authorization header first, then fallback to cookies
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      const user = await this.userService.getProfile(payload.userId);

      res.status(200).json(user);
    } catch (error) {
      console.error('[UserController] Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // Check for token in Authorization header first, then fallback to cookies
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      const { fname, lname, phone, email } = req.body;

      const updatedUser = await this.userService.updateProfile(payload.userId, {
        fname,
        lname,
        phone,
        email,
      });

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('[UserController] Update profile error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      // Check for token in Authorization header first, then fallback to cookies
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Current password and new password are required' });
        return;
      }

      await this.userService.changePassword(payload.userId, currentPassword, newPassword);

      res.status(200).json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('[UserController] Change password error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fname, lname, phone, deviceId } = req.body;

      if (!email || !password || !fname || !lname || !phone || !deviceId) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const result = await this.authService.register({
        email,
        password,
        fname,
        lname,
        phone,
        deviceId,
      });

      res.status(201).json({
        message: 'Registration successful. Please wait for device verification.',
        ...result,
      });
    } catch (error) {
      console.error('[AuthController] Registration error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, deviceId } = req.body;

      if (!email || !password || !deviceId) {
        res.status(400).json({ error: 'Email, password, and device ID are required' });
        return;
      }

      const result = await this.authService.login(email, password, deviceId);


      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      console.error('[AuthController] Login error:', error);
      const message = (error as Error).message;
      if (message === 'Device not verified') {
        res.status(403).json({
          error: message,
          message: 'Your device must be verified by an administrator before you can log in.',
          deviceStatus: 'pending',
        });
      } else {
        res.status(401).json({ error: message });
      }
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.logout();

      res.clearCookie('auth-token');
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('[AuthController] Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
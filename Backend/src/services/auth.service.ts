import { UserRepository } from '../repositories/user.repository';
import { DeviceRepository } from '../repositories/device.repository';
import { hashPassword, comparePassword, createToken, validateEmail, validatePassword, JWTPayload } from '../utils/auth.utils';
import { sendDeviceVerificationEmail } from '../utils/email.utils';
import { CreateUserData, UserDTO } from '../types/user.types';
import { CreateDeviceData } from '../types/device.types';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private deviceRepository: DeviceRepository
  ) {}

  async register(data: CreateUserData & { deviceId: string }): Promise<{ userId: string; deviceStatus: string }> {
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = hashPassword(data.password);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    await this.deviceRepository.create({
      userId: user.id,
      deviceId: data.deviceId,
      status: 'pending',
    });

    // Send verification email
    try {
      await sendDeviceVerificationEmail(user.email, data.deviceId);
    } catch (emailError) {
      console.error('[AuthService] Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    return {
      userId: user.id,
      deviceStatus: 'pending',
    };
  }

  async login(email: string, password: string, deviceId: string): Promise<{ user: UserDTO; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!comparePassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const device = await this.deviceRepository.findByUserIdAndDeviceId(user.id, deviceId);
    if (!device || device.status !== 'verified') {
      throw new Error('Device not verified');
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      deviceId,
    });

    const userDTO = await this.userRepository.toDTO(user);

    return { user: userDTO, token };
  }

  async logout(): Promise<void> {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // If we need server-side logout, we could implement a token blacklist
    return Promise.resolve();
  }
}
import { UserRepository } from '../repositories/user.repository';
import { UserDTO, UpdateUserData } from '../types/user.types';
import { validateEmail, hashPassword, comparePassword, validatePassword } from '../utils/auth.utils';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getProfile(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.toDTO(user);
  }

  async updateProfile(userId: string, data: UpdateUserData): Promise<UserDTO> {
    // Validate email if provided
    if (data.email && !validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Check if email is already taken by another user
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already in use');
      }
    }

    const updatedUser = await this.userRepository.update(userId, data);
    return this.userRepository.toDTO(updatedUser);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    if (!comparePassword(currentPassword, user.password)) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Hash and update password
    const hashedPassword = hashPassword(newPassword);
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
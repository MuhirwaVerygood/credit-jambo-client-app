import { PrismaClient } from '@prisma/client';
import { User, CreateUserData, UserDTO } from '../types/user.types';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        fname: data.fname || '',
        lname: data.lname || '',
        phone: data.phone || '',
        balance: 0,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateBalance(id: string, balance: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { balance },
    });
  }

  async update(id: string, data: Partial<CreateUserData>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.fname && { fname: data.fname }),
        ...(data.lname && { lname: data.lname }),
        ...(data.phone && { phone: data.phone }),
        ...(data.email && { email: data.email }),
      },
    });
  }

  async toDTO(user: User): Promise<UserDTO> {
    return {
      id: user.id,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      phone: user.phone,
      balance: user.balance,
      createdAt: user.createdAt,
    };
  }
}
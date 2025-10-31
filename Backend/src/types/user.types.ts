import { User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {}

export interface CreateUserData {
  email: string;
  password: string;
  fname?: string;
  lname?: string;
  phone?: string;
  deviceId: string;
}

export interface UserDTO {
  id: string;
  email: string;
  fname: string;
  lname: string;
  phone: string;
  balance: number;
  createdAt: Date;
}

export interface UpdateUserData {
  fname?: string;
  lname?: string;
  phone?: string;
  email?: string;
}
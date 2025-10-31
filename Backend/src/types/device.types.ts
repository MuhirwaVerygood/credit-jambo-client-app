import { Device as PrismaDevice } from '@prisma/client';

export interface Device extends PrismaDevice {}

export interface CreateDeviceData {
  userId: string;
  deviceId: string;
  status?: string;
}
import { PrismaClient } from '@prisma/client';
import { Device, CreateDeviceData } from '../types/device.types';

export class DeviceRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateDeviceData): Promise<Device> {
    return this.prisma.device.create({
      data,
    });
  }

  async findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<Device | null> {
    return this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });
  }

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return this.prisma.device.findFirst({
      where: { deviceId },
    });
  }

  async updateStatus(id: string, status: string): Promise<Device> {
    return this.prisma.device.update({
      where: { id },
      data: { status },
    });
  }

  async findByUserId(userId: string): Promise<Device[]> {
    return this.prisma.device.findMany({
      where: { userId },
    });
  }
}
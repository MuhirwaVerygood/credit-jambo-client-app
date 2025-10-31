// Device ID utility for persistent device identification
import { getDeviceId } from './device-id';

// In production, replace this with a proper database (Supabase, Neon, etc.)

export interface User {
  id: string
  email: string
  password: string
  fullName: string
  phoneNumber: string
  balance: number
  createdAt: string
  verifiedDevices: string[]
}

export interface DeviceVerification {
  userId: string
  email: string
  deviceId: string
  status: "pending" | "verified" | "rejected"
  requestedAt: string
  verifiedAt?: string
}

export interface Transaction {
  id: string
  userId: string
  type: "deposit" | "withdraw"
  amount: number
  balanceAfter: number
  timestamp: string
}

// Get current device ID
export async function getCurrentDeviceId(): Promise<string> {
  return await getDeviceId();
}

// In-memory storage (replace with database in production)
class DataStore {
  private users: Map<string, User> = new Map()
  private pendingDevices: Map<string, DeviceVerification> = new Map()
  private transactions: Map<string, Transaction[]> = new Map()

  // User operations
  getUser(email: string): User | undefined {
    return this.users.get(email)
  }

  getUserById(id: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.id === id)
  }

  createUser(user: User): void {
    this.users.set(user.email, user)
  }

  updateUser(email: string, updates: Partial<User>): void {
    const user = this.users.get(email)
    if (user) {
      this.users.set(email, { ...user, ...updates })
    }
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  // Device verification operations
  getDevice(deviceId: string): DeviceVerification | undefined {
    return this.pendingDevices.get(deviceId)
  }

  createDevice(device: DeviceVerification): void {
    this.pendingDevices.set(device.deviceId, device)
  }

  updateDevice(deviceId: string, updates: Partial<DeviceVerification>): void {
    const device = this.pendingDevices.get(deviceId)
    if (device) {
      this.pendingDevices.set(deviceId, { ...device, ...updates })
    }
  }

  getAllDevices(): DeviceVerification[] {
    return Array.from(this.pendingDevices.values())
  }

  // Transaction operations
  getTransactions(userId: string): Transaction[] {
    return this.transactions.get(userId) || []
  }

  addTransaction(userId: string, transaction: Transaction): void {
    if (!this.transactions.has(userId)) {
      this.transactions.set(userId, [])
    }
    this.transactions.get(userId)!.push(transaction)
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values()).flat()
  }
}

// Export singleton instance
export const dataStore = new DataStore()
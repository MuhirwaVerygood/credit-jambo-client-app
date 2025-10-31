import { Transaction as PrismaTransaction } from '@prisma/client';

export interface Transaction extends PrismaTransaction {}

export interface CreateTransactionData {
  userId: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  balanceAfter: number;
}

export interface TransactionDTO {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balanceAfter: number;
  timestamp: Date;
  createdAt: string;
  description?: string;
  status: 'completed' | 'pending' | 'failed';
}
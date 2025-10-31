import { PrismaClient } from '@prisma/client';
import { Transaction, CreateTransactionData, TransactionDTO } from '../types/transaction.types';

export class TransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTransactionData): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async toDTO(transaction: Transaction): Promise<TransactionDTO> {
    return {
      id: transaction.id,
      type: transaction.type === 'withdraw' ? 'withdrawal' : transaction.type as 'deposit' | 'withdrawal',
      amount: transaction.amount,
      balanceAfter: transaction.balanceAfter,
      timestamp: transaction.timestamp,
      createdAt: transaction.timestamp.toISOString(),
      description: `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} of $${transaction.amount}`,
      status: 'completed' as const,
    };
  }

}


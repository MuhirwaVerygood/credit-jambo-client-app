import { authorizedAPI } from '../api-client';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balanceAfter: number;
  timestamp: string;
  createdAt: string;
  description?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
}

export interface TransactionResponse {
  message: string;
  transaction: Transaction;
  newBalance: number;
}

export const transactionService = {
  async deposit(amount: number): Promise<TransactionResponse> {
    const response = await authorizedAPI.post('/transactions/deposit', { amount });
    return response.data;
  },

  async withdraw(amount: number): Promise<TransactionResponse> {
    const response = await authorizedAPI.post('/transactions/withdraw', { amount });
    return response.data;
  },

  async getHistory(): Promise<TransactionHistoryResponse> {
    const response = await authorizedAPI.get('/transactions/history');
    return response.data;
  },
};
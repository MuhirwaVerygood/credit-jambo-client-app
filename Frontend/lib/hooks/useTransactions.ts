import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => transactionService.deposit(amount),
    onSuccess: (data) => {
      // Update user balance in cache directly
      queryClient.setQueryData(['user'], (oldUser: any) => {
        if (oldUser) {
          return { ...oldUser, balance: data.newBalance };
        }
        return oldUser;
      });
      // Invalidate transaction history
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => transactionService.withdraw(amount),
    onSuccess: (data) => {
      // Update user balance in cache directly
      queryClient.setQueryData(['user'], (oldUser: any) => {
        if (oldUser) {
          return { ...oldUser, balance: data.newBalance };
        }
        return oldUser;
      });
      // Invalidate transaction history
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useTransactionHistory = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await transactionService.getHistory();
      return response.transactions;
    },
  });
};

export const useTransactions = useTransactionHistory;
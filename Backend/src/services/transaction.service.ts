import { UserRepository } from '../repositories/user.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { sendTransactionNotification } from '../utils/email.utils';
import { CreateTransactionData, TransactionDTO } from '../types/transaction.types';

export class TransactionService {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async deposit(userId: string, amount: number): Promise<{ transaction: TransactionDTO; newBalance: number }> {
    if (amount <= 0) {
      throw new Error('Invalid amount. Must be greater than 0');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newBalance = user.balance + amount;
    await this.userRepository.updateBalance(userId, newBalance);

    const transaction = await this.transactionRepository.create({
      userId,
      type: 'deposit',
      amount,
      balanceAfter: newBalance,
    });

    const transactionDTO = await this.transactionRepository.toDTO(transaction);

    // Create in-app notification
    try {
      await this.notificationRepository.create({
        userId,
        title: 'Deposit Successful',
        message: `You have successfully deposited RWF ${amount.toLocaleString()}. Your new balance is RWF ${newBalance.toLocaleString()}.`,
        type: 'transaction',
      });
    } catch (notificationError) {
      console.error('[TransactionService] Failed to create deposit notification:', notificationError);
    }

    // Send transaction notification email
    try {
      await sendTransactionNotification(user.email, 'deposit', amount, newBalance);
    } catch (emailError) {
      console.error('[TransactionService] Failed to send deposit notification:', emailError);
      // Don't fail the transaction if email fails
    }

    return {
      transaction: transactionDTO,
      newBalance,
    };
  }

  async withdraw(userId: string, amount: number): Promise<{ transaction: TransactionDTO; newBalance: number }> {
    if (amount <= 0) {
      throw new Error('Invalid amount. Must be greater than 0');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const newBalance = user.balance - amount;
    await this.userRepository.updateBalance(userId, newBalance);

    const transaction = await this.transactionRepository.create({
      userId,
      type: 'withdraw',
      amount,
      balanceAfter: newBalance,
    });

    const transactionDTO = await this.transactionRepository.toDTO(transaction);

    // Create in-app notification
    try {
      await this.notificationRepository.create({
        userId,
        title: 'Withdrawal Successful',
        message: `You have successfully withdrawn RWF ${amount.toLocaleString()}. Your new balance is RWF ${newBalance.toLocaleString()}.`,
        type: 'transaction',
      });
    } catch (notificationError) {
      console.error('[TransactionService] Failed to create withdrawal notification:', notificationError);
    }

    // Send transaction notification email
    try {
      await sendTransactionNotification(user.email, 'withdraw', amount, newBalance);
    } catch (emailError) {
      console.error('[TransactionService] Failed to send withdrawal notification:', emailError);
      // Don't fail the transaction if email fails
    }

    return {
      transaction: transactionDTO,
      newBalance,
    };
  }

  async getTransactionHistory(userId: string): Promise<{ transactions: TransactionDTO[]; total: number }> {
    const transactions = await this.transactionRepository.findByUserId(userId);
    const transactionDTOs = await Promise.all(
      transactions.map(transaction => this.transactionRepository.toDTO(transaction))
    );

    return {
      transactions: transactionDTOs,
      total: transactionDTOs.length,
    };
  }
}
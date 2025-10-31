import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { verifyToken } from '../utils/auth.utils';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async deposit(req: Request, res: Response): Promise<void> {
    try {
      // Check for token in Authorization header first, then fallback to cookies
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount. Must be greater than 0' });
        return;
      }

      const result = await this.transactionService.deposit(payload.userId, amount);

      res.status(200).json({
        message: 'Deposit successful',
        transaction: result.transaction,
        newBalance: result.newBalance,
      });
    } catch (error) {
      console.error('[TransactionController] Deposit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async withdraw(req: Request, res: Response): Promise<void> {
    try {
      // Check for token in Authorization header first, then fallback to cookies
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount. Must be greater than 0' });
        return;
      }

      const result = await this.transactionService.withdraw(payload.userId, amount);

      res.status(200).json({
        message: 'Withdrawal successful',
        transaction: result.transaction,
        newBalance: result.newBalance,
      });
    } catch (error) {
      console.error('[TransactionController] Withdrawal error:', error);
      if ((error as Error).message === 'Insufficient balance') {
        let errorToken = req.headers.authorization?.replace('Bearer ', '') || req.cookies['auth-token'];
        const user = await this.transactionService.getTransactionHistory((await verifyToken(errorToken)).userId);
        res.status(400).json({
          error: (error as Error).message,
          currentBalance: user.transactions[0]?.balanceAfter || 0,
          requestedAmount: req.body.amount,
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      // Check for token in Authorization header first, then fallback to cookies
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await verifyToken(token);
      const result = await this.transactionService.getTransactionHistory(payload.userId);

      res.status(200).json(result);
    } catch (error) {
      console.error('[TransactionController] Get history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
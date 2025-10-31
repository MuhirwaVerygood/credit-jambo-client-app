"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/hooks/useAuth"
import { useTransactions, useDeposit, useWithdraw } from "@/lib/hooks/useTransactions"
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, DollarSign, TrendingUp } from "lucide-react"
import { toast } from "react-hot-toast"

export function WalletClient() {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const deposit = useDeposit()
  const withdraw = useWithdraw()
  
  const { data: user } = useUser()
  const { data: transactions } = useTransactions()

  const recentTransactions = transactions?.slice(0, 3) || []

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      await deposit.mutateAsync(parseFloat(depositAmount))
      toast.success(`Successfully deposited $${depositAmount}`)
      setDepositAmount("")
    } catch (error) {
      toast.error("Deposit failed. Please try again.")
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (user && parseFloat(withdrawAmount) > user.balance) {
      toast.error("Insufficient balance")
      return
    }

    try {
      await withdraw.mutateAsync(parseFloat(withdrawAmount))
      toast.success(`Successfully withdrew $${withdrawAmount}`)
      setWithdrawAmount("")
    } catch (error) {
      toast.error("Withdrawal failed. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Wallet Management</h1>
          <p className="text-emerald-600">Manage your deposits and withdrawals</p>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Available Balance</p>
                <p className="text-3xl font-bold">${user?.balance?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Deposits</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ${transactions?.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Withdrawals</p>
                <p className="text-2xl font-bold text-red-600">
                  ${transactions?.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deposit & Withdraw Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
              Deposit Funds
            </CardTitle>
            <CardDescription>
              Add money to your Credit Jambo account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(amount.toString())}
                  className="border-emerald-200 hover:bg-emerald-50"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleDeposit}
              disabled={deposit.isPending || !depositAmount}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {deposit.isPending ? "Processing..." : "Deposit Funds"}
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <ArrowUpRight className="w-5 h-5 text-red-600" />
              Withdraw Funds
            </CardTitle>
            <CardDescription>
              Transfer money from your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                  max={user?.balance || 0}
                />
              </div>
              <p className="text-sm text-gray-500">
                Available: ${user?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={withdraw.isPending || !withdrawAmount}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              {withdraw.isPending ? "Processing..." : "Withdraw Funds"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-500">Your wallet transactions will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-emerald-100 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
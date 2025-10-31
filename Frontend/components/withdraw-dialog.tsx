"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { useWithdraw } from "@/lib/hooks/useTransactions"

interface WithdrawDialogProps {
  children: React.ReactNode
  currentBalance: number
  onSuccess?: () => void
}

export function WithdrawDialog({ children, currentBalance, onSuccess }: WithdrawDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const withdrawMutation = useWithdraw()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const withdrawAmount = Number.parseFloat(amount)
    if (withdrawAmount > currentBalance) {
      const errorMsg = `Insufficient balance. Available: RWF ${currentBalance.toLocaleString()}`
      setError(errorMsg)
      toast({
        title: "Insufficient Balance",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    if (currentBalance - withdrawAmount < 1000 && currentBalance - withdrawAmount > 0) {
      toast({
        title: "Low Balance Warning",
        description: "Your balance will be low after this withdrawal",
        variant: "default",
      })
    }

    withdrawMutation.mutate(withdrawAmount, {
      onSuccess: () => {
        setSuccess(true)
        toast({
          title: "Withdrawal Successful",
          description: `RWF ${withdrawAmount.toLocaleString()} has been withdrawn from your account`,
        })
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setAmount("")
          onSuccess?.()
        }, 2000)
      },
      onError: (error: any) => {
        setError(error.response?.data?.error || "Withdrawal failed")
        toast({
          title: "Withdrawal Failed",
          description: error.response?.data?.error || "An error occurred during withdrawal",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>Withdraw money from your savings account</DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-emerald-600 mb-4" />
            <p className="text-lg font-semibold text-emerald-600">Withdrawal Successful!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  Available balance: RWF {currentBalance.toLocaleString()}
                </AlertDescription>
              </Alert>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (RWF)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  max={currentBalance}
                  step="1"
                  disabled={withdrawMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={withdrawMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={withdrawMutation.isPending}>
                {withdrawMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Withdraw"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
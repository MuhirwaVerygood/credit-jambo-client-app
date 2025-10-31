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
import { Loader2, CheckCircle2 } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { useDeposit } from "@/lib/hooks/useTransactions"
import { toast } from "react-hot-toast"

interface DepositDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function DepositDialog({ children, onSuccess }: DepositDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const depositMutation = useDeposit()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    depositMutation.mutate(Number.parseFloat(amount), {
      onSuccess: () => {
        setSuccess(true)
        toast({
          title: "Deposit Successful",
          description: `RWF ${Number.parseFloat(amount).toLocaleString()} has been added to your account`,
        })
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setAmount("")
          onSuccess?.()
        }, 2000)
      },
      onError: (error: any) => {
        setError(error.response?.data?.error || "Deposit failed")
        toast({
          title: "Deposit Failed",
          description: error.response?.data?.error || "An error occurred during deposit",
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
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>Add money to your savings account</DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-emerald-600 mb-4" />
            <p className="text-lg font-semibold text-emerald-600">Deposit Successful!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (RWF)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="1"
                  disabled={depositMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={depositMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={depositMutation.isPending}>
                {depositMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Deposit"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
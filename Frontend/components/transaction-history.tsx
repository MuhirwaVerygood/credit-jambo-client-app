"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTransactionHistory } from "@/lib/hooks/useTransactions"
import { useSearch } from "@/components/dashboard-layout-client"

interface Transaction {
  id: string
  type: "deposit" | "withdraw"
  amount: number
  balanceAfter: number
  timestamp: string
}

export function TransactionHistory() {
  const { data: transactions, isLoading, error } = useTransactionHistory()
  const { searchQuery } = useSearch()
  
  const filteredTransactions = transactions?.filter(transaction => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      transaction.type.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query) ||
      new Date(transaction.createdAt || transaction.timestamp).toLocaleDateString().includes(query)
    )
  }) || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error?.message || "Failed to load transaction history"}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          {filteredTransactions && filteredTransactions.length > 0
            ? `${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? "s" : ""}`
            : searchQuery ? "No matching transactions" : "No transactions yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!filteredTransactions || filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No transactions yet. Start by making a deposit!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "deposit" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {transaction.type === "deposit" ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold capitalize">{transaction.type}</p>
                      <Badge
                        variant={transaction.type === "deposit" ? "default" : "secondary"}
                        className={
                          transaction.type === "deposit" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""
                        }
                      >
                        {transaction.type === "deposit" ? "+" : "-"}RWF {transaction.amount.toLocaleString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt || transaction.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Balance after</p>
                  <p className="font-semibold">RWF {transaction.balanceAfter.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, LogOut, Leaf, TrendingUp, TrendingDown, Wallet, History, Settings, UserCircle, Menu } from "lucide-react"
import { DepositDialog } from "@/components/deposit-dialog"
import { WithdrawDialog } from "@/components/withdraw-dialog"
import { TransactionHistory } from "@/components/transaction-history"
import { useUser, useLogout } from "@/lib/hooks/useAuth"
import { useSearch } from "@/components/dashboard-layout-client"
import { toast } from "react-hot-toast"

interface User {
  id: string
  email: string
  fullName: string
  phoneNumber: string
  balance: number
  createdAt: string
}

export function DashboardClient() {
  const router = useRouter()
  const { data: user, isLoading, error } = useUser()
  const logoutMutation = useLogout()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { searchQuery } = useSearch()

  // Debug logging
  console.log('User logged in', user)
  console.log('Loading state', isLoading)
  console.log('Error state', error)

  const handleLogout = () => {
    toast.loading('Logging out...', { id: 'logout' })
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully', { id: 'logout' })
        router.push('/login')
      },
      onError: (error) => {
        toast.error('Logout failed', { id: 'logout' })
        // Force logout even if server request fails
        router.push('/login')
      }
    })
  }

  console.log("User logged in", user);

  const handleTransactionComplete = () => {
    // User data will be automatically refetched due to query invalidation in hooks
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error?.message || "Failed to load dashboard"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
          {/* Welcome Section */}
          <div className="mb-6 lg:mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-balance">Welcome back, {user.fullName}!</h2>
              <p className="text-muted-foreground text-sm lg:text-base">Manage your savings and track your financial growth</p>
            </div>
          </div>

        {/* Balance Card */}
        <Card className="mb-8 border-emerald-100 shadow-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-lg" />
          <CardHeader className="relative">
            <CardDescription className="text-emerald-100 flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="h-3 w-3 text-white" />
              </div>
              Total Balance
            </CardDescription>
            <CardTitle className="text-4xl lg:text-6xl font-bold text-balance mb-2">
              RWF {user.balance.toLocaleString()}
            </CardTitle>
            <div className="flex items-center gap-2 text-emerald-100">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              <span className="text-sm">Live balance</span>
            </div>
          </CardHeader>

          <CardContent className="relative flex gap-3">
            <DepositDialog onSuccess={handleTransactionComplete}>
              <Button className="flex-1 bg-white/90 backdrop-blur-sm text-emerald-700 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg border-0">
                <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center mr-2">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                Deposit
              </Button>
            </DepositDialog>
            <WithdrawDialog currentBalance={user.balance} onSuccess={handleTransactionComplete}>
              <Button className="flex-1 bg-emerald-700/80 backdrop-blur-sm hover:bg-emerald-700 hover:scale-105 transition-all duration-200 shadow-lg border-0">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <TrendingDown className="h-3 w-3 text-white" />
                </div>
                Withdraw
              </Button>
            </WithdrawDialog>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <Card className="border-emerald-100 hover:shadow-lg transition-all duration-200 hover:border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Account Status</CardTitle>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 mb-1">Active</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Device verified
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Member Since</CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Account created
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-all duration-200 hover:border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Contact</CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-balance text-purple-600 mb-1">{user.phoneNumber}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Registered phone
              </p>
            </CardContent>
          </Card>
        </div>

            {/* Transaction History */}
            <TransactionHistory />
    </div>
  )
}
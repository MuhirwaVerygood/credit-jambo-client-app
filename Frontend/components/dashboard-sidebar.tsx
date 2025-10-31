"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/dashboard-layout-client"
import {
  LayoutDashboard,
  CreditCard,
  History,
  Settings,
  User,
  Menu,
  X,
  Leaf,
  TrendingUp,
  Wallet,
  PieChart
} from "lucide-react"

interface DashboardSidebarProps {
  className?: string
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & balance"
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: History,
    description: "Transaction history"
  },
  {
    name: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
    description: "Deposit & withdraw"
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account settings"
  }
]

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-[#e9ecef] transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e9ecef]">
        {!isCollapsed && (
          <div className="flex items-center  gap-3">
            <div className="w-8 h-8 bg-[#29b81c] rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#29b81c]">Credit Jambo</h2>
              <p className="text-xs text-[#29b81c]">Savings Platform</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 hover:bg-[#f0f9f0]"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4 text-[#29b81c]" />
          ) : (
            <X className="h-4 w-4 text-[#29b81c]" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-1 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[#f0f9f0] border border-[#29b81c] text-[#29b81c]"
                  : "text-gray-600 hover:bg-[#f0f9f0] hover:text-[#29b81c]"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0",
                isActive ? "text-[#29b81c]" : "text-gray-400 group-hover:text-[#29b81c]"
              )} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 ">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[#e9ecef]">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/wallet">
                <Button
                  size="sm"
                  className="h-20 w-full flex-col gap-1 bg-[#f0f9f0] hover:bg-[#e8f5e8] text-[#29b81c] border border-[#29b81c]"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">Deposit</span>
                </Button>
              </Link>
              <Link href="/dashboard/wallet">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-20 w-full flex-col gap-1 border-[#29b81c] hover:bg-[#f0f9f0] text-[#29b81c]"
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs">Withdraw</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-[#e9ecef]">
        {!isCollapsed && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#f0f9f0] to-[#e8f5e8]">
            <div className="w-8 h-8 bg-[#29b81c] rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#29b81c]">Premium Account</div>
              <div className="text-xs text-[#29b81c]">Verified Member</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
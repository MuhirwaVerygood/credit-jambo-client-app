"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Menu,
  Settings,
  User,
  LogOut
} from "lucide-react"
import { useUser, useLogout } from "@/lib/hooks/useAuth"
import { ProfileDialog } from "@/components/profile-dialog"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { toast } from "react-hot-toast"

interface DashboardHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function DashboardHeader({ onMenuClick, showMenuButton = true }: DashboardHeaderProps) {
  const { data: user } = useUser()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    toast.loading('Logging out...', { id: 'logout' })
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully', { id: 'logout' })
        window.location.href = '/login'
      },
      onError: () => {
        toast.error('Logout failed', { id: 'logout' })
        window.location.href = '/login'
      }
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-[#e9ecef] lg:pl-64 ">
      <div className="flex h-[76px] justify-end px-4 w-full items-center">
        {/* Mobile menu button */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="sm"
            className="mr-4 md:hidden"
            onClick={onMenuClick}
          >
            <div className="w-6 h-6 bg-[#29b81c] rounded-full flex items-center justify-center">
              <Menu className="h-3 w-3 text-white" />
            </div>
          </Button>
        )}


        {/* Actions */}
        <div className="flex items-center     gap-6">
          {/* Notifications */}
          <NotificationsDropdown />



          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={user?.fullName || ''} />
                  <AvatarFallback className="bg-[#29b81c] text-white">
                    {user?.fullName ? getInitials(user.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </header>
  )
}
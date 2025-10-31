"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Bell, Check, Wallet, Shield, Info } from "lucide-react"
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/lib/hooks/useNotifications"


export function NotificationsDropdown() {
  const { data: notifications = [], isLoading, error } = useNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const [isOpen, setIsOpen] = useState(false)

  // Mock notifications for testing when API is not available
  const mockNotifications = [
    {
      id: '1',
      title: 'Deposit Successful',
      message: 'Your deposit of $500 has been processed successfully.',
      type: 'transaction' as const,
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Security Alert',
      message: 'New device login detected from Chrome on Windows.',
      type: 'security' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      title: 'Account Update',
      message: 'Your profile information has been updated.',
      type: 'system' as const,
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]

  const displayNotifications = notifications.length > 0 ? notifications : (error ? mockNotifications : [])
  const unreadCount = displayNotifications.filter(n => !n.isRead).length

  console.log('NotificationsDropdown - displayNotifications:', displayNotifications)
  console.log('NotificationsDropdown - unreadCount:', unreadCount)

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <Wallet className="h-4 w-4 text-emerald-600" />
      case 'security':
        return <Shield className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const handleMarkAsRead = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    markAsRead.mutate(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-600 text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 px-3 text-xs"
              >
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your account activity
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">Loading notifications...</div>
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <div className="text-sm text-gray-500">No notifications yet</div>
            </div>
          ) : (
            <div className="space-y-3">
              {displayNotifications.slice(0, 20).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                    !notification.isRead
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="h-8 w-8 p-0 flex-shrink-0 hover:bg-emerald-100"
                        >
                          <Check className="h-4 w-4 text-emerald-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Bell } from "lucide-react"
import type { RootState } from "@/redux/store"
import { markAllAsRead, markAsRead } from "@/redux/features/notificationsSlice"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the Notification interface
interface Notification {
  id: string;
  read: boolean;
  type: string;
  timestamp: number;
  message: string;
}

export function NotificationCenter() {
  const dispatch = useDispatch()
  const { items, unreadCount } = useSelector((state: RootState) => state.notifications)
  const [isOpen, setIsOpen] = useState(false)

  // Mark all as read when dropdown is closed
  useEffect(() => {
    if (!isOpen && unreadCount > 0) {
      dispatch(markAllAsRead())
    }
  }, [isOpen, dispatch, unreadCount])

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto text-xs px-2 py-1"
              onClick={() => dispatch(markAllAsRead())}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            items.map((notification: Notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${!notification.read ? "bg-muted/50" : ""}`}
                onClick={() => notification.id && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={`h-2 w-2 rounded-full ${notification.type === "price_alert" ? "bg-green-500" : "bg-blue-500"}`}
                  />
                  <span className="text-xs font-medium">
                    {notification.type === "price_alert" ? "Price Alert" : "Weather Alert"}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                </div>
                <p className="mt-1 text-sm">{notification.message}</p>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
"use client"

import { Bell } from "lucide-react"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface Notification {
    id: string
    title: string
    time: string
    read?: boolean
}

interface NotificationBellProps {
    notifications: Notification[]
}

const NotificationBell = ({ notifications }: NotificationBellProps) => {
    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="hidden md:block">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative border-none">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    <>
                        {notifications.map((notification) => (
                            <DropdownMenuItem key={notification.id}>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium">{notification.title}</p>
                                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center justify-center text-sm text-primary">
                            View all notifications
                        </DropdownMenuItem>
                    </>
                ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
    )
}

export default NotificationBell
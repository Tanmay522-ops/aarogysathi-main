"use client"

import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Bell, ChevronDown, LogOut, Moon, PlusIcon, Settings, Sun, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./ui/avatar"
import { useTheme } from "next-themes"
import SearchBar from "./SearchBar"
import NotificationBell from "./NotificationBell"
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "./ui/sidebar"
import { SheetTrigger } from "./ui/sheet"
import Image from "next/image"




const Navbar = () => {
    const notifications = [
        { id: '1', title: 'New message received', time: '2 minutes ago', read: false },
        { id: '2', title: 'Your order has been shipped', time: '1 hour ago', read: false },
        { id: '3', title: 'Password changed successfully', time: '3 hours ago', read: true },
    ]
    const { theme, setTheme } = useTheme()
    const { toggleSidebar,state } = useSidebar()

    return (
        <nav className='p-4 flex items-center justify-between sticky top-0 z-10'>
            
            {/* LEFT */}
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Link
                    href="/"
                    className={`text-lg font-semibold tracking-tight ${state === 'collapsed' ? 'block' : 'hidden lg:block'
                        }`}
                >
                    Dashboard
                </Link>
            </div>
         

            {/* Right */}
            <div className='flex items-center gap-4'>
                
                {/* Left */}

                <AvatarGroup className=" hidden lg:flex">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                        <AvatarImage
                            src="https://github.com/evilrabbit.png"
                            alt="@evilrabbit"
                        />
                        <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount  className="bg-white border-2">
                        <PlusIcon />
                    </AvatarGroupCount>
                </AvatarGroup>

                <NotificationBell notifications={notifications} />
                <SearchBar />


             
               
                {/* UserMenu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-md border px-2 py-1 hover:bg-accent transition">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={10}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className='h-[1.2rem] w-[1.2rem] mr-2' />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className='h-[1.2rem] w-[1.2rem] mr-2' />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem variant='destructive'>
                            <LogOut className='h-[1.2rem] w-[1.2rem] mr-2' />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar

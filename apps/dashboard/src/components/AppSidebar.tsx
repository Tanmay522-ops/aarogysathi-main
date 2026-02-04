"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  FileText,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  Moon,
  Crown,
  MoreVertical,
  User2,
  ChevronUp,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { role } from "@/lib/data"

const mainNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
    visible: ["admin", "doctor", "patient"],
  },

  // ---------------- APPOINTMENTS (ROLE BASED) ----------------
  {
    title: "Appointments",
    icon: Calendar,
    url: "/appointments",
    visible: ["admin", "doctor", "patient"],
    items:
      role === "admin"
        ? [
          { title: "All Appointments", url: "/admin/appointments" },
          { title: "Pending Requests", url: "/admin/appointments/pending" },
          { title: "Completed Visits", url: "/admin/appointments/completed" },
          { title: "Cancelled", url: "/admin/appointments/cancelled" },
        ]
        : role === "doctor"
          ? [
            { title: "Today's Appointments", url: "/doctor/schedule/today" },
            { title: "Upcoming", url: "/doctor/schedule/upcoming" },
            { title: "Completed", url: "/doctor/schedule/completed" },
          ]
          : [
            { title: "Upcoming Visits", url: "/patient/appointments/upcoming" },
            { title: "Past Visits", url: "/patient/appointments/history" },
            { title: "Cancelled", url: "/patient/appointments/cancelled" },
          ],
  },

  // ---------------- ADMIN ----------------
  {
    title: "Doctors",
    icon: Users,
    url: "/admin/doctors",
    visible: ["admin"],
  },
  {
    title: "Patients",
    icon: User2,
    url: "/admin/patients",
    visible: ["admin"],
  },
  {
    title: "Billing",
    icon: CreditCard,
    url: "/admin/billing",
    visible: ["admin"],
  },
  {
    title: "Reports",
    icon: FileText,
    url: "/admin/reports",
    visible: ["admin"],
  },

  // ---------------- DOCTOR ----------------
  {
    title: "My Schedule",
    icon: Calendar,
    url: "/doctor/schedule",
    visible: ["doctor"],
  },
  {
    title: "My Patients",
    icon: Users,
    url: "/doctor/patients",
    visible: ["doctor"],
  },
  {
    title: "Prescriptions",
    icon: FileText,
    url: "/doctor/prescriptions",
    visible: ["doctor"],
  },

  // ---------------- PATIENT ----------------
  {
    title: "Book Appointment",
    icon: Calendar,
    url: "/patient/book",
    visible: ["patient"],
  },
  {
    title: "Medical Records",
    icon: FileText,
    url: "/patient/records",
    visible: ["patient"],
  },
  {
    title: "Payments",
    icon: CreditCard,
    url: "/patient/payments",
    visible: ["patient"],
  },
]

const settingsNavItems = [
  {
    title: "Profile",
    icon: User2,
    url: "/profile",
    visible: ["admin", "doctor", "patient"],
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
    visible: ["admin", "doctor", "patient"],
  },
  {
    title: "Help Center",
    icon: HelpCircle,
    url: "/help",
    visible: ["admin", "doctor", "patient"],
  },
]


const AppSidebar = () => {

  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon" >
      {/* Header - Logo & User */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/assets/icons/logo.svg" alt="logo" width={20} height={20} />
                <span>Tanmay</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      {/* Main Content */}
      <SidebarContent>
        {/* MAIN Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.filter((item) => item.visible.includes(role)).map((item) => {
                const isActive = pathname === item.url

                if (item.items) {
                  return (
                    <Collapsible key={item.title} defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                              isActive && "bg-accent text-accent-foreground font-medium"
                            )}
                          >
                            <item.icon className="h-[18px] w-[18px]" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={cn(
                                    pathname === subItem.url && "font-medium text-foreground"
                                  )}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        isActive && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-[18px] w-[18px]" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SETTINGS Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.filter((item) => item.visible.includes(role))
                .map((item) => {
                  const isActive = pathname === item.url

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={cn(
                          isActive && "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className="h-[18px] w-[18px]" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          {/* Dark Mode Toggle */}
          {/* Dark Mode Toggle */}
          {state === "expanded" && (
            <SidebarMenuItem>
              <div className="flex items-center justify-between w-full px-3 py-2">
                <label
                  htmlFor="dark-mode-switch"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Moon className="h-4 w-4" />
                  <span className="text-sm">Dark Mode</span>
                </label>

                {mounted && (
                  <Switch
                    id="dark-mode-switch"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                )}
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> John Doe <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Setting</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
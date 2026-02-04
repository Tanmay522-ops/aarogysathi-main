import { LucideIcon } from "lucide-react"
export interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    iconColor?: string
    iconBgColor?: string
    variant?: string
    trend?: string
    trendDirection?: 'up' | 'down' | 'neutral'
}




export interface MonthlyStats {
    month: string
    booked: number
    completed: number
}

export interface QuarterlyStats {
    month: string
    booked: number
    completed: number
}

export interface YearlyStats {
    month: string
    booked: number
    completed: number
}

export interface RecentActivityItem {
    id: number
    icon: LucideIcon
    iconBg: string
    iconColor: string
    title: string
    description: string
    badge: string
    badgeColor: string
}


export interface AppointmentDoctor {
    id: number
    icon: string
    name: string
    specialty: string
    appointments: number
    completed: number
    cancelled: number
    revenue: string
}

export interface AppointmentRequest {
    id: string
    name: string
    avatar?: string
    date: string
    time: string
    type: string
}

export interface Appointment {
    id: string
    type: string
    icon: string
    name: string
    avatar?: string
    date: string
    time: string
    contactType: "video" | "phone"
    fullDate: Date
}

export interface AgeGroupStats {
    ageGroup: string
    patients: number
}


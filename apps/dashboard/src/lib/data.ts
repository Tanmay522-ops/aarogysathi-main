
import { Calendar, UserCheck, UserX, Clock} from "lucide-react"
import {  AgeGroupStats, Appointment, AppointmentDoctor, AppointmentRequest, MonthlyStats, QuarterlyStats, RecentActivityItem, YearlyStats } from "./types"


// Realistic data with ~10-15% no-show/cancellation rate
export const monthlyData: MonthlyStats[] = [
    { month: "Jan", booked: 342, completed: 298 },
    { month: "Feb", booked: 318, completed: 276 },
    { month: "Mar", booked: 395, completed: 348 },
    { month: "Apr", booked: 412, completed: 367 },
    { month: "May", booked: 438, completed: 389 },
    { month: "Jun", booked: 461, completed: 408 },
    { month: "Jul", booked: 387, completed: 335 },
    { month: "Aug", booked: 358, completed: 312 },
    { month: "Sep", booked: 445, completed: 398 },
    { month: "Oct", booked: 472, completed: 421 },
    { month: "Nov", booked: 489, completed: 436 },
    { month: "Dec", booked: 425, completed: 368 },
]

export const quarterlyData: QuarterlyStats[] = [
    { month: "Q1 2024", booked: 1055, completed: 922 },
    { month: "Q2 2024", booked: 1311, completed: 1164 },
    { month: "Q3 2024", booked: 1190, completed: 1045 },
    { month: "Q4 2024", booked: 1386, completed: 1225 },
]

export const yearlyData: YearlyStats[] = [
    { month: "2022", booked: 4238, completed: 3685 },
    { month: "2023", booked: 4756, completed: 4198 },
    { month: "2024", booked: 4942, completed: 4356 },
]

export const recentActivities: RecentActivityItem[] = [
    {
        id: 1,
        icon: Calendar,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        title: "Appointment Booked",
        description: "Dr. Sarah Johnson • 15 Feb 26",
        badge: "New Booking",
        badgeColor: "bg-blue-100 text-blue-600"
    },
    {
        id: 2,
        icon: UserCheck,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Appointment Completed",
        description: "Patient: John Doe • 14 Feb 26",
        badge: "Completed",
        badgeColor: "bg-green-100 text-green-600"
    },
    {
        id: 3,
        icon: UserX,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        title: "Appointment Cancelled",
        description: "Dr. Michael Chen • 13 Feb 26",
        badge: "Cancelled",
        badgeColor: "bg-red-100 text-red-600"
    },
    {
        id: 4,
        icon: Clock,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        title: "Rescheduled Appointment",
        description: "Patient: Emma Wilson • 12 Feb 26",
        badge: "Rescheduled",
        badgeColor: "bg-purple-100 text-purple-600"
    },

]


export const appointmentsData: AppointmentDoctor[] = [
    {
        id: 1,
        icon: "👨‍⚕️",
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        appointments: 245,
        completed: 228,
        cancelled: 17,
        revenue: "$45,600",
    },
    {
        id: 2,
        icon: "👩‍⚕️",
        name: "Dr. Michael Chen",
        specialty: "Neurology",
        appointments: 198,
        completed: 185,
        cancelled: 13,
        revenue: "$37,000",
    },
    {
        id: 3,
        icon: "👨‍⚕️",
        name: "Dr. Emily Davis",
        specialty: "Pediatrics",
        appointments: 312,
        completed: 298,
        cancelled: 14,
        revenue: "$46,800",
    },
    {
        id: 4,
        icon: "👩‍⚕️",
        name: "Dr. Robert Taylor",
        specialty: "Orthopedics",
        appointments: 176,
        completed: 168,
        cancelled: 8,
        revenue: "$35,200"
    },
]




export const appointmentRequests: AppointmentRequest[] = [
    {
        id: '1',
        name: 'Sourabh Pathak',
        date: '06 Feb',
        time: '11:00 am - 11:45 am',
        type: 'Individual Counseling'
    },
    {
        id: '2',
        name: "Rohan Mishra",
        date: '08 Feb',
        time: '4:00 am - 6:00 pm',
        type: 'Couple Counseling'
    },
    {
        id: '3',
        name: 'Shyam Mehta',
        date: '08 Feb',
        time: '8:00 pm - 9:00 pm',
        type: 'Family Counseling'
    },
    {
        id: '4',
        name: 'Siya Dubey',
        date: '08 Feb',
        time: '10:00 am - 11:00 am',
        type: 'Full Body Checkup'
    },

]




export const appointments: Appointment[] = [

    {
        id: "1",
        type: "Individual Counselling",
        icon: "individual",
        name: "Rahul Sharma",
        date: "13 Feb",
        time: "11:00 am - 11:45 am",
        contactType: "video",
        fullDate: new Date(2024, 1, 13),
    },
    {
        id: "2",
        type: "Couple Counselling",
        icon: "couple",
        name: "Shyam pandit",
        date: "14 Feb",
        time: "10:00 am - 10:45 am",
        contactType: "phone",
        fullDate: new Date(2024, 1, 14),
    },
    {
        id: "3",
        type: "Family Therapy",
        icon: "family",
        name: "Siya Dubey",
        date: "15 Feb",
        time: "02:00 pm - 02:45 pm",
        contactType: "video",
        fullDate: new Date(2024, 1, 15),
    },
    {
        id: "4",
        type: "Individual Counselling",
        icon: "individual",
        name: "Sneha Patel",
        date: "16 Feb",
        time: "09:30 am - 10:15 am",
        contactType: "phone",
        fullDate: new Date(2024, 1, 16),
    },
    {
        id: "5",
        type: "Career Counselling",
        icon: "career",
        name: "Rahul Mehta",
        date: "17 Feb",
        time: "01:00 pm - 01:45 pm",
        contactType: "video",
        fullDate: new Date(2024, 1, 17),
    },
    {
        id: "6",
        type: "Stress Management",
        icon: "stress",
        name: "Shivani Gupta",
        date: "18 Feb",
        time: "11:15 am - 12:00 pm",
        contactType: "phone",
        fullDate: new Date(2024, 1, 18),
    },
    {
        id: "7",
        type: "Couple Counselling",
        icon: "couple",
        name: "Arjun Singh",
        date: "19 Feb",
        time: "04:00 pm - 04:45 pm",
        contactType: "phone",
        fullDate: new Date(2024, 1, 19),
    },


]


// Age group data matching the image
export const ageGroupData: AgeGroupStats[] = [
    { ageGroup: "8-15", patients: 77 },
    { ageGroup: "16-20", patients: 125 },
    { ageGroup: "21-29", patients: 192 },
    { ageGroup: "30-45", patients: 168 },
    { ageGroup: "46-60", patients: 39 },
    { ageGroup: "61-80", patients: 93 },
]

export const role: "admin" | "doctor" | "patient" = "admin"
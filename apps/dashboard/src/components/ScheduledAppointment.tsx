"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    User,
    Users,
    Baby,
    UsersRound,
    Video,
    Phone,
    MoreVertical,
    Filter,
    Plus,
    CalendarIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DataTablePagination } from "./TablePagination"
import Pagination from "./Pagination"

/* -------------------------------- DATA -------------------------------- */

interface Appointment {
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

const appointments: Appointment[] = [

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



/* -------------------------------- COMPONENT -------------------------------- */

const ScheduledAppointments = () => {
    const [selectedDate, setSelectedDate] = useState(13)
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(
        new Date(2024, 1, 13)
    )
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const datesWithAppointments = appointments.map((a) =>
        a.fullDate.getDate()
    )

    const handleCalendarSelect = (date: Date | undefined) => {
        if (!date) return
        setCalendarDate(date)
        setSelectedDate(date.getDate())
        setIsCalendarOpen(false)
    }

    const getAppointmentIcon = (icon: string) => {
        switch (icon) {
            case "individual":
                return <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            case "couple":
                return <Users className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            case "teen":
                return <Baby className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            case "family":
                return <UsersRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            default:
                return <User className="w-4 h-4" />
        }
    }

    return (
        <Card className="w-full max-w-full overflow-hidden border-gray-200 dark:border-gray-800">
            {/* ---------------- HEADER ---------------- */}

            <CardHeader className="px-5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-md lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        New Appointments
                    </CardTitle>

                    {/* Calendar Picker */}
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "justify-start text-left font-normal h-8",
                                    !calendarDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {calendarDate
                                    ? format(calendarDate, "MMMM yyyy")
                                    : "Pick a date"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-[280px] sm:w-auto p-0"
                            align="end"
                        >
                            <Calendar
                                mode="single"
                                selected={calendarDate}
                                onSelect={handleCalendarSelect}
                                initialFocus
                                modifiers={{
                                    hasAppointment: (date) =>
                                        datesWithAppointments.includes(date.getDate()),
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div> 
            </CardHeader>

            {/* ---------------- CONTENT ---------------- */}

            <CardContent className="px-3">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        Schedule List
                    </h3>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                        >
                            <Filter className="w-2 h-2 lg:w-4 lg:h-4" />
                            Filter
                        </Button>

                        <Button size="sm" className="h-8">
                            <Plus className="w-2 h-2" />
                            Add New
                        </Button>
                    </div>
                </div>

              
                {/* Mobile View */}
                <div className="justify-between lg:hidden space-y-3">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-4"
                        >
                            <div className="flex justify-between mb-2">
                                <div className="flex gap-2">
                                    {getAppointmentIcon(appointment.icon)}
                                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                        {appointment.type}
                                    </span>
                                </div>

                                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>

                            <div className="flex justify-between gap-6 text-xs text-gray-600 dark:text-gray-400">
                                <span>
                                    {appointment.date}, {appointment.time}
                                </span>

                                {appointment.contactType === "video" ? (
                                    <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                ) : (
                                    <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                )}
                            </div>
                        </div>
                    ))}
                    <Pagination/>
                </div>

             
                {/* Desktop View */}
                <div className="hidden lg:block border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <TableHead className="text-gray-900 dark:text-gray-100">Appoint for</TableHead>
                                <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
                                <TableHead className="text-gray-900 dark:text-gray-100">Date & Time</TableHead>
                                <TableHead className="text-gray-900 dark:text-gray-100">Type</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow 
                                    key={appointment.id}
                                    className="border-gray-200 dark:border-gray-700"
                                >
                                    <TableCell className="py-6 px-4">
                                        <div className="flex gap-2 text-gray-900 dark:text-gray-100">
                                            {getAppointmentIcon(appointment.icon)}
                                            {appointment.type}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                        {appointment.name}
                                    </TableCell>

                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                        {appointment.date}, {appointment.time}
                                    </TableCell>

                                    <TableCell>
                                        {appointment.contactType === "video" ? (
                                            <Video className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                        ) : (
                                            <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination/>
                </div>
            </CardContent>
        </Card>
    )
}

export default ScheduledAppointments
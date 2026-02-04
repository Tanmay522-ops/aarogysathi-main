"use client"

import { Users, ArrowUpDown, Filter } from "lucide-react"
import { useState } from "react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { appointmentsData } from "@/lib/data"



const TopDoctors = () => {
    const [sortBy, setSortBy] = useState("appointments")

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground shrink-0" />
                        <CardTitle className="text-base sm:text-lg font-semibold">
                            Top Doctors
                        </CardTitle>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 border rounded-md hover:bg-muted transition">
                            <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Sort</span>
                        </button>

                        <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 border rounded-md hover:bg-muted transition">
                            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Filter</span>
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:px-6">
                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-3">
                    {appointmentsData.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">{doctor.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{doctor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center ">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Appointments</p>
                                    <p className="font-medium text-sm">{doctor.appointments}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Completed</p>
                                    <p className="font-medium text-sm text-green-600">{doctor.completed}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Cancelled</p>
                                    <p className="font-medium text-sm text-red-600">{doctor.cancelled}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block w-full overflow-x-auto">
                    <Table className="w-full border-collapse">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-3 min-w-[200px]">Doctor</TableHead>
                                <TableHead className="px-4 py-3 min-w-[120px]">Specialty</TableHead>
                                <TableHead className="px-4 py-3 text-center">Appointments</TableHead>
                                <TableHead className="px-4 py-3 text-center">Completed</TableHead>
                                <TableHead className="px-4 py-3 text-center">Cancelled</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {appointmentsData.map((doctor) => (
                                <TableRow
                                    key={doctor.id}
                                    className="hover:bg-muted/40 transition border-b last:border-b-0"
                                >
                                    <TableCell className="py-6 px-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{doctor.icon}</span>
                                            <span className="font-medium">{doctor.name}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-6 px-4 text-muted-foreground">
                                        {doctor.specialty}
                                    </TableCell>

                                    <TableCell className="py-6 px-4 font-medium text-center">
                                        {doctor.appointments.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="py-6 px-4 font-medium text-green-600 text-center">
                                        {doctor.completed.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="py-6 px-4 font-medium text-red-600 text-center">
                                        {doctor.cancelled}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default TopDoctors
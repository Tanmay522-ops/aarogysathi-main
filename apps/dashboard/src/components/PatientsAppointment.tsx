"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { appointmentRequests } from '@/lib/data'



const PatientsAppointment = () => {
    const handleAccept = (id: string, name: string) => {
        console.log(`Accepted appointment for ${name}`)
        // Add your accept logic here
    }

    const handleReject = (id: string, name: string) => {
        console.log(`Rejected appointment for ${name}`)
        // Add your reject logic here
    }

    const getAvatarColor = (index: number) => {
        const colors = [
            'from-blue-400 to-blue-600',
            'from-red-400 to-red-600',
            'from-green-400 to-green-600',
            'from-orange-400 to-orange-600',
        ]
        return colors[index % colors.length]
    }

    return (
        <Card className="w-full mx-auto ">
            <CardHeader className="px-5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Appointment Request
                    </CardTitle>
                    <Button
                        variant="link"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto font-normal hover:no-underline"
                    >
                        See All
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 px-5">
                {appointmentRequests.map((appointment, index) => (
                    <div
                        key={appointment.id}
                        className=" border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200"
                    >
                        {/* Appointment Info */}
                        <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10 shrink-0">
                                <AvatarImage src={appointment.avatar} alt={appointment.name} />
                                <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(index)} text-white text-sm font-semibold`}>
                                    {appointment.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight mb-1">
                                    {appointment.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {appointment.date}, {appointment.time}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                    {appointment.type}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <Button
                                variant="ghost"
                                onClick={() => handleReject(appointment.id, appointment.name)}
                                className="w-full text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 font-medium text-sm h-9 rounded-lg"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleAccept(appointment.id, appointment.name)}
                                className="w-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 shadow-none font-medium text-sm h-9 rounded-lg"
                            >
                                Accept
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default PatientsAppointment
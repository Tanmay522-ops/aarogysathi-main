"use client"

import React from 'react'

const appointments = [
    {
        specialist: "Cardiologist",
        date: "Oct 14, 2025",
        time: "2:00 PM",
        reason: "General Consultation",
        payment: "Paid",
    },
    {
        specialist: "Endocrinologist",
        date: "Oct 19, 2025",
        time: "10:30 AM",
        reason: "Follow-up",
        payment: "Unpaid",
    },
    {
        specialist: "Dermatologist",
        date: "Oct 20, 2025",
        time: "1:30 PM",
        reason: "Test Results Review",
        payment: "Insurance",
    },
]

const UpcomingAppointments = () => {
    return (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 w-full">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Upcoming Appointments</h3>

                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 self-start sm:self-auto">
                    View more →
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-3">
                {appointments.map((appt, idx) => (
                    <div
                        key={idx}
                        className="border border-border rounded-lg p-4 hover:bg-muted/40 transition-colors space-y-3"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h4 className="font-semibold text-sm mb-1">{appt.specialist}</h4>
                                <p className="text-xs text-muted-foreground">{appt.reason}</p>
                            </div>
                            <PaymentBadge status={appt.payment} />
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>{appt.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{appt.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">

                    <thead>
                        <tr className="text-muted-foreground text-left border-b">
                            <th className="py-3 font-medium">Specialist</th>
                            <th className="py-3 font-medium">Date</th>
                            <th className="py-3 font-medium">Time</th>
                            <th className="py-3 font-medium">Reason</th>
                            <th className="py-3 font-medium text-right">Payment</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {appointments.map((appt, idx) => (
                            <tr key={idx} className="hover:bg-muted/40 transition">
                                <td className="py-3 font-medium">{appt.specialist}</td>
                                <td>{appt.date}</td>
                                <td>{appt.time}</td>
                                <td>{appt.reason}</td>
                                <td className="text-right">
                                    <PaymentBadge status={appt.payment} />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

function PaymentBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Paid: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        Unpaid: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        Insurance:
            "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    }

    return (
        <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
        >
            {status}
        </span>
    )
}

export default UpcomingAppointments
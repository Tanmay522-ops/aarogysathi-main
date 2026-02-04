"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

const CalendarExample = () => {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [month, setMonth] = React.useState<Date | undefined>(undefined)

    React.useEffect(() => {
        setDate(new Date(2025, 9, 9))
        setMonth(new Date(2025, 9, 1))
    }, [])

    const highlightedDates = React.useMemo(
        () => [
            new Date(2025, 9, 4),
            new Date(2025, 9, 5),
            new Date(2025, 9, 6),
            new Date(2025, 9, 7),
            new Date(2025, 9, 14),
            new Date(2025, 9, 19),
            new Date(2025, 9, 20),
            new Date(2025, 9, 25),
            new Date(2025, 9, 28),
            new Date(2025, 9, 29),
        ],
        []
    )

    if (!month) return null

    return (
        <div className="py-4 w-full">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 w-full">
                <Calendar
                    className="w-full"
                    mode="single"
                    month={month}
                    onMonthChange={setMonth}
                    selected={date}
                    onSelect={setDate}
                    modifiers={{ highlighted: highlightedDates }}
                    modifiersClassNames={{
                        highlighted:
                            "bg-green-100 dark:bg-green-950 text-gray-900 dark:text-green-400 font-medium hover:bg-green-200 dark:hover:bg-green-900",
                    }}
                />
            </div>
        </div>
    )
}

export default CalendarExample
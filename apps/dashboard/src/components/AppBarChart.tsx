"use client"

import { Calendar } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { monthlyData, quarterlyData, yearlyData } from "@/lib/data"


const chartConfig = {
    booked: {
        label: "Total Appointments Booked",
        color: "#8B8BDB",
    },
    completed: {
        label: "Completed Appointments",
        color: "#D4D4F4",
    },
} satisfies ChartConfig

const AppointmentChart = () => {
    const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')

    const getChartData = () => {
        switch (period) {
            case 'monthly':
                return monthlyData
            case 'quarterly':
                return quarterlyData
            case 'yearly':
                return yearlyData
            default:
                return monthlyData
        }
    }

    const calculateStats = () => {
        const data = getChartData()
        const totalBooked = data.reduce((sum, item) => sum + item.booked, 0)
        const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0)
        const completionRate = ((totalCompleted / totalBooked) * 100).toFixed(1)
        const noShows = totalBooked - totalCompleted

        return { totalBooked, totalCompleted, completionRate, noShows }
    }

    const stats = calculateStats()

    return (
        <Card>
            <CardHeader className="space-y-4">
                {/* Header with title and period buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 shrink-0" />
                        <CardTitle className="text-base sm:text-lg font-semibold">
                            Appointments Overview
                        </CardTitle>
                    </div>
                    <div className="flex justify-between sm:gap-2">
                        <button
                            onClick={() => setPeriod('monthly')}
                            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${period === 'monthly'
                                    ? 'bg-[#8B8BDB] text-white'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setPeriod('quarterly')}
                            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${period === 'quarterly'
                                    ? 'bg-[#8B8BDB] text-white'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            Quarterly
                        </button>
                        <button
                            onClick={() => setPeriod('yearly')}
                            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${period === 'yearly'
                                    ? 'bg-[#8B8BDB] text-white'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-sm">
                        <p className="text-muted-foreground text-xs sm:text-sm">Total Booked</p>
                        <p className="text-lg sm:text-xl font-semibold mt-1">
                            {stats.totalBooked.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-sm">
                        <p className="text-muted-foreground text-xs sm:text-sm">Completed</p>
                        <p className="text-lg sm:text-xl font-semibold text-green-600 mt-1">
                            {stats.totalCompleted.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-sm">
                        <p className="text-muted-foreground text-xs sm:text-sm">Completion Rate</p>
                        <p className="text-lg sm:text-xl font-semibold text-blue-600 mt-1">
                            {stats.completionRate}%
                        </p>
                    </div>
                    <div className="text-sm">
                        <p className="text-muted-foreground text-xs sm:text-sm">No-shows/Cancelled</p>
                        <p className="text-lg sm:text-xl font-semibold text-red-600 mt-1">
                            {stats.noShows.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#D4D4F4] shrink-0" />
                        <span className="text-muted-foreground">Completed Appointments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#8B8BDB] shrink-0" />
                        <span className="text-muted-foreground">Total Appointments Booked</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={getChartData()}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            tick={{ fontSize: 12 }}
                            width={45}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                            content={<ChartTooltipContent className="[&_div.flex-1]:gap-8" />}
                        />
                        <Bar
                            dataKey="booked"
                            fill="var(--color-booked)"
                            radius={[8, 8, 0, 0]}
                            stackId="a"
                            activeBar={{
                                fill: "#6F7FFF",
                            }}
                        />
                        <Bar
                            dataKey="completed"
                            fill="var(--color-completed)"
                            radius={[8, 8, 0, 0]}
                            stackId="a"
                            activeBar={{
                                fill: "#B8B8E8",
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default AppointmentChart;
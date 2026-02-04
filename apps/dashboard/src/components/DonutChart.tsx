"use client"

import { Pie, PieChart, Label } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart"

const chartConfig = {
    completed: {
        label: "Completed",
        color: "var(--chart-1)",
    },
    upcoming: {
        label: "Upcoming",
        color: "var(--chart-2)",
    },
    cancelled: {
        label: "Cancelled",
        color: "var(--chart-3)",
    },

} satisfies ChartConfig

type AppointmentKey = keyof typeof chartConfig

const chartData: {
    key: AppointmentKey
    value: number
    fill: string
}[] = [
        { key: "completed", value: 1280, fill: "var(--chart-1)" },
        { key: "upcoming", value: 420, fill: "var(--chart-2)" },
        { key: "cancelled", value: 180, fill: "var(--chart-3)" },
    ]

const AppPieChart = () => {
    const totalAppointments = chartData.reduce((a, b) => a + b.value, 0)

    return (
        <div className="bg-card border border-border rounded-2xl p-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Appointments Overview</h3>
                <button className="text-sm text-foreground px-4 py-1.5 border border-border rounded-md hover:bg-muted transition-colors w-fit">
                    View All
                </button>
            </div>

            {/* Donut */}
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />

                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="key"
                        innerRadius={70}
                        outerRadius={95}
                        strokeWidth={0}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                className="fill-foreground text-sm"
                                                dy="-4"
                                            >
                                                Total Appointments
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                dy="22"
                                                className="fill-foreground text-xl font-semibold"
                                            >
                                                {totalAppointments}
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="mt-4 space-y-2">
                {chartData.map((item) => {
                    const percent = Math.round(
                        (item.value / totalAppointments) * 100
                    )

                    return (
                        <div
                            key={item.key}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: item.fill }}
                                />
                                <span className="text-muted-foreground">
                                    {chartConfig[item.key].label}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="font-medium">
                                    {item.value}
                                </span>
                                <span className="text-muted-foreground w-10 text-right">
                                    {percent}%
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AppPieChart

"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ageGroupData } from "@/lib/data"



const chartConfig = {
    patients: {
        label: "Patients",
        color: "#6B7FFF",
    },
} satisfies ChartConfig

const PatientsChart = () => {
    const [timePeriod, setTimePeriod] = useState("This Month")

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                        Patients Overview
                    </CardTitle>
                    <Select value={timePeriod} onValueChange={setTimePeriod}>
                        <SelectTrigger className="w-[140px] h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="This Week">This Week</SelectItem>
                            <SelectItem value="This Month">This Month</SelectItem>
                            <SelectItem value="This Quarter">This Quarter</SelectItem>
                            <SelectItem value="This Year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 ">
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={ageGroupData}
                        margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="0" stroke="#F0F0F0" />
                        <XAxis
                            dataKey="ageGroup"
                            tickLine={false}
                            tickMargin={12}
                            axisLine={false}
                            tick={{ fontSize: 13, fill: "#666" }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 13, fill: "#666" }}
                            ticks={[0, 20, 50, 100, 150]}
                            domain={[0, 150]}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="patients"
                            fill="var(--color-patients)"
                            radius={[6, 6, 6, 6]}
                            maxBarSize={60}
                            label={{
                                position: 'top',
                                fontSize: 12,
                                fill: '#666',
                                fontWeight: 500,
                                formatter: (value:any) => value,
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default PatientsChart
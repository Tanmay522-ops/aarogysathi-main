"use client"
import { Droplet, HeartPulse, Scale } from "lucide-react"

import * as React from "react"


const WeightCard = () => {
     const [month, setMonth] = React.useState(new Date(2025, 9)) // October 2025
        const [selected, setSelected] = React.useState<Date | undefined>(
            new Date(2025, 9, 9)
        )
    return (
        <div className="space-y-4   ">
        <div className="relative overflow-hidden rounded-2xl bg-[#cfe3d4] dark:bg-[#2d4a35] p-5 h-[130px] flex items-center">

            {/* Left Section */}
            <div className="z-10">
                <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-white/70 dark:bg-white/10 flex items-center justify-center">
                        <Scale className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="font-medium text-sm">Weight</span>
                </div>
            </div>

            {/* Right Value */}
            <div className="ml-auto z-10 text-right">
                <span className="text-3xl font-semibold">
                    58
                </span>
                <span className="text-sm ml-1 text-muted-foreground">
                    kg
                </span>
            </div>

            {/* Wave SVG */}
            <svg
                className="absolute bottom-0 left-0 w-full h-[70px]"
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
            >
                <path
                    d="M0 80 
             C 80 20, 
               160 120, 
               240 70
             S 400 40, 
               500 80"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    opacity="0.7"
                />

                {/* Highlight point */}
                <circle cx="300" cy="55" r="7" fill="white" />
            </svg>

            {/* Floating Badge */}
            <div className="absolute bottom-14 left-[60%] -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full">
                64 kg
            </div>
            
        </div>
           
        </div>
        

        
    )
}
export default WeightCard

"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { recentActivities } from "@/lib/data"
import { Clock } from "lucide-react"



const RecentActivity = () => {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                        <CardTitle className="text-base md:text-lg">Recent Activity</CardTitle>
                    </div>
                    <button className="text-sm text-foreground px-4 py-1.5 border border-border rounded-md hover:bg-muted transition-colors w-fit">
                        See All
                    </button>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <div className="space-y-3">
                    {recentActivities.map((activity)=>{
                        const Icon = activity.icon
                        return(
                            <div 
                            key={activity.id}
                                className="flex items-start gap-3 p-4 md:p-5 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className={`${activity.iconBg} p-2 rounded-full shrink-0`}>
                                    <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-foreground line-clamp-1">
                                        {activity.title}
                                    </h4>
                                    <p className=" md:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                        {activity.description}
                                    </p>
                                </div>
                                <span className={` text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap shrink-0 ${activity.badgeColor}`}>
                                    {activity.badge}
                                </span>
                                <div className={` w-2 h-2 rounded-full shrink-0 mt-1 ${activity.iconBg}`} />

                            </div>
                        )

                    })}

                </div>
               
            </CardContent>
        </Card>
    )
}

export default RecentActivity;



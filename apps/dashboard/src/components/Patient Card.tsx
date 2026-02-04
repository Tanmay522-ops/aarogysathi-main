"use client"
import { Droplet, HeartPulse } from 'lucide-react'
import React from 'react'

const PatientCard = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
   
                   {/* Heart Rate */}
          <div className="rounded-2xl bg-white dark:bg-gray-900  p-4 shadow-sm border dark:border-gray-800 ">
                       <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <HeartPulse className="h-5 w-5 text-green-700 dark:text-green-400" />
                           </div>
                           <span className="text-sm font-medium">Heart rate</span>
                       </div>
   
                       <div className="mt-4 flex items-end gap-1">
                           <span className="text-3xl font-semibold">70</span>
                           <span className="text-sm text-muted-foreground mb-1">bpm</span>
                       </div>
                   </div>
   
                   {/* Blood Glucose */}
          <div className="rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-sm border dark:border-gray-800">
                       <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <Droplet className="h-5 w-5 text-green-700 dark:text-green-400" />
                           </div>
                           <span className="text-sm font-medium">Blood Glucose</span>
                       </div>
   
                       <div className="mt-4 flex items-end gap-1">
                           <span className="text-3xl font-semibold">4,5</span>
                           <span className="text-sm text-muted-foreground mb-1">mmol/L</span>
                       </div>
                   </div>
   
               </div>
  )
}

export default PatientCard

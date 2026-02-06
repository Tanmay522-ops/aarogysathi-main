"use client"

import dynamic from "next/dynamic"

const PatientForm = dynamic(
    () => import("./PatientForm"),
    {
        ssr: false,
        loading: () => (
            <div className="mt-10 space-y-4">
                <div className="h-10 bg-gray-800 rounded animate-pulse" />
                <div className="h-10 bg-gray-800 rounded animate-pulse" />
                <div className="h-10 bg-gray-800 rounded animate-pulse" />
            </div>
        ),
    }
)

export default PatientForm

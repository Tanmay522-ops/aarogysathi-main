import PatientCard from "@/components/Patient Card"
import CalendarExample from "@/components/CalendarExample"
import UpcomingAppointments from "@/components/UpcomingAppointment"
import WeightCard from "@/components/WeightCard"
import { Maximize, Mic, PhoneOff, Video } from "lucide-react"

const PatientPage = () => {
  return (
    <div className=' '>
      <div className='flex gap-4 sm:gap-6 flex-col xl:flex-row'>

        {/* Left Section */}
        <div className='w-full xl:w-2/3 flex flex-col gap-4 sm:gap-6 lg:gap-8'>

          {/* Video Call Section */}
          <div className='w-full'>
            <div
              className="relative w-full h-[300px] sm:h-[380px] md:h-[420px] lg:h-[480px] rounded-xl overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: "url('/assets/images/doctor.jpeg')",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Top Left Name */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 text-white">
                <p className="font-semibold text-base sm:text-lg">Scarlet Everett</p>
                <span className="text-xs sm:text-sm opacity-80">0:21:43</span>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4 bg-white/90 dark:bg-black/60 backdrop-blur px-3 sm:px-4 py-2 rounded-full shadow-md">

                {/* End Call */}
                <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition">
                  <PhoneOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </button>

                {/* Video */}
                <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 border hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                </button>

                {/* Mic */}
                <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 border hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                </button>

                {/* Fullscreen */}
                <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 border hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
                  <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                </button>

              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className='w-full'>
            <UpcomingAppointments />
          </div>
        </div>

        {/* Right Section */}
        <div className='w-full xl:w-1/3 flex flex-col gap-4 sm:gap-6'>
          <WeightCard />
          <PatientCard />
          <CalendarExample />
        </div>

      </div>
    </div>
  )
}

export default PatientPage
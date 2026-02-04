import PatientsChart from '@/components/PatientChart'
import PatientsAppointment from '@/components/PatientsAppointment'
import ScheduledAppointments from '@/components/ScheduledAppointment'
import UpcomingAppointments from '@/components/ScheduledAppointment'
import StatsCard from '@/components/StatsCard'
import { CalendarCheck, CalendarDays, CalendarX, Eye, UserPlus, Users } from 'lucide-react'


const DoctorsPage = () => {
    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 '>
                {/* Sales Revenue Chart - Takes 2 columns on large screens */}
                <div className=' grid grid-cols-2  gap-4 p-4 rounded-md  '>
                   
                    <div className="bg-card text-card-foreground rounded-2xl border border-white dark:border-gray-800 px-6 py-4 flex items-center transition-colors">
                        <StatsCard
                            title="Total Councelling"
                            value="2900"
                            icon={Users}
                            iconColor="text-blue-600"
                            iconBgColor="bg-white-100"
                            variant="doctors"
                            trend="+5.6%"
                            trendDirection="up"

                        />

                    </div>
                    <div className="bg-card text-card-foreground rounded-2xl border border-white dark:border-gray-800  px-6 py-4 flex items-center transition-colors">
                        <StatsCard
                            title="Overall Booking"
                            value="2900"
                            icon={CalendarCheck}
                            iconColor="text-green-600"
                            iconBgColor="bg-white-100"
                            variant="doctors"
                            trend="-0.2%"
                            trendDirection="down"
                        />
                    </div>
                    <div className="bg-card text-card-foreground rounded-2xl border border-white dark:border-gray-800  px-6 py-4 flex items-center transition-colors">
                        <StatsCard
                            title="New Appointments"
                            value="2900"
                            icon={UserPlus}
                            iconColor="text-orange-600"
                            iconBgColor="bg-white-100"
                            variant="doctors"
                            trend="-0.9%"
                            trendDirection="down"
                        />
                    </div>
                    <div className="bg-card text-card-foreground rounded-2xl border border-white dark:border-gray-800 px-6 py-4 flex items-center transition-colors">
                        <StatsCard
                            title="Cancel Appointment"
                            value="2900"
                            icon={CalendarX}
                            iconColor="text-red-600"
                            iconBgColor="bg-white-50"
                            variant="doctors"
                            trend="+3%"
                            trendDirection="up"
                        />
                    </div>
                    <div className="bg-card text-card-foreground rounded-2xl border border-white dark:border-gray-800 px-6 py-4 flex items-center transition-colors">
                        <StatsCard
                            title="Total Visitors"
                            value="2900"
                            icon={Eye}
                            iconColor="text-green-900"
                            iconBgColor="bg-white-200"
                            variant="doctors"
                            trend="+7.3%"
                            trendDirection="up"
                        />
                    </div>
                    <div className="bg-card text-card-foreground rounded-2xl border border-white dark:border-gray-800  px-6 py-4 flex items-center transition-colors">
                        <StatsCard
                            title="Appointment Today"
                            value="2900"
                            icon={CalendarDays}
                            iconColor="text-purple-600"
                            iconBgColor="bg-white-100"
                            variant="doctors"
                            trend="+0.0%"
                            trendDirection="neutral"
                        />
                    </div>

                </div>
               
                        <PatientsChart/>
               
            </div>


            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className=' lg:col-span-2'>
                        <ScheduledAppointments/>
                </div>
                        <PatientsAppointment/>
            </div>
        </div>
    )
}

export default DoctorsPage

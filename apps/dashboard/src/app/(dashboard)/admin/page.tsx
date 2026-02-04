import AppBarChart from '@/components/AppBarChart'
import AppPieChart from '@/components/DonutChart'
import RecentActivity from '@/components/RecentActivity'
import StatsCard from '@/components/StatsCard'
import UserCard from '@/components/StatsCard'
import TopDoctors from '@/components/TopDoctors'
import { BarChart, DollarSign, Package, Stethoscope, TrendingDown, TrendingUp, User2 } from 'lucide-react'
import React from 'react'

const AdminPage = () => {
  return (
    <div className='space-y-4'>
      {/* Stats Cards Row */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm px-6 py-4 flex items-center transition-colors">
          <StatsCard
            title="Total Patient"
            value="10,892"
            icon={User2}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
        </div>
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm px-6 py-4 flex items-center transition-colors">
          <StatsCard
            title="Total Income"
            value="$157,32456"
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
          />

        </div>
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm px-6 py-4 flex items-center transition-colors">
          <StatsCard
            title="Total Expenses"
            value="$12,453"
            icon={TrendingDown}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
        </div>
        <div className="bg-card text-card-foreground rounded-2xl border border-border  shadow-sm px-6 py-4 flex items-center transition-colors">
          <StatsCard
            title="Total Expenses"
            value="$12,453"
            icon={TrendingDown}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
        </div>
      </div>

      {/* Charts and Categories Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 '>
        {/* Sales Revenue Chart - Takes 2 columns on large screens */}
        <div className=' border lg:col-span-2'>
          <AppBarChart/>
        </div>

        {/* Top Categories Donut Chart */}
        <AppPieChart/>

      </div>

      {/* Recent Activity and Top Products Row */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>     
            <RecentActivity/>
            <TopDoctors/>

      </div>
    </div>
  )
}

export default AdminPage
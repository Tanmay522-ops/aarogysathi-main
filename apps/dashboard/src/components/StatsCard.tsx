
import { StatsCardProps } from '@/lib/types';
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react'




const formatValue = (value: string | number): string => {
    // If it's already a string with currency symbol or custom format, return as is
    if (typeof value === 'string' && (value.includes('$') || value.includes('%'))) {
        const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
        if (isNaN(numericValue)) return value;

        const prefix = value.match(/^[^0-9.-]*/)?.[0] || '';
        const suffix = value.match(/[^0-9.-]*$/)?.[0] || '';

        return prefix + formatNumber(numericValue) + suffix;
    }

    // Convert to number
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

    if (isNaN(num)) return value.toString();

    return formatNumber(num);
}

const formatNumber = (num: number): string => {
    const absNum = Math.abs(num);

    if (absNum >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (absNum >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (absNum >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return num.toLocaleString();
}

const StatsCard = ({
    title,
    value,
    icon: Icon,
    iconColor = "text-blue-600",
    iconBgColor = "bg-blue-100",
    variant = "default",
    trend,
    trendDirection = 'neutral'
}: StatsCardProps) => {

    const isDoctors = variant === "doctors"
    return (
            <div className='flex items-center w-full gap-3 lg:gap-5  '>
            <div className={`${iconBgColor} ${iconColor}    ${isDoctors
                ? " lg:p-3 border border-muted-foreground/20 rounded-md "
                : "p-2.5 rounded-lg"
  }`}>
                <Icon className={` ${isDoctors ? "hidden lg:block" :"w-4 h-4 lg:w-6 lg:h-6"}`}/>
                </div>
            <div className="flex flex-col">
                <p className="text-xs lg:text-sm text-muted-foreground mb-0.5 ">
                    {title}
                </p>

                <div className='flex gap-2  items-center lg:gap-5  '>
                <h3 className="text-lg  lg:text-2xl font-semibold leading-tight">
                    {formatValue(value)}
                </h3>
                
                    {trend && (
                        <div className={cn(
                            'flex items-center gap-0.5 text-xs font-medium',
                            trendDirection === 'up' && 'text-green-600',
                            trendDirection === 'down' && 'text-red-600',
                            trendDirection === 'neutral' && 'text-gray-500'
                        )}>
                            {trendDirection === 'up' && <ArrowUp className="w-3 h-3" />}
                            {trendDirection === 'down' && <ArrowDown className="w-3 h-3" />}
                            <span>{trend}</span>
                        </div>
                    )}

            </div>
                
            </div>
        </div>
    )
}

export default StatsCard
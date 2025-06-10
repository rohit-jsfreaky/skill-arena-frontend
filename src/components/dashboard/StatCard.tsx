import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
  valueClassName,
}: StatCardProps) => {
  return (
    <div className={cn(
      "bg-black/70 border border-[#BBF429]/30 rounded-lg p-5 shadow-lg flex flex-col",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className={cn("text-2xl font-bold text-white mt-1", valueClassName)}>
            {value}
          </h3>
        </div>
        <div className={cn(
          "p-3 rounded-full bg-[#BBF429]/10", 
          iconClassName
        )}>
          <Icon className="h-5 w-5 text-[#BBF429]" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4">
          <span className={`text-xs font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-xs text-gray-400 ml-1">since last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
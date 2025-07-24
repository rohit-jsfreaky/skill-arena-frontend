import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  DollarSign, 
  Users, 
  Calendar, 
  Award, 
  BarChart3,
  TrendingUp,
  GamepadIcon
} from "lucide-react";
import apiClient from "@/utils/apiClient";
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformStat {
  id: number;
  stat_key: string;
  stat_value: number;
  stat_label: string;
  stat_description?: string;
  display_order: number;
  icon?: string;
  format_type: 'number' | 'currency' | 'percentage';
}

const PlatformStatsBanner: React.FC = () => {
  const [stats, setStats] = useState<PlatformStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconMap: Record<string, React.ReactNode> = {
    'trophy': <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />,
    'dollar-sign': <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />,
    'users': <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
    'calendar': <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />,
    'award': <Award className="h-5 w-5 sm:h-6 sm:w-6" />,
    'bar-chart': <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />,
    'trending-up': <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
    'gamepad': <GamepadIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
  };

  useEffect(() => {
    fetchBannerStats();
  }, []);

  const fetchBannerStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/platform-stats/banner");
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError("Failed to fetch platform statistics");
      }
    } catch (error) {
      console.error("Error fetching banner stats:", error);
      setError("Failed to fetch platform statistics");
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number, formatType: string) => {
    switch (formatType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getIconColor = (index: number) => {
    const colors = [
      'text-yellow-400', // Gold
      'text-green-400',  // Green
      'text-blue-400',   // Blue
      'text-purple-400', // Purple
      'text-red-400',    // Red
      'text-pink-400',   // Pink
    ];
    return colors[index % colors.length];
  };

  const getGradientBg = (index: number) => {
    const gradients = [
      'from-yellow-500/20 to-yellow-600/10',
      'from-green-500/20 to-green-600/10',
      'from-blue-500/20 to-blue-600/10',
      'from-purple-500/20 to-purple-600/10',
      'from-red-500/20 to-red-600/10',
      'from-pink-500/20 to-pink-600/10',
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 border border-[#BBF429]/30">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                <Skeleton className="h-6 w-16 bg-gray-700" />
                <Skeleton className="h-4 w-20 bg-gray-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || stats.length === 0) {
    return null; // Don't show anything if there's an error or no stats
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 border border-[#BBF429]/30 backdrop-blur-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#BBF429] mb-1">
            Platform Statistics
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Live gaming community metrics
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:gap-0 gap-6 ">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`
                relative overflow-hidden rounded-lg p-3 sm:p-4 
                bg-gradient-to-br ${getGradientBg(index)}
                border border-gray-700/50 hover:border-[#BBF429]/50 
                transition-all duration-300 hover:scale-105
                group cursor-pointer
              `}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              
              <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
                {/* Icon */}
                <div className={`
                  p-2 sm:p-3 rounded-full bg-black/20 backdrop-blur-sm
                  ${getIconColor(index)} group-hover:scale-110 transition-transform duration-300
                `}>
                  {iconMap[stat.icon || 'bar-chart'] || <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />}
                </div>
                
                {/* Value */}
                <div className="space-y-1">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {formatValue(stat.stat_value, stat.format_type)}
                  </p>
                  
                  {/* Label */}
                  <p className="text-xs sm:text-sm font-medium text-gray-300 leading-tight">
                    {stat.stat_label}
                  </p>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#BBF429]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Optional description */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs text-gray-500">
            Statistics update in real-time as tournaments and matches are completed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformStatsBanner;

import { Home, Trophy, BarChart3, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomTabs = () => {
  const location = useLocation();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      id: 'tournaments',
      label: 'Tournament',
      icon: Trophy,
      path: '/tournaments',
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: BarChart3,
      path: '/leaderboard',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-[#BBF429]/20">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200",
                "min-w-[60px] hover:bg-[#BBF429]/10",
                active 
                  ? "text-[#BBF429] bg-[#BBF429]/10" 
                  : "text-gray-400 hover:text-[#BBF429]"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-all duration-200",
                  active ? "scale-110" : ""
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                active ? "text-[#BBF429]" : "text-gray-400"
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabs;
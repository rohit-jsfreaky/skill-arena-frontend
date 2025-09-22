import {
  Home,
  Trophy,
  Users,
  // Settings,
  Gamepad,
  DollarSign,
  CrownIcon,
  AlertTriangle,
  FileText,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import api from "@/utils/api";

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Tournament",
    url: "/admin/tournaments",
    icon: Trophy,
  },
  {
    title: "Tournament Results",
    url: "/admin/tournament-results",
    icon: AlertTriangle,
    badge: true,
  },
  {
    title: "TDM Matches",
    url: "/admin/tdm/matches",
    icon: Users, // or a more appropriate icon
  },
  {
    title: "Create TDM Match",
    url: "/admin/tdm/create",
    icon: Users, // or a more appropriate icon for creation
  },
  {
    title: "TDM Disputes",
    url: "/admin/tdm/disputes",
    icon: AlertTriangle,
    badge: true, // You might want to add a count for disputes as well
  },
  {
    title: "Games",
    url: "/admin/games",
    icon: Gamepad,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: DollarSign,
  },
  {
    title: "Memberships",
    url: "/admin/memberships",
    icon: CrownIcon,
  },
  {
    title: "Pages",
    url: "/admin/pages",
    icon: FileText,
  },
  {
    title: "Leaderboard",
    url: "/admin/leaderboard",
    icon: BarChart3,
  },
  {
    title: "WhatsApp Support",
    url: "/admin/whatsapp-support",
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const [disputedCount, setDisputedCount] = useState(0);
  const [tdmDisputedCount, setTdmDisputedCount] = useState(0);

  // Handle link click to close mobile sidebar
  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  useEffect(() => {
    // Fetch disputed tournaments and TDM disputes count
    const fetchDisputedCounts = async () => {
      try {
        const [tournamentResponse, tdmResponse] = await Promise.all([
          api.get("/api/admin/tournament-results/disputed-tournaments"),
          api.get("/api/admin/tdm/disputes?status=pending"),
        ]);

        setDisputedCount(tournamentResponse.data.length);
        setTdmDisputedCount(tdmResponse.data.length || 0);
      } catch (error) {
        console.error("Error fetching disputed counts:", error);
      }
    };

    fetchDisputedCounts();
    // Set up polling
    const interval = setInterval(fetchDisputedCounts, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar variant="inset" collapsible="icon" className="bg-black text-white">
      <SidebarContent className="bg-black">
        {/* Sidebar Header */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#BBF429] text-2xl font-semibold px-4 py-4">
            Skill Arena
          </SidebarGroupLabel>

          {/* Sidebar Menu */}
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-5 mt-2 px-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-4 text-xl px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-[#BBF429] text-black font-bold"
                            : "text-white hover:bg-[#BBF429] hover:text-black"
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 ${
                            isActive ? "text-black" : "text-[#eaffa9]"
                          }`}
                        />
                        <span className="relative">
                          {item.title}
                          {item.badge && disputedCount > 0 && (
                            <span className="absolute -top-2 -right-5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {disputedCount}
                            </span>
                          )}
                          {item.title === "TDM Disputes" &&
                            tdmDisputedCount > 0 && (
                              <span className="absolute -top-2 -right-5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {tdmDisputedCount}
                              </span>
                            )}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

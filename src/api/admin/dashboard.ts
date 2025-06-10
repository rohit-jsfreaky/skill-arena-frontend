import api from "@/utils/api";

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    banned: number;
    registrations: { date: string; count: number }[];
    recentUsers: {
      id: number;
      username: string;
      name: string;
      profile: string | null;
      created_at: string;
    }[];
    topActiveUsers: {
      id: number;
      username: string;
      name: string;
      profile: string | null;
      total_games_played: number;
      total_wins: number;
    }[];
  };
  tournaments: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    created: { date: string; count: number }[];
  };
}

export const getDashboardStats = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<{
  success: boolean;
  message: string;
  data?: DashboardStats;
}> => {
  try {
    setLoading(true);
    const res = await api.get("api/admin/dashboard/stats?admin=true");

    if (res.status === 200) {
      return {
        success: true,
        message: "Dashboard stats fetched successfully",
        data: res.data.data,
      };
    }
    return { success: false, message: "Failed to fetch dashboard stats" };
  } catch (error) {
    const axiosError = error as import("axios").AxiosError;
    return {
      success: false,
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        "An error occurred",
    };
  } finally {
    setLoading(false);
  }
};

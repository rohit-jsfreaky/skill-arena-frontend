import apiClient from "@/utils/apiClient";
import { Game } from "./admin/games";

export interface getGamesBasedOnUserResponse {
  success: boolean;
  data: Game[];
  message?: string;
}

export const getGamesBasedOnUser = async (
  userId: number
): Promise<getGamesBasedOnUserResponse> => {
  try {
    const response = await apiClient.post(`api/games/get`, { user_id: userId });
    return {
      success: true,
      data: response.data.data,
      message: "Games fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    return {
      success: false,
      data: error.response.data.message || "Failed to fetch games",
      message: "Games fetched successfully",
    };
  }
};

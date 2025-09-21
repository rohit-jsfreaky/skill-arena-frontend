import apiClient from "@/utils/apiClient";
import { Game } from "./admin/games";
import axios from "axios";

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
    const errorMessage = axios.isAxiosError(error) 
      ? error.response?.data?.message || "Failed to fetch games"
      : "Failed to fetch games";
    return {
      success: false,
      data: [],
      message: errorMessage,
    };
  }
};

export const getAllGamesForFilter = async (): Promise<{
  success: boolean;
  data: Game[];
  message?: string;
}> => {
  try {
    const response = await apiClient.get(`api/games`);
    return {
      success: true,
      data: response.data.data,
      message: "Games fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to fetch games"
      : "Failed to fetch games";
    return {
      success: false,
      data: [],
      message: errorMessage,
    };
  }
};

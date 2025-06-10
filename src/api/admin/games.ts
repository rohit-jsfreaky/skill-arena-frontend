import api from "@/utils/api";
import React from "react";

// Game interface
export interface Game {
  id: number;
  name: string;
  description?: string;
  image?: string;
  status: string;
  platform?: string;
  genre?: string;
  release_date: string | null;
  created_at: string;
  access_type: 'free' | 'pro';
}

// Pagination interface
export interface PaginationResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// Response interface
export interface GamesResponse {
  games: Game[];
  pagination: PaginationResponse;
}

// Get all games with pagination and search
export const fetchGames = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<GamesResponse> => {
  try {
    const { data } = await api.get(
      `/api/admin/games/get-all-games?page=${page}&limit=${limit}&search=${search}&admin=true`
    );
    return data;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

// Get a specific game by ID
export const fetchGameById = async (id: number): Promise<Game> => {
  try {
    const { data } = await api.get(
      `/api/admin/games/get-game/${id}?admin=true`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw error;
  }
};

// Create a new game
export const createGame = async (
  gameData: Omit<Game, "id" | "created_at">
): Promise<Game> => {
  try {
    const { data } = await api.post(
      "/api/admin/games/create-game?admin=true",
      gameData
    );
    return data.game;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

// Update an existing game
export const updateGame = async (
  id: number,
  gameData: Partial<Game>
): Promise<Game> => {
  try {
    const { data } = await api.put(
      `/api/admin/games/update-game/${id}?admin=true`,
      gameData
    );
    return data.game;
  } catch (error) {
    console.error(`Error updating game with ID ${id}:`, error);
    throw error;
  }
};

// Delete a game
export const deleteGame = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/admin/games/delete-game/${id}?admin=true`);
  } catch (error) {
    console.error(`Error deleting game with ID ${id}:`, error);
    throw error;
  }
};

// Add this new function
export const fetchActiveGames = async (): Promise<Game[]> => {
  try {
    const { data } = await api.get("/api/admin/games/active-games?admin=true");
    return data.games;
  } catch (error) {
    console.error("Error fetching active games:", error);
    throw error;
  }
};

// Get all games
export const getAllGames = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<{ success: boolean; message: string; data?: Game[] }> => {
  try {
    setLoading(true);
    const res = await api.get("api/admin/games/get-all-games?admin=true");

    console.log("res in get all games", res);

    if (res.status === 200) {
      return {
        success: true,
        message: res.data.message || "Games fetched successfully",
        data: res.data.games,
      };
    }
    return { success: false, message: "Failed to fetch games" };
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

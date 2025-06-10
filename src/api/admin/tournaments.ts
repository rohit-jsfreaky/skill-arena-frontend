import {
  TournamentFormData,
  updateTournamentProps,
  TournamentFilterOption,
} from "@/interface/tournament";
import api from "@/utils/api";
import axios from "axios";
import React from "react";

export const getAllTournamets = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  page: number = 1,
  limit: number = 10,
  filter: TournamentFilterOption = "all"
) => {
  try {
    setLoading(true);
    const res = await api.get(
      `api/admin/tournaments/get-all-tournaments?page=${page}&limit=${limit}&filter=${filter}&admin=true`
    );

    if (res.status === 200) {
      setLoading(false);
      return { 
        data: res.data.data, 
        pagination: res.data.pagination,
        message: "Tournaments Fetched", 
        success: true 
      };
    }
    setLoading(false);
    return { data: {}, pagination: null, message: "Something Went Wrong", success: false };
  } catch (error) {
    const axiosError = error as import("axios").AxiosError;
    setLoading(false);
    return {
      data: {},
      pagination: null,
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        "An error occurred",
      success: false,
    };
  }
};

export const handleImageUpload = async (
  file: File,
  setUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setFormData: React.Dispatch<
    React.SetStateAction<
      TournamentFormData & {
        game_name: string;
        prize_pool: number;
        rules: string;
        room_id?: string | null;
        room_password?: string | null;
      }
    >
  >
) => {
  try {
    console.log("file", file);
    setUploading(true);

    const formData = new FormData();
    // Change "file" to "image" to match backend expectation
    formData.append("image", file);

    // Don't wrap formData in an object, pass it directly as the request data
    // Don't set Content-Type header - axios will set it automatically with boundary
    const response = await api.post(
      "api/admin/tournaments/upload-image?admin=true",
      formData
    );

    if (response.status !== 200) {
      return { success: false, message: "Failed to upload image" };
    }

    const data = response.data;
    console.log("Upload response:", data);

    setFormData((prev) => ({
      ...prev,
      image_url: data.url,
    }));

    return { success: true, message: "Image uploaded successfully" };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to upload image",
    };
  } finally {
    setUploading(false);
  }
};

export const updateTournament = async ({
  formData,
  setLoading,
  id,
}: updateTournamentProps) => {
  try {
    setLoading(true);
    const res = await api.put(
      `api/admin/tournaments/update-tournament/${id}?admin=true`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res);

    return { success: true, message: "Tournament updated successfully" };
  } catch (err: unknown) {
    console.log(err);
    if (axios.isAxiosError(err) && err.response) {
      return {
        success: false,
        message: err.response.data?.message || "Failed to update tournament",
      };
    } else {
      return { success: false, message: "Failed to update tournament" };
    }
  } finally {
    setLoading(false);
  }
};

export const deleteTournament = async (
  id: number,
  setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setDeleteLoading(true);
    const res = await api.delete(
      `api/admin/tournaments/delete-tournament/${id}?admin=true`
    );

    if (res.status === 200) {
      return { success: true, message: "Tournament deleted successfully" };
    } else {
      return { success: false, message: "Failed to delete tournament" };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to delete tournament" };
  } finally {
    setDeleteLoading(false);
  }
};

/**
 * Search tournaments by name or game name
 * @param searchTerm The search query
 * @param setLoading Function to set loading state
 * @returns Promise with search results
 */
export const searchTournaments = async (
  searchTerm: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<{
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    game_name: string;
    image?: string;
    status: string;
  }[];
}> => {
  try {
    setLoading(true);
    const res = await api.get(`api/admin/tournaments/search?term=${encodeURIComponent(searchTerm)}&limit=5&admin=true`);

    if (res.status === 200) {
      return { 
        success: true,
        message: "Search results fetched successfully",
        data: res.data.data
      };
    }
    return { success: false, message: "Failed to search tournaments" };
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

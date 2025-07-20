import { UserContextType } from "@/context/UserContext";
import api from "@/utils/api";

export interface UserDetailed extends UserContextType {
  tournaments_joined: number;
}

interface PaginationData {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Get all users with pagination and filter
 * @param setLoading Function to set loading state
 * @param page Page number (default: 1)
 * @param limit Users per page (default: 10)
 * @param filter Filter criteria (default: "all")
 * @returns Promise with users data and pagination info
 */
export const getAllUsers = async (
  setLoading: (loading: boolean) => void,
  page: number = 1,
  limit: number = 10,
  filter: string = "all"
): Promise<{
  success: boolean;
  message: string;
  data?: UserContextType[];
  pagination?: PaginationData;
}> => {
  setLoading(true);
  try {
    const response = await api.get(
      `/api/admin/users?page=${page}&limit=${limit}&filter=${filter}&admin=true`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch users");
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setLoading(false);
  }
};

/**
 * Get user details by ID
 * @param userId The ID of the user to fetch
 * @param setLoading Function to set loading state
 * @returns Promise with detailed user data
 */
export const getUserById = async (
  userId: number ,
  setLoading: (loading: boolean) => void
): Promise<{
  success: boolean;
  message: string;
  data?: UserDetailed;
}> => {
  setLoading(true);
  try {
    const response = await api.get(`/api/admin/users/${userId}?admin=true`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = response.data;

    if (response.status < 200 || response.status >= 300) {
      throw new Error(result.message || "Failed to fetch user");
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setLoading(false);
  }
};

/**
 * Search users by username, name, or user ID
 * @param searchTerm The search query (username, name, or user ID)
 * @param setLoading Function to set loading state
 * @returns Promise with search results
 */
export const searchUsers = async (
  searchTerm: string,
  setLoading: (loading: boolean) => void
): Promise<{
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    username: string;
  }[];
}> => {
  setLoading(true);
  try {
    const response = await api.get(
      `/api/admin/users/search?term=${encodeURIComponent(searchTerm)}&limit=5&admin=true`, 
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to search users");
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setLoading(false);
  }
};

/**
 * Delete a user by ID
 * @param userId The ID of the user to delete
 * @param setLoading Function to set loading state
 * @returns Promise with deletion result
 */
export const deleteUserById = async (
  userId: number,
  setLoading: (loading: boolean) => void
): Promise<{
  success: boolean;
  message: string;
}> => {
  setLoading(true);
  try {
    const response = await api.delete(`/api/admin/users/${userId}?admin=true`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to delete user");
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setLoading(false);
  }
};

/**
 * Ban or unban a user
 * @param userId The ID of the user
 * @param action "ban" or "unban"
 * @param duration The ban duration (only for ban action)
 * @param reason The reason for banning (optional)
 * @param setLoading Function to set loading state
 * @returns Promise with the result
 */
export const banUnbanUser = async (
  userId: number,
  action: "ban" | "unban",
  duration?: string,
  reason?: string,
  setLoading?: (loading: boolean) => void
): Promise<{
  success: boolean;
  message: string;
}> => {
  if (setLoading) setLoading(true);
  try {
    const response = await api.post(
      `/api/admin/users/${userId}/${action}?admin=true`,
      { duration, reason },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || `Failed to ${action} user`);
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    if (setLoading) setLoading(false);
  }
};

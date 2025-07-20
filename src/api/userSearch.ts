import apiClient from "@/utils/apiClient";

export interface UserSearchResult {
  id: number;
  username: string;
  name: string;
  profile?: string;
}

interface UserSearchResponse {
  success: boolean;
  message?: string;
  data?: UserSearchResult[];
}

/**
 * Search users by username, name, or user ID for client-side usage
 * @param searchTerm The search query (username, name, or user ID)
 * @param limit Maximum number of results to return
 * @returns Promise with search results
 */
export const searchUsersForClient = async (
  searchTerm: string,
  limit: number = 5
): Promise<UserSearchResponse> => {
  try {
    const response = await apiClient.get(
      `/api/user/search-client?term=${encodeURIComponent(searchTerm)}&limit=${limit}`,
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
      data: [],
    };
  }
};

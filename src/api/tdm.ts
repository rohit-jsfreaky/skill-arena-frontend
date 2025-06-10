import apiClient from "@/utils/apiClient";


// Search for players to add to team
export const searchTDMPlayers = async (searchTerm: string, matchId?: number) => {
  try {
    let url = `api/user/search?q=${searchTerm}&limit=5`;
    
    // If matchId is provided, add it to the query to exclude users already in the match
    if (matchId) {
      url += `&matchId=${matchId}`;
    }
    
    const response = await apiClient.get(url);
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error searching players",
    };
  }
};

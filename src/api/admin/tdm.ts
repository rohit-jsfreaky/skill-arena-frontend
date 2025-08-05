import api from "@/utils/api";

// Admin: Create a new TDM match
export const createTdmMatch = async (data: {
  match_type: 'public' | 'private';
  game_name: string;
  entry_fee: number;
  team_size: number;
}) => {
  const response = await api.post(`api/admin/tdm/matches/create?admin=true`, data);
  return response.data;
};

// Admin: Generate shareable link for private matches
export const generatePrivateMatchLink = async (matchId: number) => {
  const response = await api.get(`api/admin/tdm/matches/${matchId}/share-link?admin=true`);
  return response.data;
};

// Get all TDM matches with pagination and filtering
export const getAllTdmMatches = async (page = 1, limit = 10, status = "all") => {
  const response = await api.get(`api/admin/tdm/matches?page=${page}&limit=${limit}&status=${status}&admin=true`);
  console.log("tdm",response.data)
  return response.data;
};

// Get detailed information about a specific TDM match
export const getTdmMatchDetails = async (matchId: number) => {
  const response = await api.get(`api/admin/tdm/matches/${matchId}?admin=true`);
  return response.data;
};

// Get all TDM disputes with pagination and filtering
export const getAllTdmDisputes = async (page = 1, limit = 10, status = "pending") => {
  const response = await api.get(`api/admin/tdm/disputes?page=${page}&limit=${limit}&status=${status}&admin=true`);
  return response.data;
};

// Get all disputed TDM matches
export const getDisputedTdmMatches = async () => {
  return await api.get("api/admin/tdm/disputes?admin=true");
};

// Resolve a specific TDM dispute
export const resolveTdmDispute = async (
  disputeId: number, 
  resolution: 'resolved' | 'rejected', 
  adminNotes: string,
  winnerTeamId?: number
) => {
  const data: { 
    resolution: string; 
    admin_notes: string; 
    winner_team_id?: number; 
  } = { resolution, admin_notes: adminNotes };
  
  // Winner team ID is only required when resolving in favor of a team
  if (resolution === 'resolved' && winnerTeamId) {
    data.winner_team_id = winnerTeamId;
  }
  
  const response = await api.post(`api/admin/tdm/disputes/${disputeId}/resolve?admin=true`, data);
  return response.data;
};

// Cancel a TDM match as admin
export const cancelTdmMatch = async (matchId: number, reason: string) => {
  const response = await api.post(`api/admin/tdm/matches/${matchId}/cancel?admin=true`, { reason });
  return response.data;
};

// Set the winner for a TDM match
export const setTdmMatchWinner = async (matchId: number, winnerTeamId: number, adminNotes?: string) => {
  const data = { 
    winner_team_id: winnerTeamId,
    admin_notes: adminNotes || "Winner manually set by admin"
  };
  
  const response = await api.post(`api/admin/tdm/matches/${matchId}/set-winner?admin=true`, data);
  return response.data;
};

// Get TDM statistics for admin dashboard
export const getTdmStatistics = async () => {
  const response = await api.get(`api/admin/tdm/statistics?admin=true`);
  return response.data;
};
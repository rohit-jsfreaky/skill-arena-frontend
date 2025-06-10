import apiClient from "@/utils/apiClient";
import {
  TdmMatch,
  TdmMatchDetails,
  CreateTdmMatchRequest,
  JoinTdmMatchRequest,
} from "@/interface/tdmMatches";

// CREATE
export const createTdmMatch = async (matchData: CreateTdmMatchRequest) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>("/api/tdm/create", matchData);

  return response;
};

// READ
export const getPublicTdmMatches = async () => {
  const response = await apiClient.get<{
    success: boolean;
    data: TdmMatch[];
  }>("/api/tdm/public");

  return response;
};

export const getUserTdmMatches = async (userId: number) => {
  const response = await apiClient.get<{
    success: boolean;
    data: TdmMatch[];
  }>(`/api/tdm/user-matches?user_id=${userId}`);

  return response;
};

export const getTdmMatchById = async (matchId: number) => {
  const response = await apiClient.get<{
    success: boolean;
    data: TdmMatchDetails;
  }>(`/api/tdm/${matchId}`);

  return response;
};

export const getUserTdmMatchHistory = async (userId: number) => {
  const response = await apiClient.post<{
    success: boolean;
    data: any[];
  }>("/api/tdm/history", { user_id: userId });

  return response;
};

export const getUserTdmFinancials = async (userId: number) => {
  const response = await apiClient.post<{
    success: boolean;
    data: any[];
  }>("/api/tdm/financials", { user_id: userId });

  return response;
};

// JOIN
export const joinPublicTdmMatch = async (data: JoinTdmMatchRequest) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>("/api/tdm/join-public", data);

  return response;
};

export const joinPrivateTdmMatch = async (data: JoinTdmMatchRequest) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>("/api/tdm/join-private", data);

  return response;
};

// Join an existing team (either Team A or B)
export const joinExistingTeam = async (data: {
  match_id: number;
  team_id: number;
  user_id: number;
}) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>("/api/tdm/join-team", data);

  return response;
};

// MATCH ACTIONS
export const startTdmMatch = async (matchId: number,user_id:number) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/tdm/${matchId}/start?user_id=${user_id}`);

  return response;
};

export const processTdmTeamPayment = async (
  matchId: number,
  teamId: number,
  userId: number
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/tdm/${matchId}/team/${teamId}/payment?user_id=${userId}`);

  return response;
};

export const uploadTdmMatchScreenshot = async (
  matchId: number,
  data: {
    screenshot_path: string;
    team_id: number;
    user_id: number;
  }
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/tdm/${matchId}/screenshot`, data);

  return response;
};

export const completeTdmMatch = async (
  matchId: number,
  data: {
    winner_team_id: number;
    user_id: number;
  }
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/tdm/${matchId}/complete`, data);

  return response;
};

export const reportTdmDispute = async (
  matchId: number,
  data: {
    reported_team_id: number;
    reported_by: number;
    reason: string;
    evidence_path?: string;
  }
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/tdm/${matchId}/dispute`, data);

  return response;
};

export const cancelTdmMatch = async (
  matchId: number,
  data: {
    reason: string;
    user_id: number;
  }
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/tdm/${matchId}/cancel`, data);

  return response;
};

export const checkTdmMatchReadiness = async (matchId: number) => {
  const response = await apiClient.get<{
    success: boolean;
    data: {
      match_id: number;
      status: string;
      team_a_players: number;
      team_a_paid: number;
      team_b_players: number;
      team_b_paid: number;
      total_players: number;
      total_paid: number;
      can_be_confirmed: boolean;
      reason: string;
    }
  }>(`/api/tdm/${matchId}/readiness`);

  return response;
};

// Add this new function
export const setTdmRoomDetails = async (
  matchId: number,
  data: {
    room_id: string;
    room_password: string;
    user_id:number
  }
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/tdm/${matchId}/room-details`, data);

  return response;
};

// ADMIN API FUNCTIONS
export const adminGetAllTdmMatches = async (
  page: number,
  limit: number,
  status: string = "all"
) => {
  const response = await apiClient.get<{
    success: boolean;
    data: TdmMatch[];
    pagination: any;
  }>(`/api/admin/tdm/matches?page=${page}&limit=${limit}&status=${status}`);

  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

export const adminGetTdmMatchDetails = async (matchId: number) => {
  const response = await apiClient.get<{
    success: boolean;
    data: any;
  }>(`/api/admin/tdm/matches/${matchId}`);

  return response;
};

export const adminGetAllTdmDisputes = async (
  page: number,
  limit: number,
  status: string = "pending"
) => {
  const response = await apiClient.get<{
    success: boolean;
    data: any[];
    pagination: any;
  }>(`/api/admin/tdm/disputes?page=${page}&limit=${limit}&status=${status}`);

  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

export const adminResolveTdmDispute = async (
  disputeId: number,
  data: {
    resolution: "resolved" | "rejected";
    admin_notes: string;
    winner_team_id?: number;
  }
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/admin/tdm/disputes/${disputeId}/resolve`, data);

  return response;
};

export const adminCancelTdmMatch = async (matchId: number, reason: string) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/admin/tdm/matches/${matchId}/cancel`, { reason });

  return response;
};

export const adminSetTdmMatchWinner = async (
  matchId: number,
  data: {
    winner_team_id: number;
    admin_notes: string;
  }
) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/api/admin/tdm/matches/${matchId}/set-winner`, data);

  return response;
};

export const adminGetTdmStatistics = async () => {
  const response = await apiClient.get<{
    success: boolean;
    data: any;
  }>("/api/admin/tdm/statistics");

  return response;
};

// Player search for team creation
export const searchTDMPlayers = async (
  searchTerm: string,
  matchId?: number
) => {
  const url = matchId
    ? `/api/user/search?q=${encodeURIComponent(
        searchTerm
      )}&matchId=${matchId}&limit=5`
    : `/api/user/search?q=${encodeURIComponent(searchTerm)}&limit=5`;

  try {
    const response = await apiClient.get(url);
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error searching players",
    };
  }
};

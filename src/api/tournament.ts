import {
  createTournamentProps,
  fetchHistoryProps,
  fetchMyTournamentsProps,
  fetchTournamentDetailsProps,
  fetchTournamentsProps,
  joinTournamentProps,
  Tournament,
} from "@/interface/tournament";
import api from "@/utils/api";
import apiClient from "@/utils/apiClient";
import axios from "axios";

export const createTournament = async ({
  setLoading,
  formData,
}: createTournamentProps) => {
  try {
    setLoading(true);
    const res = await api.post(
      `api/admin/tournaments/create-tournament?admin=true`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res);

    return { success: true, message: "Tournament created successfully" };
  } catch (err: unknown) {
    console.log(err);
    if (axios.isAxiosError(err) && err.response) {
      return {
        success: false,
        message: err.response.data?.message || "Failed to create tournament",
      };
    } else {
      return { success: false, message: "Failed to create tournament" };
    }
  } finally {
    setLoading(false);
  }
};

export const fetchTournamentDetails = async ({
  setLoading,
  setTournament,
  id,
  myUser,
  setHasJoined,
  setParticipants,
  setError,
  authToken,
  admin = false,
}: fetchTournamentDetailsProps) => {
  try {
    setLoading(true);
    const { data } = await api.get(`api/tournaments/get/${id}?admin=${admin}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("tournament details", data);
    setTournament(data);

    if (!admin) {
      if (myUser) {
        const { data: myTournaments } = await apiClient.post(
          `api/tournaments/my-tournaments`,

          {
            user_id: myUser.id,
          }
        );
        if (setHasJoined) {
          setHasJoined(
            myTournaments.some(
              (t: Tournament) => t.id === parseInt(id as string)
            )
          );
        }
      }
    }

    // Fetch participants
    console.log("fetching participants ");
    const { data: participantsData } = await api.get(
      `api/tournaments/${id}/participants?admin=${admin}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    setParticipants(participantsData);
  } catch (error) {
    console.log("Error fetching tournament details:", error);
    setError("Failed to load tournament details");
  } finally {
    setLoading(false);
  }
};

export const joinTournament = async ({
  myUser,
  navigate,
  setJoining,
  setError,
  id,
  setSuccess,
  setHasJoined,
  setUser,
  setTournament,
  setParticipants,
}: joinTournamentProps) => {
  if (!myUser) {
    navigate("/login");
    return;
  }

  try {
    setJoining(true);
    setError(null);

    const { data } = await apiClient.post(
      `api/tournaments/${id}/join`,
      { user: myUser }, // Send user inside request body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setSuccess("Successfully joined the tournament!");
    setHasJoined(true);

    // Update user wallet
    setUser({ ...myUser, wallet: data.newBalance });

    const { data: tournamentData } = await apiClient.get(
      `api/tournaments/get/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setTournament(tournamentData);

    // Fetch updated participants
    const { data: participantsData } = await apiClient.get(
      `api/tournaments/${id}/participants`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setParticipants(participantsData);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data?.message || "Failed to fetch tournaments");
    } else {
      console.log("Unexpected error:", error);
    }
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data?.message || "Failed to join tournament");
    } else {
      setError("Failed to join tournament");
    }
  } finally {
    setJoining(false);
  }
};

export const fetchHistory = async ({
  setLoading,
  setTournaments,
}: fetchHistoryProps) => {
  try {
    setLoading(true);
    const { data } = await apiClient.get(`api/tournaments/history`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTournaments(data);
  } catch (error) {
    console.log("Error fetching tournament history:", error);
  } finally {
    setLoading(false);
  }
};

// Modify the fetchTournaments function
export const fetchTournaments = async ({
  setTournaments,
  page = 1,
  limit = 9,
  user_id,
}: fetchTournamentsProps) => {
  try {
    const { data } = await apiClient.get(
      `api/tournaments?page=${page}&limit=${limit}&user_id=${user_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fetched tournaments:", data.data);
    setTournaments(data.data);
    return data.pagination;
  } catch (error) {
    console.log("Error fetching tournaments:", error);
  }
};

export const fetchMyTournaments = async ({
  myUser,
  setMyTournaments,
}: fetchMyTournamentsProps) => {
  if (!myUser) return;

  try {
    const { data } = await apiClient.post(
      `${import.meta.env.VITE_SERVER_URL}api/tournaments/my-tournaments`,
      {
        user_id: myUser.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("my tournaments", data);
    setMyTournaments(data);
  } catch (error) {
    console.log("Error fetching my tournaments:", error);
  }
};

// Add these functions to your existing tournament.ts file

export const getUserTournamentHistory = async (userId: number) => {
  try {
    const { data } = await apiClient.post("api/tournaments/user-history", {
      user_id: userId,
    });
    return data;
  } catch (error) {
    console.log("Error fetching tournament history:", error);
    return { success: false, data: [] };
  }
};

export const getUserTournamentFinancials = async (userId: number) => {
  try {
    const { data } = await apiClient.post("api/tournaments/user-financials", {
      user_id: userId,
    });
    return data;
  } catch (error) {
    console.log("Error fetching tournament financials:", error);
    return { success: false, data: [] };
  }
};

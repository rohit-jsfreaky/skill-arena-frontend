import { useState, useCallback } from "react";
import { useMYUser } from "@/context/UserContext";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { JoinTdmMatchRequest, TdmMatchType } from "@/interface/tdmMatches";
import {
  createTdmMatch,
  getPublicTdmMatches,
  getTdmMatchById,
  getUserTdmMatches,
  joinPublicTdmMatch,
  joinPrivateTdmMatch,
  startTdmMatch,
  processTdmTeamPayment,
  uploadTdmMatchScreenshot,
  completeTdmMatch,
  reportTdmDispute,
  cancelTdmMatch,
  joinExistingTeam,
  checkTdmMatchReadiness,
  setTdmRoomDetails,
} from "@/api/tdmMatches";

export interface TeamMember {
  id: number;
  username: string;
  profile?: string;
}

interface TDMMatchState {
  loading: boolean;
  currentMatchId: number | null;
  matchDetails: any | null;
  publicMatches: any[];
  myMatches: any[];
}

export const useTDMMatch = () => {
  const { myUser } = useMYUser();
  const [state, setState] = useState<TDMMatchState>({
    loading: false,
    currentMatchId: null,
    matchDetails: null,
    publicMatches: [],
    myMatches: [],
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  // Create a new TDM match
  const handleCreateMatch = useCallback(
    async (
      matchType: TdmMatchType,
      gameName: string,
      entryFee: number,
      teamName: string,
      teamMembers: TeamMember[],
      teamSize: number  // Add teamSize parameter
    ) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return;
        }

        if (teamMembers.length < 1 || teamMembers.length > teamSize) {
          showErrorToast(`Team must have between 1 and ${teamSize} members`);
          return;
        }

        if (!teamName) {
          showErrorToast("Please enter a team name");
          return;
        }

        setLoading(true);

        const data = {
          match_type: matchType,
          game_name: gameName,
          entry_fee: entryFee,
          team_name: teamName,
          team_members: teamMembers.map((member) => member.id),
          creatorId: myUser.id,
          team_size: teamSize  // Add teamSize to request
        };

        const response = await createTdmMatch(data);

        if (response.data.success) {
          showSuccessToast("Match created successfully");
          setState((prev) => ({
            ...prev,
            currentMatchId: response.data.data.match_id,
            matchDetails: response.data.data,
          }));
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to create match");
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to create match");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading]
  );

  // Load public matches
  const loadPublicMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPublicTdmMatches();
      if (response.data.success) {
        setState((prev) => ({ ...prev, publicMatches: response.data.data }));
      } else {
        showErrorToast("Failed to load public matches");
      }
    } catch (error) {
      showErrorToast("Error loading matches");
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Load user's matches
  const loadMyMatches = useCallback(
    async (userId: number) => {
      try {
        setLoading(true);
        const response = await getUserTdmMatches(userId);
        if (response.data.success) {
          setState((prev) => ({ ...prev, myMatches: response.data.data }));
        } else {
          showErrorToast("Failed to load your matches");
        }
      } catch (error) {
        showErrorToast("Error loading your matches");
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // Load match details
  const loadMatchDetails = useCallback(
    async (matchId: number) => {
      try {
        setLoading(true);
        const response = await getTdmMatchById(matchId);
        if (response.data.success) {
          setState((prev) => ({
            ...prev,
            currentMatchId: matchId,
            matchDetails: response.data.data,
          }));
          return response.data.data;
        } else {
          showErrorToast("Failed to load match details");
        }
      } catch (error) {
        showErrorToast("Error loading match details");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [setLoading]
  );

  // Join a public match
  const joinPublicMatch = useCallback(
    async (joinData: JoinTdmMatchRequest) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        if (joinData.team_members.length < 1 || joinData.team_members.length > 4) {
          showErrorToast("Team must have between 1 and 4 members");
          return null;
        }

        setLoading(true);
        const response = await joinPublicTdmMatch(joinData);

        if (response.data.success) {
          showSuccessToast("Successfully joined the match");
          setState((prev) => ({
            ...prev,
            currentMatchId: response.data.data.match_id,
            matchDetails: response.data.data,
          }));
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to join match");
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to join match");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading]
  );

  // Join a private match
  const joinPrivateMatch = useCallback(
    async (joinData: JoinTdmMatchRequest) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await joinPrivateTdmMatch(joinData);

        if (response.data.success) {
          showSuccessToast("Successfully joined the private match");
          setState((prev) => ({
            ...prev,
            currentMatchId: response.data.data.match_id,
            matchDetails: response.data.data,
          }));
          return response.data.data;
        } else {
          showErrorToast(
            response.data.message || "Failed to join private match"
          );
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to join private match");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading]
  );

  // Add this function to your hook
  const joinTeam = useCallback(
    async (matchId: number, teamId: number) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await joinExistingTeam({
          match_id: matchId,
          team_id: teamId,
          user_id: myUser.id,
        });

        if (response.data.success) {
          showSuccessToast("Successfully joined the team");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to join team");
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to join team");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  // Start a confirmed match
  const startMatch = useCallback(
    async (matchId: number) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await startTdmMatch(matchId,myUser.id);

        if (response.data.success) {
          showSuccessToast("Match started successfully");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to start match");
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to start match");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  // Process team payment for a match
  const processTeamPayment = useCallback(
    async (matchId: number, teamId: number) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await processTdmTeamPayment(
          matchId,
          teamId,
          myUser.id
        );

        if (response.data.success) {
          showSuccessToast("Payment processed successfully");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to process payment");
        }
      } catch (error: any) {
        showErrorToast(
          error.response.data.message || "Failed to process payment"
        );
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  // Upload match screenshot
  const uploadMatchScreenshot = useCallback(
    async (matchId: number, teamId: number, screenshotPath: string) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await uploadTdmMatchScreenshot(matchId, {
          screenshot_path: screenshotPath,
          team_id: teamId,
          user_id: myUser.id,
        });

        if (response.data.success) {
          showSuccessToast("Screenshot uploaded successfully");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(
            response.data.message || "Failed to upload screenshot"
          );
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to upload screenshot");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  // Complete a match
  const completeMatch = useCallback(
    async (matchId: number, winnerTeamId: number) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await completeTdmMatch(matchId, {
          winner_team_id: winnerTeamId,
          user_id: myUser.id,
        });

        if (response.data.success) {
          showSuccessToast("Match completed successfully");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to complete match");
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to complete match");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  // Report a dispute
  const reportDispute = useCallback(
    async (
      matchId: number,
      reportedTeamId: number,
      reason: string,
      evidencePath?: string
    ) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await reportTdmDispute(matchId, {
          reported_team_id: reportedTeamId,
          reported_by: myUser.id,
          reason,
          evidence_path: evidencePath,
        });

        if (response.data.success) {
          showSuccessToast("Dispute reported successfully");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to report dispute");
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to report dispute");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  // Cancel a match
  const cancelMatch = useCallback(
    async (matchId: number, reason: string) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await cancelTdmMatch(matchId, {
          reason,
          user_id: myUser.id,
        });

        if (response.data.success) {
          showSuccessToast("Match cancelled successfully");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to cancel match");
        }
      } catch (error: any) {
        showErrorToast(error.response.data.message || "Failed to cancel match");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  // Add a new function to check match readiness
  const checkMatchReadiness = useCallback(
    async (matchId: number) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        const response = await checkTdmMatchReadiness(matchId);
        
        if (response.data.success) {
          return response.data.data;
        } else {
          showErrorToast("Failed to check match readiness");
        }
      } catch (error: any) {
        console.error("Error checking match readiness:", error);
      }
      return null;
    },
    [myUser]
  );

  // Add this function to your hook
  const setRoomDetails = useCallback(
    async (matchId: number, roomId: string, roomPassword: string) => {
      try {
        if (!myUser) {
          showErrorToast("You need to be logged in");
          return null;
        }

        setLoading(true);
        const response = await setTdmRoomDetails(matchId, {
          room_id: roomId,
          room_password: roomPassword,
          user_id:myUser.id
        });

        if (response.data.success) {
          showSuccessToast("Room details set successfully");
          await loadMatchDetails(matchId); // Reload match details
          return response.data.data;
        } else {
          showErrorToast(response.data.message || "Failed to set room details");
        }
      } catch (error: any) {
        showErrorToast(error.message || "Failed to set room details");
      } finally {
        setLoading(false);
      }
      return null;
    },
    [myUser, setLoading, loadMatchDetails]
  );

  return {
    ...state,
    setLoading,
    handleCreateMatch,
    loadPublicMatches,
    loadMyMatches,
    loadMatchDetails,
    joinPublicMatch,
    joinPrivateMatch,
    joinTeam,
    startMatch,
    processTeamPayment,
    uploadMatchScreenshot,
    completeMatch,
    reportDispute,
    cancelMatch,
    checkMatchReadiness,
    setRoomDetails, // Add this
  };
};

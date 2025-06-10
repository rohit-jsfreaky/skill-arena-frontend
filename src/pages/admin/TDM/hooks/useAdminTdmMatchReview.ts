import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getTdmMatchDetails, setTdmMatchWinner, resolveTdmDispute } from "@/api/admin/tdm";
import { TdmMatch } from "@/interface/tdmMatches";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";

export const useAdminTdmMatchReview = (matchId: number) => {
  const navigate = useNavigate();
  const [match, setMatch] = useState<TdmMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWinnerTeamId, setSelectedWinnerTeamId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processingDecision, setProcessingDecision] = useState(false);

  // Load match data
  const loadMatchData = async () => {
    try {
      setLoading(true);
      const response = await getTdmMatchDetails(matchId);
      if (response.success) {
        setMatch(response.data);
        // If match already has a winner, preselect it
        if (response.data.winner_team_id) {
          setSelectedWinnerTeamId(response.data.winner_team_id);
        }
      } else {
        setError(response.message || "Failed to load match details");
      }
    } catch (error) {
      console.error("Error loading match details:", error);
      setError("An error occurred while loading match details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (matchId) {
      loadMatchData();
    }
  }, [matchId]);

  // Handle setting a winner and resolving any related disputes
  const handleSetWinner = async () => {
    if (!match || !selectedWinnerTeamId || !adminNotes) {
      showErrorToast("Missing required information");
      return;
    }

    try {
      setProcessingDecision(true);
      
      // Step 1: Set the match winner
      const winnerResponse = await setTdmMatchWinner(match.id, selectedWinnerTeamId, adminNotes);
      
      if (!winnerResponse.success) {
        throw new Error(winnerResponse.message || "Failed to set match winner");
      }
      
      // Step 2: Resolve any pending disputes related to this match
      let disputesResolved = 0;
      if (match.disputes && match.disputes.length > 0) {
        const pendingDisputes = match.disputes.filter(d => d.status === "pending");
        
        for (const dispute of pendingDisputes) {
          // Determine if the reporter's team or the reported team won
          const reporterTeamWon = dispute.reporter_team_id === selectedWinnerTeamId;
          
          await resolveTdmDispute(
            dispute.id,
            "resolved", // Always mark as resolved since we're setting a winner
            `${adminNotes} - Dispute automatically resolved as part of match winner selection.`,
            selectedWinnerTeamId
          );
          
          disputesResolved++;
        }
      }
      
      // Show success message including info about resolved disputes
      showSuccessToast(
        `Prize awarded successfully${disputesResolved > 0 ? ` and ${disputesResolved} dispute(s) automatically resolved` : ""}`
      );
      
      // Reload match data to show updated status
      loadMatchData();
      
    } catch (error) {
      console.error("Error setting winner:", error);
      showErrorToast(error instanceof Error ? error.message : "Failed to process your request");
    } finally {
      setProcessingDecision(false);
      setDialogOpen(false);
    }
  };

  return {
    match,
    loading,
    error,
    selectedWinnerTeamId,
    setSelectedWinnerTeamId,
    adminNotes,
    setAdminNotes,
    dialogOpen,
    setDialogOpen,
    processingDecision,
    handleSetWinner,
    loadMatchData,
    navigate,
  };
};
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { toast } from "sonner";

export interface Tournament {
  id: number;
  name: string;
  prize_pool: number;
  status: string;
  end_time: string;
  prize_awarded: boolean;
}

export interface Screenshot {
  id: number;
  user_id: number;
  screenshot_path: string;
  verification_status: string;
  upload_timestamp: string;
  ocr_result?: string;
  admin_notes?: string;
  user_name: string;
  username: string;
  email: string;
}

export const useAdminTournamentReview = (tournamentId: string | undefined) => {
  const navigate = useNavigate();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWinnerId, setSelectedWinnerId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [processingDecision, setProcessingDecision] = useState<boolean>(false);
  const [expandedOcr, setExpandedOcr] = useState<number | null>(null);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/admin/tournament-results/${tournamentId}/screenshots`
        );
        setTournament(response.data.tournament);
        setScreenshots(response.data.screenshots);
      } catch (error) {
        console.error("Error fetching tournament data:", error);
        toast.error("Failed to load tournament data");
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) {
      fetchTournamentData();
    }
  }, [tournamentId]);

  const handleWinnerSelection = (userId: number) => {
    setSelectedWinnerId(userId === selectedWinnerId ? null : userId);
  };

  const openConfirmDialog = () => {
    if (!selectedWinnerId) {
      toast.error("Please select a winner first");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const submitDecision = async () => {
    if (!selectedWinnerId) {
      toast.error("Please select a winner");
      return;
    }

    try {
      setProcessingDecision(true);
      await api.post(
        `/api/admin/tournament-results/${tournamentId}/review`,
        {
          winnerId: selectedWinnerId,
          adminNotes: adminNotes.trim() || "Selected as winner by admin",
        }
      );

      toast.success("Tournament winner determined and prize awarded");
      setConfirmDialogOpen(false);

      // Navigate back to disputed tournaments list after short delay
      setTimeout(() => {
        navigate("/admin/tournament-results");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting decision:", error);
      toast.error(
        error.response?.data?.message || "Failed to process admin decision"
      );
    } finally {
      setProcessingDecision(false);
    }
  };

  const toggleOcrText = (id: number) => {
    setExpandedOcr(expandedOcr === id ? null : id);
  };

  const filteredScreenshots = {
    disputed: screenshots.filter(
      (s) =>
        s.verification_status === "verified_win" ||
        s.verification_status === "disputed"
    ),
    others: screenshots.filter(
      (s) =>
        s.verification_status !== "verified_win" &&
        s.verification_status !== "disputed"
    )
  };

  return {
    tournament,
    screenshots,
    loading,
    selectedWinnerId,
    adminNotes,
    confirmDialogOpen,
    processingDecision,
    expandedOcr,
    filteredScreenshots,
    handleWinnerSelection,
    setAdminNotes,
    openConfirmDialog,
    submitDecision,
    toggleOcrText,
    setConfirmDialogOpen,
    navigate
  };
};
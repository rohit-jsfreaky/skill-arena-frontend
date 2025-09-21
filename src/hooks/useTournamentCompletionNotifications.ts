import { useState, useEffect, useCallback } from "react";
import { getRecentTournamentCompletions } from "@/api/userNotifications";

interface TournamentNotification {
  id: number;
  title: string;
  body: string;
  data: {
    tournament_id: string;
    type: string;
    action_url: string;
  };
  sent_at: string;
}

export const useTournamentCompletionNotifications = (userId: number | null) => {
  const [notifications, setNotifications] = useState<TournamentNotification[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTournamentCompletions = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await getRecentTournamentCompletions(userId);
      
      if (response.success && response.data.length > 0) {
        setNotifications(response.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching tournament completions:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const closeModal = () => {
    setShowModal(false);
    setNotifications([]);
  };

  // Check for new notifications on user ID change or mount
  useEffect(() => {
    if (userId) {
      fetchTournamentCompletions();
    }
  }, [userId, fetchTournamentCompletions]);

  // Optional: Check for new notifications periodically (every 5 minutes)
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchTournamentCompletions();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [userId, fetchTournamentCompletions]);

  return {
    notifications,
    showModal,
    loading,
    closeModal,
    refetch: fetchTournamentCompletions,
  };
};
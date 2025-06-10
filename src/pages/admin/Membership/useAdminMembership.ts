import { useState, useEffect, useCallback } from "react";
import {
  getAllMemberships,
  createMembership,
  updateMembership,
  deleteMembership as apiDeleteMembership,
  Membership,
} from "@/api/admin/membership";
import { getAllGames, Game } from "@/api/admin/games";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";

export interface MembershipFormData {
  id?: number;
  name: string;
  price: number;
  duration: string | Duration | null;
  benefits: string[];
  gameIds?: number[];
}

interface Duration {
  days?: number;
  months?: number;
  years?: number;
}

export const useAdminMembership = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMembership, setEditMembership] = useState<Membership | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [membershipToDelete, setMembershipToDelete] = useState<number | null>(
    null
  );
  const [processingAction, setProcessingAction] = useState(false);

  const fetchMemberships = useCallback(async () => {
    const result = await getAllMemberships(setLoading);
    if (result.success && result.data) {
      setMemberships(result.data as Membership[]);
    } else {
      showErrorToast(result.message);
    }
  }, []);

  const fetchGames = useCallback(async () => {
    const result = await getAllGames(setGamesLoading);
    if (result.success && result.data) {
      setGames(result.data as Game[]);
    } else {
      showErrorToast(result.message);
    }
  }, []);

  useEffect(() => {
    fetchMemberships();
    fetchGames();
  }, [fetchMemberships, fetchGames]);

  const handleCreateMembership = () => {
    setEditMembership(null);
    setIsModalOpen(true);
  };

  const handleEditMembership = (membership: Membership) => {
    setEditMembership(membership);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: MembershipFormData) => {
    setProcessingAction(true);
    try {
      let result;

      // Prepare data for API
      const formattedData = {
        ...formData,
        price:
          typeof formData.price === "string"
            ? parseFloat(formData.price)
            : formData.price,
        duration: formData.duration,
        games: formData.gameIds || [],
      };

      if (editMembership) {
        result = await updateMembership(
          editMembership.id as number,
          formattedData,
          setLoading
        );
      } else {
        // Create new membership
        result = await createMembership(formattedData, setLoading);
      }

      if (result.success) {
        showSuccessToast(result.message);
        setIsModalOpen(false);
        fetchMemberships();
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorToast("An error occurred processing your request");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setMembershipToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!membershipToDelete) return;

    setProcessingAction(true);
    try {
      const result = await apiDeleteMembership(membershipToDelete, setLoading);

      if (result.success) {
        showSuccessToast(result.message);
        fetchMemberships();
      } else {
        showErrorToast(result.message);
      }
    } catch {
      showErrorToast("Failed to delete membership");
    } finally {
      setDeleteDialogOpen(false);
      setMembershipToDelete(null);
      setProcessingAction(false);
    }
  };

  const formatDuration = (duration: Duration | string | null): string => {
    if (!duration) return "Permanent";

    if (typeof duration === "object") {
      if (duration.days)
        return duration.days === 1 ? "1 Day" : `${duration.days} Days`;
      if (duration.months)
        return duration.months === 1 ? "1 Month" : `${duration.months} Months`;
      if (duration.years)
        return duration.years === 1 ? "1 Year" : `${duration.years} Years`;
      return "Permanent";
    }

    const durationStr = String(duration);

    const months = durationStr.match(/(\d+) month/i);
    const days = durationStr.match(/(\d+) day/i);
    const years = durationStr.match(/(\d+) year/i);

    if (months && parseInt(months[1]) === 1) {
      return "1 Month";
    } else if (months) {
      return `${months[1]} Months`;
    } else if (days && parseInt(days[1]) === 30) {
      return "1 Month";
    } else if (days && parseInt(days[1]) === 1) {
      return "1 Day";
    } else if (days) {
      return `${days[1]} Days`;
    } else if (years && parseInt(years[1]) === 1) {
      return "1 Year";
    } else if (years) {
      return `${years[1]} Years`;
    }

    return durationStr;
  };

  // Format price to currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return {
    memberships,
    games,
    loading,
    gamesLoading,
    isModalOpen,
    setIsModalOpen,
    editMembership,
    deleteDialogOpen,
    setDeleteDialogOpen,
    processingAction,
    handleCreateMembership,
    handleEditMembership,
    handleSubmit,
    handleDeleteClick,
    handleDeleteConfirm,
    formatDuration,
    formatPrice,
    fetchMemberships,
  };
};

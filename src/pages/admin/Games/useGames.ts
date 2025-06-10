import {
  fetchGames,
  Game,
  deleteGame as apiDeleteGame,
  PaginationResponse,
} from "@/api/admin/games";
import { FormEvent } from "react";

export const useGames = () => {
  const loadGames = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    pagination: PaginationResponse,
    setGames: React.Dispatch<React.SetStateAction<Game[]>>,
    setPagination: React.Dispatch<React.SetStateAction<PaginationResponse>>,
    searchTerm: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchGames(
        pagination.currentPage,
        pagination.limit,
        searchTerm
      );
      setGames(data.games);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (
    e: FormEvent<HTMLFormElement>,
    setPagination: React.Dispatch<React.SetStateAction<PaginationResponse>>
  ): void => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleEdit = (
    game: Game,
    setSelectedGame: React.Dispatch<React.SetStateAction<Game | null>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleDelete = async (
    deleteGame: typeof apiDeleteGame,
    deleteId: number | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    pagination: PaginationResponse,
    setGames: React.Dispatch<React.SetStateAction<Game[]>>,
    setPagination: React.Dispatch<React.SetStateAction<PaginationResponse>>,
    searchTerm: string,
    setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteId: React.Dispatch<React.SetStateAction<number | null>>
  ): Promise<void> => {
    if (!deleteId) return;
    try {
      await deleteGame(deleteId);
      loadGames(setLoading, pagination, setGames, setPagination, searchTerm);
    } catch (error) {
      console.error("Error deleting game:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = (
    id: number,
    setDeleteId: React.Dispatch<React.SetStateAction<number | null>>,
    setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChange = (
    page: number,
    setPagination: React.Dispatch<React.SetStateAction<PaginationResponse>>
  ): void => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toUTCString()
      .split(",")[1]
      .trim()
      .split(" ")
      .slice(0, 3)
      .join(" ");
  };

  return {
    loadGames,
    handleSearch,
    handleEdit,
    handleDelete,
    confirmDelete,
    handlePageChange,
    getStatusColor,
    formatDate,
  };
};

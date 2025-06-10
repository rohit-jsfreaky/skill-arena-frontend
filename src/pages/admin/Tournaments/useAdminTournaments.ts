import { useCallback, useEffect, useRef, useState } from "react";
import { Tournament, TournamentFilterOption } from "@/interface/tournament";
import {
  deleteTournament,
  getAllTournamets,
  searchTournaments,
} from "@/api/admin/tournaments";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { useNavigate } from "react-router";

// Define search result type for tournaments
export interface TournamentSearchResult {
  id: number;
  name: string;
  game_name: string;
  image?: string;
  status: string;
}

export interface TournamentPagination {
  totalTournaments: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useAdminTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tournamentId, setTournamentId] = useState<number>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filter, setFilter] = useState<TournamentFilterOption>("all");
  const navigate = useNavigate();

  // Search-related state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TournamentSearchResult[]>(
    []
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [pagination, setPagination] = useState<TournamentPagination>({
    totalTournaments: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Load tournaments based on current filter and pagination
  const loadTournaments = useCallback(async () => {
    const result = await getAllTournamets(
      setLoading,
      pagination.currentPage,
      pagination.limit,
      filter
    );  

    console.log("tournaments", result.data);

    if (result.success) {
      setTournaments(result.data);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } else {
      showErrorToast(result.message);
    }
  }, [pagination.currentPage, pagination.limit, filter]);

  // Initial load and when dependencies change
  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  // Handle screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth < 1000;
      setIsMobile(newIsMobile);
    };

    // Initial check
    checkScreenSize();

    // Add throttled event listener for better performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkScreenSize();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Handle search functionality with debouncing
  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const res = await searchTournaments(term, setSearchLoading);
    if (res.success && res.data) {
      setSearchResults(res.data);
      setShowSuggestions(true);
    }
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for debounce (300ms)
    searchTimeout.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  // Handle clicking on a search result
  const handleSelectTournament = (tournamentId: number) => {
    setShowSuggestions(false);
    navigate(`/admin/tournaments/${tournamentId}`);
  };

  // Setup click outside listener for search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any pending timeouts
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle tournament deletion
  const handleDeleteTournament = async () => {
    if (!tournamentId) {
      return showErrorToast("Tournament ID is not set.");
    }

    const res = await deleteTournament(tournamentId, setDeleteLoading);

    if (res.success) {
      setAlertOpen(false);
      // Refresh tournaments without reloading the page
      loadTournaments();
      return showSuccessToast(res.message);
    } else {
      setAlertOpen(false);
      return showErrorToast(res.message);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: TournamentFilterOption) => {
    if (newFilter !== filter) {
      setFilter(newFilter);
      // Reset pagination when changing filter
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Navigate to create tournament page
  const navigateToCreate = () => {
    navigate("/admin/tournaments/create");
  };

  return {
    tournaments,
    loading,
    alertOpen,
    setAlertOpen,
    tournamentId,
    setTournamentId,
    deleteLoading,
    isMobile,
    filter,
    searchTerm,
    searchResults,
    searchLoading,
    showSuggestions,
    pagination,
    searchContainerRef,
    handleSearchChange,
    handleSelectTournament,
    formatDate,
    handleDeleteTournament,
    handleFilterChange,
    handlePageChange,
    navigateToCreate,
  };
};

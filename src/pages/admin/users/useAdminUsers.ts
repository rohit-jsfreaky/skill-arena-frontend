import { useEffect, useState, useCallback, useRef } from "react";
import { getAllUsers, searchUsers } from "@/api/admin/users";
import { UserContextType } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

// Define search result type
export interface UserSearchResult {
  id: number;
  name: string;
  username: string;
}

// Define filter options
export type FilterOption = "all" | "active" | "banned";

// Define pagination type
export interface UserPagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useAdminUsers = () => {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [users, setUsers] = useState<UserContextType[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("all");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<UserPagination>({
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounced search function
  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const res = await searchUsers(term, setSearchLoading);
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
  const handleSelectUser = (userId: number) => {
    setShowSuggestions(false);
    navigate(`/admin/users/${userId}`);
  };

  // Fetch users based on current filter and pagination
  const fetchUsers = useCallback(async () => {
    // Reset to first page when filter changes
    const page = filter !== "all" ? 1 : pagination.currentPage;

    const res = await getAllUsers(setLoading, page, pagination.limit, filter);

    if (res.success && res.data && res.pagination) {
      setUsers(res.data);
      setPagination(res.pagination);
    }
  }, [pagination.currentPage, pagination.limit, filter]);

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
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

  // Handle clicking outside to close suggestions
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

  // Fetch users on mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle filter change
  const handleFilterChange = (newFilter: FilterOption) => {
    if (newFilter !== filter) {
      setFilter(newFilter);
      // Reset pagination when changing filter
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return {
    users,
    loading,
    searchLoading,
    isMobile,
    searchTerm,
    searchResults,
    showSuggestions,
    filter,
    pagination,
    searchContainerRef,
    handleSearchChange,
    handleSelectUser,
    fetchUsers,
    handleFilterChange,
    formatDate,
    handlePageChange,
    navigate
  };
};
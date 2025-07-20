import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User } from "lucide-react";
import { searchUsersForClient, UserSearchResult } from "@/api/userSearch";
import { useNavigate } from "react-router-dom";

interface ClientUserSearchProps {
  placeholder?: string;
  className?: string;
  onUserSelect?: (user: UserSearchResult) => void;
  autoNavigate?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "leaderboard";
}

const ClientUserSearch: React.FC<ClientUserSearchProps> = ({
  placeholder = "Search users by name, username, or ID...",
  className = "",
  onUserSelect,
  autoNavigate = true,
  size = "md",
  variant = "default",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Helper function to check if search term is numeric
  const isNumericSearch = /^\d+$/.test(searchTerm.trim());

  // Size variants
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  // Variant styles
  const variantStyles = {
    default: "bg-black/50 border-[#BBF429]/40 focus:border-[#BBF429]",
    leaderboard:
      "bg-black/30 border-[#BBF429]/30 focus:border-[#BBF429] focus:bg-black/50",
  };

  // Debounced search function
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await searchUsersForClient(term, 6);
      if (response.success && response.data) {
        setSearchResults(response.data);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debouncing (300ms)
    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  // Handle user selection
  const handleUserSelect = (user: UserSearchResult) => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSuggestions(false);

    if (onUserSelect) {
      onUserSelect(user);
    }

    if (autoNavigate) {
      navigate(`/profile/${user.id}`);
    }
  };

  // Handle click outside to close suggestions
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
      // Cleanup timeout on unmount
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchContainerRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full pr-10 rounded-lg border text-white focus:outline-none transition-all duration-300
            ${sizeClasses[size]}
            ${variantStyles[variant]}
          `}
        />
        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2`}>
          {searchLoading ? (
            <div
              className={`animate-spin rounded-full border-t-2 border-b-2 border-[#BBF429] ${iconSizes[size]}`}
            ></div>
          ) : (
            <Search className={`${iconSizes[size]} text-[#BBF429]/70`} />
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showSuggestions && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-black/95 border border-[#BBF429]/30 rounded-lg shadow-xl max-h-72 overflow-auto backdrop-blur-sm"
          >
            {searchResults.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: "rgba(187, 244, 41, 0.1)" }}
                className="px-4 py-3 cursor-pointer hover:bg-[#BBF429]/10 border-b border-[#BBF429]/10 last:border-0 transition-colors duration-200"
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#BBF429]/20 flex items-center justify-center overflow-hidden border border-[#BBF429]/30">
                    {user.profile ? (
                      <img
                        src={user.profile}
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling!.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`${
                        user.profile ? "hidden" : ""
                      } text-[#BBF429] text-xs font-bold flex items-center justify-center w-full h-full`}
                    >
                      <User className="h-4 w-4" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">
                      {user.username}
                    </div>
                    <div className="text-xs text-[#BBF429]/70 truncate">
                      {user.name}
                    </div>
                  </div>

                  {/* User ID */}
                  <div className="text-xs text-gray-400 bg-[#BBF429]/10 px-2 py-1 rounded">
                    ID: {user.id}
                  </div>
                </div>

                {/* Highlight if this was an ID search match */}
                {isNumericSearch &&
                  user.id.toString() === searchTerm.trim() && (
                    <div className="text-xs text-[#BBF429] mt-2 ml-11 flex items-center gap-1">
                      <div className="w-1 h-1 bg-[#BBF429] rounded-full"></div>
                      Exact ID match
                    </div>
                  )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search hint */}
      {searchTerm.length > 0 && searchTerm.length < 2 && !isNumericSearch && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-40 w-full mt-1 px-3 py-2 bg-black/90 border border-[#BBF429]/20 rounded-lg text-xs text-gray-400 backdrop-blur-sm"
        >
          Type at least 2 characters to search...
        </motion.div>
      )}

      {/* No results hint */}
      {showSuggestions &&
        searchResults.length === 0 &&
        searchTerm.length >= 2 &&
        !searchLoading && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-40 w-full mt-1 px-3 py-2 bg-black/90 border border-[#BBF429]/20 rounded-lg text-xs text-gray-400 backdrop-blur-sm"
          >
            No users found for "{searchTerm}"
          </motion.div>
        )}
    </div>
  );
};

export default ClientUserSearch;

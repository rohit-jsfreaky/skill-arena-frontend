import { useState, useCallback } from "react";
import { searchUsersForClient, UserSearchResult } from "@/api/userSearch";

export interface UseUserSearchReturn {
  searchTerm: string;
  searchResults: UserSearchResult[];
  searchLoading: boolean;
  showSuggestions: boolean;
  setSearchTerm: (term: string) => void;
  setShowSuggestions: (show: boolean) => void;
  handleSearch: (term: string) => Promise<void>;
  clearSearch: () => void;
}

export const useUserSearch = (): UseUserSearchReturn => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    // For numeric searches (user ID), allow single character searches
    // For text searches, require at least 2 characters
    const isNumeric = /^\d+$/.test(term.trim());
    const minLength = isNumeric ? 1 : 2;
    
    if (term.length < minLength) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    
    try {
      const response = await searchUsersForClient(term, 5);
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
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSuggestions(false);
  }, []);

  return {
    searchTerm,
    searchResults,
    searchLoading,
    showSuggestions,
    setSearchTerm,
    setShowSuggestions,
    handleSearch,
    clearSearch,
  };
};

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TournamentSearchResult } from "@/pages/admin/Tournaments/useAdminTournaments";

interface TournamentSearchProps {
  searchTerm: string;
  searchResults: TournamentSearchResult[];
  searchLoading: boolean;
  showSuggestions: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectTournament: (id: number) => void;
}

const TournamentSearch: React.FC<TournamentSearchProps> = ({
  searchTerm,
  searchResults,
  searchLoading,
  showSuggestions,
  searchContainerRef,
  onSearchChange,
  onSelectTournament,
}) => {
  return (
    <div className="relative w-full md:w-64" ref={searchContainerRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search tournaments..."
          className="w-full px-4 py-2 pr-10 rounded-lg bg-black/50 border border-[#BBF429]/40 focus:border-[#BBF429] text-white focus:outline-none transition-all duration-300"
        />
        {searchLoading ? (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#BBF429]"></div>
          </div>
        ) : (
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-[#BBF429]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showSuggestions && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-black/90 border border-[#BBF429]/30 rounded-lg shadow-xl max-h-60 overflow-auto"
          >
            {searchResults.map((tournament) => (
              <motion.div
                key={tournament.id}
                whileHover={{
                  backgroundColor: "rgba(187, 244, 41, 0.1)",
                }}
                className="px-4 py-3 cursor-pointer hover:bg-[#BBF429]/10 border-b border-[#BBF429]/10 last:border-0"
                onClick={() => onSelectTournament(tournament.id)}
              >
                <div className="flex items-center mb-1">
                  {tournament.image && (
                    <img
                      src={tournament.image}
                      alt={tournament.name}
                      className="h-6 w-6 rounded-full mr-2 object-cover"
                    />
                  )}
                  <div className="font-medium text-white">
                    {tournament.name}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-[#BBF429]/70">
                    {tournament.game_name}
                  </div>
                  <div
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      tournament.status === "upcoming"
                        ? "bg-blue-900/30 text-blue-300"
                        : tournament.status === "ongoing"
                        ? "bg-green-900/30 text-green-300"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {tournament.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentSearch;
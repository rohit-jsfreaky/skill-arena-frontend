import React from "react";
import { Button } from "@/components/ui/button";
import TournamentSearch from "./TournamentSearch";
import { TournamentSearchResult } from "@/pages/admin/Tournaments/useAdminTournaments";

interface TournamentHeaderProps {
  searchTerm: string;
  searchResults: TournamentSearchResult[];
  searchLoading: boolean;
  showSuggestions: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectTournament: (id: number) => void;
  onCreateClick: () => void;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  searchTerm,
  searchResults,
  searchLoading,
  showSuggestions,
  searchContainerRef,
  onSearchChange,
  onSelectTournament,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 className="text-3xl font-bold mb-4 md:mb-0 text-white">
        Tournaments
      </h1>

      <div className="flex flex-col md:flex-row gap-3">
        <TournamentSearch
          searchTerm={searchTerm}
          searchResults={searchResults}
          searchLoading={searchLoading}
          showSuggestions={showSuggestions}
          searchContainerRef={searchContainerRef}
          onSearchChange={onSearchChange}
          onSelectTournament={onSelectTournament}
        />

        <Button
          onClick={onCreateClick}
          className="flex items-center bg-[#BBF429] text-black px-4 py-2 rounded-lg hover:bg-[#a8d90f] transition text-sm sm:text-base ml-0 md:ml-2"
        >
          <span className="mr-2 text-base sm:text-lg font-medium">+</span>
          <span>Create Tournament</span>
        </Button>
      </div>
    </div>
  );
};

export default TournamentHeader;

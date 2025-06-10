import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMember } from "@/hooks/useTDMMatch";
import { useMYUser } from "@/context/UserContext";
import { searchTDMPlayers } from "@/api/tdm";
import { X, Search, Loader2, Plus } from "lucide-react";
import { showErrorToast } from "@/utils/toastUtils";

interface TeamMemberSelectorProps {
  selectedMembers: TeamMember[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  maxMembers: number;
  matchId?: number; // Optional match ID for checking if users are already in the match
}

export const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  selectedMembers,
  setSelectedMembers,
  maxMembers,
  matchId,
}) => {
  const { myUser } = useMYUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Debounce search function
  const debouncedSearch = useCallback(
    async (term: string) => {
      if (!term.trim() || term.length < 2) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }

      setIsSearching(true);
      try {
        // Pass matchId to exclude users already in the match
        const response = await searchTDMPlayers(term, matchId);
        if (response.success) {
          // Filter out already selected members
          const filteredResults = response.data.filter(
            (player) => !selectedMembers.some((m) => m.id === player.id)
          );
          setSearchResults(filteredResults);
          setNoResults(filteredResults.length === 0);
        }
      } catch (error) {
        console.error("Error searching for players:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [selectedMembers, matchId]
  );

  // Use debouncing with useEffect
  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debouncedSearch]);

  const addMember = (member: TeamMember) => {
    if (selectedMembers.length >= maxMembers) {
      showErrorToast(`You can only add up to ${maxMembers} members.`);
      return;
    }

    if (selectedMembers.some((m) => m.id === member.id)) {
      showErrorToast("This player is already in your team.");
      return;
    }

    setSelectedMembers((prev) => [...prev, member]);
    setSearchTerm("");
    setSearchResults([]);
    setNoResults(false);
  };

  const removeMember = (id: number) => {
    if (myUser?.id === id) {
      showErrorToast("You cannot remove yourself from the team.");
      return;
    }

    setSelectedMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="team-members">
          Team Members ({selectedMembers.length}/{maxMembers})
        </Label>
        <div className="relative mt-2">
          <Input
            id="member-search"
            placeholder="Search for players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Type at least 2 characters to search
        </p>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-md mt-1 max-h-48 overflow-y-auto">
          {searchResults.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 hover:bg-secondary/10 cursor-pointer"
              onClick={() => addMember(player)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  {player.profile && (
                    <AvatarImage src={player.profile} alt={player.username} />
                  )}
                  <AvatarFallback className="bg-primary/10">
                    {player.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{player.username}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {noResults && searchTerm.length >= 2 && !isSearching && (
        <div className="bg-secondary/30 p-3 rounded-md">
          <p className="text-sm text-center">No available players found</p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium mb-2">Selected Members:</p>
        <ul className="space-y-2">
          {selectedMembers.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={member.profile || ""}
                    alt={member.username}
                  />
                  <AvatarFallback>
                    {member.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {member.username} {member.id === myUser?.id ? "(You)" : ""}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeMember(member.id)}
                disabled={member.id === myUser?.id}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gamepad2, Search, Plus, X, Coins } from "lucide-react";
import { TeamMember } from "@/hooks/useTDMMatch";
import { useMYUser } from "@/context/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TdmMatchType } from "@/interface/tdmMatches";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { searchTDMPlayers } from "@/api/tdmMatches";
import { useDebounce } from "@/hooks/useDebounce";
import { showErrorToast } from "@/utils/toastUtils";
import { Game } from "@/api/admin/games";
import { getGamesBasedOnUser } from "@/api/games";

interface CreateTdmMatchProps {
  onCreateMatch: (
    matchType: TdmMatchType,
    gameName: string,
    entryFee: number,
    teamName: string,
    teamMembers: TeamMember[],
    teamSize: number // Add this new parameter
  ) => Promise<void>;
  loading: boolean;
  tournamentMargin: number;
}

export const CreateTdmMatch: React.FC<CreateTdmMatchProps> = ({
  onCreateMatch,
  loading,
  tournamentMargin,
}) => {
  const { myUser } = useMYUser();
  const [matchType, setMatchType] = useState<TdmMatchType>("public");
  const [game, setGame] = useState<string>("");
  const [entryFee, setEntryFee] = useState<number>(10);
  const [teamName, setTeamName] = useState<string>("");
  const [teamSize, setTeamSize] = useState<number>(4); // Default to 4v4
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    myUser
      ? [
          {
            id: myUser.id,
            username: myUser.username,
            profile: myUser.profile || undefined,
          },
        ]
      : []
  );
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [popularGames, setPopularGames] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    const getGames = async () => {
      if (myUser?.id) {
        const { data, success, message } = await getGamesBasedOnUser(
          myUser?.id
        );

        if (!success) return showErrorToast(message || "Failed to fetch games");
        
        // Extract game names from the data array and set to popularGames
        if (data && Array.isArray(data)) {
          const gameNames = data.map((game: Game) => game.name);
          setPopularGames(gameNames);
        }
      }
    };

    getGames();
  }, [myUser?.id]);

  useEffect(() => {
    const searchPlayers = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        const response = await searchTDMPlayers(debouncedSearchTerm);
        if (response.success) {
          // Filter out players already in the team
          const filteredResults = response.data.filter(
            (player: TeamMember) =>
              !teamMembers.some((member) => member.id === player.id)
          );
          setSearchResults(filteredResults);
        }
      } catch (error) {
        console.error("Error searching players:", error);
      } finally {
        setSearching(false);
      }
    };

    searchPlayers();
  }, [debouncedSearchTerm, teamMembers]);

  const addTeamMember = (member: TeamMember) => {
    if (
      teamMembers.length >= teamSize ||
      teamMembers.some((m) => m.id === member.id)
    )
      return;
    setTeamMembers([...teamMembers, member]);
    setSearchTerm("");
  };

  const removeTeamMember = (id: number) => {
    // Don't remove yourself
    if (myUser && id === myUser.id) return;
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const handleGameSelect = (selectedGame: string) => {
    setGame(selectedGame);
  };

  const calculatePrizePool = () => {
    const totalEntryFees = entryFee * teamSize * 2; // Both teams
    const platformFee = totalEntryFees * (tournamentMargin / 100);
    const prizePool = Math.round(totalEntryFees - platformFee);
    return prizePool.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!game) {
      showErrorToast("Please select a game");
      return;
    }

    if (!teamName) {
      showErrorToast("Please enter a team name");
      return;
    }

    if (teamMembers.length < 1) {
      showErrorToast("Your team must have at least one member (you)");
      return;
    }

    if (teamMembers.length > teamSize) {
      showErrorToast(`Your team cannot have more than ${teamSize} members`);
      return;
    }

    await onCreateMatch(
      matchType,
      game,
      entryFee,
      teamName,
      teamMembers,
      teamSize
    );
  };

  const isNextEnabled = () => {
    if (activeTab === "details") {
      return !!game && !!teamName && entryFee >= 5;
    }
    return teamMembers.length >= 1 && teamMembers.length <= teamSize;
  };

  // Add team size options
  const teamSizeOptions = [
    { value: 4, label: "4v4" },
    { value: 6, label: "6v6" },
    { value: 8, label: "8v8" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-0 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 bg-[#BBF429] ">
          <TabsTrigger
            className="data-[state=active]:bg-black data-[state=active]:text-white"
            value="details"
          >
            Match Details
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-black data-[state=active]:text-white"
            value="team"
          >
            Team Selection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-4 px-6 pb-6 text-white">
          {/* Match Type Selection */}
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="match-type" className="text-base text-white">
                  Match Type
                </Label>
              </div>
              <RadioGroup
                id="match-type"
                value={matchType}
                onValueChange={(value) => setMatchType(value as TdmMatchType)}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 cursor-pointer hover:bg-[#BBF429]/10 transition-colors border-[#BBF429]">
                  <RadioGroupItem
                    value="public"
                    id="public"
                    className="text-[#BBF429] border-[#BBF429] focus:ring-[#BBF429] data-[state=checked]:bg-[#BBF429] data-[state=checked]:text-black"
                  />
                  <Label
                    htmlFor="public"
                    className="cursor-pointer flex flex-col text-white"
                  >
                    <span className="font-medium">Public Match</span>
                    <span className="text-xs text-[#EAFFA9]">
                      Anyone can join your match
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 cursor-pointer hover:bg-[#BBF429]/10 transition-colors border-[#BBF429]">
                  <RadioGroupItem
                    value="private"
                    id="private"
                    className="text-[#BBF429] border-[#BBF429] focus:ring-[#BBF429] data-[state=checked]:bg-[#BBF429] data-[state=checked]:text-black"
                  />
                  <Label
                    htmlFor="private"
                    className="cursor-pointer flex flex-col"
                  >
                    <span className="font-medium">Private Match</span>
                    <span className="text-xs text-[#EAFFA9]">
                      Invite another team to play
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Game Selection */}
            <div className="space-y-3 border-[#BBF429] border rounded-md p-3">
              <Label htmlFor="game" className="text-base">
                Select Game
              </Label>
              <Input
                id="game"
                placeholder="Select Game below..."
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="mb-2 border-[#BBF429]"
                disabled={true}
              />
              <div className="flex flex-wrap gap-2">
                {popularGames.map((popularGame) => (
                  <Badge
                    key={popularGame}
                    variant={game === popularGame ? "default" : "outline"}
                    className="cursor-pointer border-[#BBF429] text-white"
                    onClick={() => handleGameSelect(popularGame)}
                  >
                    <Gamepad2 className="h-3 w-3 mr-1" />
                    {popularGame}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Team Name */}
            <div className="space-y-3 border-[#BBF429] border rounded-md p-3">
              <Label htmlFor="team-name" className="text-base">
                Team Name
              </Label>
              <Input
                id="team-name"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            {/* Entry Fee */}
            <div className="space-y-3 border-[#BBF429] border rounded-md p-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="entry-fee" className="text-base">
                  Entry Fee per Player
                </Label>
                <div className="text-sm text-white">
                  Prize Pool:{" "}
                  <span className="font-semibold text-[#EAFFA9]">
                    {calculatePrizePool()} coins
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <Input
                  id="entry-fee"
                  type="number"
                  min={5}
                  max={1000}
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-[#EAFFA9]">coins</span>
              </div>
              <p className="text-xs text-[#EAFFA9]">
                This is the amount each player needs to pay. Minimum 5 coins.
              </p>
            </div>

            {/* Team Size Selection */}
            <div className="space-y-3 border-[#BBF429] border rounded-md p-3">
              <Label htmlFor="team-size" className="text-base">
                Team Size
              </Label>
              <div className="flex flex-col space-y-2">
                {teamSizeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                      teamSize === option.value
                        ? "bg-[#BBF429]/20 border border-[#BBF429]"
                        : "hover:bg-[#BBF429]/10"
                    }`}
                    onClick={() => setTeamSize(option.value)}
                  >
                    <div
                      className={`h-4 w-4 rounded-full border ${
                        teamSize === option.value
                          ? "bg-[#BBF429] border-[#BBF429]"
                          : "border-white"
                      }`}
                    >
                      {teamSize === option.value && (
                        <div className="h-2 w-2 rounded-full bg-black m-0.5"></div>
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#EAFFA9]">
                Select the size of each team in the match
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => setActiveTab("team")}
              disabled={!isNextEnabled()}
            >
              Next: Select Team Members
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="team" className="pt-4 px-6 pb-6">
          <div className="space-y-5">
            {/* Team Members Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-base">Team Members ({teamSize})</Label>
                <Badge
                  variant={
                    teamMembers.length === teamSize ? "default" : "outline"
                  }
                  className="text-white"
                >
                  {teamMembers.length}/{teamSize} Selected
                </Badge>
              </div>

              {/* Team members list */}
              <div className="space-y-2 mb-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between border border-[#BBF429] rounded-md p-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {member.profile && (
                          <AvatarImage
                            src={member.profile}
                            alt={member.username}
                          />
                        )}
                        <AvatarFallback className="bg-primary/10">
                          {member.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.username}</p>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Team Captain
                          </Badge>
                        )}
                      </div>
                    </div>
                    {member.id !== myUser?.id && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Empty slots */}
                {Array(teamSize - teamMembers.length)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="flex items-center justify-center border border-dashed border-[#BBF429] rounded-md p-2 h-12"
                    >
                      <span className="text-sm text-muted-foreground">
                        Add team member
                      </span>
                    </div>
                  ))}
              </div>

              {/* Player search */}
              {teamMembers.length < teamSize && (
                <div className="space-y-3">
                  <Label htmlFor="player-search">Search Players</Label>
                  <div className="relative">
                    <Input
                      id="player-search"
                      placeholder="Search by username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 border-[#BBF429]"
                    />
                    <div className="absolute right-3 top-2.5">
                      {searching ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="border rounded-md mt-1 max-h-48 overflow-y-auto">
                      {searchResults.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-2 hover:bg-secondary/10 cursor-pointer"
                          onClick={() => addTeamMember(player)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              {player.profile && (
                                <AvatarImage
                                  src={player.profile}
                                  alt={player.username}
                                />
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

                  {debouncedSearchTerm.length >= 2 &&
                    searchResults.length === 0 &&
                    !searching && (
                      <p className="text-sm text-muted-foreground">
                        No players found
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-between mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveTab("details")}
            >
              Back to Match Details
            </Button>
            <Button
              variant={"secondary"}
              type="submit"
              disabled={!isNextEnabled() || loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Match"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

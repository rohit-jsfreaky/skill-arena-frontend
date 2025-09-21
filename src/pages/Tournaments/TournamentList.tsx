import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMYUser } from "@/context/UserContext";
import TournamentCard from "@/components/Tournaments/TournamentCard";
import TournamentHistory from "./TournamentHistory";
import { Tournament } from "@/interface/tournament";
import { fetchMyTournaments, fetchTournaments } from "@/api/tournament";
import { useAuthToken } from "@/context/AuthTokenContext";
import { useUser } from "@clerk/clerk-react";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllGamesForFilter } from "@/api/games";
import { Game } from "@/api/admin/games";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TournamentList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [gamesLoading, setGamesLoading] = useState(false);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  const { myUser } = useMYUser();
  const navigate = useNavigate();
  const { authToken } = useAuthToken();
  const { isSignedIn } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<{
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalItems: number;
    limit: number;
  } | null>(null);

  // Load games on component mount
  useEffect(() => {
    const loadGames = async () => {
      setGamesLoading(true);
      try {
        const result = await getAllGamesForFilter();
        if (result.success) {
          setGames(result.data);
        }
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setGamesLoading(false);
      }
    };

    if (authToken) {
      loadGames();
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      const fetchData = async () => {
        setTournamentsLoading(true);
        try {
          const paginationInfo = await fetchTournaments({
            setTournaments,
            page: currentPage,
            limit: 9,
            user_id: myUser?.id,
            game_name: selectedGame,
          });
          setPaginationData(paginationInfo);
        } catch (error) {
          console.error("Error fetching tournaments:", error);
        } finally {
          setTournamentsLoading(false);
        }
      };
      fetchData();
      fetchMyTournaments({ myUser, setMyTournaments });
    }
  }, [myUser, currentPage, authToken, selectedGame]);

  const handleGameFilterChange = (gameName: string) => {
    setSelectedGame(gameName);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getEntryFee = (tournament: Tournament): number => {
    if (myUser?.membership_id) {
      return Number(tournament.entry_fee_pro);
    }
    return Number(tournament.entry_fee_normal);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    if (!paginationData || activeTab !== "all") return null;

    const { currentPage, hasNextPage, hasPrevPage, totalPages } =
      paginationData;

    return (
      <div className="flex justify-between items-center mt-6 bg-[#1A1A1A] rounded-lg p-4 text-white">
        <div className="flex gap-4 text-sm">
          <div className=" pl-4">
            Page {currentPage} of {totalPages}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => hasPrevPage && handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            variant="outline"
            size="sm"
            className={
              !hasPrevPage
                ? "opacity-50 cursor-not-allowed text-black"
                : "text-black"
            }
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            variant="outline"
            size="sm"
            className={
              !hasNextPage
                ? "opacity-50 cursor-not-allowed text-black"
                : "text-black"
            }
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  if (!isSignedIn) {
    return (
      <div
        className={`${
          !isSignedIn && "justify-center flex items-center"
        } bg-black text-white min-h-screen`}
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        <NotLoginCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Tournaments</h1>
      
      {/* Tabs and Filters */}
      <div className="mb-6 space-y-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b text-white">
          <button
            className={`py-2 px-4 md:px-6 text-sm md:text-base ${
              activeTab === "all"
                ? "border-b-2 border-[#BBF429] text-[#BBF429]"
                : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Tournaments
          </button>
          <button
            className={`py-2 px-4 md:px-6 text-sm md:text-base ${
              activeTab === "my"
                ? "border-b-2 border-[#BBF429] text-[#BBF429]"
                : ""
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Tournaments
          </button>
        </div>

        {/* Game Filter - Only show for "all" tab */}
        {activeTab === "all" && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#BBF429]" />
              <span className="text-white text-sm font-medium">Filter by Game:</span>
            </div>
            <Select
              value={selectedGame}
              onValueChange={handleGameFilterChange}
              disabled={gamesLoading || tournamentsLoading}
            >
              <SelectTrigger className="w-full sm:w-64 bg-black/50 border-[#BBF429]/30 text-white">
                <SelectValue placeholder={gamesLoading ? "Loading games..." : "Select a game..."} />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-[#BBF429]/30">
                {gamesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner color="white" size={20} />
                  </div>
                ) : (
                  <>
                    <SelectItem value="all" className="text-white hover:bg-[#BBF429]/20">
                      All Games
                    </SelectItem>
                    {games.map((game) => (
                      <SelectItem
                        key={game.id}
                        value={game.name}
                        className="text-white hover:bg-[#BBF429]/20"
                      >
                        <div className="flex items-center gap-2">
                          {game.image && (
                            <img
                              src={game.image}
                              alt={game.name}
                              className="w-4 h-4 rounded object-cover"
                            />
                          )}
                          <span>{game.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            {tournamentsLoading && selectedGame !== "all" && (
              <div className="flex items-center gap-2 text-[#BBF429] text-sm">
                <LoadingSpinner color="#BBF429" size={16} />
                <span>Filtering...</span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Tournament Grid */}
      <div
        className={
          activeTab === "history"
            ? "w-full"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]"
        }
      >
        {activeTab === "history" ? (
          <TournamentHistory />
        ) : tournamentsLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-3">
              <LoadingSpinner color="white" size={50} />
              <p className="text-white text-sm">
                {selectedGame === "all" 
                  ? "Loading tournaments..." 
                  : `Loading ${games.find(g => g.name === selectedGame)?.name || selectedGame} tournaments...`}
              </p>
            </div>
          </div>
        ) : (
          (activeTab === "all" ? tournaments : myTournaments).map(
            (tournament) => (
              <TournamentCard
                formatDate={formatDate}
                getEntryFee={getEntryFee}
                myUser={myUser}
                navigate={navigate}
                tournament={tournament}
                key={tournament.id}
              />
            )
          )
        )}
      </div>

      {renderPagination()}

      {activeTab !== "history" &&
        (activeTab === "all" ? tournaments : myTournaments).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {activeTab === "all"
                ? selectedGame === "all" 
                  ? "No tournaments available at the moment."
                  : `No tournaments found for ${games.find(g => g.name === selectedGame)?.name || selectedGame}.`
                : "You haven't joined any tournaments yet."}
            </p>
            {activeTab === "all" && selectedGame !== "all" && (
              <button
                onClick={() => handleGameFilterChange("all")}
                className="mt-2 text-[#BBF429] hover:underline text-sm"
              >
                Show all tournaments
              </button>
            )}
          </div>
        )}
    </div>
  );
};

export default TournamentList;

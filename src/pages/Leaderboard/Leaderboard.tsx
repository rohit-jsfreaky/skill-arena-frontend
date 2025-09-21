import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Search,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import apiClient from "@/utils/apiClient";
import { useMYUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ClientUserSearch from "@/components/UserSearch/ClientUserSearch";
import PlatformStatsBanner from "@/components/PlatformStatsBanner";

interface LeaderboardItem {
  id: number;
  username: string;
  name: string;
  profile: string;
  rank: number;
  total_wins: number;
  total_games_played: number;
  tournament_wins: number;
  tournaments_joined: number;
  tdm_wins: number;
  tdm_matches_joined: number;
  kills: number | null;
  deaths: number | null;
  kd_ratio: number | null;
  headshots: number | null;
  assists: number | null;
  score: number;
}

interface LeaderboardResponse {
  id: number;
  username: string;
  name: string;
  profile: string;
  rank: number | string;
  total_wins: number | string | null;
  total_games_played: number | string | null;
  tournament_wins: number | string | null;
  tournaments_joined: number | string | null;
  tdm_wins: number | string | null;
  tdm_matches_joined: number | string | null;
  kills: number | string | null;
  deaths: number | string | null;
  kd_ratio: number | string | null;
  headshots: number | string | null;
  assists: number | string | null;
  score: number | string;
}

interface PaginationInfo {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("global");
  const [timeframe, setTimeframe] = useState<string>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [isPro, setIsPro] = useState<boolean>(false);

  const { myUser } = useMYUser();
  const navigate = useNavigate();

  const fetchLeaderboard = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `api/leaderboard/global?page=${page}&timeframe=${timeframe}&user_id=${myUser?.id}`;

      if (activeTab === "game" && selectedGame) {
        endpoint = `api/leaderboard/game/${selectedGame}?page=${page}&timeframe=${timeframe}&user_id=${myUser?.id}`;
      }

      const response = await apiClient.get(endpoint);
      console.log("Leaderboard response:", response.data);
      if (response.data.success) {
        // Ensure all numeric fields are properly formatted
        const formattedLeaderboard = response.data.data.map((player: LeaderboardResponse) => ({
          ...player,
          rank: Number(player.rank || 0),
          total_wins: Number(player.total_wins || 0),
          total_games_played: Number(player.total_games_played || 0),
          tournament_wins: Number(player.tournament_wins || 0),
          tournaments_joined: Number(player.tournaments_joined || 0),
          tdm_wins: Number(player.tdm_wins || 0),
          tdm_matches_joined: Number(player.tdm_matches_joined || 0),
          kills: player.kills !== null ? Number(player.kills || 0) : null,
          deaths: player.deaths !== null ? Number(player.deaths || 0) : null,
          kd_ratio: player.kd_ratio !== null ? Number(player.kd_ratio || 0) : null,
          headshots: player.headshots !== null ? Number(player.headshots || 0) : null,
          assists: player.assists !== null ? Number(player.assists || 0) : null,
          score: Number(player.score || 0),
        }));
        
        setLeaderboard(formattedLeaderboard);
        setPagination(response.data.pagination || {
          totalUsers: 0,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        });
        setIsPro(response.data.isPro || false);

        if (response.data.user_rank) {
          setUserRank(Number(response.data.user_rank));
        } else {
          setUserRank(null);
        }
      } else {
        setError(response.data.message || "Failed to load leaderboard");
      }
    } catch (err: unknown) {
      console.error("Error fetching leaderboard:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load leaderboard";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeTab, timeframe, selectedGame, myUser?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeaderboard(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchLeaderboard]);

  const handlePageChange = (page: number) => {
    fetchLeaderboard(page);
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  const handleUpgradeClick = () => {
    navigate("/membership");
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
    return <span className="font-bold">{rank}</span>;
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-3 sm:px-6">
      <div className="container py-4 sm:py-8 max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                Leaderboard
              </h1>
              <p className="text-sm text-[#eaffa9]/70">
                Track player rankings across all games and competitions
              </p>
            </div>
            
            {/* User Search Bar */}
            <div className="w-full sm:w-80">
              <ClientUserSearch 
                placeholder="Search players by name, username, or ID..."
                className="w-full"
                variant="leaderboard"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Platform Statistics Banner */}
        <PlatformStatsBanner />

        <Card className="mb-4 sm:mb-6 bg-black/10 border border-[#BBF429]">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Tabs
                defaultValue="global"
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value);
                  if (value === "global") {
                    setSelectedGame("");
                  }
                }}
                className="w-full sm:w-auto"
              >
                <TabsList className=" w-full sm:w-[300px]  bg-black/50 border border-[#BBF429]/50 p-1 rounded-lg">
                  <TabsTrigger
                    value="global"
                    className="rounded-md data-[state=active]:bg-[#BBF429] data-[state=active]:text-black text-[#BBF429] hover:text-white data-[state=active]:shadow-sm text-sm font-medium transition-all"
                  >
                    Global Rankings
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="ml-auto">
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-black border-[#BBF429]/50 text-white">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#BBF429]/50 text-white">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {userRank && (
          <Card className="mb-4 sm:mb-6 bg-black/30 border border-[#BBF429]/50 text-white">
            <CardContent className="p-3 sm:p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-[#BBF429]/10 border border-[#BBF429]/50 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm sm:text-base">
                      #{userRank}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium">
                      Your Current Rank
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#eaffa9]/70">
                      {activeTab === "global"
                        ? "Global leaderboard"
                        : "Game leaderboard"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewProfile(myUser?.id || 0)}
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#BBF429]/50 text-[#BBF429] hover:bg-[#BBF429]/10"
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card className="bg-black/30 border border-[#BBF429]/50 text-white">
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                    <div className="ml-auto">
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="bg-black/30 border border-[#BBF429]/50">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-400">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : leaderboard.length === 0 ? (
          <Card className="bg-black/30 border border-[#BBF429]/50">
            <CardContent className="p-6">
              <div className="text-center text-white">
                <p className="text-lg mb-2">No leaderboard data available</p>
                <p className="text-sm text-[#eaffa9]/70">
                  {loading ? "Loading players..." : "Check back later for updated rankings"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black/30 border border-[#BBF429]/50">
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 text-xs text-[#eaffa9]/70 pb-2 border-b border-[#BBF429]/20">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-7 sm:col-span-3">Player</div>
                  {isPro && (
                    <>
                      <div className="hidden sm:block col-span-1">Kills</div>
                      <div className="hidden sm:block col-span-1">Deaths</div>
                      <div className="hidden sm:block col-span-1">K/D</div>
                      <div className="hidden sm:block col-span-2">
                        Tournaments
                      </div>
                    </>
                  )}
                  {!isPro && (
                    <>
                      <div className="hidden sm:block col-span-2">
                        Tournaments
                      </div>
                      <div className="hidden sm:block col-span-2">
                        TDM Matches
                      </div>
                    </>
                  )}
                  <div className="col-span-4 sm:col-span-3 text-right">
                    Score
                  </div>
                </div>

                {leaderboard.map((player) => (
                  <div
                    key={player.id}
                    className={`grid grid-cols-12 gap-2 items-center py-2  text-white${
                      player.id === myUser?.id
                        ? "bg-[#BBF429]/10 rounded-md text-white"
                        : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      {getRankIcon(player.rank)}
                    </div>

                    <div className="col-span-7 sm:col-span-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          {player.profile && player.profile.trim() !== "" ? (
                            <AvatarImage
                              src={player.profile}
                              alt={player.username || player.name || "Player"}
                            />
                          ) : (
                            <AvatarFallback className="bg-[#BBF429]/20 text-white">
                              {(player.username?.[0] || player.name?.[0] || "?").toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {player.username || player.name || "Unknown Player"}
                          </p>
                          {isPro && player.kills !== null && player.kills !== undefined && (
                            <p className="text-[10px] text-[#eaffa9]/70 sm:hidden">
                              {player.kills || 0}K/{player.deaths || 0}D · {
                                player.kd_ratio !== null && player.kd_ratio !== undefined 
                                  ? Number(player.kd_ratio).toFixed(2) 
                                  : "0.00"
                              } K/D
                            </p>
                          )}
                          {!isPro && (player.tournament_wins !== null && player.tournament_wins !== undefined) && (
                            <p className="text-[10px] text-[#eaffa9]/70 sm:hidden">
                              {player.tournament_wins || 0} tourney wins ·{" "}
                              {player.tdm_wins || 0} TDM wins
                            </p>
                          )}
                        </div>

                        {player.id === myUser?.id && (
                          <span className="text-[10px] bg-[#BBF429]/20 text-[#BBF429] px-1.5 py-0.5 rounded-sm">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    {isPro && (
                      <>
                        <div className="hidden sm:block col-span-1">
                          <p className="text-sm font-medium text-green-400">
                            {player.kills !== null && player.kills !== undefined ? player.kills : "-"}
                          </p>
                        </div>

                        <div className="hidden sm:block col-span-1">
                          <p className="text-sm font-medium text-red-400">
                            {player.deaths !== null && player.deaths !== undefined ? player.deaths : "-"}
                          </p>
                        </div>

                        <div className="hidden sm:block col-span-1">
                          <p className="text-sm font-medium text-yellow-400">
                            {player.kd_ratio !== null && player.kd_ratio !== undefined 
                              ? Number(player.kd_ratio).toFixed(2) 
                              : "-"
                            }
                          </p>
                        </div>

                        <div className="hidden sm:block col-span-2">
                          <p className="text-sm">
                            {player.tournament_wins !== null && player.tournament_wins !== undefined 
                              ? `${player.tournament_wins} wins` 
                              : "0 wins"
                            }
                          </p>
                          <p className="text-[10px] text-[#eaffa9]/70">
                            {player.tournaments_joined !== null && player.tournaments_joined !== undefined
                              ? `${player.tournaments_joined} played`
                              : "0 played"
                            }
                          </p>
                        </div>
                      </>
                    )}

                    {!isPro && (
                      <>
                        <div className="hidden sm:block col-span-2">
                          <p className="text-sm">
                            {player.tournament_wins !== null && player.tournament_wins !== undefined
                              ? `${player.tournament_wins} wins`
                              : "0 wins"
                            }
                          </p>
                          <p className="text-[10px] text-[#eaffa9]/70">
                            {player.tournaments_joined !== null && player.tournaments_joined !== undefined
                              ? `${player.tournaments_joined} played`
                              : "0 played"
                            }
                          </p>
                        </div>

                        <div className="hidden sm:block col-span-2">
                          <p className="text-sm">
                            {player.tdm_wins !== null && player.tdm_wins !== undefined
                              ? `${player.tdm_wins} wins`
                              : "0 wins"
                            }
                          </p>
                          <p className="text-[10px] text-[#eaffa9]/70">
                            {player.tdm_matches_joined !== null && player.tdm_matches_joined !== undefined
                              ? `${player.tdm_matches_joined} played`
                              : "0 played"
                            }
                          </p>
                        </div>
                      </>
                    )}

                    <div className="col-span-4 sm:col-span-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <p className="font-semibold">
                          {Number(player.score || 0).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-8 sm:w-8 rounded-full hover:bg-white/10"
                          onClick={() => handleViewProfile(player.id)}
                        >
                          <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalUsers > 0 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-xs text-[#eaffa9]/70">
                    Showing {Math.max(1, (pagination.currentPage - 1) * pagination.limit + 1)}{" "}
                    to{" "}
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalUsers
                    )}{" "}
                    of {pagination.totalUsers} players
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-[#BBF429]/50"
                      disabled={!pagination.hasPrevPage || loading}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm px-2">
                      {pagination.currentPage} / {Math.max(1, pagination.totalPages)}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-[#BBF429]/50"
                      disabled={!pagination.hasNextPage || loading}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 sm:mt-8 bg-black/30 border-[#BBF429]/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 text-white">
                  <Lock className="h-4 w-4 text-[#BBF429]" />
                  Pro Features
                </h3>
                <p className="text-sm text-[#eaffa9]/70 mt-1">
                  Upgrade to Pro to see detailed player statistics and unlock
                  exclusive leaderboard insights
                </p>
              </div>

              {!isPro && (
                <Button
                  onClick={handleUpgradeClick}
                  className="bg-[#BBF429] text-black hover:bg-[#BBF429]/80 whitespace-nowrap"
                >
                  <Crown className="h-4 w-4 mr-1" /> Upgrade Now
                </Button>
              )}

              {isPro && (
                <div className="bg-[#BBF429]/20 px-3 py-1.5 rounded-md border border-[#BBF429]/50 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-[#BBF429]" />
                  <span className="text-[#BBF429] text-sm font-medium">
                    Pro Member
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;

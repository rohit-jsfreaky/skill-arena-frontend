import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Trophy, Award, Crown, Users, Gamepad2, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import apiClient from "@/utils/apiClient";
import { useMYUser } from "@/context/UserContext";
interface GameStats {
  game_name: string;
  tournament_wins: number;
  tournaments_joined: number;
  tdm_wins: number;
  tdm_matches_joined: number;
}

interface UserStats {
  id: number;
  username: string;
  name: string;
  profile: string;
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
  global_rank: number | null;
  games: GameStats[] | null;
}

const UserLeaderboardStats: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState<boolean>(false);

  const { userId } = useParams<{ userId: string }>();
  const { myUser } = useMYUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(
          `api/leaderboard/user/${userId}/${myUser?.id}`
        );

        if (response.data.success) {
          setStats(response.data.data);
          setIsPro(response.data.isPro);
          setIsOwnProfile(response.data.isOwnProfile);
        }
      } catch (err: unknown) {
        console.error("Error fetching user leaderboard stats:", err);
        
        const error = err as {
          response?: {
            status?: number;
            data?: {
              requiresPro?: boolean;
              message?: string;
            };
          };
        };

        if (error.response?.status === 403 && error.response?.data?.requiresPro) {
          setRequiresUpgrade(true);
        } else {
          setError(
            error.response?.data?.message || "Failed to load user statistics"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    if (userId && myUser?.id) {
      fetchStats();
    }
  }, [userId, myUser?.id]);

  const navigateToMembership = () => {
    navigate("/membership");
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-black via-black to-[#BBF429]/10 border-[#BBF429] text-white mx-4 md:mx-10 my-4">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-center items-center py-6 sm:py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-32 bg-[#BBF429]/20 rounded mb-4"></div>
              <div className="h-40 w-full max-w-md bg-[#BBF429]/20 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requiresUpgrade) {
    return (
      <Card className="bg-gradient-to-r from-black via-black to-[#BBF429]/10 border-[#BBF429] text-white mx-4 md:mx-10 my-4">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            Premium Feature
          </CardTitle>
          <CardDescription className="text-[#eaffa9]/70 text-xs sm:text-sm">
            Upgrade to Pro to view detailed statistics of other players
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8 space-y-4">
            <p className="text-sm sm:text-base">
              Detailed player statistics are only available to Pro members.
            </p>
            <Button
              onClick={navigateToMembership}
              className="bg-[#BBF429] text-black hover:bg-[#BBF429]/80"
            >
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="bg-gradient-to-r from-black via-black to-[#BBF429]/10 border-[#BBF429] text-white mx-4 md:mx-10 my-4">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <p className="text-red-400">
              {error || "Failed to load statistics"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate win rates with proper null checks
  const tournamentWinRate =
    stats.tournaments_joined > 0
      ? Math.round((stats.tournament_wins / stats.tournaments_joined) * 100)
      : 0;

  const tdmWinRate =
    stats.tdm_matches_joined > 0
      ? Math.round((stats.tdm_wins / stats.tdm_matches_joined) * 100)
      : 0;

  const overallWinRate =
    stats.total_games_played > 0
      ? Math.round((stats.total_wins / stats.total_games_played) * 100)
      : 0;

  // Format numbers safely
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "-";
    return Number(num).toLocaleString();
  };

  const formatDecimal = (num: number | null | undefined, decimals: number = 2): string => {
    if (num === null || num === undefined) return "-";
    return Number(num).toFixed(decimals);
  };

  return (
    <Card className="bg-gradient-to-r from-black via-black to-[#BBF429]/10 border-[#BBF429] text-white mx-4 md:mx-10 my-4">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg sm:text-xl">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            Leaderboard Statistics
          </div>
          {!isPro && !isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToMembership}
              className="border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429]/10"
            >
              <Crown className="h-3 w-3 mr-1" /> Upgrade to Pro
            </Button>
          )}
        </CardTitle>
        <CardDescription className="text-[#eaffa9]/70 text-xs sm:text-sm">
          Competitive performance across all games
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-black/50 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center border border-[#BBF429]/30">
            <p className="text-[10px] sm:text-xs text-[#eaffa9]/70 mb-1">
              Global Rank
            </p>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.global_rank !== null ? `#${stats.global_rank}` : "-"}
            </div>
          </div>

          <div className="bg-black/50 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center border border-[#BBF429]/30">
            <p className="text-[10px] sm:text-xs text-[#eaffa9]/70 mb-1">
              Total Score
            </p>
            <div className="text-xl sm:text-2xl font-bold">
              {formatNumber(stats.score)}
            </div>
          </div>

          <div className="bg-black/50 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center border border-[#BBF429]/30">
            <p className="text-[10px] sm:text-xs text-[#eaffa9]/70 mb-1">
              Tournament Wins
            </p>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.tournament_wins}
            </div>
          </div>

          <div className="bg-black/50 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center border border-[#BBF429]/30">
            <p className="text-[10px] sm:text-xs text-[#eaffa9]/70 mb-1">
              TDM Wins
            </p>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.tdm_wins}
            </div>
          </div>
        </div>

        {/* Kill/Death Statistics - Show if Pro or Own Profile and data exists */}
        {(isPro || isOwnProfile) && (stats.kills !== null || stats.deaths !== null) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-black/50 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center border border-green-500/30">
              <p className="text-[10px] sm:text-xs text-green-400 mb-1">
                Total Kills
              </p>
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {formatNumber(stats.kills)}
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center border border-red-500/30">
              <p className="text-[10px] sm:text-xs text-red-400 mb-1">
                Total Deaths
              </p>
              <div className="text-xl sm:text-2xl font-bold text-red-400">
                {formatNumber(stats.deaths)}
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center border border-yellow-500/30">
              <p className="text-[10px] sm:text-xs text-yellow-400 mb-1">
                K/D Ratio
              </p>
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                {formatDecimal(stats.kd_ratio)}
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-2 mb-4 bg-black border border-[#BBF429]/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#BBF429]  text-white data-[state=active]:text-black text-xs sm:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="games"
              className="data-[state=active]:bg-[#BBF429] text-white data-[state=active]:text-black text-xs sm:text-sm"
            >
              By Game
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2 bg-black/30 p-3 rounded-lg border border-[#BBF429]/30">
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium flex items-center gap-1">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    Tournament Win Rate
                  </p>
                  <span className="text-xs sm:text-sm">
                    {tournamentWinRate}%
                  </span>
                </div>
                <Progress
                  value={tournamentWinRate}
                  className="h-1.5 sm:h-2 [&>div]:bg-[#BBF429]"
                />
                <p className="text-[10px] sm:text-xs text-[#eaffa9]/70">
                  {stats.tournament_wins} wins out of {stats.tournaments_joined}{" "}
                  tournaments
                </p>
              </div>

              <div className="space-y-2 bg-black/30 p-3 rounded-lg border border-[#BBF429]/30">
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium flex items-center gap-1">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                    TDM Win Rate
                  </p>
                  <span className="text-xs sm:text-sm">{tdmWinRate}%</span>
                </div>
                <Progress
                  value={tdmWinRate}
                  className="h-1.5 sm:h-2 [&>div]:bg-[#BBF429]"
                />
                <p className="text-[10px] sm:text-xs text-[#eaffa9]/70">
                  {stats.tdm_wins} wins out of {stats.tdm_matches_joined} TDM
                  matches
                </p>
              </div>

              <div className="space-y-2 bg-black/30 p-3 rounded-lg border border-[#BBF429]/30">
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium flex items-center gap-1">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                    Overall Win Rate
                  </p>
                  <span className="text-xs sm:text-sm">{overallWinRate}%</span>
                </div>
                <Progress
                  value={overallWinRate}
                  className="h-1.5 sm:h-2 [&>div]:bg-[#BBF429]"
                />
                <p className="text-[10px] sm:text-xs text-[#eaffa9]/70">
                  {stats.total_wins} wins out of {stats.total_games_played}{" "}
                  games
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-3">
            {stats.games && stats.games.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.games.map((game, index) => (
                  <div
                    key={index}
                    className="space-y-2 bg-black/30 p-3 rounded-lg border border-[#BBF429]/30"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs sm:text-sm font-medium flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3 sm:h-4 sm:w-4 text-[#BBF429]" />
                        {game.game_name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-[10px] sm:text-xs text-[#eaffa9]/70">
                          Tournaments
                        </p>
                        <p className="text-xs sm:text-sm">
                          {game.tournament_wins} / {game.tournaments_joined}{" "}
                          wins
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-[#eaffa9]/70">
                          TDM Matches
                        </p>
                        <p className="text-xs sm:text-sm">
                          {game.tdm_wins} / {game.tdm_matches_joined} wins
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#eaffa9]/70">No game-specific statistics available</p>
                <p className="text-xs text-[#eaffa9]/50 mt-1">
                  Game statistics will appear after participating in tournaments or TDM matches
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserLeaderboardStats;

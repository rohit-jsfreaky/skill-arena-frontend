import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "@/utils/api";
import { toast } from "sonner";

interface UserLeaderboardStats {
  id: number;
  username: string;
  name: string;
  email: string;
  profile: string;
  total_games_played: number;
  total_wins: number;
  total_kills: number;
  total_deaths: number;
  kill_death_ratio: number;
  headshots: number;
  assists: number;
  damage_dealt: number;
  accuracy_percentage: number;
  mvp_count: number;
  longest_killstreak: number;
  favorite_weapon: string;
  playtime_hours: number;
  rank_points: number;
  season_rank: string;
  updated_at: string;
}

interface PaginationInfo {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface EditStatsForm {
  total_kills: number;
  total_deaths: number;
  headshots: number;
  assists: number;
  damage_dealt: number;
  accuracy_percentage: number;
  mvp_count: number;
  longest_killstreak: number;
  favorite_weapon: string;
  playtime_hours: number;
  rank_points: number;
  season_rank: string;
}

const AdminLeaderboard: React.FC = () => {
  const { isAuthenticated } = useAdmin();
  const [users, setUsers] = useState<UserLeaderboardStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resetting, setResetting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("total_kills");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserLeaderboardStats | null>(
    null
  );
  const [editForm, setEditForm] = useState<EditStatsForm>({
    total_kills: 0,
    total_deaths: 0,
    headshots: 0,
    assists: 0,
    damage_dealt: 0,
    accuracy_percentage: 0,
    mvp_count: 0,
    longest_killstreak: 0,
    favorite_weapon: "",
    playtime_hours: 0,
    rank_points: 0,
    season_rank: "Unranked",
  });

  // Reset confirmation dialog state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<UserLeaderboardStats | null>(
    null
  );

  // Statistics state
  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    totalKills: 0,
    totalDeaths: 0,
    averageKD: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers(1);
    }
  }, [isAuthenticated, search, sortBy, sortOrder]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search,
        sortBy,
        sortOrder,
      });

      const response = await api.get(`/api/admin/leaderboard/users?${params}`);

      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);

        // Calculate total statistics
        const stats = response.data.data.reduce(
          (acc: any, user: UserLeaderboardStats) => ({
            totalKills: acc.totalKills + (user.total_kills || 0),
            totalDeaths: acc.totalDeaths + (user.total_deaths || 0),
          }),
          { totalKills: 0, totalDeaths: 0 }
        );

        setTotalStats({
          totalUsers: response.data.pagination.totalUsers,
          totalKills: stats.totalKills,
          totalDeaths: stats.totalDeaths,
          averageKD:
            stats.totalDeaths > 0 ? stats.totalKills / stats.totalDeaths : 0,
        });
      } else {
        setError("Failed to fetch users");
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserLeaderboardStats) => {
    setEditingUser(user);
    setEditForm({
      total_kills: user.total_kills || 0,
      total_deaths: user.total_deaths || 0,
      headshots: user.headshots || 0,
      assists: user.assists || 0,
      damage_dealt: user.damage_dealt || 0,
      accuracy_percentage: user.accuracy_percentage || 0,
      mvp_count: user.mvp_count || 0,
      longest_killstreak: user.longest_killstreak || 0,
      favorite_weapon: user.favorite_weapon || "",
      playtime_hours: user.playtime_hours || 0,
      rank_points: user.rank_points || 0,
      season_rank: user.season_rank || "Unranked",
    });
    setEditDialogOpen(true);
  };

  const handleSaveStats = async () => {
    if (!editingUser || updating) return;

    // Validate accuracy percentage
    if (
      editForm.accuracy_percentage < 0 ||
      editForm.accuracy_percentage > 100
    ) {
      toast.error("Accuracy percentage must be between 0 and 100");
      return;
    }

    // Validate other fields for reasonable ranges
    if (editForm.total_kills < 0 || editForm.total_kills > 1000000) {
      toast.error("Total kills must be between 0 and 1,000,000");
      return;
    }

    if (editForm.total_deaths < 0 || editForm.total_deaths > 1000000) {
      toast.error("Total deaths must be between 0 and 1,000,000");
      return;
    }

    if (editForm.playtime_hours < 0 || editForm.playtime_hours > 100000) {
      toast.error("Playtime hours must be between 0 and 100,000");
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put(
        `/api/admin/leaderboard/users/${editingUser.id}`,
        editForm
      );

      if (response.data.success) {
        toast.success("User statistics updated successfully");
        setEditDialogOpen(false);
        await fetchUsers(pagination.currentPage);
      } else {
        toast.error("Failed to update user statistics");
      }
    } catch (err: any) {
      console.error("Error updating user stats:", err);
      toast.error(
        err.response?.data?.message || "Failed to update user statistics"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleResetStats = async (userId: number) => {
    setResetting(userId);
    try {
      const response = await api.patch(
        `/api/admin/leaderboard/users/${userId}/reset`
      );

      if (response.data.success) {
        toast.success("User statistics reset successfully");
        await fetchUsers(pagination.currentPage);
      } else {
        toast.error("Failed to reset user statistics");
      }
    } catch (err: any) {
      console.error("Error resetting user stats:", err);
      toast.error(
        err.response?.data?.message || "Failed to reset user statistics"
      );
    } finally {
      setResetting(null);
      setResetDialogOpen(false);
    }
  };

  const handleResetClick = (user: UserLeaderboardStats) => {
    setUserToReset(user);
    setResetDialogOpen(true);
  };

  const handleConfirmReset = async () => {
    if (!userToReset) return;
    await handleResetStats(userToReset.id);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleFormChange = (
    field: keyof EditStatsForm,
    value: string | number
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const rankColors = {
    Unranked: "bg-gray-500",
    Bronze: "bg-amber-700",
    Silver: "bg-gray-400",
    Gold: "bg-yellow-500",
    Platinum: "bg-cyan-500",
    Diamond: "bg-blue-500",
    Master: "bg-purple-500",
    Grandmaster: "bg-red-500",
  };

  // Utility function to safely format K/D ratio
  const formatKDRatio = (ratio: number | null | undefined): string => {
    if (ratio === null || ratio === undefined || typeof ratio !== 'number' || isNaN(ratio)) {
      return "0.00";
    }
    return ratio.toFixed(2);
  };

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto mt-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#BBF429] mb-2">
            Leaderboard Management
          </h1>
          <p className="text-gray-400">
            Manage user statistics and leaderboard data
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-[#BBF429]">
                    {totalStats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Kills</p>
                  <p className="text-2xl font-bold text-green-400">
                    {totalStats.totalKills.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-500 font-bold text-lg">K</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Deaths</p>
                  <p className="text-2xl font-bold text-red-400">
                    {totalStats.totalDeaths.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-500 font-bold text-lg">D</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Average K/D</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {totalStats.averageKD.toFixed(2)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-500 font-bold text-sm">K/D</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Sort Controls */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name, username, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="total_kills">Total Kills</SelectItem>
                    <SelectItem value="total_deaths">Total Deaths</SelectItem>
                    <SelectItem value="kill_death_ratio">K/D Ratio</SelectItem>
                    <SelectItem value="rank_points">Rank Points</SelectItem>
                    <SelectItem value="total_wins">Total Wins</SelectItem>
                    <SelectItem value="username">Username</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="DESC">Descending</SelectItem>
                    <SelectItem value="ASC">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#BBF429]">
              User Statistics ({pagination.totalUsers} users)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">{error}</p>
                <Button
                  onClick={() => fetchUsers(pagination.currentPage)}
                  className="bg-[#BBF429] hover:bg-[#BBF429]/80 text-black"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">Kills</TableHead>
                        <TableHead className="text-gray-300">Deaths</TableHead>
                        <TableHead className="text-gray-300">K/D</TableHead>
                        <TableHead className="text-gray-300">
                          Headshots
                        </TableHead>
                        <TableHead className="text-gray-300">Assists</TableHead>
                        <TableHead className="text-gray-300">Rank</TableHead>
                        <TableHead className="text-gray-300">Points</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-gray-800">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={user.profile}
                                  alt={user.username}
                                />
                                <AvatarFallback className="bg-[#BBF429] text-black">
                                  {user.username?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-white">
                                  {user.username}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {user.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            {user.total_kills || 0}
                          </TableCell>
                          <TableCell className="text-white">
                            {user.total_deaths || 0}
                          </TableCell>
                          <TableCell className="text-white">
                            {formatKDRatio(user.kill_death_ratio)}
                          </TableCell>
                          <TableCell className="text-white">
                            {user.headshots || 0}
                          </TableCell>
                          <TableCell className="text-white">
                            {user.assists || 0}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                rankColors[
                                  user.season_rank as keyof typeof rankColors
                                ] || "bg-gray-500"
                              } text-white`}
                            >
                              {user.season_rank || "Unranked"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            {user.rank_points || 0}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={updating || resetting === user.id}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleResetClick(user)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={updating || resetting === user.id}
                              >
                                {resetting === user.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                  <RotateCcw className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-400">
                      Showing page {pagination.currentPage} of{" "}
                      {pagination.totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrevPage}
                        className="bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNextPage}
                        className="bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Stats Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#BBF429]">
                Edit Statistics for {editingUser?.username}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="total_kills" className="text-gray-300">
                  Total Kills
                </Label>
                <Input
                  id="total_kills"
                  type="number"
                  min="0"
                  max="1000000"
                  value={editForm.total_kills}
                  onChange={(e) =>
                    handleFormChange(
                      "total_kills",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_deaths" className="text-gray-300">
                  Total Deaths
                </Label>
                <Input
                  id="total_deaths"
                  type="number"
                  min="0"
                  max="1000000"
                  value={editForm.total_deaths}
                  onChange={(e) =>
                    handleFormChange(
                      "total_deaths",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headshots" className="text-gray-300">
                  Headshots
                </Label>
                <Input
                  id="headshots"
                  type="number"
                  min="0"
                  max="1000000"
                  value={editForm.headshots}
                  onChange={(e) =>
                    handleFormChange("headshots", parseInt(e.target.value) || 0)
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assists" className="text-gray-300">
                  Assists
                </Label>
                <Input
                  id="assists"
                  type="number"
                  min="0"
                  max="1000000"
                  value={editForm.assists}
                  onChange={(e) =>
                    handleFormChange("assists", parseInt(e.target.value) || 0)
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="damage_dealt" className="text-gray-300">
                  Damage Dealt
                </Label>
                <Input
                  id="damage_dealt"
                  type="number"
                  min="0"
                  max="999999999"
                  value={editForm.damage_dealt}
                  onChange={(e) =>
                    handleFormChange(
                      "damage_dealt",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accuracy_percentage" className="text-gray-300">
                  Accuracy (%)
                </Label>
                <Input
                  id="accuracy_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={editForm.accuracy_percentage}
                  onChange={(e) =>
                    handleFormChange(
                      "accuracy_percentage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mvp_count" className="text-gray-300">
                  MVP Count
                </Label>
                <Input
                  id="mvp_count"
                  type="number"
                  min="0"
                  max="100000"
                  value={editForm.mvp_count}
                  onChange={(e) =>
                    handleFormChange("mvp_count", parseInt(e.target.value) || 0)
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longest_killstreak" className="text-gray-300">
                  Longest Killstreak
                </Label>
                <Input
                  id="longest_killstreak"
                  type="number"
                  min="0"
                  max="10000"
                  value={editForm.longest_killstreak}
                  onChange={(e) =>
                    handleFormChange(
                      "longest_killstreak",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favorite_weapon" className="text-gray-300">
                  Favorite Weapon
                </Label>
                <Input
                  id="favorite_weapon"
                  value={editForm.favorite_weapon}
                  onChange={(e) =>
                    handleFormChange("favorite_weapon", e.target.value)
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="playtime_hours" className="text-gray-300">
                  Playtime (Hours)
                </Label>
                <Input
                  id="playtime_hours"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100000"
                  value={editForm.playtime_hours}
                  onChange={(e) =>
                    handleFormChange(
                      "playtime_hours",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rank_points" className="text-gray-300">
                  Rank Points
                </Label>
                <Input
                  id="rank_points"
                  type="number"
                  min="0"
                  max="999999"
                  value={editForm.rank_points}
                  onChange={(e) =>
                    handleFormChange(
                      "rank_points",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="season_rank" className="text-gray-300">
                  Season Rank
                </Label>
                <Select
                  value={editForm.season_rank}
                  onValueChange={(value) =>
                    handleFormChange("season_rank", value)
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Unranked">Unranked</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Grandmaster">Grandmaster</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                onClick={() => setEditDialogOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveStats}
                className="bg-[#BBF429] hover:bg-[#BBF429]/80 text-black"
                disabled={updating}
              >
                {updating && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent mr-2" />
                )}
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reset Confirmation Dialog */}
        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">
                Confirm Reset Statistics
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-gray-300 mb-4">
                Are you sure you want to reset all statistics for{" "}
                <span className="font-bold text-[#BBF429]">
                  {userToReset?.username}
                </span>
                ?
              </p>
              
              <div className="bg-red-950/20 border border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-400 text-sm font-medium">
                  ⚠️ Warning: This action cannot be undone
                </p>
                <p className="text-red-300 text-sm mt-1">
                  All kills, deaths, achievements, and progress will be permanently reset to zero.
                </p>
              </div>

              <div className="text-sm text-gray-400">
                Current statistics will be lost:
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Kills: {userToReset?.total_kills || 0}</li>
                  <li>• Deaths: {userToReset?.total_deaths || 0}</li>
                  <li>• K/D Ratio: {formatKDRatio(userToReset?.kill_death_ratio)}</li>
                  <li>• Rank Points: {userToReset?.rank_points || 0}</li>
                  <li>• All other achievements and statistics</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                onClick={() => setResetDialogOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
                disabled={resetting === userToReset?.id}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReset}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={resetting === userToReset?.id}
              >
                {resetting === userToReset?.id && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                )}
                {resetting === userToReset?.id ? "Resetting..." : "Yes, Reset All Statistics"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminLeaderboard;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Share2, Settings, Play } from "lucide-react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { toast } from "sonner";
import { formatDistanceToNowIST } from "@/utils/timeUtils";
import { adminGetAllTdmMatches } from "@/api/tdmMatches";
import {
  generatePrivateMatchLink,
  adminSetRoomDetails,
  adminStartTdmMatch,
} from "@/api/admin/tdm";
import { TdmMatch } from "@/interface/tdmMatches";
import Table, { TableColumn } from "@/containers/Table/Table";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const AdminTdmMatchesPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<TdmMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roomDetailsDialog, setRoomDetailsDialog] = useState<{
    open: boolean;
    matchId: number | null;
  }>({
    open: false,
    matchId: null,
  });
  const [roomId, setRoomId] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [settingRoom, setSettingRoom] = useState(false);
  const [startingMatch, setStartingMatch] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMatches: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load matches with filtering and pagination
  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminGetAllTdmMatches(
        pagination.currentPage,
        pagination.limit,
        statusFilter
      );

      if (response.data) {
        setMatches(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error loading TDM matches:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, statusFilter]);

  // Load matches when component mounts or filters change
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "waiting":
      case "team_a_ready":
      case "team_b_ready":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "in_progress":
        return "bg-purple-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Handle sharing match link (user-facing route)
  const handleShareMatchLink = async (match: TdmMatch) => {
    try {
      let shareableLink;

      if (match.match_type === "private") {
        // For private matches, generate a special shareable link
        const response = await generatePrivateMatchLink(match.id);
        if (response.success && response.data?.shareable_link) {
          shareableLink = response.data.shareable_link;
        } else {
          toast.error(response.message || "Failed to generate share link");
          return;
        }
      } else {
        // For public matches, just share the direct user route
        shareableLink = `${window.location.origin}/tdm/match/${match.id}`;
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(shareableLink);
      toast.success(
        `${
          match.match_type === "private" ? "Private match" : "Match"
        } link copied to clipboard!`
      );
    } catch (error) {
      console.error("Error sharing match link:", error);
      toast.error("Failed to copy match link");
    }
  };

  // Handle opening room details dialog
  const handleOpenRoomDetails = (matchId: number) => {
    setRoomDetailsDialog({ open: true, matchId });
    setRoomId("");
    setRoomPassword("");
  };

  // Handle setting room details
  const handleSetRoomDetails = async () => {
    if (!roomDetailsDialog.matchId || !roomId || !roomPassword) {
      toast.error("Please fill in all room details");
      return;
    }

    try {
      setSettingRoom(true);
      const response = await adminSetRoomDetails(roomDetailsDialog.matchId, {
        room_id: roomId,
        room_password: roomPassword,
      });

      if (response.success) {
        toast.success("Room details set successfully");
        setRoomDetailsDialog({ open: false, matchId: null });
        setRoomId("");
        setRoomPassword("");
        loadMatches(); // Reload matches to show updated room details
      } else {
        toast.error(response.message || "Failed to set room details");
      }
    } catch (error) {
      console.error("Error setting room details:", error);
      toast.error("Failed to set room details");
    } finally {
      setSettingRoom(false);
    }
  };

  // Handle starting a match
  const handleStartMatch = async (matchId: number) => {
    try {
      setStartingMatch(matchId);
      const response = await adminStartTdmMatch(matchId);

      if (response.success) {
        toast.success("Match started successfully");
        loadMatches(); // Reload matches to show updated status
      } else {
        toast.error(response.message || "Failed to start match");
      }
    } catch (error) {
      console.error("Error starting match:", error);
      toast.error("Failed to start match");
    } finally {
      setStartingMatch(null);
    }
  };

  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Define table columns
  const columns: TableColumn<TdmMatch>[] = [
    {
      key: "id",
      label: "ID",
      className: "w-16",
      render: (match) => <span className="font-medium">{match.id}</span>,
    },
    {
      key: "game_name",
      label: "Game",
      render: (match) => match.game_name,
    },
    {
      key: "match_type",
      label: "Type",
      render: (match) => (
        <Badge variant="outline" className="text-white">
          {match.match_type === "public" ? "Public" : "Private"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (match) => (
        <Badge className={getStatusBadgeColor(match.status)}>
          {match.status.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "team_a_name",
      label: "Team A",
      render: (match) => (
        <>
          {match.team_a_name || "Not set"}
          {match.team_a_size && (
            <span className="text-xs text-gray-400 ml-1">
              ({match.team_a_size}/4)
            </span>
          )}
        </>
      ),
    },
    {
      key: "team_b_name",
      label: "Team B",
      render: (match) => (
        <>
          {match.team_b_name || "Not set"}
          {match.team_b_size && (
            <span className="text-xs text-gray-400 ml-1">
              ({match.team_b_size}/4)
            </span>
          )}
        </>
      ),
    },
    {
      key: "prize_pool",
      label: "Prize Pool",
      render: (match) => `$${match.prize_pool}`,
    },
    {
      key: "created_at",
      label: "Created",
      render: (match) =>
        formatDistanceToNowIST(new Date(match.created_at), { addSuffix: true }),
    },
    {
      key: "actions",
      label: "Actions",
      render: (match) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/tdm/matches/${match.id}/review`);
            }}
            title="View Match Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Share Match Link - Available for all match types */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleShareMatchLink(match);
            }}
            title="Share Match Link"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          {match.status === "confirmed" && !match.room_id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenRoomDetails(match.id);
              }}
              title="Set Room Details"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {match.status === "confirmed" &&
            match.room_id &&
            match.room_password && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartMatch(match.id);
                }}
                disabled={startingMatch === match.id}
                title="Start Match"
              >
                {startingMatch === match.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex-col gap-40 pt-15 bg-gradient-to-r from-black via-black to-[#BBF429] p-4">
      <div className="container mx-auto py-10">
        <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-[#BBF429]">TDM Matches</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-black text-white border-[#BBF429]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-[#BBF429]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="team_a_ready">Team A Ready</SelectItem>
                  <SelectItem value="team_b_ready">Team B Ready</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size={40} color="white" />
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No matches found
              </div>
            ) : (
              <>
                {/* Desktop view - Table */}
                {!isMobile && (
                  <Table
                    columns={columns}
                    data={matches}
                    loading={loading}
                    loadingMessage={<LoadingSpinner size={40} color="white" />}
                    emptyMessage="No matches found"
                    rowKeyField="id"
                    onRowClick={(match) =>
                      navigate(`/admin/tdm/matches/${match.id}/review`)
                    }
                    headerClassName="bg-gradient-to-r from-[#BBF429] to-[#a9e01c] text-black"
                    containerClassName="border border-[#BBF429] rounded-md overflow-hidden"
                  />
                )}

                {/* Mobile view - Cards */}
                {isMobile && (
                  <div className="grid grid-cols-1 gap-4">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="bg-black/30 text-white rounded-lg p-4 shadow-lg border border-[#BBF429] cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/tdm/matches/${match.id}/review`)
                        }
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-lg">
                            #{match.id}
                          </span>
                          <Badge className={getStatusBadgeColor(match.status)}>
                            {match.status.replace(/_/g, " ")}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="bg-black text-[#BBF429] border-[#BBF429]"
                          >
                            {match.game_name}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-black text-white"
                          >
                            {match.match_type === "public"
                              ? "Public"
                              : "Private"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="text-gray-400">Prize Pool:</div>
                          <div className="text-[#BBF429] font-medium">
                            ${match.prize_pool}
                          </div>

                          <div className="text-gray-400">Team A:</div>
                          <div className="truncate">
                            {match.team_a_name || "Not set"}
                            {match.team_a_size && (
                              <span className="text-xs text-gray-400 ml-1">
                                ({match.team_a_size}/4)
                              </span>
                            )}
                          </div>

                          <div className="text-gray-400">Team B:</div>
                          <div className="truncate">
                            {match.team_b_name || "Not set"}
                            {match.team_b_size && (
                              <span className="text-xs text-gray-400 ml-1">
                                ({match.team_b_size}/4)
                              </span>
                            )}
                          </div>

                          <div className="text-gray-400">Created:</div>
                          <div className="truncate">
                            {formatDistanceToNowIST(
                              new Date(match.created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                          </div>
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-600">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/tdm/matches/${match.id}/review`);
                            }}
                            className="bg-black text-white border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareMatchLink(match);
                            }}
                            className="bg-black text-white border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                          >
                            <Share2 className="mr-1 h-3 w-3" />
                            Share
                          </Button>

                          {match.status === "confirmed" && !match.room_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenRoomDetails(match.id);
                              }}
                              className="bg-black text-white border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                            >
                              <Settings className="mr-1 h-3 w-3" />
                              Room
                            </Button>
                          )}

                          {match.status === "confirmed" &&
                            match.room_id &&
                            match.room_password && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartMatch(match.id);
                                }}
                                disabled={startingMatch === match.id}
                                className="bg-black text-white border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                              >
                                {startingMatch === match.id ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                                ) : (
                                  <Play className="mr-1 h-3 w-3" />
                                )}
                                Start
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleChangePage(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrevPage}
                        className="bg-black text-white border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                      >
                        Previous
                      </Button>

                      <span className="text-white">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleChangePage(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNextPage}
                        className="bg-black text-white border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Room Details Dialog */}
      <Dialog
        open={roomDetailsDialog.open}
        onOpenChange={(open) =>
          setRoomDetailsDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="bg-black text-white border-[#BBF429]">
          <DialogHeader>
            <DialogTitle>Set Room Details</DialogTitle>
            <DialogDescription>
              Enter the room ID and password for match{" "}
              {roomDetailsDialog.matchId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-id">Room ID</Label>
              <Input
                id="room-id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="bg-black border-[#BBF429] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-password">Room Password</Label>
              <Input
                id="room-password"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                placeholder="Enter room password"
                className="bg-black border-[#BBF429] text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() =>
                setRoomDetailsDialog({ open: false, matchId: null })
              }
              disabled={settingRoom}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetRoomDetails}
              disabled={!roomId || !roomPassword || settingRoom}
              className="bg-[#BBF429] text-black hover:bg-[#a9e01c]"
            >
              {settingRoom ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Setting...
                </span>
              ) : (
                "Set Room Details"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTdmMatchesPage;

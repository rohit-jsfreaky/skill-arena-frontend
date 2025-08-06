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
import { Badge } from "@/components/ui/badge";
import { Eye, Share2 } from "lucide-react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { toast } from "sonner";
import { formatDistanceToNowIST } from "@/utils/timeUtils";
import { adminGetAllTdmMatches } from "@/api/tdmMatches";
import { generatePrivateMatchLink } from "@/api/admin/tdm";
import { TdmMatch } from "@/interface/tdmMatches";
import { Pagination } from "@/components/ui/pagination";
import Table, { TableColumn } from "@/containers/Table/Table";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const AdminTdmMatchesPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<TdmMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  // Handle sharing private match link
  const handleShareMatch = async (match: TdmMatch) => {
    if (match.match_type !== "private") {
      toast.error("Only private matches can be shared");
      return;
    }

    try {
      const response = await generatePrivateMatchLink(match.id);
      if (response.success) {
        const shareableLink = response.data.shareable_link;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareableLink);
        toast.success("Private match link copied to clipboard!");
      } else {
        toast.error(response.message || "Failed to generate share link");
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error("Failed to generate share link");
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
          {match.match_type === "private" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleShareMatch(match);
              }}
              title="Share Private Match Link"
            >
              <Share2 className="h-4 w-4" />
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
                          <Badge className={getStatusBadgeColor(match.status) } >
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
                          <Badge variant="outline" className="bg-black text-white">
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
                            {formatDistanceToNowIST(new Date(match.created_at), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handleChangePage}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTdmMatchesPage;

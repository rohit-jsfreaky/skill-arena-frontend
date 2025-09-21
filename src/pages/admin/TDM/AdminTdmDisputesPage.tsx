import { useState, useEffect } from "react";
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
import { Pagination } from "@/components/ui/pagination";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { formatDistanceToNow } from "date-fns";
import { getAllTdmDisputes, resolveTdmDispute } from "@/api/admin/tdm";
import { TdmDispute } from "@/interface/tdmMatches";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { DisputeDialog } from "./components/DisputeDialog";
import Table, { TableColumn } from "@/containers/Table/Table";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const AdminTdmDisputesPage = () => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<TdmDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedDispute, setSelectedDispute] = useState<TdmDispute | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resolution, setResolution] = useState<"resolved" | "rejected">(
    "resolved"
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDisputes: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load disputes with filtering and pagination
  const loadDisputes = async () => {
    try {
      setLoading(true);
      const response = await getAllTdmDisputes(
        pagination.currentPage,
        pagination.limit,
        statusFilter
      );

      setDisputes(response.data || []);
      console.log("Disputes:", response.data);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error("Error loading TDM disputes:", error);
      showErrorToast("Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  // Load disputes when component mounts or filters change
  useEffect(() => {
    loadDisputes();
  }, [pagination.currentPage, statusFilter]);

  const handleResolveDispute = (
    dispute: TdmDispute,
    action: "resolved" | "rejected"
  ) => {
    setSelectedDispute(dispute);
    setResolution(action);
    setAdminNotes(
      action === "resolved"
        ? "Dispute resolved in favor of the reporting team."
        : "Dispute rejected due to insufficient evidence."
    );
    setDialogOpen(true);
  };

  const handleConfirmResolution = async (winnerTeamId?: number) => {
    if (!selectedDispute) return;

    try {
      setResolving(true);

      const response = await resolveTdmDispute(
        selectedDispute.id,
        resolution,
        adminNotes,
        resolution === "resolved" ? winnerTeamId : undefined
      );

      if (response.success) {
        showSuccessToast(
          `Dispute ${
            resolution === "resolved" ? "resolved" : "rejected"
          } successfully`
        );
        loadDisputes(); // Reload the disputes list
      } else {
        showErrorToast(response.message || "Failed to resolve dispute");
      }
    } catch (error) {
      console.error("Error resolving dispute:", error);
      showErrorToast("An error occurred while resolving the dispute");
    } finally {
      setResolving(false);
      setDialogOpen(false);
    }
  };

  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "under_review":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Define table columns for the Table component
  const columns: TableColumn<TdmDispute>[] = [
    {
      key: "id",
      label: "ID",
      className: "w-16",
      render: (dispute) => <span className="font-medium">{dispute.id}</span>,
    },
    {
      key: "match_id",
      label: "Match",
      render: (dispute) => (
        <div className="flex flex-col">
          <span>Match #{dispute.match_id}</span>
          <span className="text-xs text-[#BBF429]">{dispute.game_name}</span>
        </div>
      ),
    },
    {
      key: "reporter_username",
      label: "Reported By",
      render: (dispute) => dispute.reporter_username,
    },
    {
      key: "reported_team_name",
      label: "Reported Team",
      render: (dispute) => dispute.reported_team_name,
    },
    {
      key: "status",
      label: "Status",
      render: (dispute) => (
        <Badge className={getStatusBadgeColor(dispute.status)}>
          {dispute.status.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (dispute) =>
        formatDistanceToNow(new Date(dispute.created_at), { addSuffix: true }),
    },
    {
      key: "actions",
      label: "Actions",
      render: (dispute) => (
        <div className="flex space-x-1">
          <Button
            variant="default"
            size="icon"
            className="border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/tdm/matches/${dispute.match_id}/review`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {dispute.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResolveDispute(dispute, "resolved");
                }}
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResolveDispute(dispute, "rejected");
                }}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex-col gap-40 pt-15 bg-black p-4">
      <div className="container mx-auto py-10">
        <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-[#BBF429]">TDM Disputes</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-black text-white border-[#BBF429]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-[#BBF429]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size={40} color="white" />
              </div>
            ) : disputes.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No disputes found
              </div>
            ) : (
              <>
                {/* Desktop view - Table */}
                {!isMobile && (
                  <Table
                    columns={columns}
                    data={disputes}
                    loading={loading}
                    loadingMessage={<LoadingSpinner size={40} color="white" />}
                    emptyMessage="No disputes found"
                    rowKeyField="id"
                    onRowClick={(dispute) =>
                      navigate(`/admin/tdm/matches/${dispute.match_id}/review`)
                    }
                    headerClassName="bg-gradient-to-r from-[#BBF429] to-[#a9e01c] text-black"
                    containerClassName="border border-[#BBF429] rounded-md overflow-hidden"
                  />
                )}

                {/* Mobile view - Cards */}
                {isMobile && (
                  <div className="grid grid-cols-1 gap-4">
                    {disputes.map((dispute) => (
                      <div
                        key={dispute.id}
                        className="bg-black/30 text-white rounded-lg p-4 shadow-lg border border-[#BBF429] cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/tdm/matches/${dispute.match_id}/review`)
                        }
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-lg">
                            #{dispute.id}
                          </span>
                          <Badge className={getStatusBadgeColor(dispute.status)}>
                            {dispute.status.replace(/_/g, " ")}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="bg-black text-[#BBF429] border-[#BBF429]"
                          >
                            Match #{dispute.match_id}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-black text-white"
                          >
                            {dispute.game_name}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="text-gray-400">Reported By:</div>
                          <div className="truncate">{dispute.reporter_username}</div>

                          <div className="text-gray-400">Reported Team:</div>
                          <div className="truncate">{dispute.reported_team_name}</div>

                          <div className="text-gray-400">Created:</div>
                          <div className="truncate">
                            {formatDistanceToNow(new Date(dispute.created_at), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>

                        {dispute.status === "pending" && (
                          <div className="mt-3 flex space-x-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolveDispute(dispute, "resolved");
                              }}
                              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolveDispute(dispute, "rejected");
                              }}
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
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

        {selectedDispute && (
          <DisputeDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            dispute={selectedDispute}
            resolution={resolution}
            adminNotes={adminNotes}
            setAdminNotes={setAdminNotes}
            resolving={resolving}
            onConfirm={handleConfirmResolution}
          />
        )}
      </div>  
    </div>
  );
};

export default AdminTdmDisputesPage;

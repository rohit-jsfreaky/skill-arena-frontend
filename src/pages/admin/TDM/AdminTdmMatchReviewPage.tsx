import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { useAdminTdmMatchReview } from "./hooks/useAdminTdmMatchReview";
import { MatchDetailsPanel } from "./components/MatchDetailsPanel";
import { TeamsPanel } from "./components/TeamsPanel";
import { ScreenshotsPanel } from "./components/ScreenshotsPanel";
import { DisputesPanel } from "./components/DisputesPanel";
import { WinnerSelectionDialog } from "./components/WinnerSelectionDialog";

const AdminTdmMatchReviewPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const {
    match,
    loading,
    selectedWinnerTeamId,
    setSelectedWinnerTeamId,
    adminNotes,
    setAdminNotes,
    dialogOpen,
    setDialogOpen,
    processingDecision,
    handleSetWinner,
    error,
  } = useAdminTdmMatchReview(matchId ? parseInt(matchId) : 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner size={30} color="white" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="text-center p-4 sm:p-8 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Match not found or failed to load
        </h2>
        <Button
          onClick={() => navigate("/admin/tdm/disputes")}
          className="bg-[#BBF429] text-black hover:bg-[#a9e01c]"
        >
          Back to TDM Disputes
        </Button>
      </div>
    );
  }

  // Count pending disputes
  const pendingDisputesCount =
    match.disputes?.filter((d) => d.status === "pending").length || 0;

  return (
    <div className="w-full min-h-screen flex-col gap-4 sm:gap-8 bg-gradient-to-r from-black via-black to-[#BBF429] p-3 sm:p-4">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Back button - full width on small screens */}
        <Button
          className="mb-4 sm:mb-6 w-full sm:w-auto border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black"
          onClick={() => navigate("/admin/tdm/matches")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Matches
        </Button>

        {/* Header section - stacks vertically on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              TDM Match #{match.id}
            </h1>
            <p className="text-[#eaffa9] text-sm sm:text-base">
              {match.game_name} - {match.status.replace(/_/g, " ")}
            </p>
          </div>

          <div className="mt-2 sm:mt-0 flex flex-col md:items-end">
            <div className="flex items-center mb-2">
              <Trophy className="h-5 w-5 text-amber-500 mr-2" />
              <span className="font-medium text-white">
                Prize Pool: ₹{match.prize_pool}
              </span>
            </div>

            {match.winner_team_id ? (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Prize Already Awarded
              </div>
            ) : (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Pending Admin Decision
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <MatchDetailsPanel match={match} />

          <div className="lg:col-span-2">
            <TeamsPanel match={match} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ScreenshotsPanel
            screenshots={match.screenshots || []}
            selectedWinnerTeamId={selectedWinnerTeamId}
            onSelectWinner={setSelectedWinnerTeamId}
            prizeAlreadyAwarded={!!match.winner_team_id}
          />

          <DisputesPanel disputes={match.disputes || []} match={match} />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
          <Button
            size="lg"
            disabled={!selectedWinnerTeamId || !!match.winner_team_id}
            onClick={() => {
              setAdminNotes(
                pendingDisputesCount > 0
                  ? `Winner selected based on screenshot evidence. This also resolves ${pendingDisputesCount} pending dispute(s).`
                  : "Winner selected based on screenshot evidence."
              );
              setDialogOpen(true);
            }}
            className="w-full sm:w-auto bg-[#BBF429] hover:bg-[#a9e01c] text-black font-medium flex items-center justify-center transition-all duration-300"
          >
            <Trophy className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base">
              Award Prize to Selected Team
              {pendingDisputesCount > 0 &&
                ` (Resolves ${pendingDisputesCount} Dispute${
                  pendingDisputesCount === 1 ? "" : "s"
                })`}
            </span>
          </Button>
        </div>

        {match && (
          <WinnerSelectionDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            match={match}
            selectedTeamId={selectedWinnerTeamId}
            adminNotes={adminNotes}
            setAdminNotes={setAdminNotes}
            processing={processingDecision}
            onConfirm={handleSetWinner}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTdmMatchReviewPage;

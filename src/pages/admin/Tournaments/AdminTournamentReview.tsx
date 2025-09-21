import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { useAdminTournamentReview } from "./useAdminTournamentReview";
import { ScreenshotsTab } from "./components/ScreenshotsTab";
import { ConfirmationDialog } from "./components/ConfirmationDialog";
import { useState } from "react";

const AdminTournamentReview = () => {
  const { id } = useParams<{ id: string }>();
  const {
    tournament,
    screenshots,
    loading,
    selectedWinnerId,
    adminNotes,
    confirmDialogOpen,
    processingDecision,
    expandedOcr,
    filteredScreenshots,
    handleWinnerSelection,
    setAdminNotes,
    openConfirmDialog,
    submitDecision,
    toggleOcrText,
    setConfirmDialogOpen,
    navigate,
  } = useAdminTournamentReview(id);

  // Local state for active view
  const [activeView, setActiveView] = useState<"disputed" | "others">(
    "disputed"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner size={30} color="white" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Tournament not found</h2>
        <Button onClick={() => navigate("/admin/tournament-results")}>
          Back to Disputed Tournaments
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex-col gap-40 pt-15 bg-black p-4">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="default"
          className="mb-6 text-[#BBF429]"
          onClick={() => navigate("/admin/tournament-results")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Disputed Tournaments
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
            <p className="text-[#eaffa9]">
              Review tournament results and select a winner
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col md:items-end">
            <div className="flex items-center mb-2">
              <Trophy className="h-5 w-5 text-amber-500 mr-2" />
              <span className="font-medium text-white">
                Prize Pool: ₹{tournament.prize_pool}
              </span>
            </div>

            {tournament.prize_awarded ? (
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

        <div className="mt-6 mb-8 bg-black/20 p-4 rounded-lg">
          {/* Segmented control instead of tabs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => setActiveView("disputed")}
              className={`relative flex-1 py-3 px-4 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#BBF429] focus:ring-opacity-50 ${
                activeView === "disputed"
                  ? "bg-[#BBF429] text-black font-medium"
                  : "bg-black/30 text-white"
              }`}
            >
              <div className="flex items-center justify-center">
                <span>Disputed Screenshots</span>
                {filteredScreenshots.disputed.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center bg-black/30 text-white text-xs font-medium rounded-full h-5 w-5">
                    {filteredScreenshots.disputed.length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveView("others")}
              className={`flex-1 py-3 px-4 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#BBF429] focus:ring-opacity-50 ${
                activeView === "others"
                  ? "bg-[#BBF429] text-black font-medium"
                  : "bg-black/30 text-white"
              }`}
            >
              All Other Screenshots
            </button>
          </div>

          {/* Content based on active view */}
          <div className="mt-2 sm:mt-4">
            {activeView === "disputed" ? (
              <ScreenshotsTab
                screenshots={filteredScreenshots.disputed}
                emptyMessage="No Disputed Screenshots"
                selectedWinnerId={selectedWinnerId}
                expandedOcr={expandedOcr}
                onWinnerSelect={handleWinnerSelection}
                onToggleOcr={toggleOcrText}
              />
            ) : (
              <ScreenshotsTab
                screenshots={filteredScreenshots.others}
                emptyMessage="No Other Screenshots"
                selectedWinnerId={selectedWinnerId}
                expandedOcr={expandedOcr}
                onWinnerSelect={handleWinnerSelection}
                onToggleOcr={toggleOcrText}
              />
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4 ">
          <Button
            size="lg"
            disabled={!selectedWinnerId || tournament.prize_awarded}
            onClick={openConfirmDialog}
            className="w-full sm:w-auto bg-[#BBF429] hover:bg-[#a9e01c] text-black font-medium flex items-center justify-center transition-all duration-300"
          >
            <Trophy className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base">
              Award Prize to Selected Winner
            </span>
          </Button>
        </div>
        <ConfirmationDialog
          open={confirmDialogOpen}
          setOpen={setConfirmDialogOpen}
          tournament={tournament}
          selectedWinnerId={selectedWinnerId}
          screenshots={screenshots}
          adminNotes={adminNotes}
          setAdminNotes={setAdminNotes}
          processingDecision={processingDecision}
          onSubmitDecision={submitDecision}
        />
      </div>
    </div>
  );
};

export default AdminTournamentReview;

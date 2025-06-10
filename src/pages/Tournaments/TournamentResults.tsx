import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { useUserTournamentResult } from "@/hooks/useUserTournamentResult";
import { ScreenshotUploader } from "@/components/Tournaments/ScreenshotUploader";
import { VerificationStatus } from "@/components/Tournaments/VerificationStatus";
import { UserSubmission } from "@/components/Tournaments/UserSubmission";
import { AllSubmissions } from "@/components/Tournaments/AllSubmissions";

const TournamentResults = () => {
  const { id = "" } = useParams<{ id: string }>();
  const {
    tournament,
    loading,
    userScreenshot,
    allScreenshots,
    file,
    uploading,
    totalParticipants,
    screenshotsSubmitted,
    handleFileChange,
    handleUpload,
  } = useUserTournamentResult(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner color="white" size={30} />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Tournament not found</h2>
        <Link to="/tournaments">
          <Button>Back to Tournaments</Button>
        </Link>
      </div>
    );
  }

  return (
    // Make container responsive with smaller padding on mobile
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Improve back button and heading spacing */}
      <div className="mb-4 sm:mb-6">
        <Link
          to={`/tournaments/${id}`}
          className="text-[#BBF429] hover:underline mb-2 sm:mb-4 inline-flex items-center text-sm sm:text-base"
        >
          <span className="mr-2">&larr;</span>
          <span>Back to Tournament Details</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2 text-white break-words">
          {tournament.name} - Results
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Tournament ended{" "}
          {formatDistance(new Date(tournament.end_time), new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>

      {/* Improve grid layout for better responsiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Left column */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429]">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
              Your Tournament Results
            </h2>

            {userScreenshot ? (
              <UserSubmission screenshot={userScreenshot} />
            ) : tournament.status === "completed" ? (
              <ScreenshotUploader
                file={file}
                handleFileChange={handleFileChange}
                handleUpload={handleUpload}
                uploading={uploading}
              />
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                You can submit your results once the tournament is completed.
              </p>
            )}
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429]">
            <VerificationStatus
              screenshotsSubmitted={screenshotsSubmitted}
              totalParticipants={totalParticipants}
              prizePool={tournament.prize_pool}
            />
          </Card>
        </div>

        {/* Right column */}
        <div>
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429]">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
              All Submissions
            </h2>
            <AllSubmissions screenshots={allScreenshots} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TournamentResults;

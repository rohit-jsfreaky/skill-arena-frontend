import { useLocation, useNavigate } from "react-router-dom";
import BackArrow from "@/components/Tournaments/BackArrow";
import { TournamentFormComponents } from "./TournamentFormComponents";
import { useEditTournament } from "./hooks/useEditTournament";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const EditTournament = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const tournament = state?.tournament;

  if (!tournament) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-black p-8">
        <div className="bg-[#1A1A1A] rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-[#BBF429] mb-4">
            No Tournament Found
          </h1>
          <p className="text-white mb-6">
            The tournament you're trying to edit doesn't exist or wasn't
            properly loaded.
          </p>
          <Button
            onClick={() => navigate("/admin/tournaments")}
            className="bg-[#BBF429] text-black hover:bg-[#a8d90f]"
          >
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  const {
    formData,
    handleChange,
    handleSubmit,
    imageUpload,
    error,
    loading,
    uploading,
    minDateTime,
  } = useEditTournament(tournament);


  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#BBF429] mb-2">
              Edit Tournament
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Update the tournament details below
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/tournaments")}
            className="w-full sm:w-auto text-white hover:text-[#BBF429] transition-colors duration-200 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-[#BBF429]/20"
          >
            <BackArrow />
            <span className="text-sm sm:text-base">Back to Tournaments</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <TournamentFormComponents
            formData={formData}
            handleChange={handleChange}
            imageUpload={imageUpload}
            uploading={uploading}
            minDateTime={minDateTime}
          />

          <div className="fixed bottom-0 left-0 right-0 md:sticky bg-black/80 backdrop-blur-sm border-t md:border border-[#BBF429]/20 p-4 md:rounded-lg z-50">
            <div className="container mx-auto flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 max-w-screen-2xl">
              <Button
                variant="default"
                type="button"
                onClick={() => navigate("/admin/tournaments")}
                className="w-full sm:w-auto px-6 py-2 hover:bg-white/10 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || uploading}
                className={`w-full sm:w-auto px-6 py-2 order-1 sm:order-2 ${
                  loading || uploading
                    ? "bg-[#BBF429]/50 cursor-not-allowed"
                    : "bg-[#BBF429] hover:bg-[#BBF429]/80"
                } text-black font-medium transition-colors duration-200`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                    <span>Updating...</span>
                  </div>
                ) : uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                    <span>Uploading Image...</span>
                  </div>
                ) : (
                  "Update Tournament"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTournament;

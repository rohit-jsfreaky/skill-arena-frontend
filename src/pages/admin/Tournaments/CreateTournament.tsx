import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "@/components/Tournaments/BackArrow";
import { TournamentFormComponents } from "./TournamentFormComponents";
import { useCreateTournament } from "./hooks/useCreateTournament";
import { Button } from "@/components/ui/button";

const CreateTournament: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    handleChange,
    handleSubmit,
    imageUpload,
    error,
    loading,
    uploading,
    minDateTime,
  } = useCreateTournament();


  useEffect(()=>{
    console.log(formData)
  },[formData])

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-black to-[#BBF429]">
      <div className="container mx-auto px-4 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#BBF429] mb-2">
              Create New Tournament
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Fill in the details to create a new tournament
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/tournaments")}
            className="w-full sm:w-auto text-white hover:text-[#BBF429] transition-colors duration-200 ease-in-out flex items-center justify-center sm:justify-start gap-2 bg-black/40 px-4 py-2 rounded-lg border border-[#BBF429]/20"
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
                    <div className="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full" />
                    <span>Creating Tournament...</span>
                  </div>
                ) : uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full" />
                    <span>Uploading Image...</span>
                  </div>
                ) : (
                  "Create Tournament"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;

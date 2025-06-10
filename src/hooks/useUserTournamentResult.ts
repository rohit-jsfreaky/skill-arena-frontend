import { useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { useMYUser } from "@/context/UserContext";
import {
  fetchTournamentData,
  handleImageUpload,
  uploadScreenshot,
} from "@/api/tournamentsResult";

export interface Tournament {
  id: number;
  name: string;
  prize_pool: number;
  status: string;
  max_participants: number;
  end_time: string;
}

export interface Screenshot {
  id: number;
  user_id: number;
  screenshot_path: string;
  verification_status: string;
  upload_timestamp: string;
  ocr_result?: string;
  name?: string;
  username?: string;
}

export const useUserTournamentResult = (tournamentId: string) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userScreenshot, setUserScreenshot] = useState<Screenshot | null>(null);
  const [allScreenshots, setAllScreenshots] = useState<Screenshot[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [screenshotsSubmitted, setScreenshotsSubmitted] = useState<number>(0);
  const { myUser } = useMYUser();

  useEffect(() => {
    const loadTournamentData = async () => {
      if (!myUser) return;

      try {
        setLoading(true);
        const userId = myUser.id;

        const data = await fetchTournamentData(tournamentId, userId);

        setTournament(data.tournament);
        setUserScreenshot(data.userScreenshot);
        setAllScreenshots(data.allScreenshots);
        setTotalParticipants(data.totalParticipants);
        setScreenshotsSubmitted(data.screenshotsSubmitted);
      } catch (error) {
        console.error("Error fetching tournament data:", error);
        showErrorToast("Failed to load tournament results");
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId && myUser) {
      loadTournamentData();
    }
  }, [tournamentId, myUser]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (!selectedFile.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        showErrorToast("Please upload only image files (JPEG, PNG, GIF)");
        return;
      }

      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        showErrorToast("File size exceeds 5MB limit");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showErrorToast("Please select a file to upload");
      return;
    }
    if (!myUser) return;

    try {
      const userId = myUser.id;
      setUploading(true);
      const { data, message, success } = await handleImageUpload(
        file,
        setUploading
      );

      if (!success) return showErrorToast(message);

      const screenshotPath = data;
      const result = await uploadScreenshot( tournamentId, userId,screenshotPath);

      setUserScreenshot(result.uploadedScreenshot);
      setAllScreenshots(result.allScreenshots);
      setScreenshotsSubmitted(result.screenshotsSubmitted);

      showSuccessToast("Screenshot uploaded successfully");
      setFile(null);

      // Show verification status
      if (result.verificationStatus === "verified_win") {
        showSuccessToast("Your screenshot was verified as a win!");
      } else if (result.verificationStatus === "verified_loss") {
        showErrorToast("Your screenshot was verified as a loss");
      } else {
        showSuccessToast("Your screenshot needs manual review");
      }
    } catch (error: any) {
      console.error("Error uploading screenshot:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to upload screenshot"
      );
    } finally {
      setUploading(false);
    }
  };

  const canUpload = tournament?.status === "completed" && !userScreenshot;

  return {
    tournament,
    loading,
    userScreenshot,
    allScreenshots,
    file,
    uploading,
    totalParticipants,
    screenshotsSubmitted,
    canUpload,
    handleFileChange,
    handleUpload,
    setFile,
  };
};

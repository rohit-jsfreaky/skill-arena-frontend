import apiClient from "@/utils/apiClient";

export const handleImageUpload = async (
  file: File,
  setUploading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    console.log("file", file);
    setUploading(true);

    const formData = new FormData();
    // Change "file" to "image" to match backend expectation
    formData.append("image", file);

    // Don't wrap formData in an object, pass it directly as the request data
    // Don't set Content-Type header - axios will set it automatically with boundary
    const response = await apiClient.post(
      "api/tournament-results/upload-image",
      formData
    );

    if (response.status !== 200) {
      return { success: false, message: "Failed to upload image" };
    }

    const data = response.data;
    console.log("Upload response:", data);

    return {
      success: true,
      message: "Image uploaded successfully",
      data: data.url,
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to upload image",
    };
  } finally {
    setUploading(false);
  }
};

// New functions to separate API calls from the hook

export const fetchTournamentData = async (
  tournamentId: string,
  userId: number
) => {
  if (!userId) return;
  try {
    console.log("userId", userId);
    const [tournamentRes, screenshotRes, allScreenshotsRes, participantsRes] =
      await Promise.all([
        apiClient.get(`/api/tournaments/get/${tournamentId}`),
        apiClient
          .get(
            `/api/tournament-results/${tournamentId}/screenshot?userId=${userId}`
          )
          .catch(() => ({ data: null })),
        apiClient.get(
          `/api/tournament-results/${tournamentId}/screenshots?userId=${userId}`
        ),
        apiClient.get(`/api/tournaments/${tournamentId}/participants`),
      ]);

    return {
      tournament: tournamentRes.data,
      userScreenshot: screenshotRes.data,
      allScreenshots: allScreenshotsRes.data,
      totalParticipants: participantsRes.data.length,
      screenshotsSubmitted: allScreenshotsRes.data.length,
    };
  } catch (error) {
    console.error("Error fetching tournament data:", error);
    throw error;
  }
};

export const uploadScreenshot = async (
  tournamentId: string,
  userId: number,
  screenshotPath: string
) => {
  try {
    const response = await apiClient.post(
      `/api/tournament-results/${tournamentId}/screenshot?userId=${userId}&screenshotPath=${encodeURIComponent(
        screenshotPath
      )}`
    );

    // Get updated screenshot list
    const updatedScreenshots = await apiClient.get(
      `/api/tournament-results/${tournamentId}/screenshots?userId=${userId}`
    );

    return {
      uploadedScreenshot: response.data.screenshot,
      verificationStatus: response.data.status,
      allScreenshots: updatedScreenshots.data,
      screenshotsSubmitted: updatedScreenshots.data.length,
    };
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    throw error;
  }
};

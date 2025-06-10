import api from "@/utils/api";

export const getTournamentMargin = async (): Promise<{
  success: boolean;
  message: string;
  margin: number;
}> => {
  try {
    const response = await api.get("api/admin/margin");
    return {
      success: true,
      message: "Tournament margin fetched successfully",
      margin: response.data.margin,
    };
  } catch (error) {
    console.log("Error fetching tournament margin:", error);
    return {
      success: false,
      message: "Error fetching tournament margin",
      margin: 0,
    };
  }
};

export const UpdateTournamentMargin = async (
  margin: number
): Promise<{
  success: boolean;
  message: string;
  margin: number;
}> => {
  try {
    const response = await api.post("api/admin/margin", {
      margin: margin,
    });

    console.log("Response from updating margin:", response);
    return {
      success: true,
      message: "Tournament margin updated successfully",
      margin: response.data.margin,
    };
  } catch (error) {
    console.log("Error updating tournament margin:", error);
    return {
      success: false,
      message: "Error updating tournament margin",
      margin: 0,
    };
  }
};

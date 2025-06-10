import apiClient from "@/utils/apiClient";

export interface PageContent {
  title: string;
  content: string;
  updated_at: string;
}

export const getPageContent = async (
  pageName: string,
  setLoading?: (loading: boolean) => void
) => {
  if (setLoading) setLoading(true);
  try {
    const response = await apiClient.get(`api/pages/${pageName}`);
    if (setLoading) setLoading(false);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    if (setLoading) setLoading(false);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch page content",
      data: null,
    };
  }
};

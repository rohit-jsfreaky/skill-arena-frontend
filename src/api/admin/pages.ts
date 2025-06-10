import api from "@/utils/api";

export interface PageContent {
  id?: number;
  page_name: string;
  title: string;
  content: string;
  updated_at?: string;
  updated_by?: number;
  admin_username?: string;
}

export const getAllPages = async (setLoading?: (loading: boolean) => void) => {
  if (setLoading) setLoading(true);
  try {
    const response = await api.get("/api/admin/pages?admin=true");
    if (setLoading) setLoading(false);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    if (setLoading) setLoading(false);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch pages",
    };
  }
};

export const getPageContent = async (
  pageName: string,
  setLoading?: (loading: boolean) => void
) => {
  if (setLoading) setLoading(true);
  try {
    const response = await api.get(`/api/admin/pages/${pageName}?admin=true`);
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
    };
  }
};

export const updatePageContent = async (
  pageName: string,
  title: string,
  content: string,
  setLoading?: (loading: boolean) => void
) => {
  if (setLoading) setLoading(true);
  try {
    const response = await api.put(`/api/admin/pages/${pageName}?admin=true`, {
      title,
      content,
    });
    if (setLoading) setLoading(false);
    return {
      success: true,
      message: "Page content updated successfully",
      data: response.data.data,
    };
  } catch (error: any) {
    if (setLoading) setLoading(false);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update page content",
    };
  }
};

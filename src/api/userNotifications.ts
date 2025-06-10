import apiClient from "@/utils/apiClient";

interface NotificationResponse {
  success: boolean;
  message?: string;
  data?: any;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

/**
 * Get user notifications with pagination
 */
// Update the getUserNotifications function to support the page parameter needed for infinite scroll
export const getUserNotifications = async (
  page: number = 1,
  limit: number = 15,
  user_id: number
): Promise<NotificationResponse> => {
  try {
    const response = await apiClient.get(
      `api/notifications/get-user-notifications?user_id=${user_id}`,
      {
        params: { page, limit }
      }
    );
    
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch notifications",
      data: []
    };
  }
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (
  notificationId: number,
  user_id: number
): Promise<NotificationResponse> => {
  try {
    const response = await apiClient.patch(
      `api/notifications/mark-read/${notificationId}?user_id=${user_id}`
    );

    return {
      success: true,
      message: response.data.message || "Notification marked as read",
    };
  } catch (error: any) {
    console.error("Failed to mark notification as read:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to mark notification as read",
    };
  }
};

/**
 * Mark all user notifications as read
 */
export const markAllNotificationsAsRead = async (
  user_id: number
): Promise<NotificationResponse> => {
  try {
    const response = await apiClient.patch(
      `api/notifications/mark-all-read?user_id=${user_id}`
    );

    return {
      success: true,
      message: response.data.message || "All notifications marked as read",
    };
  } catch (error: any) {
    console.error("Failed to mark all notifications as read:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to mark all notifications as read",
    };
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationsCount = async (
  user_id: number
): Promise<NotificationResponse> => {
  try {
    const response = await apiClient.get(
      `api/notifications/unread-count?user_id=${user_id}`
    );

    return {
      success: true,
      data: response.data.count,
    };
  } catch (error: any) {
    console.error("Failed to fetch unread notification count:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch unread notification count",
      data: 0,
    };
  }
};

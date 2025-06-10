import axios from "axios";
import { messaging, getToken } from "../utils/firebase";
import apiClient from "@/utils/apiClient";
import api from "@/utils/api";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

// Register FCM token with the backend
export const registerFcmToken = async (
  token: string,
  user_id: number,
  deviceType?: string
) => {
  try {
    console.log("registerFcmToken", token, user_id, deviceType);
    const response = await apiClient.post(
      `api/notifications/register-token?user_id=${user_id}`,
      {
        device_token: token,
        device_type: deviceType,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error registering FCM token:", error);
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to register device"
        : "Unknown error occurred",
    };
  }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async (user_id: number) => {
  try {
    // Check if notification permission is already granted
    console.log("Checking notification permission for user:", user_id);
    console.log("Notification permission state:", Notification.permission);
    if (Notification.permission === "granted") {
      return await getFcmToken(user_id);
    }

    console.log("Requesting notification permission for user:", user_id);

    // Request permission
    const permission = await Notification.requestPermission();

    console.log("Notification permission result:", permission);

    if (permission === "granted") {
      return await getFcmToken(user_id);
    } else {
      return {
        success: false,
        message: "Notification permission denied",
      };
    }
  } catch (error) {
    console.log("Error requesting notification permission:", error);
    return {
      success: false,
      message: "Failed to request notification permission",
    };
  }
};

// Get FCM token and register it with backend
export const getFcmToken = async (user_id: number) => {
  try {
    // Get the device details
    const deviceType = getDeviceType();

    console.log("deviceType:", deviceType);
    // Check if service worker is supported
    if (!("serviceWorker" in navigator)) {
      console.error("Service workers are not supported in this browser");
      return {
        success: false,
        message: "Push notifications are not supported in this browser",
      };
    }

    // Explicitly register the service worker first
    console.log("Registering service worker...");
    let swRegistration;

    try {
      swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered successfully:", swRegistration);
    } catch (swError) {
      console.error("Service Worker registration failed:", swError);
      return {
        success: false,
        message: "Failed to register notification service: " + swError.message,
      };
    }

    // Wait for the service worker to be ready
    console.log("Waiting for service worker to be ready...");
    swRegistration = await navigator.serviceWorker.ready;
    console.log("Service Worker is ready:", swRegistration);

    // Get the FCM token with better error handling
    try {
      console.log(
        "Getting FCM token with VAPID key:",
        import.meta.env.VITE_FIREBASE_VAPID_KEY
      );

      if (!messaging) {
        throw new Error("Firebase messaging is not initialized");
      }

      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });

      console.log("FCM Token obtained:", currentToken ? "Success" : "Failed");

      if (currentToken && user_id) {
        // Register token with backend
        const result = await registerFcmToken(
          currentToken,
          user_id,
          deviceType
        );

        if (result.success) {
          console.log("Token registered successfully");
          return {
            success: true,
            token: currentToken,
          };
        } else {
          console.error(
            "Failed to register token with backend:",
            result.message
          );
          return {
            success: false,
            message: result.message,
          };
        }
      } else {
        console.error("No token received from Firebase");
        return {
          success: false,
          message: "No registration token available",
        };
      }
    } catch (tokenError) {
      console.error("Error getting FCM token:", tokenError);
      return {
        success: false,
        message: tokenError.message || "Failed to get FCM token",
      };
    }
  } catch (error) {
    console.error("Error in getFcmToken:", error);
    return {
      success: false,
      message: "Failed to initialize push notifications",
    };
  }
};

// Helper function to determine device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/android/i.test(userAgent)) {
    return "android";
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "ios";
  }

  return "web";
};

// Admin API calls for sending notifications
export const sendGlobalNotification = async (
  title: string,
  body: string,
  imageUrl?: string,
  data?: Record<string, string>
) => {
  try {
    const response = await api.post(`api/admin/notifications/send/global`, {
      title,
      body,
      image_url: imageUrl,
      data,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error sending global notification:", error);
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to send notification"
        : "Unknown error occurred",
    };
  }
};

export const sendUserNotification = async (
  userId: number,
  title: string,
  body: string,
  imageUrl?: string,
  data?: Record<string, string>
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/notifications/send/user`,
      {
        user_id: userId,
        title,
        body,
        image_url: imageUrl,
        data,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error sending user notification:", error);
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to send notification"
        : "Unknown error occurred",
    };
  }
};

export const getNotificationHistory = async (
  page: number = 1,
  limit: number = 10,
  type: "all" | "global" | "user" = "all"
) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/notifications/history`,
      {
        params: {
          page,
          limit,
          type,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error getting notification history:", error);
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message ||
          "Failed to fetch notification history"
        : "Unknown error occurred",
      data: [],
      pagination: { totalCount: 0, totalPages: 0, currentPage: page, limit },
    };
  }
};

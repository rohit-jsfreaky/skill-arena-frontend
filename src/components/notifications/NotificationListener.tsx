import { useEffect, useState, useRef } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/utils/firebase";
import { toast } from "sonner";
import { useMYUser } from "@/context/UserContext";
import { showSuccessToast } from "@/utils/toastUtils";

interface NotificationMessage {
  notification: {
    title: string;
    body: string;
    image?: string;
  };
  data?: Record<string, string>;
}

export const NotificationListener: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const { myUser } = useMYUser();
  const unsubscribeRef = useRef<() => void | undefined>(null);

  // Initialize FCM token and set up message listener
  useEffect(() => {
    // Only set up once and ensure user exists
    if (initialized || !myUser) return;

    const setupNotifications = async () => {
      try {
        console.log("Setting up notification listener for user:", myUser.id);

        if (!messaging) {
          console.error("Firebase messaging is not initialized");
          return;
        }

        console.log("Adding onMessage listener...");

        // Set up foreground message handler
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("📬 Received foreground message:", payload);

          // Make sure we have a proper notification
          if (payload && payload.notification) {
            handleForegroundMessage(payload as NotificationMessage);
          } else {
            console.warn(
              "Received message without notification payload:",
              payload
            );

            // If there's no notification but there is a data payload, still handle it
            if (payload.data) {
              const title = payload.data.title || "New notification";
              const body = payload.data.body || "You have a new notification";

              handleForegroundMessage({
                notification: {
                  title,
                  body,
                },
                data: payload.data,
              });
            }
          }
        });

        console.log("onMessage listener added successfully");

        // Store the unsubscribe function
        unsubscribeRef.current = unsubscribe;
        setInitialized(true);

        // Optionally, also show a notification when the listener is set up
        showSuccessToast("Notifications enabled");
      } catch (error) {
        console.error("Error setting up notification listener:", error);
      }
    };

    setupNotifications();

    return () => {
      console.log("Cleaning up notification listener");
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [myUser]); // Only depend on myUser - we'll reset initialized if needed

  // Handle foreground messages (app is open)
  const handleForegroundMessage = (payload: NotificationMessage) => {
    const { title, body } = payload.notification;
    const { route } = payload.data || {};
    console.log(payload.data);
    console.log("📣 Displaying foreground message:", title, body);
    console.log("Message data:", payload.data);

    // First try to play a notification sound to get user's attention
    try {
      const audio = new Audio("/notification-sound.wav");
      audio
        .play()
        .catch((err) => console.log("Could not play notification sound:", err));
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }

    // Display toast notification with onClick navigation
    toast(title, {
      description: body,
      duration: 6000,
      icon: "🔔",
      // Add onClick handler to navigate when toast is clicke
      classNames: {
        toast:
          "bg-blue-100 border-l-4 border-blue-500 text-blue-800 font-medium shadow-lg cursor-pointer", // Add cursor-pointer to indicate it's clickable
        title: "font-bold text-lg",
        description: "text-blue-700",
      },
      action: {
        label: "View",
        onClick: () => {
          console.log("Toast clicked, navigating to route:", route);
          if (route) {
            // Handle relative routes correctly

            const baseUrl = window.location.origin;
            window.location.href = `${baseUrl}/${route}`;
          } else {
            console.log("No route specified in notification data.");
          }
        },
      },
    });

    // Handle data payload
    if (payload.data) {
      handleNotificationData(payload.data);
    }
  };

  // Handle notification data payload
  const handleNotificationData = (data: Record<string, string>) => {
    console.log("Processing notification data:", data);

    // Your existing notification data handler
    if (data.type === "match_invite") {
      console.log("Match invite notification received:", data);
      // Handle match invite logic
    } else if (data.type === "announcement") {
      console.log("Announcement notification received:", data);
      // Handle announcement logic
    } else if (data.type === "tournament_update") {
      console.log("Tournament update notification received:", data);
      // Handle tournament update logic
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default NotificationListener;

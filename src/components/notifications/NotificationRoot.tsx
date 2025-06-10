import React from "react";
import { NotificationListener } from "./NotificationListener";
import { requestNotificationPermission } from "@/api/notifications";
import { useMYUser } from "@/context/UserContext";

interface NotificationRootProps {
  children: React.ReactNode;
}

export const NotificationRoot: React.FC<NotificationRootProps> = ({
  children,
}) => {
  const [permissionState, setPermissionState] = React.useState<
    "pending" | "granted" | "denied" | "unsupported"
  >("pending");
  const [requestSent, setRequestSent] = React.useState(false);

  const { myUser } = useMYUser();

  // Effect to check browser support and current permission
  React.useEffect(() => {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      setPermissionState("unsupported");
      return;
    }

    // Check current permission state
    if (Notification.permission === "granted") {
      setPermissionState("granted");
    } else if (Notification.permission === "denied") {
      setPermissionState("denied");
    }
  }, []);

  // Separate effect to handle permission request when user is available
  React.useEffect(() => {
    // Skip if any of these conditions are true
    if (
      !myUser || // No user object yet
      permissionState !== "pending" || // Permission already determined
      requestSent || // Request already sent
      !("Notification" in window) // Browser doesn't support notifications
    ) {
      return;
    }

    const requestPermission = async () => {
      setRequestSent(true); // Mark that we've sent the request
      try {
        console.log("Requesting notification permission for user:", myUser.id);
        const result = await requestNotificationPermission(myUser.id);

        console.log("Notification permission result:", result);
        if (result.success) {
          console.log("Notification permission granted");
          setPermissionState("granted");
        } else {
          console.log("Notification permission denied:", result.message);
          setPermissionState("denied");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        setPermissionState("denied");
      }
    };

    requestPermission();
  }, [myUser, permissionState, requestSent]); // Only re-run when these values change

  return (
    <>
      {/* The NotificationListener component doesn't render anything visible */}
      {permissionState === "granted" && myUser && <NotificationListener />}

      {/* Render children regardless of notification permission */}
      {children}
    </>
  );
};

export default NotificationRoot;

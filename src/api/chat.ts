import { fetchUnreadCountsProps, fetchUsersProps } from "@/interface/chat";
import axios from "axios";

export const fetchUsers = async ({
  currentUser,
  setUsers,
  authToken,
}: fetchUsersProps) => {
  try {
    console.log("fetchUsers");
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}api/personal-messages/users`,
      null,
      {
        params: { currentUserId: currentUser.id },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log("users", response.data);
    setUsers(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchUnreadCounts = async ({
  currentUser,
  setUnreadCounts,
  authToken,
}: fetchUnreadCountsProps) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}api/personal-messages/unread-counts`,
      {
        params: { userId: currentUser.id },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("unread count", response.data);
    setUnreadCounts(response.data);
  } catch (error) {
    console.error("Error fetching unread counts:", error);
  }
};

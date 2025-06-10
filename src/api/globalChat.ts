import { fetchMessagesProps } from "@/interface/globalchat";
import apiClient from "@/utils/apiClient";


export const fetchMessages = async ({
  setMessages,
  setLoading,
}: fetchMessagesProps) => {
  try {
    const response = await apiClient.get(
      `api/chat/messages`,
    );
    console.log(response.data);
    setMessages(response.data);
  } catch (error) {
    console.log("Error fetching messages:", error);
  } finally {
    setLoading(false);
  }
};

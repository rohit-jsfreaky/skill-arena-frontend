import { ChatMessage } from "@/components/chat/GlobalChatRoom";

export interface fetchMessagesProps {
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }
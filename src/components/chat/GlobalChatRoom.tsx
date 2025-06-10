import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { UserContextType } from "@/context/UserContext";
import "./message.css";
import { fetchMessages } from "@/api/globalChat";
import { useAuthToken } from "@/context/AuthTokenContext";

interface GlobalChatRoomProps {
  user: UserContextType;
}

export interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  timestamp: Date;
  username: string;
  is_system: boolean;
}

interface FormatTimeOptions {
  hour: "2-digit";
  minute: "2-digit";
}

const GlobalChatRoom: React.FC<GlobalChatRoomProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<
    { userId: number; username: string }[]
  >([]);

  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { authToken } = useAuthToken();

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`);
    setSocket(newSocket);
    if (authToken) fetchMessages({ setMessages, setLoading });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("chat_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("typing", ({ userId, username, isTyping }) => {
      if (isTyping) {
        setTypingUsers((prevUsers) => {
          if (!prevUsers.some((u) => u.userId === userId)) {
            return [...prevUsers, { userId, username }];
          }
          return prevUsers;
        });
      } else {
        setTypingUsers((prevUsers) =>
          prevUsers.filter((u) => u.userId !== userId)
        );
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMessage(e.target.value);

    if (socket && user) {
      socket.emit("typing", {
        userId: user.id,
        username: user.username,
        isTyping: true,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", {
          userId: user.id,
          username: user.username,
          isTyping: false,
        });
      }, 2000);
    }
  };

  const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!message.trim() || !socket || !user) return;

    socket.emit("chat_message", { userId: user.id, message: message.trim() });

    setMessage("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("typing", {
      userId: user.id,
      username: user.username,
      isTyping: false,
    });
  };

  const formatTime = (timestamp: Date): string => {
    const options: FormatTimeOptions = { hour: "2-digit", minute: "2-digit" };
    return new Date(timestamp).toLocaleTimeString([], options);
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading chat...</div>;
  }

  return (
    <div className="flex bg-gradient-to-r from-black via-black to-[#BBF429] flex-col h-[calc(100vh-160px)] md:h-96 border rounded-lg shadow-md max-w-2xl mx-auto w-full">
      <div className="hidden md:block bg-gradient-to-r from-black via-black to-[#BBF429] text-white p-3 rounded-t-lg">
        <h2 className="text-xl font-semibold">Global Chat Room</h2>
      </div>

      <div className="flex-1 messages-container p-4 overflow-y-auto bg-gradient-to-r from-black via-black to-[#BBF429]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 ${
                msg.is_system
                  ? "text-center" // Center system messages
                  : msg.username === user.username
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-xs md:max-w-md w-fit px-4 py-2 rounded-lg break-words ${
                  msg.is_system
                    ? "bg-gray-300 text-gray-600 font-semibold text-sm" // Style for system messages
                    : msg.username === user.username
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {!msg.is_system && msg.username !== user.username && (
                  <p className="font-semibold text-gray-400 text-sm">
                    {msg.username}
                  </p>
                )}
                <p>{msg.message}</p>
                {!msg.is_system && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="text-gray-500 text-sm italic">
            {typingUsers.length === 1
              ? `${typingUsers[0].username} is typing...`
              : `${typingUsers.length} people are typing...`}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t p-3 flex flex-col md:flex-row"
      >
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1  text-white border rounded-lg md:rounded-l-lg md:rounded-r-none px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0"
          disabled={!user}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-black via-black to-[#BBF429] text-white px-4 py-2 rounded-lg md:rounded-r-lg md:rounded-l-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!message.trim() || !user}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default GlobalChatRoom;

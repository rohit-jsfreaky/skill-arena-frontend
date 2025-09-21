import type React from "react";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import type { UserContextType } from "@/context/UserContext";
import { Menu, X } from "lucide-react";
import "../chat/message.css";
import { fetchUnreadCounts, fetchUsers } from "@/api/chat";
import { useAuthToken } from "@/context/AuthTokenContext";
import { UnreadMessagesCount } from "@/interface/chat";

const socket = io(import.meta.env.VITE_SERVER_URL);

interface PersonalChatProps {
  currentUser: UserContextType;
}

interface Conversations {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  isRead: boolean;
  timestamp: string;
}

const PersonalChat: React.FC<PersonalChatProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<UserContextType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserContextType | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<{
    [key: string]: Conversations[];
  }>({});
  const [unreadCounts, setUnreadCounts] = useState<UnreadMessagesCount>({});
  const [typing, setTyping] = useState<{ [key: number]: boolean }>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<{ [key: number]: NodeJS.Timeout | null }>({});
  const { authToken } = useAuthToken();

  useEffect(() => {
    if (currentUser?.id) {
      if (authToken) {
        fetchUsers({ currentUser, setUsers, authToken });
        fetchUnreadCounts({
          currentUser,
          setUnreadCounts,
          authToken,
        });
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.id) return;

    socket.emit("authenticate", currentUser.id);

    socket.on("personal_message", (msg) => {
      setConversations((prev) => {
        const otherUserId =
          msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
        const prevMessages = prev[otherUserId] || [];
        return {
          ...prev,
          [otherUserId]: [...prevMessages, msg],
        };
      });

      if (msg.senderId !== currentUser.id) {
        // Don't increment if this conversation is currently selected
        if (!selectedUser || selectedUser.id !== msg.senderId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [msg.senderId]: (prev[msg.senderId] || 0) + 1,
          }));
        }
      }
    });

    socket.on("personal_typing", ({ userId, isTyping }) => {
      setTyping((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));
    });

    socket.on("messages_read", ({ by }) => {
      if (conversations[by]) {
        setConversations((prev) => ({
          ...prev,
          [by]: prev[by].map((msg) =>
            msg.senderId === currentUser.id && !msg.isRead
              ? { ...msg, isRead: true }
              : msg
          ),
        }));
      }
    });

    return () => {
      socket.off("personal_message");
      socket.off("personal_typing");
      socket.off("messages_read");
    };
  }, [currentUser, selectedUser, conversations]);

  useEffect(() => {
    if (selectedUser && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser, conversations]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!selectedUser) return;

      try {
        if (unreadCounts[selectedUser.id] > 0) {
          socket.emit("mark_messages_read", {
            userId: currentUser.id,
            senderId: selectedUser.id,
          });

          setUnreadCounts((prev) => ({
            ...prev,
            [selectedUser.id]: 0,
          }));
        }

        if (!conversations[selectedUser.id]) {
          const response = await axios.get(
            `${
              import.meta.env.VITE_SERVER_URL
            }api/personal-messages/conversations/${selectedUser.id}`,
            {
              params: { senderId: currentUser.id },
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          setConversations((prev) => ({
            ...prev,
            [selectedUser.id]: response.data,
          }));
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    };

    loadConversation();
  }, [selectedUser, currentUser, unreadCounts]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const msgData = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      message: message.trim(),
    };

    socket.emit("personal_message", msgData);
    setMessage("");

    handleTypingStop();
  };

  const handleUserSelect = (user: UserContextType) => {
    setSelectedUser(user);
    setIsMobileMenuOpen(false); // Close mobile menu when user is selected
  };

  const handleTyping = () => {
    if (!selectedUser) return;

    socket.emit("personal_typing", {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      isTyping: true,
    });

    if (typingTimeoutRef.current[selectedUser.id]) {
      if (typingTimeoutRef.current[selectedUser.id]) {
        clearTimeout(
          typingTimeoutRef.current[selectedUser.id] as NodeJS.Timeout
        );
      }
    }

    typingTimeoutRef.current[selectedUser.id] = setTimeout(
      handleTypingStop,
      2000
    );
  };

  const handleTypingStop = () => {
    if (!selectedUser) return;

    socket.emit("personal_typing", {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      isTyping: false,
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex border border-white rounded-2xl h-[80vh] relative bg-gradient-to-r from-black via-black to-[#BBF429] overflow-x-hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden absolute right-2 top-4  z-50 bg-[#BBF429] p-2 rounded-full shadow-md"
        aria-label="Toggle conversation list"
      >
        {!isMobileMenuOpen ? <Menu /> : <X />}
      </button>

      {/* Users list sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-[-5%]" : "-translate-x-[120%]"
        } md:translate-x-0 transition-transform duration-300 ease-in-out absolute md:relative z-40 w-72 h-full bg-black border-r border-[#BBF429]/30 flex flex-col `}
      >
        <div className="p-4 border-b border-[#BBF429]/30">
          <h3 className="text-sm md:text-xl font-semibold text-white px-2">
            Conversations
          </h3>
        </div>
        <div className="overflow-y-auto flex-1">
          <ul className="divide-y divide-[#BBF429]/20">
            {users.map((user) => (
              <li
                key={user.id}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-[#BBF429]/20 ${
                  selectedUser?.id === user.id ? "bg-[#BBF429]/30" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex flex-col items-start pl-2">
                  {" "}
                  {/* Change to flex-col and items-start */}
                  <div className="md:w-10 md:h-10 w-5 h-5 rounded-full bg-[#BBF429] flex items-center justify-center text-white font-semibold">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="ml-0 text-white mt-2 font-medium w-[50vw] md:w-48 text-xs md:text-sm break-words">
                    {" "}
                    {/* Remove ml-3, add mt-2 and break-words */}
                    {user.username || "Unknown User"}
                  </span>
                </div>
                {unreadCounts[user.id] > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#BBF429] text-white text-xs font-semibold">
                    {unreadCounts[user.id]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-black via-black to-[#BBF429] flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#BBF429] flex items-center justify-center text-white font-semibold">
                  {selectedUser.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-xs md:text-sm  text-white">
                    {selectedUser.username || "Unknown User"}
                  </h3>
                  {typing[selectedUser.id] && (
                    <div className="text-sm text-gray-500">typing...</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1  px-7 xs:px-5 text-xs md:text-sm messages-container overflow-y-auto p-4 bg-gradient-to-r from-black via-black to-[#BBF429]">
              {conversations &&
                conversations[selectedUser.id]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${
                      msg.senderId === currentUser.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.senderId === currentUser.id
                          ? "bg-[#BBF429] text-gray-800 rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                      }`}
                    >
                      <div className="break-words">{msg.message}</div>
                      <div
                        className={`text-xs mt-1 flex items-center ${
                          msg.senderId === currentUser.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <span className="text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {msg.senderId === currentUser.id && (
                          <span className="ml-1 text-gray-600">
                            {msg.isRead ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              className="p-3 border-t border-gray-200 bg-gradient-to-r from-black via-black to-[#BBF429] flex items-center"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type a message..."
                className="flex-1 border text-white border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BBF429] focus:border-transparent w-1"
              />
              <button
                type="submit"
                className="ml-2 bg-[#BBF429] text-white rounded-full p-2 hover:bg-[#BBF429]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BBF429]/50"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-black via-black to-[#BBF429]">
            <div className="text-center p-6 max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#BBF429]/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#BBF429]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 ">
                No conversation selected
              </h3>
              <p className="text-[#EAFFA9]">
                Select a user from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalChat;

import React from 'react';
import { NavigateFunction } from "react-router";
import { UserContextType } from "@/context/UserContext";

interface JoinButtonProps {
  onJoinTournament?: () => void;
  joining?: boolean;
  hasJoined?: boolean;
  canJoin?: boolean | null;
  insufficientFunds?: boolean | null;
  myUser?: UserContextType | null;
  isFull: boolean;
  status?: string;
  getEntryFee?: () => string | number;
  navigate: NavigateFunction;
  disableJoinButton?: boolean;
  disableReason?: string;
}

const JoinButton: React.FC<JoinButtonProps> = ({
  onJoinTournament,
  joining,
  hasJoined,
  canJoin,
  insufficientFunds,
  myUser,
  isFull,
  status,
  getEntryFee,
  navigate,
  disableJoinButton,
  disableReason
}) => {
  // If the main button must be disabled (e.g., slot-based), render a disabled button with context
  if (disableJoinButton) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button className="px-8 py-3 rounded-lg font-medium bg-gray-600/50 cursor-not-allowed text-gray-400">
          {disableReason || "Select a group to join"}
        </button>
      </div>
    );
  }

  if (!onJoinTournament) return null;
  
  return (
    <div className="flex flex-col items-center gap-4">
      {hasJoined ? (
        <button className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium cursor-not-allowed opacity-75">
          You've Joined This Tournament
        </button>
      ) : (
        <button
          onClick={onJoinTournament}
          disabled={joining || !canJoin || insufficientFunds || !myUser}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            joining || !canJoin || insufficientFunds || !myUser
              ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
              : "bg-[#BBF429] hover:bg-[#BBF429]/80 text-black"
          }`}
        >
          {joining
            ? "Joining..."
            : !myUser
            ? "Login to Join"
            : insufficientFunds
            ? "Insufficient Funds"
            : isFull
            ? "Tournament Full"
            : status !== "upcoming"
            ? "No Longer Available"
            : `Join Tournament ($${
                getEntryFee ? getEntryFee() : "N/A"
              })`}
        </button>
      )}

      {insufficientFunds && (
        <button
          onClick={() => navigate("/wallet")}
          className="text-[#BBF429] hover:text-[#BBF429]/80 transition-colors duration-200"
        >
          Add funds to wallet →
        </button>
      )}
    </div>
  );
};

export default JoinButton;
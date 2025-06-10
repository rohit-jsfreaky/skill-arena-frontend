import React from 'react';
import { Tournament } from "@/interface/tournament";

interface RoomDetailsProps {
  tournament: Tournament;
  showRoomDetails: boolean;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ tournament, showRoomDetails }) => {
  if (!showRoomDetails) return null;
  
  return (
    <div className="mb-8 p-4 bg-[#BBF429]/10 border border-[#BBF429]/30 rounded-lg">
      <h3 className="text-[#BBF429] font-medium mb-4">
        Game Room Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
          <span className="text-gray-300">Room ID:</span>
          <span className="text-white font-mono">
            {tournament.room_id}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
          <span className="text-gray-300">Password:</span>
          <span className="text-white font-mono">
            {tournament.room_password}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
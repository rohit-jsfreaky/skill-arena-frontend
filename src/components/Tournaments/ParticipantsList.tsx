import React from 'react';
import { Participant } from "@/pages/Tournaments/TournamentDetails";

interface ParticipantsListProps {
  participants: Participant[];
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  if (!participants?.length) return null;
  
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 bg-black border-2 border-[#BBF429]/50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6">
      {/* Header - Responsive text size and padding */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white flex items-center justify-between">
        <span>Participants</span>
        <span className="text-sm sm:text-base text-[#BBF429]">
          ({participants.length})
        </span>
      </h2>

      {participants.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center p-2 sm:p-3 md:p-4 bg-[#1A1A1A] rounded-md sm:rounded-lg 
                       border border-[#BBF429]/20 hover:border-[#BBF429]/40 transition-colors
                       duration-200"
            >
              {/* Profile Image - Responsive sizes */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                {participant.profile ? (
                  <img
                    src={participant.profile}
                    alt={participant.username}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center 
                                bg-[#BBF429]/20 text-[#BBF429] text-sm sm:text-base">
                    {participant.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* User Info - Responsive text sizes */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white text-sm sm:text-base truncate"
                   title={participant.username}>
                  {participant.username}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Joined:{" "}
                  {new Date(participant.joined_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4 sm:py-6 md:py-8 text-sm sm:text-base">
          No participants have joined yet.
        </p>
      )}
    </div>
  );
};

export default ParticipantsList;
import { UserContextType } from "@/context/UserContext";
import { Tournament } from "@/interface/tournament";
import React from "react";
import { NavigateFunction } from "react-router";

interface TournamentCardProps {
  formatDate: (dateString: string) => string;
  getEntryFee: (tournament: Tournament) => number;
  myUser: UserContextType | null;
  navigate: NavigateFunction;
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  formatDate,
  getEntryFee,
  myUser,
  navigate,
}) => {
  return (
    <div
      key={tournament.id}
      className="bg-black hover:shadow-[0_0_10px_#BBF429] hover:scale-105 transition-transform duration-300 ease-in-out border-[#BBF429] border-2 flex  gap-3 rounded-lg shadow-lg overflow-hidden p-3   w-full"
    >
      {/* Tournament Image */}
      <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden bg-gray-700 flex items-center justify-center">
        {tournament.image ? (
          <img
            src={tournament.image}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
        )}
      </div>

      {/* Tournament Details */}
      <div className="w-full text-white text-xs sm:text-sm">
        <div className="flex w-full justify-between items-center mb-1">
          <h2 className="text-sm sm:text-base font-bold text-[#BBF429]">
            {tournament.game_name}
          </h2>
          <span className="bg-[#BBF429]/20 text-[#BBF429] px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
            {tournament.team_mode}
          </span>
        </div>

        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-400">
            Start: {formatDate(tournament.start_time)}
          </p>
          <span
            className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium ${
              tournament.current_participants >= tournament.max_participants
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {tournament.current_participants} / {tournament.max_participants}
            {tournament.current_participants >= tournament.max_participants &&
              " (Full)"}
          </span>
        </div>

        <div className="mb-1">
          <p className="text-gray-400">
            Entry Fee: ${getEntryFee(tournament)}
            {myUser?.membership_id && (
              <span className="ml-1 sm:ml-2 text-green-400 text-xs sm:text-sm">
                (Pro Price)
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => navigate(`/tournaments/${tournament.id}`)}
          className="w-full bg-[#BBF429] hover:bg-[#A8E000] text-black font-bold py-2 sm:py-2.5 px-3 rounded transition duration-200 text-xs sm:text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;

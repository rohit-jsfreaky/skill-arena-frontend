import React from 'react';
import { Tournament } from "@/interface/tournament";
import ShareButton from './ShareButton';

interface TournamentHeaderProps {
  tournament: Tournament;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({ tournament }) => {
  return (
    <div className="relative h-64 md:h-80">
      {tournament.image ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
          <img
            src={tournament.image}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black/50">
          <span className="text-gray-400">No Image Available</span>
        </div>
      )}

      {/* Status Badge and Share Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <ShareButton tournament={tournament} />
        {tournament.status && (
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tournament.status === "upcoming"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                : tournament.status === "ongoing"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
            }`}
          >
            {tournament.status.charAt(0).toUpperCase() +
              tournament.status.slice(1)}
          </span>
        )}
      </div>

      {/* Title Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <h1 className="text-4xl font-bold text-white mb-2">
          {tournament.game_name}
        </h1>
        <p className="text-[#BBF429] text-xl">{tournament.name}</p>
      </div>
    </div>
  );
};

export default TournamentHeader;
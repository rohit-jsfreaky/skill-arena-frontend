
import { UserContextType } from "@/context/UserContext";
import { Tournament } from "@/interface/tournament";
import { Participant } from "@/pages/Tournaments/TournamentDetails";
import { NavigateFunction } from "react-router";

import TournamentHeader from './TournamentHeader';
import TournamentInfo from './TournamentInfo';
import RoomDetails from './RoomDetails';
import StatusMessages from './StatusMessages';
import JoinButton from './JoinButton';
import ParticipantsList from './ParticipantsList';

type TournamentDetailsCardProps = {
  tournament: Tournament;
  isFull: boolean;
  formatDate: (dateString: string) => string;
  getEntryFee?: () => string | number;
  myUser?: UserContextType | null;
  error?: string | null;
  success?: string | null;
  hasJoined?: boolean;
  onJoinTournament?: () => void;
  joining?: boolean;
  canJoin?: boolean | null;
  insufficientFunds?: boolean | null;
  navigate: NavigateFunction;
  participants: Participant[];
};

const TournamentDetailsCard = ({
  tournament,
  isFull,
  formatDate,
  getEntryFee,
  myUser,
  error,
  success,
  hasJoined,
  onJoinTournament,
  joining,
  canJoin,
  insufficientFunds,
  navigate,
  participants,
}: TournamentDetailsCardProps) => {
  // Check if current user is a participant
  const isParticipant = participants.some(
    (participant) => participant.username === myUser?.username
  );

  // Show room details only if user is a participant and room details exist
  const showRoomDetails: boolean =
    Boolean(isParticipant && tournament.room_id && tournament.room_password);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-black to-[#1A1A1A] border-2 border-[#BBF429] rounded-t-2xl overflow-hidden shadow-xl">
        <TournamentHeader tournament={tournament} />

        {/* Main Content */}
        <div className="p-6">
          <TournamentInfo 
            tournament={tournament}
            isFull={isFull}
            formatDate={formatDate}
            getEntryFee={getEntryFee}
            myUser={myUser}
          />

          <RoomDetails 
            tournament={tournament}
            showRoomDetails={showRoomDetails}
          />

          <StatusMessages error={error} success={success} />

          <JoinButton 
            onJoinTournament={onJoinTournament}
            joining={joining}
            hasJoined={hasJoined}
            canJoin={canJoin}
            insufficientFunds={insufficientFunds}
            myUser={myUser}
            isFull={isFull}
            status={tournament.status}
            getEntryFee={getEntryFee}
            navigate={navigate}
          />
        </div>
      </div>

      <ParticipantsList participants={participants} />
    </div>
  );
};

export default TournamentDetailsCard;

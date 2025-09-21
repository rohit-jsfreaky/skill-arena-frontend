import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMYUser } from "@/context/UserContext";
import NotFoundTournament from "@/components/Tournaments/NotFoundTournament";
import BackArrow from "@/components/Tournaments/BackArrow";
import { fetchTournamentDetails, joinTournament } from "@/api/tournament";
import { Tournament } from "@/interface/tournament";
import { useAuthToken } from "@/context/AuthTokenContext";
import { useUser } from "@clerk/clerk-react";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import TournamentDetailsCard from "@/components/Tournaments/TournamentDetails";
import SlotBasedTournamentJoin from "@/components/Tournaments/SlotBasedTournamentJoin";
import { Button } from "@/components/ui/button";


export interface Participant {
  id: number;
  username: string;
  profile: string | null;
  joined_at: string;
}

const TournamentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const { myUser, setUser } = useMYUser();
  const navigate = useNavigate();
  const { authToken } = useAuthToken();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (authToken) {
      fetchTournamentDetails({
        setLoading,
        setTournament,
        id,
        myUser,
        setHasJoined,
        setParticipants,
        setError,
        authToken,
      });
    }
  }, [id, myUser, authToken]);

  const onJoinTournament = () => {
    if (authToken) {
      joinTournament({
        myUser,
        navigate,
        setJoining,
        setError,
        id,
        setSuccess,
        setHasJoined,
        setUser,
        setTournament,
        setParticipants,
      });
    }
  };

  const getEntryFee = () => {
    if (!tournament) return 0;
    return myUser?.membership_id
      ? tournament.entry_fee_pro
      : tournament.entry_fee_normal;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isSignedIn) {
    return (
      <div
        className={`${
          !isSignedIn && "justify-center flex items-center"
        } bg-black text-white min-h-screen`}
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        <NotLoginCard />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!tournament) {
    return <NotFoundTournament navigate={navigate} />;
  }

  const isFull =
    Number(tournament.current_participants) >= tournament.max_participants;
  const canJoin =
    !hasJoined && !isFull && myUser && tournament.status === "upcoming";
  const insufficientFunds =
    myUser &&
    myUser.wallet !== null &&
    Number(myUser.wallet) < Number(getEntryFee());

  // Check if this is a slot-based tournament
  const isSlotBasedTournament = Boolean(tournament.tournament_mode && tournament.max_groups);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/tournaments")}
        className="mb-6 flex items-center text-[#BBF429]"
      >
        <BackArrow />
        Back to Tournaments
      </button>

      <TournamentDetailsCard
        canJoin={canJoin}
        error={error}
        formatDate={formatDate}
        getEntryFee={getEntryFee}
        hasJoined={hasJoined}
        insufficientFunds={insufficientFunds}
        isFull={isFull}
        joining={joining}
        myUser={myUser}
        navigate={navigate}
        onJoinTournament={isSlotBasedTournament ? undefined : onJoinTournament}
        disableJoinButton={isSlotBasedTournament}
        disableReason={"Select a group below to join"}
        participants={participants}
        success={success}
        tournament={tournament}
      />

      {/* Slot-based tournament join section */}
  {isSlotBasedTournament && myUser && tournament.status === "upcoming" && (
        <div className="mt-6">
          <SlotBasedTournamentJoin
            tournamentId={id!}
            tournamentName={tournament.name}
            entryFee={getEntryFee()}
            userWallet={Number(myUser.wallet || 0)}
    userId={String(myUser.id)}
            onJoinSuccess={() => {
              setHasJoined(true);
              setSuccess("Successfully joined tournament!");
            }}
          />
        </div>
      )}

      {tournament.status === 'completed' && (
        <Link to={`/tournaments/${tournament.id}/results`}>
          <Button variant="outline" className="mt-4">
            View Results & Submit Screenshot
          </Button>
        </Link>
      )}
    </div>
  );
};

export default TournamentDetails;

import { fetchTournamentDetails } from "@/api/tournament";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import BackArrow from "@/components/Tournaments/BackArrow";
import NotFoundTournament from "@/components/Tournaments/NotFoundTournament";
import TournamentDetailsCard from "@/components/Tournaments/TournamentDetails";
import type { Tournament } from "@/interface/tournament";
import { Participant } from "@/pages/Tournaments/TournamentDetails";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournamentDetails({
      setLoading,
      setTournament,
      id,
      setParticipants,
      setError,
      admin: true,
    });
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!tournament) {
    return (
      <div className="flex justify-center items-center w-full h-full mx-auto px-4 py-14 bg-gradient-to-r from-black via-black to-[#BBF429]">
        <NotFoundTournament navigate={navigate} name="admin" />;
      </div>
    );
  }
  
  return (
    <div
      className={`w-full flex flex-col ${
        loading ? "items-center justify-center" : "justify-start"
      } h-full mx-auto px-4 py-14 bg-gradient-to-r from-black via-black to-[#BBF429]`}
    >
      {!loading && (
        <button
          onClick={() => navigate("/admin/tournaments")}
          className="mb-6 flex items-center text-[#BBF429]"
        >
          <BackArrow />
          Back to Tournaments
        </button>
      )}
      
      {loading ? (
        <LoadingSpinner color="white" size={50} />
      ) : (
        <TournamentDetailsCard
          tournament={tournament}
          isFull={false}
          formatDate={formatDate}
          error={error}
          navigate={navigate}
          participants={participants}
          success={null}
        />
      )}
    </div>
  );
};

export default Tournament;

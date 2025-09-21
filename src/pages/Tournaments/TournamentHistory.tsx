import React, { useEffect, useState } from "react";
import { fetchHistory } from "@/api/tournament";
import {  Tournament } from "@/interface/tournament";
import { useAuthToken } from "@/context/AuthTokenContext";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import { useUser } from "@clerk/clerk-react";
import TournamentTable from "@/components/Tournaments/TournamentTable";

const TournamentHistory: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuthToken();

  const { isSignedIn } = useUser();

  useEffect(() => {
    if (authToken) fetchHistory({ setLoading, setTournaments });
  }, []);

   const formatDate = (dateString: string) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left text-white">
        Tournaments History
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBF429]"></div>
        </div>
      ) : (
        <>
          {tournaments.length > 0 ? (
            <TournamentTable
              formatDate={formatDate}
              tournaments={tournaments}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-300 text-lg">
                No tournament history available.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TournamentHistory;

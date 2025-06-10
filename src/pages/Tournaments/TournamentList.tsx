import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMYUser } from "@/context/UserContext";
import TournamentCard from "@/components/Tournaments/TournamentCard";
import TournamentHistory from "./TournamentHistory";
import { Tournament } from "@/interface/tournament";
import { fetchMyTournaments, fetchTournaments } from "@/api/tournament";
import { useAuthToken } from "@/context/AuthTokenContext";
import { useUser } from "@clerk/clerk-react";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TournamentList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { myUser } = useMYUser();
  const navigate = useNavigate();
  const { authToken } = useAuthToken();
  const { isSignedIn } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<{
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalItems: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    if (authToken) {
      const fetchData = async () => {
        const paginationInfo = await fetchTournaments({
          setTournaments,
          page: currentPage,
          limit: 9,
          user_id: myUser?.id,
        });
        setPaginationData(paginationInfo);
      };
      fetchData();
      fetchMyTournaments({ myUser, setMyTournaments });
    }
  }, [myUser, currentPage]);

  const getEntryFee = (tournament: Tournament): number => {
    if (myUser?.membership_id) {
      return Number(tournament.entry_fee_pro);
    }
    return Number(tournament.entry_fee_normal);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    if (!paginationData || activeTab !== "all") return null;

    const { currentPage, hasNextPage, hasPrevPage, totalPages } =
      paginationData;

    return (
      <div className="flex justify-between items-center mt-6 bg-[#1A1A1A] rounded-lg p-4 text-white">
        <div className="flex gap-4 text-sm">
          <div className=" pl-4">
            Page {currentPage} of {totalPages}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => hasPrevPage && handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            variant="outline"
            size="sm"
            className={
              !hasPrevPage
                ? "opacity-50 cursor-not-allowed text-black"
                : "text-black"
            }
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            variant="outline"
            size="sm"
            className={
              !hasNextPage
                ? "opacity-50 cursor-not-allowed text-black"
                : "text-black"
            }
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  if (!isSignedIn) {
    return (
      <div
        className={`${
          !isSignedIn && "justify-center flex items-center"
        } bg-gradient-to-r from-black via-black to-[#BBF429] text-white min-h-screen`}
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        <NotLoginCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Tournaments</h1>
      <div className="mb-6">
        <div className="flex flex-wrap  border-b text-white">
          <button
            className={`py-2 px-4 md:px-6 text-sm md:text-base ${
              activeTab === "all"
                ? "border-b-2 border-[#BBF429] text-[#BBF429]"
                : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Tournaments
          </button>
          <button
            className={`py-2 px-4 md:px-6 text-sm md:text-base ${
              activeTab === "my"
                ? "border-b-2 border-[#BBF429] text-[#BBF429]"
                : ""
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Tournaments
          </button>
        </div>
      </div>
      <div
        className={
          activeTab === "history"
            ? "w-full"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {activeTab === "history" ? (
          <TournamentHistory />
        ) : (
          (activeTab === "all" ? tournaments : myTournaments).map(
            (tournament) => (
              <TournamentCard
                formatDate={formatDate}
                getEntryFee={getEntryFee}
                myUser={myUser}
                navigate={navigate}
                tournament={tournament}
                key={tournament.id}
              />
            )
          )
        )}
      </div>

      {renderPagination()}

      {activeTab !== "history" &&
        (activeTab === "all" ? tournaments : myTournaments).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {activeTab === "all"
                ? "No tournaments available at the moment."
                : "You haven't joined any tournaments yet."}
            </p>
          </div>
        )}
    </div>
  );
};

export default TournamentList;

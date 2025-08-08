import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMYUser } from "@/context/UserContext";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import MatchHeader from "@/components/TDM/MatchHeader";
import MatchInfoTab from "@/components/TDM/MatchInfoTab";
import TeamsTab from "@/components/TDM/TeamsTab";
import ActionsTab from "@/components/TDM/ActionsTab";
import MatchTimeline from "@/components/TDM/MatchTimeline";
import QuickActions from "@/components/TDM/QuickActions";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import ScreenshotsTab from "@/components/TDM/ScreenshotsTab";

const MatchDetailsPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { myUser } = useMYUser();
  const { loading, matchDetails, loadMatchDetails, setLoading } = useTDMMatch();

  const [userTeam, setUserTeam] = useState<any>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [isUserCaptain, setIsUserCaptain] = useState(false);
  const [opponentTeam, setOpponentTeam] = useState<any>(null);
  const [opponentTeamId, setOpponentTeamId] = useState<number | null>(null);
  const [isMatchCreator, setIsMatchCreator] = useState(false);
  const [activeTab, setActiveTab] = useState("match-info");

  useEffect(() => {
    if (matchId) {
      setLoading(true);
      const timer = setTimeout(() => {
        loadMatchDetails(parseInt(matchId));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [matchId, loadMatchDetails]);

  useEffect(() => {
    console.log("Match Details:", matchDetails);
  }, [matchDetails]);

  useEffect(() => {
    if (matchDetails && myUser) {
      // Determine if user is match creator
      setIsMatchCreator(matchDetails.created_by === myUser.id);

      // Determine user's team and if they're a captain
      let foundUserTeam = null;
      let foundUserTeamId = null;
      let foundIsUserCaptain = false;
      let foundOpponentTeam = null;
      let foundOpponentTeamId = null;

      // Check Team A
      const isInTeamA = matchDetails.team_a?.members?.some(
        (member: any) => member.user_id === myUser.id
      );

      if (isInTeamA) {
        foundUserTeam = matchDetails.team_a;
        foundUserTeamId = matchDetails.team_a.id;
        foundOpponentTeam = matchDetails.team_b;
        foundOpponentTeamId = matchDetails.team_b?.id;

        const userMember = matchDetails.team_a.members.find(
          (member: any) => member.user_id === myUser.id
        );
        foundIsUserCaptain = userMember?.is_captain || false;
      } else {
        // Check Team B
        const isInTeamB = matchDetails.team_b?.members?.some(
          (member: any) => member.user_id === myUser.id
        );

        if (isInTeamB) {
          foundUserTeam = matchDetails.team_b;
          foundUserTeamId = matchDetails.team_b.id;
          foundOpponentTeam = matchDetails.team_a;
          foundOpponentTeamId = matchDetails.team_a?.id;

          const userMember = matchDetails.team_b.members.find(
            (member: any) => member.user_id === myUser.id
          );
          foundIsUserCaptain = userMember?.is_captain || false;
        }
      }

      setUserTeam(foundUserTeam);
      setUserTeamId(foundUserTeamId);
      setIsUserCaptain(foundIsUserCaptain);
      setOpponentTeam(foundOpponentTeam);
      setOpponentTeamId(foundOpponentTeamId);
    }
  }, [matchDetails, myUser]);

  if (matchDetails) {
    // Get team size from match details, default to 4 if not specified
    const teamSize = matchDetails?.team_size || 4;

    // Log size (for debugging)
    console.log(`Match setup: ${teamSize}v${teamSize}`);
  }

  if (loading) {
    return (
      <div className="w-full h-full items-center flex justify-center">
        <LoadingSpinner color="white" size={30} />
      </div>
    );
  }

  if (!matchDetails) {
    return (
      <div className="w-[50%] m-auto  py-10">
        <Alert
          variant="destructive"
          className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Match not found</AlertTitle>
          <AlertDescription>
            The match you're looking for doesn't exist or you don't have access
            to it.
            <Button onClick={() => navigate("/tdm/matches")} className="mt-4">
              Back to Matches
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className=" py-4 w-full px-4">
      <MatchHeader
        matchDetails={matchDetails}
        navigate={navigate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="w-full mb-6">
            {/* Replace tabs with a custom responsive solution */}
            <div className="w-full">
              {/* Tab selector buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  onClick={() => setActiveTab("match-info")}
                  className={`px-4 py-3 rounded-lg text-center font-medium text-sm transition-all ${
                    activeTab === "match-info"
                      ? "bg-black text-white shadow-md border-2 border-[#BBF429]"
                      : "bg-[#BBF429] hover:bg-[#a5d825] text-black"
                  }`}
                >
                  Match Info
                </button>
                <button
                  onClick={() => setActiveTab("teams")}
                  className={`px-4 py-3 rounded-lg text-center font-medium text-sm transition-all ${
                    activeTab === "teams"
                      ? "bg-black text-white shadow-md  border-2 border-[#BBF429]"
                      : "bg-[#BBF429] hover:bg-[#a5d825] text-black"
                  }`}
                >
                  Teams
                </button>
                <button
                  onClick={() => setActiveTab("screenshots")}
                  className={`px-4 py-3 rounded-lg text-center font-medium text-sm transition-all ${
                    activeTab === "screenshots"
                      ? "bg-black text-white shadow-md  border-2 border-[#BBF429]"
                      : "bg-[#BBF429] hover:bg-[#a5d825] text-black"
                  }`}
                >
                  Screenshots
                </button>
                <button
                  onClick={() => setActiveTab("actions")}
                  className={`px-4 py-3 rounded-lg text-center font-medium text-sm transition-all ${
                    activeTab === "actions"
                      ? "bg-black text-white shadow-md border-2 border-[#BBF429]"
                      : "bg-[#BBF429] hover:bg-[#a5d825] text-black"
                  }`}
                >
                  Actions
                </button>
              </div>

              {/* Content sections */}
              <div className="mt-4">
                {activeTab === "match-info" && (
                  <div className="space-y-4">
                    <MatchInfoTab
                      matchDetails={matchDetails}
                      isMatchCreator={isMatchCreator}
                      loadMatchDetails={loadMatchDetails}
                    />
                  </div>
                )}

                {activeTab === "teams" && (
                  <div>
                    <TeamsTab matchDetails={matchDetails} />
                  </div>
                )}

                {activeTab === "screenshots" && (
                  <div>
                    <ScreenshotsTab matchDetails={matchDetails} />
                  </div>
                )}

                {activeTab === "actions" && (
                  <div className="space-y-4">
                    <ActionsTab
                      matchDetails={matchDetails}
                      isUserCaptain={isUserCaptain}
                      userTeam={userTeam}
                      userTeamId={userTeamId}
                      opponentTeam={opponentTeam}
                      opponentTeamId={opponentTeamId}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <MatchTimeline matchDetails={matchDetails} />

          <QuickActions
            matchDetails={matchDetails}
            isUserCaptain={isUserCaptain}
            userTeamId={userTeamId}
            opponentTeamId={opponentTeamId}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPage;

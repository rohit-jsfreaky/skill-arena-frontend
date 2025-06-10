import React, { useEffect, useState } from "react";
import { CreateTdmMatch } from "@/components/TDM/CreateTdmMatch";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { useNavigate } from "react-router-dom";
import { TdmMatchType } from "@/interface/tdmMatches";
import { TeamMember } from "@/hooks/useTDMMatch";
import { ArrowLeft, Gamepad2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMYUser } from "@/context/UserContext";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import { getTournamentMargin } from "@/api/admin/margin";
import { showErrorToast } from "@/utils/toastUtils";

const CreateTdmMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, handleCreateMatch } = useTDMMatch();
  const { myUser } = useMYUser();
  const [tournamentMargin, setTournamentMargin] = useState(0);

  useEffect(() => {
    const fetchMargin = async () => {
      const { margin, success, message } = await getTournamentMargin();

      if (!success)
        return showErrorToast(message || "Failed to load tournament margin");

      setTournamentMargin(margin);
    };

    fetchMargin();
  }, []);

  const handleCreateMatchSubmit = async (
    matchType: TdmMatchType,
    gameName: string,
    entryFee: number,
    teamName: string,
    teamMembers: TeamMember[],
    teamSize: number  // Add teamSize parameter
  ) => {
    const match = await handleCreateMatch(
      matchType,
      gameName,
      entryFee,
      teamName,
      teamMembers,
      teamSize  // Pass it to handleCreateMatch
    );

    if (match) {
      navigate(`/tdm/match/${match.match_id}`);
    }
  };

  if (!myUser) {
    return (
      <div className="container mx-auto py-10 min-h-[calc(100vh-4rem)]">
        <NotLoginCard />
      </div>
    );
  }

  return (
    <div className=" w-full py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate("/tdm")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white">
              Create a TDM Match
            </h1>
            <p className="text-[#EAFFA9] mt-1">
              Form your team and create a new 4v4 match
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form card */}
          <Card className="col-span-1 lg:col-span-2  bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
            <CardContent className="p-0">
              <CreateTdmMatch
                onCreateMatch={handleCreateMatchSubmit}
                loading={loading}
                tournamentMargin={tournamentMargin}
              />
            </CardContent>
          </Card>

          {/* Info cards section */}
          <div className="space-y-6">
            <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-white" />
                  <h3 className="text-lg font-semibold">How TDM Works</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-white">1. Create a match</p>
                    <p className="text-[#EAFFA9]">
                      Form a team of 4 players and set up your match details.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-white">
                      2. Wait for opponents
                    </p>
                    <p className="text-[#EAFFA9]">
                      Public matches will be visible to all players. Private
                      matches require an invite.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-white">3. Play the match</p>
                    <p className="text-[#EAFFA9]">
                      Once both teams are ready, coordinate the match and play.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-white">4. Submit results</p>
                    <p className="text-[#EAFFA9]">
                      Upload a screenshot of your victory to claim the prize
                      pool.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Gamepad2 className="h-5 w-5 text-white" />
                  <h3 className="text-lg font-semibold">Team Requirements</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Team Sizes Available</span>
                    <span className="font-medium">4v4, 6v6, 8v8</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Entry Fee</span>
                    <span className="font-medium">Per player</span>
                  </div>
                  
                  {/* ... */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTdmMatchPage;

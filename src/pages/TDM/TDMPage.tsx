import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins, Trophy, Users, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMYUser } from "@/context/UserContext";
import { PublicMatchesList } from "@/components/TDM/PublicMatchesList";
import { UserMatchesList } from "@/components/TDM/UserMatchesList";
import NotLoginCard from "@/components/my-ui/NotLoginCard";
import { useTDMMatch } from "@/hooks/useTDMMatch";

const TDMPage = () => {
  const navigate = useNavigate();
  const { myUser } = useMYUser();
  const {
    publicMatches,
    loading,
    loadPublicMatches,
    loadMyMatches,
    myMatches,
  } = useTDMMatch();

  React.useEffect(() => {
    if (myUser) {
      loadPublicMatches();
      loadMyMatches(myUser.id);
    }
  }, [myUser, loadPublicMatches, loadMyMatches]);

  if (!myUser) {
    return (
      <div className="container mx-auto py-10 min-h-[calc(100vh-4rem)]">
        <NotLoginCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Team Deathmatch
          </h1>
          <p className="text-[#EAFFA9] mt-1">
            Compete in team battles and win rewards
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/tdm/create-match")}
            className="flex items-center gap-2 text-[#BBF429]"
          >
            <PlusCircle className="h-4 w-4" />
            Create Match
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="active-matches" className="w-full ">
            <TabsList className="grid grid-cols-2 mb-4 bg-[#BBF429] rounded-lg p-1">
              <TabsTrigger
                className="data-[state=active]:bg-black data-[state=active]:text-white"
                value="active-matches"
              >
                My Matches
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-black data-[state=active]:text-white"
                value="public-matches"
              >
                Public Matches
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active-matches">
              <UserMatchesList
                matches={myMatches}
                isLoading={loading}
                userId={myUser.id}
              />
            </TabsContent>

            <TabsContent value="public-matches">
              <PublicMatchesList matches={publicMatches} isLoading={loading} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                TDM Rewards
              </CardTitle>
              <CardDescription className="text-[#EAFFA9]">Win and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>Team Sizes</span>
                </div>
                <span className="font-medium">4v4, 6v6, 8v8</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Coins className="h-4 w-4" />
                  <span>Entry Fee</span>
                </div>
                <span>Per player basis</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" />
                  <span>Prize Pool</span>
                </div>
                <span>90% of total entry fees</span>
              </div>
              <Button
                onClick={() => navigate("/tdm/create-match")}
                className="w-full"
              >
                Create Match
              </Button>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-white" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Create a Match</h4>
                <p className="text-sm text-[#EAFFA9]">
                  Form a team and create a public or private match with your preferred team size
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Pay Entry Fee</h4>
                <p className="text-sm text-[#EAFFA9]">
                  Each player pays the entry fee to join the match
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. Find Opponents</h4>
                <p className="text-sm text-[#EAFFA9]">
                  Wait for another team to join or invite a specific team
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">4. Play & Win</h4>
                <p className="text-sm text-[#EAFFA9]">
                  Play the match and submit results to win rewards
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TDMPage;

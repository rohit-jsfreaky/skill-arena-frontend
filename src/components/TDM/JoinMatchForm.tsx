import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMYUser } from "@/context/UserContext";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeftSquare,
  Check,
  Clock,
  Coins,
  Users,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { TeamMemberSelector } from "./TeamMemberSelector";
import { TdmMatchDetails } from "@/interface/tdmMatches";
import { formatDistanceToNowIST } from "@/utils/timeUtils";
import { showErrorToast } from "@/utils/toastUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// REMOVED: import { joinPrivateMatchByLink } from "@/api/tdmMatches"; - no longer needed

const JoinMatchForm = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { myUser } = useMYUser();
  const { loading, loadMatchDetails, joinPublicMatch, joinTeam } = useTDMMatch();

  const [match, setMatch] = useState<TdmMatchDetails | null>(null);
  const [teamName, setTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState(
    myUser ? [{ id: myUser.id, username: myUser.username, profile: myUser.profile }] : []
  );
  const [isInMatch, setIsInMatch] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinTab, setJoinTab] = useState("join-team-b");

  // Use useCallback for stable functions to prevent unnecessary re-renders
  const fetchMatchDetails = useCallback(async () => {
    if (matchId) {
      const data = await loadMatchDetails(parseInt(matchId));
      if (data) {
        setMatch(data);

        // Check if the current user is already in this match
        const userInTeamA = data.team_a?.members?.some(
          (member) => member.user_id === myUser?.id
        );
        setIsInMatch(!!userInTeamA);

        if (userInTeamA) {
          showErrorToast("You are already in Team A for this match");
        }
      }
    }
  }, [matchId, loadMatchDetails, myUser?.id]);

  useEffect(() => {
    fetchMatchDetails();
  }, [fetchMatchDetails]);

  useEffect(() => {
    // Update selected members when user data loads
    if (myUser && selectedMembers.length === 0) {
      setSelectedMembers([
        {
          id: myUser.id,
          username: myUser.username,
          profile: myUser.profile,
        },
      ]);
    }
  }, [myUser]);

  // Modify the handleJoinMatch function to work with team selection
  const handleJoinMatch = async (preferredTeam: 'team_a' | 'team_b' = 'team_b') => {
    if (!myUser) {
      showErrorToast("You must be logged in to join a match");
      return;
    }

    if (!match) {
      showErrorToast("Match details not available");
      return;
    }

    if (!matchId) {
      showErrorToast("Invalid match ID");
      return;
    }

    if (!teamName) {
      showErrorToast("Please enter a team name");
      return;
    }

    // Changed to allow 1-4 players instead of requiring exactly 4
    if (selectedMembers.length < 1 || selectedMembers.length > 4) {
      showErrorToast("Please select between 1 and 4 team members");
      return;
    }

    try {
      setIsJoining(true);
      
      // Use joinPublicMatch for both public and private matches with team preference
      const result = await joinPublicMatch({
        match_id: parseInt(matchId),
        team_name: teamName,
        team_members: selectedMembers.map((m) => m.id),
        captainId: myUser.id,
        preferred_team: preferredTeam,
      });

      if (result) {
        navigate(`/tdm/match/${match.id}`);
      }
    } catch (error) {
      console.error("Error joining match:", error);
      showErrorToast("Failed to join match");
    } finally {
      setIsJoining(false);
    }
  };

  if (loading && !match) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBF429]"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <Alert
        variant="destructive"
        className="max-w-md mx-auto mt-8 border-[#BBF429] bg-black text-white"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Match not found or no longer available.
        </AlertDescription>
      </Alert>
    );
  }

  if (isInMatch) {
    return (
      <Alert className="max-w-md mx-auto mt-8 border-[#BBF429] bg-black text-white">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Already in Match</AlertTitle>
        <AlertDescription>
          You are already a member of Team A in this match and cannot join as
          Team B.
        </AlertDescription>
        <Button
          className="mt-4 w-full bg-[#BBF429] text-black hover:bg-[#EAFFA9]"
          onClick={() => navigate(`/tdm/match/${match.id}`)}
        >
          Go to Match Details
        </Button>
      </Alert>
    );
  }

  if (match.status !== "waiting") {
    return (
      <Alert className="max-w-md mx-auto mt-8 border-[#BBF429] bg-black text-white">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Available</AlertTitle>
        <AlertDescription>
          This match is no longer available for joining. It may have been filled
          or cancelled.
        </AlertDescription>
        <Button
          className="mt-4 w-full bg-[#BBF429] text-black hover:bg-[#EAFFA9]"
          onClick={() => navigate("/tdm/matches")}
        >
          Back to Available Matches
        </Button>
      </Alert>
    );
  }

  const teamAMembers = match.team_a?.members || [];

  return (
    <div className=" py-8 w-full text-white px-4">
      <div className="mb-6 ">
        <Button
          variant="outline"
          className=" bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white"
          size="sm"
          onClick={() => navigate("/tdm/")}
        >
          <ArrowLeftSquare />
          Back to Matches
        </Button>
        <h1 className="text-2xl font-bold text-white mt-2">Join TDM Match</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-black border-[#BBF429] text-white">
            <CardHeader>
              <CardTitle className="text-white">Match Details</CardTitle>
              <CardDescription className="text-[#EAFFA9]">
                Created{" "}
                {formatDistanceToNowIST(new Date(match.created_at), {
                  addSuffix: true,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-white">
                  {match.game_name}
                </h3>
                <p className="text-[#EAFFA9]">{match.match_type} match</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-white">
                    <Coins size={16} className="text-[#BBF429]" />
                    Entry Fee:
                  </span>
                  <span className="font-medium text-white">
                    {match.entry_fee} coins
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-white">
                    <Coins size={16} className="text-[#EAFFA9]" />
                    Prize Pool:
                  </span>
                  <span className="font-medium text-[#EAFFA9]">
                    {match.prize_pool} coins
                  </span>
                </div>
              </div>

              <Separator className="bg-[#BBF429]/30" />

              <div>
                <h4 className="font-medium mb-2 text-white">Team A</h4>
                <div className="bg-[#BBF429]/10 p-3 rounded-md border border-[#BBF429]/30">
                  <p className="font-medium text-white">
                    {match.team_a?.team_name || "Unnamed Team"}
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="flex items-center gap-1 mb-2 text-[#EAFFA9]">
                      <Users size={14} />
                      {teamAMembers.length} players
                    </span>

                    <div className="space-y-2">
                      {teamAMembers.map((member) => (
                        <div
                          key={member.user_id}
                          className="flex items-center space-x-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={member.profile || ""}
                              alt={member.username}
                            />
                            <AvatarFallback className="bg-[#BBF429]/20 text-white">
                              {member.username?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-white">
                            {member.username}{" "}
                            {member.is_captain ? (
                              <span className="text-[#EAFFA9]">(Captain)</span>
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#EAFFA9]">
                <Clock size={14} />
                <span>Waiting for Team B (you) to join</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs value={joinTab} onValueChange={setJoinTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-[#BBF429]">
              <TabsTrigger
                className="data-[state=active]:bg-black data-[state=active]:text-white"
                value="join-team-a"
              >
                Join Team A
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-black data-[state=active]:text-white"
                value="join-team-b"
              >
                Create Team B
              </TabsTrigger>
            </TabsList>

            {/* Join Team A Tab */}
            <TabsContent value="join-team-a">
              <Card className="bg-black border-[#BBF429] text-white">
                <CardHeader>
                  <CardTitle className="text-white">Join Existing Team</CardTitle>
                  <CardDescription className="text-[#EAFFA9]">
                    Join Team A as a player
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-[#BBF429]/10 p-3 rounded-md border border-[#BBF429]/30">
                    <p className="font-medium text-white">
                      Team: {match?.team_a?.team_name || "Unnamed Team"}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm text-[#EAFFA9] mb-2">
                        Current Members ({match?.team_a?.members?.length || 0}/4):
                      </p>
                      <div className="space-y-2">
                        {match?.team_a?.members?.map((member: any) => (
                          <div
                            key={member.user_id}
                            className="flex items-center space-x-2"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={member.profile || ""}
                                alt={member.username}
                              />
                              <AvatarFallback className="bg-[#BBF429]/20 text-white">
                                {member.username?.[0]?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-white">
                              {member.username}{" "}
                              {member.is_captain ? (
                                <span className="text-[#EAFFA9]">(Captain)</span>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Alert className="border-[#BBF429] bg-[#BBF429]/10 text-white">
                    <Check className="h-4 w-4 text-[#EAFFA9]" />
                    <AlertTitle className="text-white">
                      Entry Fee Required
                    </AlertTitle>
                    <AlertDescription className="text-[#EAFFA9]">
                      You will need to pay {match?.entry_fee} coins to join this team.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="button"
                    className="w-full bg-[#BBF429] text-black hover:bg-[#EAFFA9]"
                    onClick={() => joinTeam(match.id, match.team_a?.id || 0)}
                    disabled={
                      loading || 
                      isJoining || 
                      isInMatch || 
                      !match?.team_a?.id ||
                      (match?.team_a?.members?.length || 0) >= 4 ||
                      !!match?.team_a?.team_name // If team A already has a name, it's taken
                    }
                  >
                    {isJoining ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Joining...
                      </span>
                    ) : (
                      "Join Team A"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Join as Team B Tab (Create Team B) */}
            <TabsContent value="join-team-b">
              <Card className="bg-black border-[#BBF429] text-white">
                <CardHeader>
                  <CardTitle className="text-white">Register Your Team</CardTitle>
                  <CardDescription className="text-[#EAFFA9]">
                    Create Team B with 1-4 players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="team-name" className="text-white">
                        Team Name
                      </Label>
                      <Input
                        id="team-name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        placeholder="Enter your team name"
                        className="bg-black border-[#BBF429] text-white focus:ring-[#BBF429]"
                      />
                    </div>

                    <TeamMemberSelector
                      selectedMembers={selectedMembers}
                      setSelectedMembers={setSelectedMembers}
                      maxMembers={4}
                      matchId={parseInt(matchId || "0")}
                    />

                    <Alert className="border-[#BBF429] bg-[#BBF429]/10 text-white">
                      <Check className="h-4 w-4 text-[#EAFFA9]" />
                      <AlertTitle className="text-white">
                        Entry Fee Required
                      </AlertTitle>
                      <AlertDescription className="text-[#EAFFA9]">
                        Each team member will need to pay {match?.entry_fee} coins to
                        join this match.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="button"
                      className="w-full bg-[#BBF429] text-black hover:bg-[#EAFFA9]"
                      onClick={() => handleJoinMatch('team_b')}
                      disabled={
                        loading ||
                        isJoining ||
                        !teamName ||
                        selectedMembers.length < 1 ||
                        selectedMembers.length > 4
                      }
                    >
                      {isJoining ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Joining...
                        </span>
                      ) : (
                        "Join Match as Team B"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default JoinMatchForm;

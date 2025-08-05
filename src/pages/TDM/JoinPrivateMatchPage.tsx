import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { useMYUser } from "@/context/UserContext";
import { joinPrivateMatchByLink } from "@/api/tdmMatches";
import { toast } from "sonner";
import { ArrowLeft, Users, Clock, Trophy } from "lucide-react";
import NotLoginCard from "@/components/my-ui/NotLoginCard";

const JoinPrivateMatchPage = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { myUser } = useMYUser();
  
  const [teamName, setTeamName] = useState("");
  const [joining, setJoining] = useState(false);

  // Redirect to login if not authenticated
  if (!myUser) {
    return (
      <div className="container mx-auto py-10 min-h-[calc(100vh-4rem)]">
        <NotLoginCard />
      </div>
    );
  }

  // Validate invite code exists
  if (!inviteCode) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardHeader>
            <CardTitle className="text-[#BBF429] text-center">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">This invite link is invalid or has expired.</p>
            <Button 
              onClick={() => navigate("/tdm")}
              className="w-full bg-[#BBF429] text-black hover:bg-[#A8E526]"
            >
              Back to TDM
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleJoinMatch = async () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    if (!inviteCode || !myUser) {
      toast.error("Invalid invite code or user not authenticated");
      return;
    }

    try {
      setJoining(true);
      
      // Extract match ID from invite code (assuming it's encoded in the invite code)
      // This would need to be implemented based on how the backend generates invite codes
      const response = await joinPrivateMatchByLink(parseInt(inviteCode), {
        team_name: teamName,
        captainId: myUser.id,
        team_members: [myUser.id]
      });

      if (response.data.success) {
        toast.success("Successfully joined the private match!");
        navigate("/tdm");
      } else {
        toast.error(response.data.message || "Failed to join match");
      }
    } catch (error: unknown) {
      console.error("Error joining private match:", error);
      toast.error("Failed to join match");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/tdm")}
            className="text-[#BBF429] hover:bg-[#BBF429] hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Join Private Match</h1>
            <p className="text-[#EAFFA9]">You've been invited to join a private TDM match</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardHeader>
            <CardTitle className="text-[#BBF429] flex items-center gap-2">
              <Users className="h-5 w-5" />
              Private Match Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Match Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/50">
                <Trophy className="h-5 w-5 text-[#BBF429]" />
                <div>
                  <p className="text-xs text-gray-400">Match Type</p>
                  <p className="text-sm font-medium">Private TDM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/50">
                <Users className="h-5 w-5 text-[#BBF429]" />
                <div>
                  <p className="text-xs text-gray-400">Team Size</p>
                  <p className="text-sm font-medium">4v4</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/50">
                <Clock className="h-5 w-5 text-[#BBF429]" />
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-medium">Waiting for Teams</p>
                </div>
              </div>
            </div>

            {/* Join Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName" className="text-white">
                  Team Name
                </Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  className="bg-black text-white border-[#BBF429] focus:border-[#BBF429] focus:ring-[#BBF429]"
                  disabled={joining}
                />
                <p className="text-xs text-gray-400">
                  You will be added as the team captain
                </p>
              </div>

              <Button
                onClick={handleJoinMatch}
                disabled={joining || !teamName.trim()}
                className="w-full bg-[#BBF429] text-black hover:bg-[#A8E526] disabled:opacity-50"
              >
                {joining ? (
                  <>
                    <LoadingSpinner color="#000000" size={16} />
                    <span className="ml-2">Joining Match...</span>
                  </>
                ) : (
                  "Join Private Match"
                )}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-[#BBF429]/10 border border-[#BBF429]/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#BBF429] mb-2">
                What happens next?
              </h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• You'll be added to this private match as a team captain</li>
                <li>• You can invite up to 3 more teammates</li>
                <li>• The match will start when both teams are ready</li>
                <li>• You'll be redirected to your matches page</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinPrivateMatchPage;

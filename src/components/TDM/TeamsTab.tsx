import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Clock, Users, UserPlus } from "lucide-react";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { useMYUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from "@/utils/toastUtils";

interface TeamsTabProps {
  matchDetails: any;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ matchDetails }) => {
  const { joinTeam } = useTDMMatch();
  const { myUser } = useMYUser();
  const navigate = useNavigate();

  // Get team size from match details, default to 4 if not specified
  const teamSize = matchDetails?.team_size || 4;

  // Check if the user is already in the match
  const isUserInMatch = useMemo(() => {
    if (!myUser || !matchDetails) return false;
    
    const inTeamA = matchDetails.team_a?.members?.some(
      (member: any) => member.user_id === myUser.id
    );
    
    const inTeamB = matchDetails.team_b?.members?.some(
      (member: any) => member.user_id === myUser.id
    );
    
    return inTeamA || inTeamB;
  }, [myUser, matchDetails]);

  // Function to handle joining a team
  const handleJoinTeam = async (teamId: number) => {
    if (!myUser) {
      showErrorToast("You must be logged in to join");
      return;
    }
    
    try {
      await joinTeam(matchDetails.id, teamId);
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Team A */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Team A: {matchDetails.team_a?.team_name || 'Unnamed Team'}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                {matchDetails.team_a?.payment_completed 
                  ? <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Payment Completed</span>
                  : <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Payment Pending</span>
                }
                <span className="mx-2">•</span>
                <span className="text-white">
                  {(matchDetails.team_a?.members?.length || 0)}/{teamSize} Players
                </span>
              </CardDescription>
            </div>
            
            {/* Add Join Team A Button if possible */}
            {!isUserInMatch && matchDetails.status === 'waiting' && 
             (matchDetails.team_a?.members?.length || 0) < teamSize && 
             matchDetails.team_a?.id && (
              <Button 
                size="sm"
                variant="outline"
                onClick={() => handleJoinTeam(matchDetails.team_a?.id)}
                className="border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429]/10"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Join Team
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {matchDetails.team_a?.members?.map((member: any) => (
                <li key={member.user_id} className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.profile || ''} alt={member.username} />
                      <AvatarFallback>{member.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.username}</p>
                      {member.is_captain && (
                        <p className="text-xs text-muted-foreground">Captain</p>
                      )}
                    </div>
                  </div>
                  {member.payment_status === 'completed' ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
                      Paid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500">
                      Pending
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
        
        {/* NEW: Add empty slots to show required team size */}
        {(matchDetails.team_a?.members?.length || 0) < teamSize && (
          <div className="px-6 pb-4">
            <p className="text-sm text-[#EAFFA9] mb-2">
              {teamSize - (matchDetails.team_a?.members?.length || 0)} more player{(teamSize - (matchDetails.team_a?.members?.length || 0)) !== 1 ? 's' : ''} needed
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Array(teamSize - (matchDetails.team_a?.members?.length || 0)).fill(0).map((_, i) => (
                <div key={`empty-a-${i}`} className="border border-dashed border-[#BBF429]/30 rounded h-10 flex items-center justify-center">
                  <span className="text-xs text-[#BBF429]/50">Empty Slot</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      
      {/* Team B */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Team B: {matchDetails.team_b?.team_name || 'Waiting...'}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                {!matchDetails.team_b?.team_name 
                  ? <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Waiting for team to join</span>
                  : matchDetails.team_b?.payment_completed 
                    ? <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Payment Completed</span>
                    : <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Payment Pending</span>
                }
                {matchDetails.team_b?.team_name && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-white">
                      {(matchDetails.team_b?.members?.length || 0)}/{teamSize} Players
                    </span>
                  </>
                )}
              </CardDescription>
            </div>
            
            {/* Add Join Team B Button if possible */}
            {!isUserInMatch && matchDetails.status === 'waiting' && 
             matchDetails.team_b?.team_name && 
             (matchDetails.team_b?.members?.length || 0) < teamSize && (
              <Button 
                size="sm"
                variant="outline"
                onClick={() => handleJoinTeam(matchDetails.team_b?.id)}
                className="border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429]/10"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Join Team
              </Button>
            )}
            
            {/* Add Create Team B Button if no team B exists */}
            {!isUserInMatch && matchDetails.status === 'waiting' && 
             !matchDetails.team_b?.team_name && (
              <Button 
                size="sm"
                variant="outline"
                onClick={() => navigate(`/tdm/join-match/${matchDetails.id}`)}
                className="border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429]/10"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Create Team
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!matchDetails.team_b?.team_name ? (
            <div className="flex flex-col items-center justify-center h-[200px] bg-secondary/20 rounded-md">
              <Users className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Waiting for Team B to join</p>
            </div>
          ) : (
            <ScrollArea className="h-[200px]">
              <ul className="space-y-2">
                {matchDetails.team_b?.members?.map((member: any) => (
                  <li key={member.user_id} className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profile || ''} alt={member.username} />
                        <AvatarFallback>{member.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.username}</p>
                        {member.is_captain && (
                          <p className="text-xs text-muted-foreground">Captain</p>
                        )}
                      </div>
                    </div>
                    {member.payment_status === 'completed' ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500">
                        Pending
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
        
        {/* Add empty slots for Team B too */}
        {matchDetails.team_b?.team_name && (matchDetails.team_b?.members?.length || 0) < teamSize && (
          <div className="px-6 pb-4">
            <p className="text-sm text-[#EAFFA9] mb-2">
              {teamSize - (matchDetails.team_b?.members?.length || 0)} more player{(teamSize - (matchDetails.team_b?.members?.length || 0)) !== 1 ? 's' : ''} needed
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Array(teamSize - (matchDetails.team_b?.members?.length || 0)).fill(0).map((_, i) => (
                <div key={`empty-b-${i}`} className="border border-dashed border-[#BBF429]/30 rounded h-10 flex items-center justify-center">
                  <span className="text-xs text-[#BBF429]/50">Empty Slot</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeamsTab;
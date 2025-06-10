import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TdmMatch } from '@/interface/tdmMatches';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User } from 'lucide-react';

type TeamsPanelProps = {
  match: TdmMatch;
};

export const TeamsPanel = ({ match }: TeamsPanelProps) => {
  // Helper to render team members
  const renderTeamMembers = (team: any) => {
    if (!team || !team.members) {
      return <p className="text-gray-500">No team members</p>;
    }
    
    return (
      <div className="space-y-2">
        {team.members.map((member: any) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {member.profile ? (
                  <AvatarImage src={member.profile} alt={member.username || 'User'} />
                ) : null}
                <AvatarFallback className="bg-[#BBF429] text-black">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{member.username}</span>
                {member.is_captain && (
                  <span className="text-xs text-[#BBF429]">Captain</span>
                )}
              </div>
            </div>
            <Badge className={
              member.payment_status === 'completed' 
                ? 'bg-green-600' 
                : 'bg-amber-600'
            }>
              {member.payment_status === 'completed' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {member.payment_status}
            </Badge>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
      <CardHeader>
        <CardTitle className="text-[#BBF429]">Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team A */}
          <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600">Team A</Badge>
                <h3 className="font-semibold">{match.team_a?.team_name || 'Team A'}</h3>
              </div>
              
              {match.team_a?.is_ready && (
                <Badge className="bg-green-600">Ready</Badge>
              )}
              
              {match.winner_team_id === match.team_a?.id && (
                <Badge className="bg-amber-600">Winner</Badge>
              )}
            </div>
            
            {renderTeamMembers(match.team_a)}
          </div>
          
          {/* Team B */}
          <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600">Team B</Badge>
                <h3 className="font-semibold">{match.team_b?.team_name || 'Team B'}</h3>
              </div>
              
              {match.team_b?.is_ready && (
                <Badge className="bg-green-600">Ready</Badge>
              )}
              
              {match.winner_team_id === match.team_b?.id && (
                <Badge className="bg-amber-600">Winner</Badge>
              )}
            </div>
            
            {renderTeamMembers(match.team_b)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
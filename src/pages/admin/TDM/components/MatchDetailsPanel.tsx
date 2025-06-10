import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TdmMatch } from '@/interface/tdmMatches';
import { Badge } from '@/components/ui/badge';

type MatchDetailsPanelProps = {
  match: TdmMatch;
};

export const MatchDetailsPanel = ({ match }: MatchDetailsPanelProps) => {
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'waiting': return 'bg-gray-500';
      case 'team_a_ready': return 'bg-blue-500';
      case 'team_b_ready': return 'bg-blue-500';
      case 'confirmed': return 'bg-yellow-500';
      case 'in_progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
      <CardHeader>
        <CardTitle className="text-[#BBF429]">Match Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-300">Status:</span>
          <Badge className={getStatusColor(match.status)}>
            {match.status.replace(/_/g, ' ')}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Match Type:</span>
          <span className="text-white font-medium">
            {match.match_type === 'public' ? 'Public' : 'Private'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Entry Fee:</span>
          <span className="text-white font-medium">${match.entry_fee}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Prize Pool:</span>
          <span className="text-[#BBF429] font-medium">${match.prize_pool}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Created:</span>
          <span className="text-white">
            {format(new Date(match.created_at), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
        
        {match.start_time && (
          <div className="flex justify-between">
            <span className="text-gray-300">Started:</span>
            <span className="text-white">
              {format(new Date(match.start_time), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        )}
        
        {match.end_time && (
          <div className="flex justify-between">
            <span className="text-gray-300">Ended:</span>
            <span className="text-white">
              {format(new Date(match.end_time), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        )}
        
        {match.room_id && (
          <div className="flex justify-between">
            <span className="text-gray-300">Room ID:</span>
            <span className="text-white">{match.room_id}</span>
          </div>
        )}
        
        {match.winner_team_id && (
          <div className="flex justify-between">
            <span className="text-gray-300">Winner:</span>
            <span className="text-green-400 font-medium">
              {match.team_a?.id === match.winner_team_id 
                ? match.team_a?.team_name || 'Team A' 
                : match.team_b?.team_name || 'Team B'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
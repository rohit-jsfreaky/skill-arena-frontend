import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TdmDispute, TdmMatch } from '@/interface/tdmMatches';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

type DisputesPanelProps = {
  disputes: TdmDispute[];
  match: TdmMatch;
};

export const DisputesPanel = ({ disputes, match }: DisputesPanelProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'under_review': return 'bg-blue-600';
      case 'resolved': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };
  
  const getTeamName = (teamId: number) => {
    if (match.team_a?.id === teamId) return match.team_a?.team_name || 'Team A';
    if (match.team_b?.id === teamId) return match.team_b?.team_name || 'Team B';
    return `Team ${teamId}`;
  };
  
  if (disputes.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader>
          <CardTitle className="text-[#BBF429]">Disputes</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10 text-gray-500">
          No disputes have been filed for this match
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="text-[#BBF429]">Disputes ({disputes.length})</span>
          <AlertCircle size={16} className="ml-2 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="bg-black/30 p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <div>
                <Badge className={getStatusColor(dispute.status)}>
                  {dispute.status.replace(/_/g, ' ')}
                </Badge>
                <span className="ml-2 text-sm text-gray-300">
                  #{dispute.id} - {format(new Date(dispute.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              
              {dispute.resolved_at && (
                <span className="text-xs text-gray-400">
                  Resolved {format(new Date(dispute.resolved_at), 'MMM d, yyyy h:mm a')}
                </span>
              )}
            </div>
            
            <div className="mb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                <span className="text-sm text-gray-400">Reporter:</span>
                <span className="font-medium">{dispute.reporter_username}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm text-gray-400">Reported Team:</span>
                <span className="font-medium text-red-400">{getTeamName(dispute.reported_team_id)}</span>
              </div>
            </div>
            
            <div className="bg-black/50 p-3 rounded mb-3">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Reason:</h4>
              <p className="text-sm">{dispute.reason}</p>
            </div>
            
            {dispute.evidence_path && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-300 mb-1">Evidence:</h4>
                <div className="aspect-video bg-black rounded overflow-hidden">
                  <img 
                    src={dispute.evidence_path} 
                    alt="Dispute evidence" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            {dispute.admin_notes && (
              <div className="p-3 bg-indigo-900/20 border-l-4 border-indigo-500 rounded">
                <h4 className="text-sm font-medium text-indigo-300">Admin Notes:</h4>
                <p className="text-xs text-gray-300 mt-1">{dispute.admin_notes}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
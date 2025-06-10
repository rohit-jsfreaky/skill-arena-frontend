import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/my-ui/Loader';
import { TdmDispute } from '@/interface/tdmMatches';
import { getTdmMatchDetails } from '@/api/admin/tdm';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface DisputeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  dispute: TdmDispute;
  resolution: 'resolved' | 'rejected';
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  resolving: boolean;
  onConfirm: (winnerTeamId?: number) => Promise<void>;
}

export const DisputeDialog = ({
  open,
  setOpen,
  dispute,
  resolution,
  adminNotes,
  setAdminNotes,
  resolving,
  onConfirm,
}: DisputeDialogProps) => {
  const [teams, setTeams] = useState<{id: number; name: string}[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  // Fetch teams for the match
  useEffect(() => {
    const fetchMatchTeams = async () => {
      if (resolution === 'resolved' && open && dispute) {
        try {
          setLoading(true);
          const result = await getTdmMatchDetails(dispute.match_id);
          if (result.success && result.data) {
            const teamsList = [];
            
            if (result.data.team_a) {
              teamsList.push({
                id: result.data.team_a.id,
                name: result.data.team_a.team_name || `Team A (${result.data.team_a.id})`
              });
            }
            
            if (result.data.team_b) {
              teamsList.push({
                id: result.data.team_b.id,
                name: result.data.team_b.team_name || `Team B (${result.data.team_b.id})`
              });
            }
            
            setTeams(teamsList);
            
            // Pre-select the non-reported team if resolution is "resolved"
            if (resolution === 'resolved' && teamsList.length === 2) {
              const nonReportedTeam = teamsList.find(t => t.id !== dispute.reported_team_id);
              if (nonReportedTeam) {
                setSelectedTeamId(nonReportedTeam.id);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching match teams:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchMatchTeams();
  }, [dispute, resolution, open]);

  const handleConfirm = () => {
    onConfirm(resolution === 'resolved' ? selectedTeamId : undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-r from-black to-[#1A1A1A] text-white border border-[#BBF429]">
        <DialogHeader>
          <DialogTitle>
            {resolution === 'resolved' ? 'Resolve Dispute' : 'Reject Dispute'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4">
            You are about to {resolution === 'resolved' ? 'resolve' : 'reject'} the dispute for Match #{dispute.match_id}
          </p>

          {resolution === 'resolved' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Winning Team:
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-2">
                  <LoadingSpinner size={20} color='white'/>
                </div>
              ) : (
                <Select
                  value={selectedTeamId?.toString()}
                  onValueChange={(value) => setSelectedTeamId(parseInt(value))}
                >
                  <SelectTrigger className="bg-black border-[#BBF429]">
                    <SelectValue placeholder="Select a winning team" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#BBF429]">
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Admin Notes:
            </label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about your decision"
              className="bg-black/30 border-[#BBF429]"
            />
          </div>

          <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-300">
                  {resolution === 'resolved' 
                    ? 'This will award the prize to the selected team and mark the dispute as resolved.'
                    : 'This will reject the dispute and allow the match to continue normally.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black"
          >
            Cancel
          </Button>
          <Button 
            disabled={resolving || (resolution === 'resolved' && !selectedTeamId) || !adminNotes}
            onClick={handleConfirm}
            className={resolution === 'resolved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {resolving ? (
              <>
                <LoadingSpinner size={16} color="white"  />
                Processing...
              </>
            ) : (
              resolution === 'resolved' ? 'Resolve Dispute' : 'Reject Dispute'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import { TdmMatch } from '@/interface/tdmMatches';
import { AlertTriangle, Trophy, CheckCircle } from 'lucide-react';
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

interface WinnerSelectionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  match: TdmMatch;
  selectedTeamId: number | null;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  processing: boolean;
  onConfirm: () => Promise<void>;
}

export const WinnerSelectionDialog = ({
  open,
  setOpen,
  match,
  selectedTeamId,
  adminNotes,
  setAdminNotes,
  processing,
  onConfirm,
}: WinnerSelectionDialogProps) => {
  const selectedTeam = 
    match.team_a?.id === selectedTeamId 
      ? match.team_a 
      : match.team_b?.id === selectedTeamId 
        ? match.team_b 
        : null;
        
  // Count pending disputes that will be resolved
  const pendingDisputesCount = match.disputes?.filter(d => d.status === "pending").length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-r from-black to-[#1A1A1A] text-white border border-[#BBF429]">
        <DialogHeader>
          <DialogTitle>Confirm Winner Selection</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4">
            You are about to award the prize of{" "}
            <span className="font-bold text-[#BBF429]">${match.prize_pool}</span> to:
          </p>

          {selectedTeamId && selectedTeam && (
            <div className="bg-gradient-to-r from-black to-[#1A1A1A] border border-[#BBF429] p-4 rounded-lg mb-4">
              <p className="font-medium flex items-center">
                <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
                {selectedTeam.team_name || `Team ${selectedTeam.id}`}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Prize will be split among {selectedTeam.members?.length || 0} team members
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Admin Notes (required):
            </label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about your decision"
              className="bg-black/30 border-[#BBF429]"
            />
          </div>

          {pendingDisputesCount > 0 && (
            <div className="bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-300">
                    This action will also automatically resolve {pendingDisputesCount} pending 
                    {pendingDisputesCount === 1 ? " dispute" : " disputes"} for this match.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-300">
                  This action will award the prize to the selected team and mark the match as completed.
                  This action cannot be undone.
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
            disabled={processing || !adminNotes}
            onClick={onConfirm}
            className="bg-[#BBF429] text-black hover:bg-[#a9e01c]"
          >
            {processing ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                Processing...
              </>
            ) : (
              "Confirm Selection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
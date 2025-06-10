import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { Screenshot, Tournament } from "../useAdminTournamentReview";

interface ConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tournament: Tournament;
  selectedWinnerId: number | null;
  screenshots: Screenshot[];
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  processingDecision: boolean;
  onSubmitDecision: () => Promise<void>;
}

export const ConfirmationDialog = ({
  open,
  setOpen,
  tournament,
  selectedWinnerId,
  screenshots,
  adminNotes,
  setAdminNotes,
  processingDecision,
  onSubmitDecision,
}: ConfirmationDialogProps) => {
  const selectedScreenshot = screenshots.find(
    (s) => s.user_id === selectedWinnerId
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-r from-black to-[#1A1A1A] text-white border border-[#BBF429]">
        <DialogHeader>
          <DialogTitle>Confirm Winner Selection</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4">
            You are about to award the prize of{" "}
            <span className="font-bold">${tournament.prize_pool}</span> to:
          </p>

          {selectedWinnerId && selectedScreenshot && (
            <div className="bg-gradient-to-r from-black to-[#1A1A1A] p-4 rounded-lg mb-4">
              <p className="font-medium">
                {selectedScreenshot.user_name || selectedScreenshot.username}
              </p>
              <p className="text-sm text-gray-600">
                {selectedScreenshot.email}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Admin Notes (optional):
            </label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about your decision"
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This action will award the prize to the selected user and
                  cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button  disabled={processingDecision} onClick={onSubmitDecision}>
            {processingDecision ? (
              <>
                <LoadingSpinner size={30} color="white" />
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
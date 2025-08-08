import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, ArrowLeftSquare, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { useMYUser } from "@/context/UserContext";
import { toast } from "sonner";

interface MatchHeaderProps {
  matchDetails: any;
  isUserCaptain: boolean;
  userTeam: any;
  navigate: any;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  matchDetails,
  isUserCaptain,
  userTeam,
  navigate,
}) => {
  const { processTeamPayment, cancelMatch, loadMatchDetails } = useTDMMatch();
  const { myUser } = useMYUser();
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);

  // Handle sharing match link
  const handleShareMatch = async () => {
    try {
      const shareableLink = `${window.location.origin}/tdm/match/${matchDetails?.id}`;
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Match link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing match link:", error);
      toast.error("Failed to copy match link");
    }
  };

  // Check if current user has paid
  const hasCurrentUserPaid = () => {
    if (!myUser || !userTeam?.members) return true;
    
    const currentUserMember = userTeam.members.find(
      (m: any) => m.user_id === myUser.id
    );
    
    return currentUserMember?.payment_status === 'completed';
  };

  const handleProcessPayment = async () => {
    if (matchDetails?.id && userTeam?.id && myUser) {
      setIsProcessingAction('payment');
      try {
        await processTeamPayment(matchDetails.id, userTeam.id);
        // Reload match details to get updated payment status
        await loadMatchDetails(matchDetails.id);
      } finally {
        setIsProcessingAction(null);
      }
    }
  };

  const handleCancelMatch = async () => {
    if (matchDetails?.id) {
      setIsProcessingAction('cancel');
      try {
        const result = await cancelMatch(matchDetails.id, "Cancelled by user");
        if (result) {
          // Only navigate if the cancellation was successful
          navigate("/tdm");
        } else {
          // If not successful, refresh the match details
          await loadMatchDetails(matchDetails.id);
        }
      } finally {
        setIsProcessingAction(null);
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "waiting":
        return "outline";
      case "team_a_ready":
      case "team_b_ready":
        return "outline";
      case "confirmed":
        return "default";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            className=" bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white"
            size="sm"
            onClick={() => navigate("/tdm/")}
            disabled={isProcessingAction !== null}
          >
            <ArrowLeftSquare />
            Back to Matches
          </Button>
          <Badge variant={getStatusBadgeVariant(matchDetails.status)} className="text-white">
            {formatStatus(matchDetails.status)}
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {matchDetails.game_name} Match
        </h1>
        <p className="text-[#EAFFA9]">
          Created{" "}
          {formatDistanceToNow(new Date(matchDetails.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Share Match Button */}
        <Button
          variant="outline"
          onClick={handleShareMatch}
          className="bg-black text-white border-[#BBF429] hover:bg-[#BBF429] hover:text-black"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Match
        </Button>

        {/* Conditional actions based on match status */}
        {matchDetails.status === "waiting" && isUserCaptain && userTeam && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isProcessingAction !== null}>
                Cancel Match
              </Button>
            </DialogTrigger>
            <DialogContent className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
              <DialogHeader>
                <DialogTitle>Cancel Match</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this match? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="default" disabled={isProcessingAction === 'cancel'}>
                    No, keep match
                  </Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleCancelMatch}
                  disabled={isProcessingAction === 'cancel'}
                >
                  {isProcessingAction === 'cancel' ? (
                    <div className="flex items-center">
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                      Cancelling...
                    </div>
                  ) : (
                    "Yes, cancel match"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Start Match button removed - Admin only functionality */}

        {!hasCurrentUserPaid() &&
          ["waiting", "team_a_ready", "team_b_ready"].includes(
            matchDetails.status
          ) && (
            <Button 
              onClick={handleProcessPayment}
              disabled={isProcessingAction !== null}
            >
              {isProcessingAction === 'payment' ? (
                <div className="flex items-center">
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                  Processing...
                </div>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Pay Entry Fee
                </>
              )}
            </Button>
          )}
      </div>
    </div>
  );
};

export default MatchHeader;

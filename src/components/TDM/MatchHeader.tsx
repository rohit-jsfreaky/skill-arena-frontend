import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftSquare, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface MatchHeaderProps {
  matchDetails: any;
  navigate: any;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  matchDetails,
  navigate,
}) => {

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

        {/* Cancel Match button removed - Users can no longer cancel matches */}
        {/* Start Match button removed - Admin only functionality */}
        {/* Payment processing moved to QuickActions component */}
      </div>
    </div>
  );
};

export default MatchHeader;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {Clock, Users, Coins, Info, GamepadIcon, Share2 } from "lucide-react";
import { formatDistanceToNowIST } from "@/utils/timeUtils";
import { TdmMatch } from "@/interface/tdmMatches";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserMatchesListProps {
  matches: TdmMatch[];
  isLoading: boolean;
  userId?: number;
}

export const UserMatchesList: React.FC<UserMatchesListProps> = ({
  matches,
  isLoading,
}) => {
  const navigate = useNavigate();

  // Handle sharing match link
  const handleShareMatch = async (match: TdmMatch) => {
    try {
      const shareableLink = `${window.location.origin}/tdm/match/${match.id}`;
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Match link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing match link:", error);
      toast.error("Failed to copy match link");
    }
  };

  // Status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "waiting":
        return "secondary";
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

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <Users className="w-12 h-12 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">No matches found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't joined any TDM matches yet.
        </p>
        <Button onClick={() => navigate("/tdm/")} variant="outline">
          Browse Available Matches
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {matches.map((match) => {
        // Get team size from match, default to 4 if not specified
        const teamSize = match?.team_size || 4;
        
        return (
          <Card
            key={match.id}
            className={`hover:shadow-md transition-shadow p-4 sm:p-6 border text-white ${
              match.status === 'cancelled' 
                ? 'bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500 opacity-75' 
                : 'bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429]'
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{match.game_name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(match.status)} 
                  className={match.status === 'cancelled' ? 'text-white' : 'text-[#BBF429]'}
                >
                  {formatStatus(match.status)}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1.5 text-[#EAFFA9]" >
                <Clock className="h-3.5 w-3.5 text-[#EAFFA9]" />
                {formatDistanceToNowIST(new Date(match.created_at), {
                  addSuffix: true,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {match.status === 'cancelled' && (
                <div className="bg-red-500/20 border border-red-500 p-3 rounded-md">
                  <p className="text-red-400 text-sm font-medium">
                    ⚠️ This match has been cancelled by an administrator
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <Coins size={16} />
                  <span>Entry Fee: {match.entry_fee} coins</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins size={16} className="text-green-500" />
                  <span>Prize: {match.prize_pool} coins</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <GamepadIcon size={16} />
                  <span>
                    {match.match_type === "public"
                      ? "Public Match"
                      : "Private Match"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span className="text-[#EAFFA9]">{teamSize}v{teamSize}</span>
                </div>
              </div>

              <div className="bg-secondary/30 p-2 rounded-md text-sm">
                <p className="font-medium">
                  Your Team: {match.team_a_name || match.team_b_name}
                </p>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                className="flex-1"
                onClick={() => navigate(`/tdm/match/${match.id}`)}
                disabled={match.status === 'cancelled'}
                variant={match.status === 'cancelled' ? 'secondary' : 'default'}
              >
                <Info className="mr-2 h-4 w-4" />
                {match.status === 'cancelled' ? 'Match Cancelled' : 'View Match Details'}
              </Button>
              
              {/* Share Button - Still allow sharing cancelled matches */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShareMatch(match)}
                title="Share Match"
                className={match.status === 'cancelled' 
                  ? 'border-red-500 text-red-400 hover:bg-red-500/10'
                  : 'border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black'
                }
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

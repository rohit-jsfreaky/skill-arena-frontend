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
import { Users, Coins, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TdmMatch } from "@/interface/tdmMatches";
import { useNavigate } from "react-router-dom";
import { useMYUser } from "@/context/UserContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PublicMatchesListProps {
  matches: TdmMatch[];
  isLoading: boolean;
}

export const PublicMatchesList: React.FC<PublicMatchesListProps> = ({
  matches,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { myUser } = useMYUser();

  // Check if user is already a member of a match
  const isUserInMatch = (match: TdmMatch) => {
    if (!myUser) return false;

    // If the match has member details, check directly
    if (match.team_a_members && Array.isArray(match.team_a_members)) {
      return match.team_a_members.some(
        (member) => member.user_id === myUser.id
      );
    }

    // Fallback to checking the match creator
    return match.created_by === myUser.id;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-6 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary/60 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-secondary/60 rounded w-full"></div>
              <div className="h-4 bg-secondary/60 rounded w-full"></div>
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-secondary/80 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium mb-2 text-white">
          No public matches available
        </h3>
        <p className="text-[#EAFFA9]">
          There are currently no public matches waiting for players. Try
          creating your own match!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {matches.map((match) => {
        const userIsInMatch = isUserInMatch(match);
        // Get team size from match details, default to 4 if not specified
        const teamSize = match?.team_size || 4;

        return (
          <Card
            key={match.id}
            className="hover:shadow-md transition-shadow p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{match.game_name}</CardTitle>
                <Badge variant="secondary">{match.match_type}</Badge>
              </div>
              <CardDescription className="text-[#EAFFA9]">
                Created{" "}
                {formatDistanceToNow(new Date(match.created_at), {
                  addSuffix: true,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
                  <Users size={16} />
                  <span>
                    Team A: {match.team_a_name} ({match.team_a_members}/{teamSize} players)
                  </span>
                </div>
                <span className="text-[#EAFFA9]">{teamSize}v{teamSize}</span>
              </div>

              <div className="bg-secondary/30 p-2 rounded-md text-sm">
                <p className="font-medium">
                  Status: {match.status.replace("_", " ")}
                </p>
                <p>Waiting for Team B to join</p>
              </div>
            </CardContent>
            <CardFooter>
              {userIsInMatch ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Button
                          className="w-full"
                          onClick={() => navigate(`/tdm/match/${match.id}`)}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          View Your Match
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You are already part of this match's Team A</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/tdm/join-match/${match.id}`)}
                >
                  Join as Team B
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

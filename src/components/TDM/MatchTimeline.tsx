import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, Clock, Flag, Shield, Trophy, Users } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface MatchTimelineProps {
  matchDetails: any;
}

const MatchTimeline: React.FC<MatchTimelineProps> = ({ matchDetails }) => {
  // Get team size from match details, default to 4 if not specified
  const teamSize = matchDetails?.team_size || 4;
  const totalPlayers = teamSize * 2; // Total players required for the match
  
  // Calculate completed steps based on match status
  const steps = [
    { 
      title: "Match Created", 
      description: `${teamSize}v${teamSize} ${matchDetails.game_name} match`, 
      done: true,
      icon: <Shield className="h-4 w-4 text-[#BBF429]" />,
      date: matchDetails.created_at,
    },
    { 
      title: "Teams Formed", 
      description: `Both teams have ${teamSize} players each`, 
      done: !!matchDetails.team_a?.members?.length && 
            matchDetails.team_a.members.length === teamSize &&
            !!matchDetails.team_b?.members?.length &&
            matchDetails.team_b.members.length === teamSize,
      icon: <Users className="h-4 w-4 text-[#BBF429]" />
    },
    { 
      title: "Payments Complete", 
      description: `All ${totalPlayers} players have paid the entry fee`, 
      done: ["confirmed", "in_progress", "completed"].includes(matchDetails.status),
      icon: <CheckCircle className="h-4 w-4 text-[#BBF429]" />
    },
    { 
      title: "Match In Progress", 
      description: "Game is being played now", 
      done: ["in_progress", "completed"].includes(matchDetails.status),
      icon: <Clock className="h-4 w-4 text-[#BBF429]" />,
      date: matchDetails.start_time,
    },
    { 
      title: "Results Submitted", 
      description: "Screenshots uploaded by captains", 
      done: !!matchDetails.team_a?.screenshot || !!matchDetails.team_b?.screenshot,
      icon: <Flag className="h-4 w-4 text-[#BBF429]" />
    },
    { 
      title: "Match Complete", 
      description: `Winner: ${matchDetails.status === "completed" ? 
        (matchDetails.winner_team_id === matchDetails.team_a?.id ? 
          matchDetails.team_a?.team_name : matchDetails.team_b?.team_name) : 
        "To be determined"}`, 
      done: matchDetails.status === "completed",
      icon: <Trophy className="h-4 w-4 text-[#BBF429]" />,
      date: matchDetails.end_time,
    }
  ];

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Match Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-[#BBF429]/30" />
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-10">
                {/* Timeline node */}
                <div className={`absolute left-0 top-0 flex items-center justify-center w-5 h-5 rounded-full ${
                  step.done ? 'bg-[#BBF429]' : 'bg-black border border-[#BBF429]/30'
                }`}>
                  {step.done && <CheckCircle2 className="h-3 w-3 text-black" />}
                </div>
                
                {/* Step content */}
                <div className={step.done ? 'opacity-100' : 'opacity-50'}>
                  <h4 className="text-sm font-medium">{step.title}</h4>
                  <p className="text-xs text-[#EAFFA9]">{step.description}</p>
                  {step.date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {format(parseISO(step.date), 'MMM d, h:mm a')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchTimeline;
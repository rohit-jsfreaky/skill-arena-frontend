import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Camera, Clock, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { formatToIST } from '@/utils/timeUtils';
import { Badge } from "@/components/ui/badge";

interface ScreenshotsTabProps {
  matchDetails: any;
}

// Helper function to render verification status badge
const VerificationStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'verified_win':
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Win Verified
        </Badge>
      );
    case 'verified_loss':
      return (
        <Badge className="bg-red-500 text-white">
          <XCircle className="mr-1 h-3 w-3" /> Loss Verified
        </Badge>
      );
    case 'disputed':
      return (
        <Badge className="bg-amber-500 text-black">
          <AlertTriangle className="mr-1 h-3 w-3" /> Disputed
        </Badge>
      );
    case 'admin_reviewed':
      return (
        <Badge className="bg-blue-500 text-white">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Admin Reviewed
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge className="bg-gray-500 text-white">
          <HelpCircle className="mr-1 h-3 w-3" /> Pending Verification
        </Badge>
      );
  }
};

const ScreenshotsTab: React.FC<ScreenshotsTabProps> = ({ matchDetails }) => {
  // Get team size (not directly used in this component but added for consistency)
  const teamSize = matchDetails?.team_size || 4;
  
  // Get the screenshots for both teams if available
  const teamAScreenshot = matchDetails?.team_a?.screenshot || null;
  const teamBScreenshot = matchDetails?.team_b?.screenshot || null;
  
  // Team names
  const teamAName = matchDetails?.team_a?.team_name || 'Team A';
  const teamBName = matchDetails?.team_b?.team_name || 'Team B';
  
  // Get upload timestamps if available
  const teamAUploadTime = teamAScreenshot?.upload_timestamp
    ? formatToIST(new Date(teamAScreenshot.upload_timestamp), 'PPp')
    : null;
  
  const teamBUploadTime = teamBScreenshot?.upload_timestamp
    ? formatToIST(new Date(teamBScreenshot.upload_timestamp), 'PPp')
    : null;
  
  // Find captains for both teams
  const teamACaptain = matchDetails?.team_a?.members?.find((member: any) => member.is_captain);
  const teamBCaptain = matchDetails?.team_b?.members?.find((member: any) => member.is_captain);

  if (!["in_progress", "completed", "disputed"].includes(matchDetails.status)) {
    return (
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Clock className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">Match Not Started</h3>
            <p className="text-muted-foreground">
              Screenshots will be available once the match is in progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!teamAScreenshot && !teamBScreenshot) {
    return (
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No Screenshots Yet</h3>
            <p className="text-muted-foreground">
              Team captains haven't uploaded any screenshots for this match yet.
            </p>
            <Alert className="mt-6 bg-[#BBF429]/10 border-[#BBF429]">
              <Clock className="h-4 w-4" />
              <AlertTitle>Waiting for Captains</AlertTitle>
              <AlertDescription>
                Team captains need to upload screenshots of the match results.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team A Screenshot */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {teamAName} Screenshot
            </span>
            {teamAScreenshot && teamAScreenshot.verification_status && (
              <VerificationStatusBadge status={teamAScreenshot.verification_status} />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamAScreenshot ? (
            <div className="space-y-3">
              <Alert 
                className={`${
                  teamAScreenshot.verification_status === 'disputed' 
                    ? 'bg-amber-500/10 border-amber-500' 
                    : teamAScreenshot.verification_status === 'verified_win'
                    ? 'bg-green-500/10 border-green-500'
                    : teamAScreenshot.verification_status === 'verified_loss'
                    ? 'bg-red-500/10 border-red-500'
                    : 'bg-gray-500/10 border-gray-500'
                }`}
              >
                {teamAScreenshot.verification_status === 'disputed' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : teamAScreenshot.verification_status === 'verified_win' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : teamAScreenshot.verification_status === 'verified_loss' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                )}
                <AlertTitle className={
                  teamAScreenshot.verification_status === 'disputed' 
                    ? 'text-amber-500' 
                    : teamAScreenshot.verification_status === 'verified_win'
                    ? 'text-green-500'
                    : teamAScreenshot.verification_status === 'verified_loss'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }>
                  {teamAScreenshot.verification_status === 'disputed' 
                    ? 'Screenshot Disputed' 
                    : teamAScreenshot.verification_status === 'verified_win'
                    ? 'Victory Verified'
                    : teamAScreenshot.verification_status === 'verified_loss'
                    ? 'Loss Verified'
                    : 'Screenshot Uploaded, Pending Verification'}
                </AlertTitle>
                <AlertDescription className={
                  teamAScreenshot.verification_status === 'disputed' 
                    ? 'text-amber-500/80' 
                    : teamAScreenshot.verification_status === 'verified_win'
                    ? 'text-green-500/80'
                    : teamAScreenshot.verification_status === 'verified_loss'
                    ? 'text-red-500/80'
                    : 'text-gray-500/80'
                }>
                  {teamAScreenshot.verification_status === 'disputed' 
                    ? 'This screenshot has been marked as disputed and requires admin review.' 
                    : `${teamACaptain?.username || "Team captain"} uploaded this screenshot${teamAUploadTime ? ` on ${teamAUploadTime}` : ''}.`}
                </AlertDescription>
              </Alert>
              <div className="bg-secondary/30 p-3 rounded-md">
                <img
                  src={teamAScreenshot.screenshot_path}
                  alt={`${teamAName} Screenshot`}
                  className="max-h-[400px] rounded-md object-contain mx-auto border border-[#BBF429]/30"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed border-[#BBF429]/30">
              <Camera className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No Screenshot</h3>
              <p className="text-muted-foreground">
                {teamAName} captain hasn't uploaded a screenshot yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team B Screenshot */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {teamBName} Screenshot
            </span>
            {teamBScreenshot && teamBScreenshot.verification_status && (
              <VerificationStatusBadge status={teamBScreenshot.verification_status} />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamBScreenshot ? (
            <div className="space-y-3">
              <Alert 
                className={`${
                  teamBScreenshot.verification_status === 'disputed' 
                    ? 'bg-amber-500/10 border-amber-500' 
                    : teamBScreenshot.verification_status === 'verified_win'
                    ? 'bg-green-500/10 border-green-500'
                    : teamBScreenshot.verification_status === 'verified_loss'
                    ? 'bg-red-500/10 border-red-500'
                    : 'bg-gray-500/10 border-gray-500'
                }`}
              >
                {teamBScreenshot.verification_status === 'disputed' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : teamBScreenshot.verification_status === 'verified_win' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : teamBScreenshot.verification_status === 'verified_loss' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                )}
                <AlertTitle className={
                  teamBScreenshot.verification_status === 'disputed' 
                    ? 'text-amber-500' 
                    : teamBScreenshot.verification_status === 'verified_win'
                    ? 'text-green-500'
                    : teamBScreenshot.verification_status === 'verified_loss'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }>
                  {teamBScreenshot.verification_status === 'disputed' 
                    ? 'Screenshot Disputed' 
                    : teamBScreenshot.verification_status === 'verified_win'
                    ? 'Victory Verified'
                    : teamBScreenshot.verification_status === 'verified_loss'
                    ? 'Loss Verified'
                    : 'Screenshot Uploaded, Pending Verification'}
                </AlertTitle>
                <AlertDescription className={
                  teamBScreenshot.verification_status === 'disputed' 
                    ? 'text-amber-500/80' 
                    : teamBScreenshot.verification_status === 'verified_win'
                    ? 'text-green-500/80'
                    : teamBScreenshot.verification_status === 'verified_loss'
                    ? 'text-red-500/80'
                    : 'text-gray-500/80'
                }>
                  {teamBScreenshot.verification_status === 'disputed' 
                    ? 'This screenshot has been marked as disputed and requires admin review.' 
                    : `${teamBCaptain?.username || "Team captain"} uploaded this screenshot${teamBUploadTime ? ` on ${teamBUploadTime}` : ''}.`}
                </AlertDescription>
              </Alert>
              <div className="bg-secondary/30 p-3 rounded-md">
                <img
                  src={teamBScreenshot.screenshot_path}
                  alt={`${teamBName} Screenshot`}
                  className="max-h-[400px] rounded-md object-contain mx-auto border border-[#BBF429]/30"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed border-[#BBF429]/30">
              <Camera className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No Screenshot</h3>
              <p className="text-muted-foreground">
                {teamBName} captain hasn't uploaded a screenshot yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status alert based on match state */}
      {matchDetails.status === "in_progress" && (
        <Alert className="bg-[#BBF429]/10 border-[#BBF429]">
          <Clock className="h-4 w-4" />
          <AlertTitle className='text-white'>Match In Progress</AlertTitle>
          <AlertDescription>
            Once both team captains have uploaded screenshots, admins will review and confirm the result.
          </AlertDescription>
        </Alert>
      )}

      {/* Special alert for disputed match */}
      {((teamAScreenshot && teamAScreenshot.verification_status === 'disputed') || 
         (teamBScreenshot && teamBScreenshot.verification_status === 'disputed')) && (
        <Alert className="bg-amber-500/10 border-amber-500">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">Match Disputed</AlertTitle>
          <AlertDescription className="text-amber-500/80">
            There's a dispute with the match results. Admins will review the screenshots and determine the winner.
          </AlertDescription>
        </Alert>
      )}

      {matchDetails.status === "completed" && (
        <Alert className="bg-green-500/10 border-green-500">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Match Completed</AlertTitle>
          <AlertDescription className="text-green-500/80">
            This match has been completed. Winner: {
              matchDetails.winner_team_id === matchDetails.team_a?.id 
                ? teamAName
                : teamBName
            }
          </AlertDescription>
        </Alert>
      )}  
    </div>
  );
};

export default ScreenshotsTab;
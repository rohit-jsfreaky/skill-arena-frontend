import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/FileUploader";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { useMYUser } from "@/context/UserContext";
import {
  Clock,
  Trophy,
  Upload,
  Flag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Camera,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActionsTabProps {
  matchDetails: any;
  isUserCaptain: boolean;
  userTeam: any;
  userTeamId: number | null;
  opponentTeam: any;
  opponentTeamId: number | null;
}

const ActionsTab: React.FC<ActionsTabProps> = ({
  matchDetails,
  isUserCaptain,
  userTeam,
  userTeamId,
  opponentTeam,
  opponentTeamId,
}) => {
  // Get team size from match details
  const teamSize = matchDetails?.team_size || 4;
  
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [disputeReason, setDisputeReason] = useState<string>("");
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { uploadMatchScreenshot, completeMatch, reportDispute, loadMatchDetails } = useTDMMatch();
  const { myUser } = useMYUser();

  const handleUploadScreenshot = async () => {
    if (!matchDetails?.id || !userTeamId || !screenshotUrl) return;
    
    setIsProcessing('upload');
    try {
      await uploadMatchScreenshot(matchDetails.id, userTeamId, screenshotUrl);
      // Reload match details to update UI with new screenshot
      await loadMatchDetails(matchDetails.id);
      setScreenshotUrl("");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCompleteMatch = async () => {
    if (!matchDetails?.id || !selectedWinner) return;
    
    setIsProcessing('complete');
    try {
      await completeMatch(matchDetails.id, selectedWinner);
      // Reload match details to update UI with completed status
      await loadMatchDetails(matchDetails.id);
      setSelectedWinner(null);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReportDispute = async () => {
    if (!matchDetails?.id || !opponentTeamId || !disputeReason) return;
    
    setIsProcessing('dispute');
    try {
      await reportDispute(matchDetails.id, opponentTeamId, disputeReason);
      // Reload match details to update UI with dispute status
      await loadMatchDetails(matchDetails.id);
      setDisputeReason("");
    } finally {
      setIsProcessing(null);
    }
  };

  // Get the screenshots for both teams if available
  const teamAScreenshot = matchDetails?.team_a?.screenshot?.screenshot_path || null;
  const teamBScreenshot = matchDetails?.team_b?.screenshot?.screenshot_path || null;

  // Find out which team the current user belongs to
  const isUserInTeamA = userTeam?.team_type === 'team_a';
  const userTeamScreenshot = isUserInTeamA ? teamAScreenshot : teamBScreenshot;
  const opponentTeamScreenshot = isUserInTeamA ? teamBScreenshot : teamAScreenshot;

  // Find captains for both teams
  const teamACaptain = matchDetails?.team_a?.members?.find((member: any) => member.is_captain);
  const teamBCaptain = matchDetails?.team_b?.members?.find((member: any) => member.is_captain);

  // Get team names
  const teamAName = matchDetails?.team_a?.team_name || 'Team A';
  const teamBName = matchDetails?.team_b?.team_name || 'Team B';

  return (
    <>
      {matchDetails.status === "in_progress" && isUserCaptain && (
        <>
          {/* Upload Screenshot */}
          <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Match Screenshot
              </CardTitle>
              <CardDescription className="text-[#EAFFA9]">
                As the team captain, upload a screenshot of the match result
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userTeamScreenshot ? (
                <div className="space-y-4">
                  <Alert className="bg-green-500/10 border-green-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500">Screenshot Uploaded</AlertTitle>
                    <AlertDescription className="text-green-500/80">
                      You have already uploaded a screenshot for this match.
                    </AlertDescription>
                  </Alert>
                  <div className="bg-secondary/30 p-3 rounded-md">
                    <p className="text-sm font-medium mb-2">Your submitted screenshot:</p>
                    <img
                      src={userTeamScreenshot}
                      alt="Match Screenshot"
                      className="max-h-[300px] rounded-md object-contain mx-auto border border-[#BBF429]/30"
                    />
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      You can upload a new screenshot to replace this one
                    </p>
                  </div>
                </div>
              ) : (
                <FileUploader
                  onFileSelect={(url) => setScreenshotUrl(url)}
                  value={screenshotUrl}
                  accept="image/*"
                  disabled={isProcessing === 'upload'}
                />
              )}
              {screenshotUrl && !userTeamScreenshot && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img
                    src={screenshotUrl}
                    alt="Match Screenshot"
                    className="max-h-[300px] rounded-md object-contain mx-auto border border-[#BBF429]/30"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUploadScreenshot}
                disabled={!screenshotUrl || isProcessing === 'upload'}
                className="w-full"
              >
                {isProcessing === 'upload' ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Uploading...
                  </span>
                ) : userTeamScreenshot ? (
                  "Update Screenshot"
                ) : (
                  "Upload Screenshot"
                )}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      {matchDetails.status === "in_progress" && !isUserCaptain && (
        <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Match Screenshots
            </CardTitle>
            <CardDescription className="text-[#EAFFA9]">
              Only team captains can upload match results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userTeamScreenshot ? (
              <div className="space-y-4">
                <Alert className="bg-green-500/10 border-green-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">Screenshot Uploaded</AlertTitle>
                  <AlertDescription className="text-green-500/80">
                    Your team captain has uploaded a screenshot for this match.
                  </AlertDescription>
                </Alert>
                <div className="bg-secondary/30 p-3 rounded-md">
                  <p className="text-sm font-medium mb-2">Your team's screenshot:</p>
                  <img
                    src={userTeamScreenshot}
                    alt="Team Screenshot"
                    className="max-h-[300px] rounded-md object-contain mx-auto border border-[#BBF429]/30"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed border-[#BBF429]/30">
                <Camera className="w-12 h-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">Waiting for captain</h3>
                <p className="text-muted-foreground">
                  {isUserInTeamA ? teamACaptain?.username : teamBCaptain?.username} (your team captain) 
                  needs to upload the match result screenshot.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Display opponent team's screenshot if available */}
      {matchDetails.status === "in_progress" && opponentTeamScreenshot && (
        <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#EAFFA9]" />
              Opponent's Screenshot
            </CardTitle>
            <CardDescription className="text-[#EAFFA9]">
              Screenshot uploaded by {isUserInTeamA ? teamBName : teamAName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 p-3 rounded-md">
              <p className="text-sm font-medium mb-2">Opponent's submitted screenshot:</p>
              <img
                src={opponentTeamScreenshot}
                alt="Opponent Screenshot"
                className="max-h-[300px] rounded-md object-contain mx-auto border border-[#BBF429]/30"
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Submitted by {isUserInTeamA ? teamBCaptain?.username : teamACaptain?.username}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {matchDetails.status === "in_progress" && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              Report a Dispute
            </CardTitle>
            <CardDescription className="text-[#EAFFA9]">
              Report a problem with the match or opponent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive" className="bg-red-500/10 border-red-500">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-500">Important Notice</AlertTitle>
                <AlertDescription className="text-red-500/80">
                  Only report disputes for serious issues like cheating or rule
                  violations. False reports may lead to account penalties.
                </AlertDescription>
              </Alert>
              <div>
                <label className="text-sm font-medium">Dispute Reason:</label>
                <Textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="mt-1 text-white bg-black border-[#BBF429]"
                  rows={4}
                  disabled={isProcessing === 'dispute'}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={handleReportDispute}
              disabled={!disputeReason || disputeReason.length < 20 || isProcessing === 'dispute'}
              className="w-full text-black"
            >
              {isProcessing === 'dispute' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Dispute"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {!["in_progress", "completed", "cancelled"].includes(
        matchDetails.status
      ) && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <Clock className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">Match Not Started</h3>
              <p className="text-muted-foreground">
                Additional actions will be available once the match is in
                progress.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {matchDetails.status === "completed" && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium mb-1">Match Completed</h3>
              <p className="text-muted-foreground mb-4">
                This match has been completed and the results are final.
              </p>
              
              {/* Show winner info */}
              <div className="bg-green-500/10 p-4 rounded-md border border-green-500 text-left w-full">
                <p className="font-medium text-green-500 mb-1">Winner:</p>
                <p className="text-white text-lg">
                  {matchDetails.winner_team_id === matchDetails.team_a?.id
                    ? matchDetails.team_a?.team_name
                    : matchDetails.team_b?.team_name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {matchDetails.end_time && 
                    `Completed ${formatDistanceToNow(new Date(matchDetails.end_time), { addSuffix: true })}`
                  }
                </p>
              </div>
              
              {/* Display final screenshots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
                {teamAScreenshot && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{teamAName} Screenshot:</p>
                    <img
                      src={teamAScreenshot}
                      alt={`${teamAName} Screenshot`}
                      className="rounded-md max-h-[200px] object-contain mx-auto border border-[#BBF429]/30"
                    />
                  </div>
                )}
                
                {teamBScreenshot && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{teamBName} Screenshot:</p>
                    <img
                      src={teamBScreenshot}
                      alt={`${teamBName} Screenshot`}
                      className="rounded-md max-h-[200px] object-contain mx-auto border border-[#BBF429]/30"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {matchDetails.status === "cancelled" && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="text-lg font-medium mb-1">Match Cancelled</h3>
              <p className="text-muted-foreground">
                This match has been cancelled and is no longer active.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ActionsTab;

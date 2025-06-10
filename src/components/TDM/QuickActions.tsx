import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUploader } from "@/components/FileUploader";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { Coins, Upload, Flag, AlertTriangle, Camera } from "lucide-react";

interface QuickActionsProps {
  matchDetails: any;
  isUserCaptain: boolean;
  userTeam: any;
  userTeamId: number | null;
  opponentTeamId: number | null;
  navigate: any;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  matchDetails,
  isUserCaptain,
  userTeam,
  userTeamId,
  opponentTeamId,
  navigate,
}) => {
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [disputeReason, setDisputeReason] = useState<string>("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  
  const {
    startMatch,
    processTeamPayment,
    uploadMatchScreenshot,
    reportDispute,
    loadMatchDetails,
  } = useTDMMatch();

  const handleStartMatch = async () => {
    if (matchDetails?.id) {
      setProcessing('start');
      try {
        await startMatch(matchDetails.id);
        await loadMatchDetails(matchDetails.id);
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleProcessPayment = async () => {
    if (matchDetails?.id && userTeamId) {
      setProcessing('payment');
      try {
        await processTeamPayment(matchDetails.id, userTeamId);
        await loadMatchDetails(matchDetails.id);
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleUploadScreenshot = async () => {
    if (matchDetails?.id && userTeamId && screenshotUrl) {
      setProcessing('screenshot');
      try {
        await uploadMatchScreenshot(matchDetails.id, userTeamId, screenshotUrl);
        setScreenshotUrl("");
        setScreenshotDialogOpen(false);
        await loadMatchDetails(matchDetails.id);
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleReportDispute = async () => {
    if (matchDetails?.id && opponentTeamId && disputeReason) {
      setProcessing('dispute');
      try {
        await reportDispute(matchDetails.id, opponentTeamId, disputeReason);
        setDisputeReason("");
        setDisputeDialogOpen(false);
        await loadMatchDetails(matchDetails.id);
      } finally {
        setProcessing(null);
      }
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!userTeam?.payment_completed &&
          ["waiting", "team_a_ready", "team_b_ready"].includes(
            matchDetails.status
          ) && (
            <Button 
              onClick={handleProcessPayment} 
              className="w-full"
              disabled={processing !== null}
            >
              {processing === 'payment' ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Processing...
                </span>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Pay Entry Fee
                </>
              )}
            </Button>
          )}

        {matchDetails.status === "confirmed" && isUserCaptain && (
          <Button 
            onClick={handleStartMatch} 
            className="w-full"
            disabled={processing !== null || !matchDetails.room_id}
          >
            {processing === 'start' ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Starting...
              </span>
            ) : !matchDetails.room_id ? (
              "Set Room Details First"
            ) : (
              "Start Match"
            )}
          </Button>
        )}

        {matchDetails.status === "in_progress" &&
          isUserCaptain && (
            <Dialog open={screenshotDialogOpen} onOpenChange={setScreenshotDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={processing !== null}>
                  <Upload className="mr-2 h-4 w-4" />
                  {userTeam?.screenshot
                    ? "Update Screenshot"
                    : "Upload Screenshot"}
                </Button>
              </DialogTrigger>
              <DialogContent className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Upload Match Screenshot
                  </DialogTitle>
                  <DialogDescription className="text-[#EAFFA9]">
                    Upload a screenshot of the match result
                  </DialogDescription>
                </DialogHeader>
                <FileUploader
                  onFileSelect={(url) => setScreenshotUrl(url)}
                  value={screenshotUrl}
                  accept="image/*"
                  disabled={processing === 'screenshot'}
                />
                {screenshotUrl && (
                  <div className="mt-4">
                    <img
                      src={screenshotUrl}
                      alt="Match Screenshot"
                      className="max-h-[300px] rounded-md object-contain mx-auto"
                    />
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button 
                      variant="outline"
                      disabled={processing === 'screenshot'}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleUploadScreenshot}
                    disabled={!screenshotUrl || processing === 'screenshot'}
                    className="bg-[#BBF429] text-black hover:bg-[#a3d925]"
                  >
                    {processing === 'screenshot' ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Uploading...
                      </span>
                    ) : userTeam?.screenshot ? (
                      "Update Screenshot"
                    ) : (
                      "Upload Screenshot"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

        {matchDetails.status === "in_progress" && !isUserCaptain && (
          <Alert className="bg-[#BBF429]/10 border-[#BBF429]">
            <Camera className="h-4 w-4 text-[#BBF429]" />
            <AlertTitle className="text-white">Screenshot Upload</AlertTitle>
            <AlertDescription className="text-[#EAFFA9]">
              Only the team captain can upload match result screenshots.
              {userTeam?.screenshot
                ? " Your captain has already uploaded a screenshot."
                : " Waiting for your captain to upload."}
            </AlertDescription>
          </Alert>
        )}

        {matchDetails.status === "waiting" && (
          <Button
            variant="secondary"
            onClick={() => navigate("/tdm")}
            className="w-full"
            disabled={processing !== null}
          >
            Browse Other Matches
          </Button>
        )}

        {matchDetails.status === "in_progress" && (
          <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full text-black"
                disabled={processing !== null}
              >
                <Flag className="mr-2 h-4 w-4 text-red-500" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Report a Dispute</DialogTitle>
                <DialogDescription className="text-[#EAFFA9]">
                  Report a problem with the match or opponent
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Notice</AlertTitle>
                  <AlertDescription>
                    Only report disputes for serious issues like cheating or
                    rule violations. False reports may lead to account
                    penalties.
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
                    disabled={processing === 'dispute'}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button 
                    variant="outline"
                    disabled={processing === 'dispute'}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleReportDispute}
                  disabled={!disputeReason || disputeReason.length < 20 || processing === 'dispute'}
                >
                  {processing === 'dispute' ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Dispute"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;

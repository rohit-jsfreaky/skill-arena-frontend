import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Clock, Clipboard, AlertCircle, Trophy, Users } from "lucide-react";
import { formatToIST } from "@/utils/timeUtils";
import { showSuccessToast } from "@/utils/toastUtils";
import { useTDMMatch } from "@/hooks/useTDMMatch";
import { Progress } from "@/components/ui/progress";
import { TdmMatchDetails } from "@/interface/tdmMatches";

interface MatchInfoTabProps {
  matchDetails: any;
  isMatchCreator: boolean;
  loadMatchDetails: (matchId: number) => Promise<TdmMatchDetails | null>;
}

const MatchInfoTab: React.FC<MatchInfoTabProps> = ({
  matchDetails,
  isMatchCreator,
  loadMatchDetails,
}) => {
  const { checkMatchReadiness, setRoomDetails } = useTDMMatch();
  // Get team size from match details, default to 4 if not specified 
  const teamSize = matchDetails?.team_size || 4;
  const totalPlayers = teamSize * 2; // Total players across both teams

  const [readinessInfo, setReadinessInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [roomId, setRoomId] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [settingRoom, setSettingRoom] = useState(false);

  useEffect(() => {
    const fetchReadiness = async () => {
      if (
        matchDetails?.id &&
        ["waiting", "team_a_ready", "team_b_ready"].includes(
          matchDetails.status
        )
      ) {
        setLoading(true);
        const info = await checkMatchReadiness(matchDetails.id);
        if (info) {
          setReadinessInfo(info);
        }
        setLoading(false);
      }
    };

    fetchReadiness();
  }, [matchDetails?.id, matchDetails?.status, checkMatchReadiness]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccessToast("Copied to clipboard!");
  };

  const handleSetRoomDetails = async () => {
    if (!roomId || !roomPassword) {
      return;
    }

    setSettingRoom(true);
    try {
      await setRoomDetails(matchDetails.id, roomId, roomPassword);
      loadMatchDetails(matchDetails.id);
    } finally {
      setSettingRoom(false);
    }
  };

  return (
    <>
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
        <CardHeader>
          <CardTitle>Match Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Match Type</p>
              <p className="font-medium">
                {matchDetails.match_type.charAt(0).toUpperCase() +
                  matchDetails.match_type.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Game</p>
              <p className="font-medium">{matchDetails.game_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entry Fee</p>
              <p className="font-medium">
                {matchDetails.entry_fee} coins per player
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prize Pool</p>
              <p className="font-medium text-green-500">
                {matchDetails.prize_pool} coins
              </p>
            </div>
            {/* Add Team Size info */}
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="font-medium">
                {teamSize}v{teamSize}
              </p>
            </div>
          </div>

          {["waiting", "team_a_ready", "team_b_ready"].includes(
            matchDetails.status
          ) &&
            readinessInfo && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium mb-1">Match Readiness</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Players:</span>
                        <span
                          className={
                            readinessInfo.total_players === totalPlayers
                              ? "text-green-500"
                              : "text-yellow-500"
                          }
                        >
                          {readinessInfo.total_players}/{totalPlayers}
                        </span>
                      </div>
                      <Progress
                        value={(readinessInfo.total_players / totalPlayers) * 100}
                        className="h-2 bg-secondary/30"
                        indicatorClassName={
                          readinessInfo.total_players === totalPlayers
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Paid Players:</span>
                        <span
                          className={
                            readinessInfo.total_paid === totalPlayers
                              ? "text-green-500"
                              : "text-yellow-500"
                          }
                        >
                          {readinessInfo.total_paid}/{totalPlayers}
                        </span>
                      </div>
                      <Progress
                        value={(readinessInfo.total_paid / totalPlayers) * 100}
                        className="h-2 bg-secondary/30"
                        indicatorClassName={
                          readinessInfo.total_paid === totalPlayers
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-secondary/20 p-2 rounded border border-[#BBF429]/30">
                        <p className="text-xs text-[#EAFFA9] mb-1">Team A</p>
                        <div className="flex justify-between text-sm">
                          <span>Players:</span>
                          <span
                            className={
                              readinessInfo.team_a_players === teamSize
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {readinessInfo.team_a_players}/{teamSize}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Paid:</span>
                          <span
                            className={
                              readinessInfo.team_a_paid === teamSize
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {readinessInfo.team_a_paid}/{teamSize}
                          </span>
                        </div>
                      </div>

                      <div className="bg-secondary/20 p-2 rounded border border-[#BBF429]/30">
                        <p className="text-xs text-[#EAFFA9] mb-1">Team B</p>
                        <div className="flex justify-between text-sm">
                          <span>Players:</span>
                          <span
                            className={
                              readinessInfo.team_b_players === teamSize
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {readinessInfo.team_b_players}/{teamSize}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Paid:</span>
                          <span
                            className={
                              readinessInfo.team_b_paid === teamSize
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {readinessInfo.team_b_paid}/{teamSize}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!readinessInfo.can_be_confirmed && (
                      <Alert
                        variant="default"
                        className="bg-yellow-500/10 border-yellow-500"
                      >
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <AlertTitle className="text-yellow-500">
                          Waiting for more players
                        </AlertTitle>
                        <AlertDescription className="text-yellow-500/80">
                          {readinessInfo.reason}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </>
            )}

          {matchDetails.status === "confirmed" && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Room Details</h3>

                {isMatchCreator && !matchDetails.room_id && (
                  <div className="space-y-3 bg-[#BBF429]/10 p-4 rounded-md border border-[#BBF429]/30">
                    <Alert className="bg-black border-[#BBF429]">
                      <AlertTitle className="text-white">
                        Set Room Details
                      </AlertTitle>
                      <AlertDescription className="text-[#EAFFA9]">
                        As the match creator, you need to set up the room
                        details so players can join.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="room-id">Room ID</Label>
                      <Input
                        id="room-id"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room ID"
                        className="bg-black border-[#BBF429] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="room-password">Room Password</Label>
                      <Input
                        id="room-password"
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                        placeholder="Enter room password"
                        className="bg-black border-[#BBF429] text-white"
                      />
                    </div>

                    <Button
                      onClick={handleSetRoomDetails}
                      disabled={!roomId || !roomPassword || settingRoom}
                      className="w-full"
                    >
                      {settingRoom ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Setting Room Details...
                        </span>
                      ) : (
                        "Set Room Details"
                      )}
                    </Button>
                  </div>
                )}

                {!isMatchCreator && !matchDetails.room_id && (
                  <div className="bg-secondary/30 p-3 rounded-md">
                    <p className="text-sm text-center">
                      Waiting for the match creator to set up room details...
                    </p>
                  </div>
                )}

                {matchDetails.room_id && (
                  <div className="bg-secondary/30 p-3 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Room ID:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-black p-1 rounded text-white">
                          {matchDetails.room_id}
                        </span>
                        <Button
                          variant="link"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(matchDetails.room_id || "")
                          }
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Password:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-black p-1 rounded text-white">
                          {matchDetails.room_password}
                        </span>
                        <Button
                          variant="link"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(matchDetails.room_password || "")
                          }
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {matchDetails.status === "completed" &&
            matchDetails.winner_team_id && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1 flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Match Result
                  </h3>
                  <div className="bg-secondary/30 p-3 rounded-md">
                    <p className="font-medium">
                      Winner:{" "}
                      {matchDetails.winner_team_id === matchDetails.team_a?.id
                        ? matchDetails.team_a?.team_name
                        : matchDetails.team_b?.team_name}
                    </p>
                    {matchDetails.end_time && (
                      <p className="text-sm text-muted-foreground">
                        Completed on{" "}
                        {formatToIST(new Date(matchDetails.end_time), "PPP")}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>

      {matchDetails.status === "waiting" && (
        <Alert className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <Users className="h-4 w-4" />
          <AlertTitle>{totalPlayers} Players Required</AlertTitle>
          <AlertDescription>
            This match requires {totalPlayers} players total ({teamSize} per team) before it can be
            confirmed.
            {readinessInfo &&
              ` Currently ${readinessInfo.total_players}/${totalPlayers} players have joined.`}
          </AlertDescription>
        </Alert>
      )}

      {["team_a_ready", "team_b_ready"].includes(matchDetails.status) && (
        <Alert className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <Clock className="h-4 w-4" />
          <AlertTitle>Waiting for all players</AlertTitle>
          <AlertDescription>
            {matchDetails.status === "team_a_ready"
              ? "Team A members have completed payment. Waiting for Team B members to pay and more players to join."
              : "Team B members have completed payment. Waiting for Team A members to pay and more players to join."}
          </AlertDescription>
        </Alert>
      )}

      {matchDetails.status === "in_progress" && (
        <Alert className="p-4 sm:p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Match in progress</AlertTitle>
          <AlertDescription>
            The match is ongoing. After the match, captains can submit the
            result.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default MatchInfoTab;

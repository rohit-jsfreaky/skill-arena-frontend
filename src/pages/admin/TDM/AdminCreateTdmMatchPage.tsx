import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Share, Copy, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { createTdmMatch, generatePrivateMatchLink } from "@/api/admin/tdm";
import { toast } from "sonner";

interface MatchData {
  match_id: number;
  match_type: string;
  game_name: string;
  entry_fee: number;
  team_size: number;
}

const AdminCreateTdmMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createdMatch, setCreatedMatch] = useState<MatchData | null>(null);
  const [shareableLink, setShareableLink] = useState<string>("");
  const [linkCopied, setLinkCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    match_type: "public" as "public" | "private",
    game_name: "",
    entry_fee: 0,
    team_size: 4,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateMatch = async () => {
    try {
      if (!formData.game_name || formData.entry_fee <= 0) {
        toast.error("Please fill in all required fields");
        return;
      }

      setLoading(true);
      const response = await createTdmMatch(formData);
      
      if (response.success) {
        setCreatedMatch(response.data);
        toast.success("TDM match created successfully!");
        
        // If it's a private match, automatically generate the shareable link
        if (formData.match_type === "private") {
          await generateLink(response.data.match_id);
        }
      } else {
        toast.error(response.message || "Failed to create match");
      }
    } catch (error: unknown) {
      console.error("Error creating match:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create match";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async (matchId: number) => {
    try {
      const response = await generatePrivateMatchLink(matchId);
      if (response.success) {
        setShareableLink(response.data.shareable_link);
        toast.success("Shareable link generated!");
      } else {
        toast.error("Failed to generate shareable link");
      }
    } catch (error: unknown) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate shareable link");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy link");
    }
  };

  const resetForm = () => {
    setFormData({
      match_type: "public",
      game_name: "",
      entry_fee: 0,
      team_size: 4,
    });
    setCreatedMatch(null);
    setShareableLink("");
    setLinkCopied(false);
  };

  return (
    <div className="w-full py-8 px-4 md:px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9 bg-[#BBF429] text-black hover:bg-[#a0d424]"
            onClick={() => navigate("/admin/tdm/matches")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white">
              Create TDM Match
            </h1>
            <p className="text-[#EAFFA9] mt-1">
              Create public or private team deathmatch battles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Match Form */}
          <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
            <CardHeader>
              <CardTitle className="text-xl text-[#BBF429]">Match Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Match Type */}
              <div className="space-y-2">
                <Label htmlFor="match_type" className="text-white">
                  Match Type
                </Label>
                <Select
                  value={formData.match_type}
                  onValueChange={(value: "public" | "private") => 
                    handleInputChange("match_type", value)
                  }
                >
                  <SelectTrigger className="bg-black border-[#BBF429] text-white">
                    <SelectValue placeholder="Select match type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Match</SelectItem>
                    <SelectItem value="private">Private Match</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400">
                  {formData.match_type === "public" 
                    ? "Visible to all users in the TDM page"
                    : "Only accessible via shareable link"}
                </p>
              </div>

              {/* Game Name */}
              <div className="space-y-2">
                <Label htmlFor="game_name" className="text-white">
                  Game Name *
                </Label>
                <Input
                  id="game_name"
                  type="text"
                  placeholder="e.g., BGMI, Free Fire, Call of Duty"
                  value={formData.game_name}
                  onChange={(e) => handleInputChange("game_name", e.target.value)}
                  className="bg-black border-[#BBF429] text-white placeholder:text-gray-400"
                />
              </div>

              {/* Entry Fee */}
              <div className="space-y-2">
                <Label htmlFor="entry_fee" className="text-white">
                  Entry Fee (₹) *
                </Label>
                <Input
                  id="entry_fee"
                  type="number"
                  placeholder="50"
                  min="0"
                  value={formData.entry_fee}
                  onChange={(e) => handleInputChange("entry_fee", Number(e.target.value))}
                  className="bg-black border-[#BBF429] text-white placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-400">
                  Total Prize Pool: ₹{formData.entry_fee * 2 * formData.team_size}
                </p>
              </div>

              {/* Team Size */}
              <div className="space-y-2">
                <Label htmlFor="team_size" className="text-white">
                  Team Size
                </Label>
                <Select
                  value={formData.team_size.toString()}
                  onValueChange={(value) => handleInputChange("team_size", Number(value))}
                >
                  <SelectTrigger className="bg-black border-[#BBF429] text-white">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4v4</SelectItem>
                    <SelectItem value="6">6v6</SelectItem>
                    <SelectItem value="8">8v8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateMatch}
                  disabled={loading}
                  className="flex-1 bg-[#BBF429] text-black hover:bg-[#a0d424] font-semibold"
                >
                  {loading ? "Creating..." : "Create Match"}
                </Button>
                <Button
                  onClick={resetForm}
                  // variant="outline"
                  className="flex-1 border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Match Created Success / Private Link */}
          {createdMatch && (
            <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-green-500 text-white">
              <CardHeader>
                <CardTitle className="text-xl text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Match Created Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Match ID</Label>
                  <div className="p-3 bg-black border border-green-500 rounded">
                    <code className="text-green-400">#{createdMatch.match_id}</code>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Match Type</Label>
                  <div className="p-3 bg-black border border-green-500 rounded">
                    <span className="text-green-400 capitalize">{formData.match_type}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Game</Label>
                  <div className="p-3 bg-black border border-green-500 rounded">
                    <span className="text-green-400">{formData.game_name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Entry Fee</Label>
                  <div className="p-3 bg-black border border-green-500 rounded">
                    <span className="text-green-400">₹{formData.entry_fee} per player</span>
                  </div>
                </div>

                {/* Private Match Link */}
                {formData.match_type === "private" && shareableLink && (
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Share className="h-4 w-4" />
                      Shareable Link
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={shareableLink}
                        readOnly
                        className="bg-black border-[#BBF429] text-white"
                      />
                      <Button
                        onClick={copyToClipboard}
                        size="icon"
                        className={`${
                          linkCopied 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-[#BBF429] hover:bg-[#a0d424]"
                        } text-black`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400">
                      Share this link with teams to allow them to join the private match
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => navigate(`/admin/tdm/matches/${createdMatch.match_id}`)}
                    className="flex-1 bg-[#BBF429] text-black hover:bg-[#a0d424]"
                  >
                    View Match Details
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black"
                  >
                    Create Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          {!createdMatch && (
            <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
              <CardHeader>
                <CardTitle className="text-xl text-[#BBF429]">Match Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Public Matches</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Visible to all users on the TDM page</li>
                    <li>• Users can join directly</li>
                    <li>• Great for open competitions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-2">Private Matches</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Only accessible via shareable link</li>
                    <li>• Perfect for invited tournaments</li>
                    <li>• You can control who participates</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-600">
                  <h3 className="font-semibold text-white mb-2">Prize Pool Calculation</h3>
                  <p className="text-sm text-gray-300">
                    Prize Pool = Entry Fee × 2 Teams × Team Size
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Example: ₹50 × 2 × 4 = ₹400 total prize pool
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateTdmMatchPage;

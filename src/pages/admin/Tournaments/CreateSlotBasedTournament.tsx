import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "@/components/Tournaments/BackArrow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSlotBasedTournament } from "@/api/tournament";
import { SlotBasedTournamentFormData } from "@/interface/tournament";
import { Crown, Users, Trophy, Gamepad2, Calendar, DollarSign, Image, Clock } from "lucide-react";

const CreateSlotBasedTournament: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState<SlotBasedTournamentFormData>({
    name: '',
    game_name: '',
    description: '',
    image: '',
    tournament_mode: 'solo',
    max_groups: 10,
    entry_fee_normal: 10,
    entry_fee_pro: 5,
    prize_pool: 100,
    start_time: '',
    end_time: '',
    rules: '',
    youtube_live_url: '',
  });

  const handleInputChange = (field: keyof SlotBasedTournamentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMaxParticipants = () => {
    const slotsPerGroup = {
      'solo': 1,
      'duo': 2,
      '4v4': 4,
      '6v6': 6,
      '8v8': 8
    }[formData.tournament_mode];
    return formData.max_groups * slotsPerGroup;
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'solo': return <Crown className="w-4 h-4" />;
      case 'duo': return <Users className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.game_name || !formData.description || 
        !formData.image || !formData.start_time || !formData.end_time || 
        !formData.rules) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await createSlotBasedTournament(formData);
      
      if (response.success) {
        setSuccess('Slot-based tournament created successfully!');
        setTimeout(() => {
          navigate('/admin/tournaments');
        }, 2000);
      } else {
        setError(response.message || 'Failed to create tournament');
      }
    } catch (err) {
      console.error('Error creating tournament:', err);
      setError('Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#BBF429] mb-2">
              Create Slot-Based Tournament
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Create a tournament with group-based slots and modes
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/tournaments")}
            className="w-full sm:w-auto text-white hover:text-[#BBF429] transition-colors duration-200 ease-in-out flex items-center justify-center sm:justify-start gap-2 bg-black/40 px-4 py-2 rounded-lg border border-[#BBF429]/20"
          >
            <BackArrow />
            <span className="text-sm sm:text-base">Back to Tournaments</span>
          </button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 text-green-700">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament Info Card */}
          <Card className="bg-black/50 border-[#BBF429]/20">
            <CardHeader>
              <CardTitle className="text-[#BBF429] flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Tournament Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Tournament Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter tournament name"
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="game_name" className="text-white">Game Name *</Label>
                  <Input
                    id="game_name"
                    value={formData.game_name}
                    onChange={(e) => handleInputChange('game_name', e.target.value)}
                    placeholder="Enter game name"
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter tournament description"
                  className="bg-black/50 border-[#BBF429]/30 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-white flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Image URL *
                </Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="Enter image URL"
                  className="bg-black/50 border-[#BBF429]/30 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules" className="text-white">Rules *</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  placeholder="Enter tournament rules"
                  className="bg-black/50 border-[#BBF429]/30 text-white"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_live_url" className="text-white">YouTube Live URL</Label>
                <Input
                  id="youtube_live_url"
                  value={formData.youtube_live_url}
                  onChange={(e) => handleInputChange('youtube_live_url', e.target.value)}
                  placeholder="Enter YouTube live stream URL (optional)"
                  className="bg-black/50 border-[#BBF429]/30 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tournament Mode & Groups Card */}
          <Card className="bg-black/50 border-[#BBF429]/20">
            <CardHeader>
              <CardTitle className="text-[#BBF429] flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Tournament Mode & Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Tournament Mode *</Label>
                  <Select
                    value={formData.tournament_mode}
                    onValueChange={(value: "solo" | "duo" | "4v4" | "6v6" | "8v8") => handleInputChange('tournament_mode', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-[#BBF429]/30 text-white">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {getModeIcon(formData.tournament_mode)}
                          {formData.tournament_mode.toUpperCase()}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Solo (1 player per group)
                        </div>
                      </SelectItem>
                      <SelectItem value="duo">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Duo (2 players per group)
                        </div>
                      </SelectItem>
                      <SelectItem value="4v4">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          4v4 (4 players per group)
                        </div>
                      </SelectItem>
                      <SelectItem value="6v6">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          6v6 (6 players per group)
                        </div>
                      </SelectItem>
                      <SelectItem value="8v8">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          8v8 (8 players per group)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_groups" className="text-white">Number of Groups *</Label>
                  <Input
                    id="max_groups"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.max_groups}
                    onChange={(e) => handleInputChange('max_groups', parseInt(e.target.value) || 1)}
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
              </div>

              <div className="bg-[#BBF429]/10 border border-[#BBF429]/30 rounded-lg p-4">
                <h4 className="text-[#BBF429] font-medium mb-2">Tournament Summary:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    <span>Mode: {formData.tournament_mode.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Trophy className="w-4 h-4" />
                    <span>Groups: {formData.max_groups}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Crown className="w-4 h-4" />
                    <span>Max Players: {calculateMaxParticipants()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fees & Prize Card */}
          <Card className="bg-black/50 border-[#BBF429]/20">
            <CardHeader>
              <CardTitle className="text-[#BBF429] flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Entry Fees & Prize Pool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entry_fee_normal" className="text-white">Normal Entry Fee (₹) *</Label>
                  <Input
                    id="entry_fee_normal"
                    type="number"
                    min="0"
                    value={formData.entry_fee_normal}
                    onChange={(e) => handleInputChange('entry_fee_normal', parseFloat(e.target.value) || 0)}
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry_fee_pro" className="text-white">Pro Entry Fee (₹) *</Label>
                  <Input
                    id="entry_fee_pro"
                    type="number"
                    min="0"
                    value={formData.entry_fee_pro}
                    onChange={(e) => handleInputChange('entry_fee_pro', parseFloat(e.target.value) || 0)}
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prize_pool" className="text-white">Prize Pool (₹) *</Label>
                  <Input
                    id="prize_pool"
                    type="number"
                    min="0"
                    value={formData.prize_pool}
                    onChange={(e) => handleInputChange('prize_pool', parseFloat(e.target.value) || 0)}
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card className="bg-black/50 border-[#BBF429]/20">
            <CardHeader>
              <CardTitle className="text-[#BBF429] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tournament Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time" className="text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Start Time *
                  </Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    min={minDateTime}
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time" className="text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    End Time *
                  </Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    min={formData.start_time || minDateTime}
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    className="bg-black/50 border-[#BBF429]/30 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="fixed bottom-0 left-0 right-0 md:sticky bg-black/80 backdrop-blur-sm border-t md:border border-[#BBF429]/20 p-4 md:rounded-lg z-50">
            <div className="container mx-auto flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 max-w-screen-2xl">
              <Button
                variant="default"
                type="button"
                onClick={() => navigate("/admin/tournaments")}
                className="w-full sm:w-auto px-6 py-2 hover:bg-white/10 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-6 py-2 order-1 sm:order-2 ${
                  loading
                    ? "bg-[#BBF429]/50 cursor-not-allowed"
                    : "bg-[#BBF429] hover:bg-[#BBF429]/80"
                } text-black font-medium transition-colors duration-200`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                    <span>Creating Tournament...</span>
                  </div>
                ) : (
                  "Create Slot-Based Tournament"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSlotBasedTournament;

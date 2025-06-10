import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Membership } from "@/api/admin/membership";
import { MembershipFormData } from "@/pages/admin/Membership/useAdminMembership";
import { X, Plus } from "lucide-react";
import { Game } from "@/api/admin/games";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface MembershipFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MembershipFormData) => Promise<void>;
  membership: Membership | null;
  processing: boolean;
  games: Game[];
  gamesLoading: boolean;
}

const MembershipForm: React.FC<MembershipFormProps> = ({
  open,
  onClose,
  onSubmit,
  membership,
  processing,
  games,
  gamesLoading,
}) => {
  const [formData, setFormData] = useState<MembershipFormData>({
    name: "",
    price: 0,
    duration: "",
    benefits: [""],
    gameIds: [],
  });

  const [isPermanent, setIsPermanent] = useState(false);

  useEffect(() => {
    if (membership) {
      setFormData({
        id: membership.id,
        name: membership.name,
        price: membership.price,
        duration: membership.duration || "",
        benefits: membership.benefits || [""],
        gameIds: membership.games?.map(game => game.id) || [],
      });
      setIsPermanent(!membership.duration);
    } else {
      setFormData({
        name: "",
        price: 0,
        duration: "30 days",
        benefits: [""],
        gameIds: [],
      });
      setIsPermanent(false);
    }
  }, [membership]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index] = value;
    setFormData((prev) => ({ ...prev, benefits: updatedBenefits }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const removeBenefit = (index: number) => {
    if (formData.benefits.length === 1) return;

    const updatedBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, benefits: updatedBenefits }));
  };

  const toggleGameSelection = (gameId: number) => {
    setFormData(prev => {
      const currentIds = prev.gameIds || [];
      if (currentIds.includes(gameId)) {
        return { ...prev, gameIds: currentIds.filter(id => id !== gameId) };
      } else {
        return { ...prev, gameIds: [...currentIds, gameId] };
      }
    });
  };

  const handlePermanentToggle = () => {
    setIsPermanent(!isPermanent);
    if (!isPermanent) {
      // If toggling to permanent, set duration to null
      setFormData(prev => ({ ...prev, duration: "" }));
    } else {
      // If toggling to limited time, set default duration
      setFormData(prev => ({ ...prev, duration: "30 days" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty benefits
    const filteredBenefits = formData.benefits.filter(
      (benefit) => benefit.trim() !== ""
    );

    // If permanent, pass null as duration
    const submissionData = {
      ...formData,
      duration: isPermanent ? null : formData.duration,
      benefits: filteredBenefits,
    };

    onSubmit(submissionData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] text-white border-[#BBF429]/30 sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {membership ? "Edit Membership" : "Create Membership"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="name">Membership Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Premium Membership"
              required
              className="bg-black/50 text-white border-[#BBF429]/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (INR)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="999"
              required
              min="0"
              step="1"
              className="bg-black/50 text-white border-[#BBF429]/30"
            />
          </div>

          {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="permanent">Permanent Membership</Label>
              <Switch 
                id="permanent"
                checked={isPermanent} 
                onCheckedChange={handlePermanentToggle}
              />
            </div>
            <p className="text-xs text-gray-400">
              {isPermanent ? "This membership never expires" : "This membership expires after the specified duration"}
            </p>
          </div> */}

          {!isPermanent && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    id="duration-type"
                    name="duration-type"
                    value={
                      typeof formData.duration === "string"
                        ? formData.duration.includes("days")
                          ? "days"
                          : formData.duration.includes("months")
                          ? "months"
                          : "years"
                        : "days"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      let numericValue = "30"; // Default value

                      // Extract numeric value based on what type formData.duration is
                      if (typeof formData.duration === "string") {
                        numericValue =
                          formData.duration.match(/\d+/)?.[0] || "30";
                      } else if (typeof formData.duration === "object") {
                        numericValue = String(
                          formData.duration.days ||
                            formData.duration.months ||
                            formData.duration.years ||
                            30
                        );
                      }

                      setFormData((prev) => ({
                        ...prev,
                        duration: `${numericValue} ${value}`,
                      }));
                    }}
                    className="w-full p-2 rounded-md bg-black/50 text-white border border-[#BBF429]/30"
                    disabled={isPermanent}
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
                <div>
                  <Input
                    id="duration-value"
                    type="number"
                    min="1"
                    value={
                      typeof formData.duration === "string"
                        ? formData.duration.match(/\d+/)?.[0] || "30"
                        : typeof formData.duration === "object"
                        ? String(
                            formData.duration.days ||
                              formData.duration.months ||
                              formData.duration.years ||
                              30
                          )
                        : "30"
                    }
                    onChange={(e) => {
                      const numValue = e.target.value;
                      let type = "days"; // Default type

                      // Determine the current type from formData.duration
                      if (typeof formData.duration === "string") {
                        if (formData.duration.includes("days")) type = "days";
                        else if (formData.duration.includes("months"))
                          type = "months";
                        else if (formData.duration.includes("years"))
                          type = "years";
                      } else if (typeof formData.duration === "object") {
                        if (formData.duration.days) type = "days";
                        else if (formData.duration.months) type = "months";
                        else if (formData.duration.years) type = "years";
                      }

                      setFormData((prev) => ({
                        ...prev,
                        duration: `${numValue} ${type}`,
                      }));
                    }}
                    className="bg-black/50 text-white border-[#BBF429]/30"
                    disabled={isPermanent}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Benefits</Label>
            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder="Enter a benefit"
                    className="bg-black/50 text-white border-[#BBF429]/30 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeBenefit(index)}
                    disabled={formData.benefits.length === 1}
                    className="h-10 w-10 border-[#BBF429]/30 text-red-500"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addBenefit}
                className="w-full mt-2 border-dashed border-[#BBF429]/30 hover:bg-[#BBF429]/10"
              >
                <Plus size={16} className="mr-2" /> Add Benefit
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Included Games</Label>
            {gamesLoading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#BBF429]"></div>
              </div>
            ) : games.length === 0 ? (
              <div className="p-4 bg-black/30 rounded-md text-center">
                No games available
              </div>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto p-2 bg-black/30 rounded-md">
                {games.map((game) => (
                  <div key={game.id} className="flex items-center space-x-2 p-2 hover:bg-black/50 rounded">
                    <Checkbox
                      id={`game-${game.id}`}
                      checked={formData.gameIds?.includes(game.id) || false}
                      onCheckedChange={() => toggleGameSelection(game.id)}
                      className="border-[#BBF429]/50"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`game-${game.id}`}
                        className="text-sm cursor-pointer flex items-center"
                      >
                        {game.image && (
                          <img 
                            src={game.image} 
                            alt={game.name} 
                            className="h-6 w-6 object-cover rounded mr-2"
                          />
                        )}
                        <span>{game.name}</span>
                        {game.status !== 'active' && (
                          <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                            {game.status}
                          </span>
                        )}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="default"
              onClick={onClose}
              disabled={processing}
              className="border-gray-500 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-[#BBF429] text-black hover:bg-[#BBF429]/90"
            >
              {processing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Processing...
                </div>
              ) : membership ? (
                "Update Membership"
              ) : (
                "Create Membership"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipForm;

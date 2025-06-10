import { useState } from "react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Ban duration options
export const BAN_DURATIONS = [
  { value: "24h", label: "24 Hours" },
  { value: "3d", label: "3 Days" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "permanent", label: "Permanent" },
];

type BanUserModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  banUser: (duration: string, reason: string) => void;
  loading: boolean;
  isCurrentlyBanned: boolean;
  userName: string;
};

const BanUserModal = ({
  open,
  setOpen,
  banUser,
  loading,
  isCurrentlyBanned,
  userName,
}: BanUserModalProps) => {
  const [duration, setDuration] = useState<string>("24h");
  const [reason, setReason] = useState<string>("");

  const handleSubmit = () => {
    banUser(duration, reason);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-r from-black to-[#1A1A1A] text-white border border-[#BBF429]">
        <DialogHeader>
          <DialogTitle className="text-[#BBF429]">
            {isCurrentlyBanned ? "Unban User" : "Ban User"}
          </DialogTitle>
          <DialogDescription>
            {isCurrentlyBanned 
              ? `Are you sure you want to unban ${userName}?`
              : `This will prevent ${userName} from accessing the platform for the selected period.`}
          </DialogDescription>
        </DialogHeader>
        
        {!isCurrentlyBanned && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ban-duration">Ban Duration</Label>
              <Select 
                value={duration} 
                onValueChange={setDuration}
              >
                <SelectTrigger id="ban-duration" className="bg-black/50 border-[#BBF429]/40">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[#BBF429]/40">
                  {BAN_DURATIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-[#BBF429]/20"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason (optional)</Label>
              <Textarea
                id="ban-reason"
                placeholder="Why is this user being banned?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-black/50 border-[#BBF429]/40 min-h-[80px]"
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="text-black"
          >
            Cancel
          </Button>
          <Button 
            variant={isCurrentlyBanned ? "default" : "destructive"}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner color="white" size={16} />
            ) : isCurrentlyBanned ? (
              "Unban User"
            ) : (
              "Ban User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BanUserModal;
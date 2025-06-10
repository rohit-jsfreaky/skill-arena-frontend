import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { UserContextType } from "@/context/UserContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestWithdrawal } from "@/api/payment";
import { showSuccessToast } from "@/utils/toastUtils";

interface WithdrawDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  myUser: UserContextType | null;
  onSuccess: () => void;
}

const WithdrawDialog = ({
  open,
  setOpen,
  myUser,
  onSuccess,
}: WithdrawDialogProps) => {
  const [amount, setAmount] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accountType === "upi") {
      setAccountDetails(myUser?.upi_id || "");
    } else if (accountType === "bank") {
      setAccountDetails(myUser?.account_details || "");
    } else if (accountType === "paytm") {
      setAccountDetails(myUser?.paytm_number || "");
    } else if (accountType === "qr_code") {
      setAccountDetails(myUser?.upi_qr_code_url || "");
    }
  }, [accountType]);

  const handleWithdraw = async () => {
    if (!myUser) {
      toast.error("Please login to withdraw money");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!accountType) {
      toast.error("Please select withdrawal method");
      return;
    }

    if (!accountDetails) {
      toast.error("Please enter account details");
      return;
    }

    if (Number(amount) > (myUser.wallet || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);
    try {
      const result = await requestWithdrawal({
        amount: Number(amount),
        userId: myUser.id,
        accountType,
        accountDetails,
      });

      if (result.success) {
        showSuccessToast("Withdrawal request submitted successfully");
        setOpen(false);
        setAmount("");
        setAccountType("");
        setAccountDetails("");
        onSuccess();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit withdrawal request"
      );
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component stays the same
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-r from-black to-[#1A1A1A] text-white border border-[#BBF429]">
        <DialogHeader>
          <DialogTitle className="text-[#BBF429]">Withdraw Money</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the amount and account details for withdrawal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/50 border-[#BBF429]/40"
            />
          </div>

          <div className="space-y-2">
            <Label>Withdrawal Method</Label>
            <Select onValueChange={setAccountType} value={accountType}>
              <SelectTrigger className="bg-black/50 border-[#BBF429]/40">
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent className="bg-black border-[#BBF429]/40">
                <SelectItem
                  value="upi"
                  className="text-white hover:bg-[#BBF429]/20"
                >
                  UPI
                </SelectItem>
                <SelectItem
                  value="bank"
                  className="text-white hover:bg-[#BBF429]/20"
                >
                  Bank Transfer
                </SelectItem>
                <SelectItem
                  value="paytm"
                  className="text-white hover:bg-[#BBF429]/20"
                >
                  Paytm
                </SelectItem>
                <SelectItem
                  value="qr_code"
                  className="text-white hover:bg-[#BBF429]/20"
                >
                  Qr Code
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">
              {accountType === "upi"
                ? "UPI ID"
                : accountType === "bank"
                ? "Bank Account Details"
                : accountType === "paytm"
                ? "Paytm Number"
                : accountType === "qr_code"
                ? "QR Code"
                : "Account Details"}
            </Label>
            {accountType !== "qr_code" ? (
              <Input
                id="details"
                placeholder="Enter account details"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="bg-black/50 border-[#BBF429]/40"
              />
            ) : myUser?.upi_qr_code_url ? (
              <img
                src={myUser.upi_qr_code_url}
                alt="QR Code"
                className="w-32 h-32"
              />
            ) : (
              <p className="text-gray-400">No QR code available</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="default"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="text-white border-[#BBF429]/40 hover:bg-[#BBF429]/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={loading}
            className="bg-[#BBF429] text-black hover:bg-[#BBF429]/90"
          >
            {loading ? "Processing..." : "Request Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;

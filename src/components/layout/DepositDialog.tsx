import { createDeposit, verifyPayment } from "@/api/payment";
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
import { useState } from "react";
import { UserContextType } from "@/context/UserContext";
import { toast } from "sonner";
import { useRazorpay } from "react-razorpay";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";

interface DepositDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  myUser: UserContextType | null;
  onSuccess: () => void;
}

const DepositDialog = ({
  open,
  setOpen,
  myUser,
  onSuccess,
}: DepositDialogProps) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { Razorpay } = useRazorpay();

  const handleDeposit = async () => {
    if (!myUser) {
      toast.error("Please login to deposit money");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      // Create order using our new API
      const order = await createDeposit(Number(amount), myUser.id);

      if (!order.success || !order.orderId) {
        throw new Error(order.message || "Failed to create order");
      }

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Number(amount) * 100,
        currency: "INR",
        name: "Skill Arena",
        description: "Add Money to Wallet",
        order_id: order.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Verify payment using our new API
          const verifyResult = await verifyPayment(
            response,
            myUser.id,
            Number(amount)
          );

          if (verifyResult.success) {
            showSuccessToast("Money added successfully!");
            setOpen(false);
            setAmount("");
            onSuccess();
          } else {
            toast.error(verifyResult.message || "Payment verification failed");
          }
        },
        prefill: {
          name: myUser.name,
          email: myUser.email,
        },
        theme: {
          color: "#BBF429",
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Failed to process payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-r from-black to-[#1A1A1A] text-white border border-[#BBF429]">
        <DialogHeader>
          <DialogTitle className="text-[#BBF429]">Add Money</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the amount you want to add to your wallet
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
            onClick={handleDeposit}
            disabled={loading}
            className="bg-[#BBF429] text-black hover:bg-[#BBF429]/90"
          >
            {loading ? "Processing..." : "Add Money"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;

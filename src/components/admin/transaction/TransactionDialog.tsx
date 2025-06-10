import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/interface/payment";
import { ActionType } from "@/pages/admin/Transactions/useAdminTransactions";
import { LoadingSpinner } from "@/components/my-ui/Loader";

interface TransactionDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedTransaction: Transaction | null;
  actionType: ActionType;
  adminRemarks: string;
  setAdminRemarks: (remarks: string) => void;
  processingAction: boolean;
  confirmAction: () => Promise<void>;
  formatCurrency: (amount: number) => string;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  selectedTransaction,
  actionType,
  adminRemarks,
  setAdminRemarks,
  processingAction,
  confirmAction,
  formatCurrency,
}) => {
  if (!selectedTransaction) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-[#1A1A1A] text-white border-[#BBF429]/30">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {actionType === "completed" ? "Approve" : "Reject"} Withdrawal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-400">Amount:</div>
            <div className="font-semibold">
              {formatCurrency(selectedTransaction.amount)}
            </div>
            <div className="text-gray-400">User:</div>
            <div>{selectedTransaction.username || "Unknown"}</div>
            <div className="text-gray-400">Type:</div>
            <div className="capitalize">{selectedTransaction.type}</div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">
              Admin Remarks
            </label>
            <Textarea
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="Enter any remarks for this transaction..."
              className="bg-black/50 border-[#BBF429]/30 text-white resize-none focus-visible:ring-[#BBF429]/50"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setDialogOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white"
            disabled={processingAction}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            disabled={processingAction}
            className={
              actionType === "completed"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }
          >
            {processingAction ? (
              <LoadingSpinner color="white" size={16} />
            ) : actionType === "completed" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;

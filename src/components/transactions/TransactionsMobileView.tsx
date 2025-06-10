import { Transaction } from "@/interface/payment";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface TransactionsMobileViewProps {
  transactions: Transaction[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string) => string;
  handleProcess: (
    transaction: Transaction,
    action: "completed" | "rejected"
  ) => void;
  formatDate: (date: Date) => string;
}

const TransactionsMobileView = ({
  transactions,
  loading,
  formatCurrency,
  getStatusColor,
  handleProcess,
  formatDate,
}: TransactionsMobileViewProps) => {
  // Add state for image dialog
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Function to open image preview dialog
  const handleImageClick = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setIsImageDialogOpen(true);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BBF429]"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-white">No transactions found</div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-[#1A1A1A] text-white rounded-lg p-4 shadow-lg border border-[#BBF429]/30"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">ID: {transaction.id}</h3>
                <p className="text-sm text-gray-400">{transaction.username}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
              <div className="text-gray-400">Type:</div>
              <div className="capitalize">{transaction.type}</div>

              <div className="text-gray-400">Amount:</div>
              <div>{formatCurrency(transaction.amount)}</div>

              <div className="text-gray-400">Method:</div>
              <div className="capitalize">{transaction.payment_method}</div>
              
              {transaction.account_details && (
                <>
                  <div className="text-gray-400">Account Details:</div>
                  {transaction.payment_method === "qr_code" ? (
                    <div>
                      <img 
                        src={transaction.account_details} 
                        alt="QR Code"
                        className="h-16 w-16 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(transaction.account_details || "")}
                      />
                    </div>
                  ) : (
                    <div className="capitalize">
                      {transaction.account_details}
                    </div>
                  )}
                </>
              )}

              <div className="text-gray-400">Date:</div>
              <div>{formatDate(new Date(transaction.created_at))}</div>
            </div>

            {transaction.type === "withdrawal" &&
              transaction.status === "pending" && (
                <div className="flex gap-2 justify-end mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleProcess(transaction, "completed")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleProcess(transaction, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject
                  </Button>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md bg-black/90 border-[#BBF429]/20">
          <DialogHeader>
            <DialogTitle className="text-white">QR Code Preview</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </DialogClose>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="QR Code Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionsMobileView;

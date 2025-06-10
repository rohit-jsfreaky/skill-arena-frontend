import { Transaction } from "@/interface/payment";
import { Button } from "@/components/ui/button";
import Table from "@/containers/Table/Table";
import { JSX, useState } from "react"; // Add useState import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // Import Dialog components

interface TransactionsLargeViewProps {
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

const TransactionsLargeView = ({
  transactions,
  loading,
  formatCurrency,
  getStatusColor,
  handleProcess,
  formatDate,
}: TransactionsLargeViewProps) => {
  // Add state for image dialog
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Function to open image preview dialog
  const handleImageClick = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setIsImageDialogOpen(true);
  };

  interface Column {
    key: string;
    label: string;
    render: (transaction: Transaction) => JSX.Element | string | null;
  }

  const columns: Column[] = [
    {
      key: "user",
      label: "User",
      render: (transaction: Transaction) => (
        <div>
          <div className="font-medium">{transaction.username}</div>
          <div className="text-sm text-gray-400">{transaction.email}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (transaction: Transaction) => (
        <span className="capitalize">{transaction.type}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (transaction: Transaction) => formatCurrency(transaction.amount),
    },
    {
      key: "payment_method",
      label: "Method",
      render: (transaction: Transaction) => (
        <span className="capitalize">{transaction.payment_method}</span>
      ),
    },
    {
      key: "acccount_details",
      label: "Account",
      render: (transaction: Transaction) =>
        transaction.payment_method === "qr_code" ? (
          <img 
            src={transaction.account_details} 
            alt="QR Code"
            className="h-16 w-16 object-contain cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleImageClick(transaction.account_details || "")}
          />
        ) : (
          <span className="capitalize">
            {transaction.account_details ? transaction.account_details : "N/A"}
          </span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (transaction: Transaction) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            transaction.status
          )}`}
        >
          {transaction.status}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (transaction: Transaction) =>
        formatDate(new Date(transaction.created_at)),
    },
    {
      key: "actions",
      label: "Actions",
      render: (transaction: Transaction) => {
        if (
          transaction.type === "withdrawal" &&
          transaction.status === "pending"
        ) {
          return (
            <div className="flex gap-2">
              <Button
                onClick={() => handleProcess(transaction, "completed")}
                variant="ghost"
                size="sm"
                className="text-green-500 hover:text-green-400 hover:bg-green-900/20"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleProcess(transaction, "rejected")}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
              >
                Reject
              </Button>
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={transactions.map((transaction) => ({ ...transaction }))}
        loading={loading}
        loadingMessage="Loading transactions..."
        emptyMessage="No transactions found"
      />

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

export default TransactionsLargeView;

import { useState, useEffect } from "react";
import { Transaction } from "@/interface/payment";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { getUserTransactions } from "@/api/payment";

interface UserTransactionsProps {
  userId: number;
}

const UserTransactions = ({ userId }: UserTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const response = await getUserTransactions(userId, filter);
    if (response.success) {
      setTransactions(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId, filter]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-[#BBF429] text-black"
              : "bg-black/40 text-white border border-[#BBF429]/40 hover:bg-black/60"
          }`}
        >
          All Transactions
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter("deposit")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === "deposit"
              ? "bg-[#BBF429] text-black"
              : "bg-black/40 text-white border border-[#BBF429]/40 hover:bg-black/60"
          }`}
        >
          Deposits
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter("withdrawal")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === "withdrawal"
              ? "bg-[#BBF429] text-black"
              : "bg-black/40 text-white border border-[#BBF429]/40 hover:bg-black/60"
          }`}
        >
          Withdrawals
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner color="white" size={40} />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No transactions found
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-black/30 backdrop-blur-sm border border-[#BBF429]/20 rounded-xl p-4 hover:bg-[#BBF429]/5 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                    <span className="text-[#BBF429] font-medium capitalize">
                      {transaction.type}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(transaction.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="text-gray-400">
                    Method:{" "}
                    <span className="text-white capitalize">
                      {transaction.payment_method}
                    </span>
                  </div>
                  {transaction.transaction_id && (
                    <div className="text-gray-400">
                      ID:{" "}
                      <span className="text-white">
                        {transaction.transaction_id}
                      </span>
                    </div>
                  )}
                  {transaction.admin_remarks && (
                    <div className="text-gray-400">
                      Remarks:{" "}
                      <span className="text-white">
                        {transaction.admin_remarks}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          onClick={fetchTransactions}
          className="bg-[#BBF429]/20 hover:bg-[#BBF429]/30 text-[#BBF429] border border-[#BBF429]/40"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default UserTransactions;

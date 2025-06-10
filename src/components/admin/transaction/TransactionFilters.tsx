import React from "react";
import { motion } from "framer-motion";
import { FilterOption } from "@/pages/admin/Transactions/useAdminTransactions";

interface TransactionFiltersProps {
  statusFilter: string | null;
  onFilterChange: (filter: FilterOption) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  statusFilter,
  onFilterChange,
}) => {
  const filters: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All Transactions" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6 w-full">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.value)}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm 
            font-medium transition-all whitespace-nowrap min-w-[80px] sm:min-w-[100px] ${
            (filter.value === "all" && !statusFilter) ||
            statusFilter === filter.value
              ? "bg-[#BBF429] text-black"
              : "bg-black/40 text-white border border-[#BBF429]/40 hover:bg-black/60"
          }`}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
};

export default TransactionFilters;
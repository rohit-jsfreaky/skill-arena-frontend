import React from "react";
import { motion } from "framer-motion";
import { FilterOption } from "@/pages/admin/users/useAdminUsers";

interface UserFiltersProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const filters: { value: FilterOption; label: string; shortLabel: string }[] = [
    { value: "all", label: "All Users", shortLabel: "All" },
    { value: "active", label: "Active Users", shortLabel: "Active" },
    { value: "banned", label: "Banned Users", shortLabel: "Banned" },
  ];

  return (
    <div className="flex flex-wrap gap-2 xs:gap-3 mb-4 sm:mb-6 mx-auto justify-center sm:justify-start">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentFilter === filter.value
              ? "bg-[#BBF429] text-black"
              : "bg-black/40 text-white border border-[#BBF429]/40 hover:bg-black/60"
          }`}
        >
          <span className="hidden sm:inline">{filter.label}</span>
          <span className="sm:hidden">{filter.shortLabel}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default UserFilters;
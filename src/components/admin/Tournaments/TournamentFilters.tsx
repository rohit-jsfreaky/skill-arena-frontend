import React from "react";
import { motion } from "framer-motion";
import { TournamentFilterOption } from "@/interface/tournament";

interface TournamentFiltersProps {
  currentFilter: TournamentFilterOption;
  onFilterChange: (filter: TournamentFilterOption) => void;
}

const TournamentFilters: React.FC<TournamentFiltersProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const filterOptions: { value: TournamentFilterOption; label: string; shortLabel: string }[] = [
    { value: "all", label: "All Tournaments", shortLabel: "All" },
    { value: "upcoming", label: "Upcoming", shortLabel: "Upcoming" },
    { value: "ongoing", label: "Ongoing", shortLabel: "Live" },
    { value: "completed", label: "Completed", shortLabel: "Done" },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
      {filterOptions.map((option) => (
        <motion.button
          key={option.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(option.value)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            currentFilter === option.value
              ? "bg-[#BBF429] text-black"
              : "bg-black/40 text-white border border-[#BBF429]/40 hover:bg-black/60"
          }`}
        >
          <span className="hidden sm:inline">{option.label}</span>
          <span className="sm:hidden">{option.shortLabel}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default TournamentFilters;
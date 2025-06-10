import React from "react";
import { RefreshCw, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionSearchBar from "./TransactionSearchBar";
import TransactionDateFilter from "./TransactionDateFilter";

interface TransactionHeaderProps {
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (type: 'start' | 'end', date: Date | null) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  onRefresh,
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onDateChange,
  hasFilters,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-center justify-between w-full">
      <h1 className="text-xl md:text-2xl font-bold text-white">Transaction Management</h1>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <TransactionSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onClearSearch={() => onSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)}
        />
        
        <div className="flex gap-2">
          <TransactionDateFilter
            startDate={startDate}
            endDate={endDate}
            onDateChange={onDateChange}
            onClearDates={() => {
              onDateChange('start', null);
              onDateChange('end', null);
            }}
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="border-[#BBF429]/30 bg-black/40 text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="border-[#BBF429]/30 bg-black/40 text-white flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
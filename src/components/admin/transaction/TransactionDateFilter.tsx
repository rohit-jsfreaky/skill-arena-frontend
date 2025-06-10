import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TransactionDateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (type: "start" | "end", date: Date | null) => void;
  onClearDates: () => void;
}

const TransactionDateFilter: React.FC<TransactionDateFilterProps> = ({
  startDate,
  endDate,
  onDateChange,
  onClearDates,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"start" | "end">("start");

  const formatDateDisplay = (date: Date | null) => {
    return date ? format(date, "MMM dd, yyyy") : "";
  };

  const displayText =
    startDate || endDate
      ? `${formatDateDisplay(startDate) || "Any"} - ${
          formatDateDisplay(endDate) || "Any"
        }`
      : "Filter by date";

  const hasDateFilter = !!(startDate || endDate);

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`flex items-center gap-2 border-[#BBF429]/30 bg-black/40 text-white ${
          hasDateFilter ? "border-[#BBF429]" : ""
        }`}
        onClick={() => setOpen(true)}
      >
        <CalendarIcon className="h-4 w-4" />
        <span className="max-w-[150px] truncate">{displayText}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#121212] border border-[#BBF429]/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              Filter by date range
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center my-4">
            <div className="flex rounded-md border border-[#BBF429]/30 overflow-hidden">
              <Button
                variant="ghost"
                className={`py-2 px-4 border-none ${
                  activeTab === "start"
                    ? "bg-[#BBF429]/20 text-[#BBF429]"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("start")}
              >
                Start Date
              </Button>
              <Button
                variant="ghost"
                className={`py-2 px-4 border-none ${
                  activeTab === "end"
                    ? "bg-[#BBF429]/20 text-[#BBF429]"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("end")}
              >
                End Date
              </Button>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="text-sm text-white/75">
              {activeTab === "start" ? "Select start date" : "Select end date"}
              <span className="block mt-1 text-center">
                {activeTab === "start"
                  ? startDate
                    ? formatDateDisplay(startDate)
                    : "Not set"
                  : endDate
                  ? formatDateDisplay(endDate)
                  : "Not set"}
              </span>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <Calendar
              mode="single"
              selected={
                activeTab === "start"
                  ? startDate || undefined
                  : endDate || undefined
              }
              onSelect={(date) => onDateChange(activeTab, date || null)}
              disabled={(date) =>
                (activeTab === "end" && startDate ? date < startDate : false) ||
                (activeTab === "start" && endDate ? date > endDate : false)
              }
              className="bg-[#121212] text-white border-0"
            />
          </div>

          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            {hasDateFilter && (
              <Button
                variant="default"
                className="bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30 hover:text-red-400"
                onClick={() => {
                  onClearDates();
                  setOpen(false);
                }}
              >
                Clear Dates
              </Button>
            )}
            <Button
              variant="default"
              className="border-[#BBF429]/30 hover:bg-[#BBF429]/10 text-white"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionDateFilter;

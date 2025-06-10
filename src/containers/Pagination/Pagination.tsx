import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  showingText?: boolean;
  itemName?: string;
  containerClassName?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  showingText = true,
  itemName = "items",
  containerClassName = "",
}: PaginationProps) => {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems || currentPage * pageSize);

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 
      mt-4 sm:mt-6 bg-[#1A1A1A] rounded-lg p-3 sm:p-4 text-sm sm:text-base text-white ${containerClassName}`}>
      {showingText && totalItems && (
        <div className="text-xs sm:text-sm text-center sm:text-left">
          <span className="hidden xs:inline">Showing </span>
          {firstItem}-{lastItem} <span className="hidden xs:inline">of </span>
          {totalItems} {itemName}
        </div>
      )}

      <div className="flex items-center space-x-2 sm:space-x-3">
        <Button
          onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          variant="outline"
          size="sm"
          className={`h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm ${
            !hasPrevPage ? "opacity-50 cursor-not-allowed text-black" : "text-black"
          }`}
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="hidden xs:inline">Previous</span>
          <span className="xs:hidden">Prev</span>
        </Button>
        
        <div className="flex items-center px-1 sm:px-2 text-xs sm:text-sm">
          <span className="hidden xs:inline">Page </span>
          {currentPage}/{totalPages}
        </div>
        
        <Button
          onClick={() => hasNextPage && onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          variant="outline"
          size="sm"
          className={`h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm ${
            !hasNextPage ? "opacity-50 cursor-not-allowed text-black" : "text-black"
          }`}
        >
          <span className="hidden xs:inline">Next</span>
          <span className="xs:hidden">Next</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

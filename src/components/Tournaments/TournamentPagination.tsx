import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationData = {
  totalTournaments: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type TournamentPaginationProps = {
  pagination: PaginationData;
  handlePrevPage: () => void;
  handleNextPage: () => void;
};

const TournamentPagination = ({
  pagination,
  handlePrevPage,
  handleNextPage,
}: TournamentPaginationProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-white gap-4">
      <div>
        Showing {pagination.currentPage === 1 ? 1 : (pagination.currentPage - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.currentPage * pagination.limit, pagination.totalTournaments)} of{" "}
        {pagination.totalTournaments} tournaments
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={!pagination.hasPrevPage}
          className={`border-[#BBF429]/40 ${
            pagination.hasPrevPage
              ? "text-white hover:bg-[#BBF429]/20"
              : "text-gray-500"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Previous</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!pagination.hasNextPage}
          className={`border-[#BBF429]/40 ${
            pagination.hasNextPage
              ? "text-white hover:bg-[#BBF429]/20"
              : "text-gray-500"
          }`}
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TournamentPagination;
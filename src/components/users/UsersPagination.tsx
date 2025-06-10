import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

type UsersPaginationProps = {
  pagination: {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  handlePrevPage: () => void;
  handleNextPage: () => void;
};

const UsersPagination = ({
  pagination,
  handlePrevPage,
  handleNextPage,
}: UsersPaginationProps) => {
  return (
    <div className="flex justify-between items-center mt-6 bg-[#1A1A1A] rounded-lg p-4 text-white">
      <div className="text-sm">
        Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
        {Math.min(
          pagination.currentPage * pagination.limit,
          pagination.totalUsers
        )}{" "}
        of {pagination.totalUsers} users
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={handlePrevPage}
          disabled={!pagination.hasPrevPage}
          variant="outline"
          size="sm"
          className={
            !pagination.hasPrevPage ? "opacity-50 cursor-not-allowed text-black" : "text-black"
          }
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={!pagination.hasNextPage}
          variant="outline"
          size="sm"
          className={
            !pagination.hasNextPage ? "opacity-50 cursor-not-allowed text-black" : "text-black"
          }
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default UsersPagination;

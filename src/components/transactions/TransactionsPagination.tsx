import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TransactionsPaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const TransactionsPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
}: TransactionsPaginationProps) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={`${
              currentPage <= 1 ? "pointer-events-none opacity-50" : ""
            } cursor-pointer border border-[#BBF429]/40 bg-black/50 text-white hover:bg-[#BBF429]/20`}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={page === currentPage}
              className={
                page === currentPage
                  ? "bg-[#BBF429] text-black"
                  : "text-white border border-[#BBF429]/40 bg-black/50 hover:bg-[#BBF429]/20"
              }
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            className={`${
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            } cursor-pointer border border-[#BBF429]/40 bg-black/50 text-white hover:bg-[#BBF429]/20`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TransactionsPagination;
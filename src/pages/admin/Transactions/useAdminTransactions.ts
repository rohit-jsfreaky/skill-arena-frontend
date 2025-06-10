import { useState, useEffect } from "react";
import { getAdminTransactions, processWithdrawal } from "@/api/admin/payment";
import { Transaction } from "@/interface/payment";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";

// Define filter options
export type FilterOption = "all" | "pending" | "completed" | "rejected";
export type ActionType = "completed" | "rejected";

export const useAdminTransactions = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>("completed");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch transactions with current filters
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getAdminTransactions(
        currentPage,
        10,
        statusFilter || undefined,
        typeFilter || undefined,
        debouncedSearchQuery || undefined,
        startDate ? startDate.toISOString() : undefined,
        endDate ? endDate.toISOString() : undefined
      );

      if (response.success) {
        setTransactions(response.data);
        setTotalPages(response.totalPages);
      } else {
        showErrorToast(response.message || "Failed to fetch transactions");
      }
    } catch {
      showErrorToast("An error occurred while fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters or pagination changes
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter, typeFilter, debouncedSearchQuery, startDate, endDate]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, debouncedSearchQuery, startDate, endDate]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle date filter changes
  const handleDateChange = (type: 'start' | 'end', date: Date | null) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter(null);
    setTypeFilter(null);
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  // Open dialog to process a transaction
  const handleProcess = (
    transaction: Transaction,
    action: ActionType
  ) => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setAdminRemarks("");
    setDialogOpen(true);
  };

  // Confirm and process the transaction
  const confirmAction = async () => {
    if (!selectedTransaction) return;

    setProcessingAction(true);
    try {
      const response = await processWithdrawal(
        selectedTransaction.id,
        actionType,
        adminRemarks
      );

      if (response.success) {
        showSuccessToast(
          response.message || `Withdrawal ${actionType} successfully`
        );
        fetchTransactions();
        setDialogOpen(false);
      } else {
        showErrorToast(response.message || "Failed to process withdrawal");
      }
    } catch {
      showErrorToast("An error occurred while processing the withdrawal");
    } finally {
      setProcessingAction(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Get status color based on transaction status
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

  // Format date for relative time
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: FilterOption) => {
    if (newFilter === "all") {
      setStatusFilter(null);
    } else {
      setStatusFilter(newFilter);
    }
  };

  return {
    isMobile,
    transactions,
    loading,
    currentPage,
    totalPages,
    statusFilter,
    searchQuery,
    startDate,
    endDate,
    dialogOpen,
    setDialogOpen,
    selectedTransaction,
    actionType,
    adminRemarks,
    setAdminRemarks,
    processingAction,
    fetchTransactions,
    handlePageChange,
    handleProcess,
    confirmAction,
    formatCurrency,
    getStatusColor,
    formatDate,
    handleFilterChange,
    handleSearchChange,
    handleDateChange,
    clearFilters
  };
};
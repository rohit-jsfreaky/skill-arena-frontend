import React, { useEffect } from "react";
import { useAdminTransactions } from "./useAdminTransactions";
import TransactionHeader from "@/components/admin/transaction/TransactionHeader";
import TransactionFilters from "@/components/admin/transaction/TransactionFilters";
import TransactionLoader from "@/components/admin/transaction/TransactionLoader";
import EmptyTransactions from "@/components/admin/transaction/EmptyTransactions";
import TransactionsLargeView from "@/components/transactions/TransactionsLargeView";
import TransactionsMobileView from "@/components/transactions/TransactionsMobileView";
import TransactionDialog from "@/components/admin/transaction/TransactionDialog";
import Pagination from "@/containers/Pagination/Pagination";
import { useLocation } from "react-router";

const TransactionsPage: React.FC = () => {

  const data = useLocation().state

  useEffect(()=>{
    console.log("Data from location state:", data);
  },[data])
  const {
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
  } = useAdminTransactions();

  // Check if any filters are active
  const hasActiveFilters = !!(statusFilter || searchQuery || startDate || endDate);

  return (
    <div className="w-full h-full flex flex-col bg-black p-2 pt-14 md:p-8 md:pt-14">
      <TransactionHeader 
        onRefresh={fetchTransactions}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        hasFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
      
      <TransactionFilters 
        statusFilter={statusFilter} 
        onFilterChange={handleFilterChange} 
      />

      {loading ? (
        <TransactionLoader />
      ) : transactions.length === 0 ? (
        <EmptyTransactions />
      ) : (
        <>
          {isMobile ? (
            <TransactionsMobileView
              transactions={transactions}
              loading={loading}
              formatCurrency={formatCurrency}
              getStatusColor={getStatusColor}
              handleProcess={handleProcess}
              formatDate={(date) => formatDate(date)}
            />
          ) : (
            <TransactionsLargeView
              transactions={transactions}
              loading={loading}
              formatCurrency={formatCurrency}
              getStatusColor={getStatusColor}
              handleProcess={handleProcess}
              formatDate={(date) => formatDate(date)}
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemName="transactions"
              showingText={false}
            />
          )}
        </>
      )}

      <TransactionDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedTransaction={selectedTransaction}
        actionType={actionType}
        adminRemarks={adminRemarks}
        setAdminRemarks={setAdminRemarks}
        processingAction={processingAction}
        confirmAction={confirmAction}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default TransactionsPage;

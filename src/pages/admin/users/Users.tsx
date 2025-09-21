import React from "react";
import { useAdminUsers } from "./useAdminUsers";
import UserHeader from "@/components/admin/users/UserHeader";
import UserFilters from "@/components/admin/users/UserFilters";
import UserLoading from "@/components/admin/users/UserLoading";
import EmptyUsers from "@/components/admin/users/EmptyUsers";
import UsersMobileLayout from "@/components/users/UsersMobileLayout";
import UsersLargeView from "@/components/users/UsersLargeView";
import Pagination from "@/containers/Pagination/Pagination";

const Users: React.FC = () => {
  const {
    users,
    loading,
    searchLoading,
    isMobile,
    searchTerm,
    searchResults,
    showSuggestions,
    filter,
    pagination,
    searchContainerRef,
    handleSearchChange,
    handleSelectUser,
    fetchUsers,
    handleFilterChange,
    formatDate,
    handlePageChange,
    navigate,
  } = useAdminUsers();

  return (
    <div className="w-full h-full flex flex-col bg-black p-2 pt-14 md:p-8 md:pt-14">
      <UserHeader
        searchTerm={searchTerm}
        searchResults={searchResults}
        searchLoading={searchLoading}
        showSuggestions={showSuggestions}
        searchContainerRef={searchContainerRef}
        onSearchChange={handleSearchChange}
        onSelectUser={handleSelectUser}
      />

      <UserFilters currentFilter={filter} onFilterChange={handleFilterChange} />

      {loading ? (
        <UserLoading />
      ) : users.length === 0 ? (
        <EmptyUsers />
      ) : (
        <>
          {/* Responsive layout handling */}
          {isMobile ? (
            <UsersMobileLayout
              formatDate={formatDate}
              navigate={navigate}
              users={users}
              refetchUsers={fetchUsers}
            />
          ) : (
            <UsersLargeView
              formatDate={formatDate}
              navigate={navigate}
              users={users}
              refetchUsers={fetchUsers}
            />
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalUsers}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            itemName="users"
          />
        </>
      )}
    </div>
  );
};

export default Users;

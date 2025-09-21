import React from "react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import TournamentLargeLayout from "@/components/Tournaments/TournamentLargeLayout";
import TournamentsMobileLayout from "@/components/Tournaments/TournamentsMobileLayout";
import Pagination from "@/containers/Pagination/Pagination";
import DeleteTournamentModal from "@/components/admin/Tournaments/DeleteTournamentModal";
import TournamentHeader from "@/components/admin/Tournaments/TournamentHeader";
import TournamentFilters from "@/components/admin/Tournaments/TournamentFilters";
import { useAdminTournaments } from "./useAdminTournaments";

const AdminTournaments: React.FC = () => {
  const {
    tournaments,
    loading,
    alertOpen,
    setAlertOpen,
    setTournamentId,
    deleteLoading,
    isMobile,
    filter,
    searchTerm,
    searchResults,
    searchLoading,
    showSuggestions,
    pagination,
    searchContainerRef,
    handleSearchChange,
    handleSelectTournament,
    formatDate,
    handleDeleteTournament,
    handleFilterChange,
    handlePageChange,
    navigateToCreate,
  } = useAdminTournaments();

  return (
    <div className="w-full h-full flex-col gap-40 pt-15 bg-black p-4">
      <TournamentHeader
        searchTerm={searchTerm}
        searchResults={searchResults}
        searchLoading={searchLoading}
        showSuggestions={showSuggestions}
        searchContainerRef={searchContainerRef }
        onSearchChange={handleSearchChange}
        onSelectTournament={handleSelectTournament}
        onCreateClick={navigateToCreate}
      />

      <TournamentFilters 
        currentFilter={filter} 
        onFilterChange={handleFilterChange} 
      />

      {loading ? (
        <div className="flex justify-center items-center my-auto">
          <LoadingSpinner color="white" size={50} />
        </div>
      ) : tournaments.length > 0 ? (
        <>
          {isMobile ? (
            <TournamentsMobileLayout
              formatDate={formatDate}
              tournaments={tournaments}
              editable={true}
              setTournamentId={setTournamentId}
              setAlertOpen={setAlertOpen}
            />
          ) : (
            <TournamentLargeLayout
              formatDate={formatDate}
              tournaments={tournaments}
              editable={true}
              setTournamentId={setTournamentId}
              setAlertOpen={setAlertOpen}
            />
          )}

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalTournaments}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            itemName="tournaments"
          />
        </>
      ) : (
        <div className="flex justify-center items-center mt-10">
          <h2 className="text-xl font-bold text-white">
            No {filter !== "all" ? filter : ""} tournaments available
          </h2>
        </div>
      )}

      <DeleteTournamentModal
        alertOpen={alertOpen}
        deleteTournament={handleDeleteTournament}
        setAlertOpen={setAlertOpen}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminTournaments;

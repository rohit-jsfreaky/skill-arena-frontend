import React, { useEffect, useState } from "react";
import { deleteGame, Game, PaginationResponse } from "@/api/admin/games";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import GameCard from "@/components/Games/GameCard";
import Pagination from "@/containers/Pagination/Pagination";
import { useGames } from "./useGames";
import GameFormModal from "@/components/Games/GameFormModal";
import GameHeader from "@/components/Games/GameHeader";
import GameTable from "@/components/Games/GameTable";
import DeleteGameDialog from "@/components/Games/DeleteGameDialog";

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationResponse>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    loadGames,
    handleSearch,
    handleEdit,
    handleDelete,
    confirmDelete,
    handlePageChange,
    getStatusColor,
    formatDate,
  } = useGames();

  useEffect(() => {
    loadGames(setLoading, pagination, setGames, setPagination, searchTerm);
  }, [pagination.currentPage, searchTerm]);

  const openCreateModal = () => {
    setSelectedGame(null);
    setIsModalOpen(true);
  };

  const handleEditGame = (game: Game) => {
    handleEdit(game, setSelectedGame, setIsModalOpen);
  };

  const handleDeleteGame = (id: number) => {
    confirmDelete(id, setDeleteId, setIsDeleteDialogOpen);
  };

  const onDeleteConfirm = () => {
    handleDelete(
      deleteGame,
      deleteId,
      setLoading,
      pagination,
      setGames,
      setPagination,
      searchTerm,
      setIsDeleteDialogOpen,
      setDeleteId
    );
  };

  const refreshGames = () => {
    loadGames(setLoading, pagination, setGames, setPagination, searchTerm);
  };

  useEffect(() => {
    console.log("games", games);
  }, [games]);
  return (
    <div className="h-full w-full px-4 py-14 bg-black">
      <div className="container mx-auto">
        <GameHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          setPagination={setPagination}
          openCreateModal={openCreateModal}
        />

        {isMobile ? (
          // Mobile Card View
          <div className="grid grid-cols-1 gap-4">
            {games.length > 0 ? (
              games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  onEdit={() => handleEditGame(game)}
                  onDelete={() => handleDeleteGame(game.id)}
                />
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                No games found
              </div>
            )}
          </div>
        ) : (
          // Desktop Table View
          <GameTable
            games={games}
            loading={loading}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            onEdit={handleEditGame}
            onDelete={handleDeleteGame}
          />
        )}

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={(page) => handlePageChange(page, setPagination)}
            itemName="games"
          />
        )}

        {/* Game Form Modal */}
        <GameFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          game={selectedGame}
          onSuccess={refreshGames}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteGameDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={onDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default Games;

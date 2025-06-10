import React from "react";
import { Game } from "@/api/admin/games";
import Table, { TableColumn } from "@/containers/Table/Table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface GameTableProps {
  games: Game[];
  loading: boolean;
  getStatusColor: (status: string) => string;
  formatDate: (date: string | null) => string;
  onEdit: (game: Game) => void;
  onDelete: (id: number) => void;
}

const GameTable: React.FC<GameTableProps> = ({
  games,
  loading,
  getStatusColor,
  formatDate,
  onEdit,
  onDelete,
}) => {
  // Define table columns
  const columns: TableColumn<Game>[] = [
    {
      key: "name",
      label: "Name",
      render: (game) => <span className="font-medium">{game.name}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (game) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            game.status
          )}`}
        >
          {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
        </span>
      ),
    },
    {
      key: "platform",
      label: "Platform",
      render: (game) => game.platform || "N/A",
    },
    {
      key: "genre",
      label: "Genre",
      render: (game) => game.genre || "N/A",
    },
    {
      key: "release_date",
      label: "Release Date",
      render: (game) => formatDate(game.release_date),
    },
    {
      key: "access_type",
      label: "Access Type",
      render: (game) => game.access_type,
    },
    {
      key: "actions",
      label: <div className="text-right">Actions</div>,
      className: "text-right",
      render: (game) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-500 border-blue-500 hover:bg-blue-100 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(game);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 border-red-500 hover:bg-red-100 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(game.id);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-lg">
      <Table
        columns={columns}
        data={games.map((game) => ({ ...game }))}
        loading={loading}
        loadingMessage={
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BBF429]"></div>
          </div>
        }
        emptyMessage="No games found"
        rowKeyField="id"
        onRowClick={onEdit}
        headerClassName="bg-[#BBF429] text-[#1A1A1A]"
        rowClassName={() => "border-b border-[#333] text-white"}
        containerClassName="rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default GameTable;

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Game } from "@/api/admin/games";

interface GameCardProps {
  game: Game;
  getStatusColor: (status: string) => string;
  formatDate: (date: string | null) => string;
  onEdit: (game: Game) => void;
  onDelete: (id: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  getStatusColor,
  formatDate,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-[#222] p-4 rounded-lg border border-[#333] space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-white">{game.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            game.status
          )}`}
        >
          {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>Platform:</span>
          <span className="text-white">{game.platform || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span>Genre:</span>
          <span className="text-white">{game.genre || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span>Release Date:</span>
          <span className="text-white">{formatDate(game.release_date)}</span>
        </div>
        <div className="flex justify-between">
          <span>Access Type:</span>
          <span className="text-white">{game.access_type}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 border-blue-500 hover:bg-blue-100 hover:text-blue-600"
          onClick={() => onEdit(game)}
        >
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-500 hover:bg-red-100 hover:text-red-600"
          onClick={() => onDelete(game.id)}
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default GameCard;

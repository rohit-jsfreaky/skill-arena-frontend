import React, { useEffect, useState } from "react";
import { fetchActiveGames } from "@/api/admin/games";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

type Game = {
  id: number;
  name: string;
  image: string | null;
};

type TournamentGameNameProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  game_name: string;
  onGameSelect?: (game: { name: string; image: string }) => void;
};

const TournamentGameName = ({
  game_name,
  handleChange,
  onGameSelect,
}: TournamentGameNameProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchActiveGames();
        setGames(data);
      } catch {
        setError("Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleGameSelect = (selectedGameName: string) => {
    const selectedGame = games.find((game) => game.name === selectedGameName);
    if (!selectedGame) return;

    // Create a synthetic event to maintain compatibility with handleChange
    const syntheticEvent = {
      target: {
        name: "game_name",
        value: selectedGame.name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent);

    if (onGameSelect) {
      onGameSelect({
        name: selectedGame.name,
        image: selectedGame.image ?? "",
      });
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white mb-2">
        Game Name<span className="text-[#BBF429] ml-1">*</span>
      </label>

      <Select value={game_name} onValueChange={handleGameSelect}>
        <SelectTrigger className="w-full bg-black/50 border-[#BBF429]/30 text-white ">
          <SelectValue placeholder="Select a game..." />
        </SelectTrigger>
        <SelectContent className="bg-black/95 border-[#BBF429]/30">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#BBF429]"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 text-center">{error}</div>
          ) : games.length === 0 ? (
            <div className="text-gray-400 py-6 text-center">
              No games found.
            </div>
          ) : (
            <SelectGroup>
              <SelectLabel className="text-[#BBF429]">
                Available Games
              </SelectLabel>
              {games.map((game) => (
                <SelectItem
                  key={game.id}
                  value={game.name}
                  className="relative flex items-center space-x-3 py-3 cursor-pointer 
                             
                           
                            text-white pl-8"
                >
                  <div className="flex items-center gap-3">
                    {game.image && (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <span>{game.name}</span>
                    {game_name === game.name && (
                      <Check className="ml-auto h-4 w-4 text-[#BBF429]" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default TournamentGameName;

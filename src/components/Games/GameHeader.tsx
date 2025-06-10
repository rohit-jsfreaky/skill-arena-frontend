import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { PaginationResponse } from "@/api/admin/games";

interface GameHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (
    e: React.FormEvent<HTMLFormElement>,
    setPagination: React.Dispatch<React.SetStateAction<PaginationResponse>>
  ) => void;
  setPagination: React.Dispatch<React.SetStateAction<PaginationResponse>>;
  openCreateModal: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  setPagination,
  openCreateModal,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
        Game Management
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <form
          onSubmit={(e) => handleSearch(e, setPagination)}
          className="flex w-full md:w-auto"
        >
          <Input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-r-none text-white"
          />
          <Button
            type="submit"
            className="rounded-l-none bg-[#BBF429] hover:bg-[#A8E000] text-black"
          >
            <Search size={18} />
          </Button>
        </form>

        <Button
          className="bg-[#BBF429] hover:bg-[#A8E000] text-black w-full sm:w-auto"
          onClick={openCreateModal}
        >
          <Plus size={18} className="mr-2" /> Add Game
        </Button>
      </div>
    </div>
  );
};

export default GameHeader;
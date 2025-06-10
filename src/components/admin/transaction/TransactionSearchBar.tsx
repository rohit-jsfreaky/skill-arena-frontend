import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TransactionSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

const TransactionSearchBar: React.FC<TransactionSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <div className="relative flex-grow max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="search"
        placeholder="Search by username or email..."
        value={searchQuery}
        onChange={onSearchChange}
        className="pl-10 py-2 border-[#BBF429]/30 bg-black/40 text-white w-full"
      />
      {searchQuery && (
        <Button
          onClick={onClearSearch}
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
        >
          ×
        </Button>
      )}
    </div>
  );
};

export default TransactionSearchBar;
import React from "react";
import UserSearch from "./UserSearch";
import { UserSearchResult } from "@/pages/admin/users/useAdminUsers";

interface UserHeaderProps {
  searchTerm: string;
  searchResults: UserSearchResult[];
  searchLoading: boolean;
  showSuggestions: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectUser: (userId: number) => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  searchTerm,
  searchResults,
  searchLoading,
  showSuggestions,
  searchContainerRef,
  onSearchChange,
  onSelectUser,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 className="text-3xl font-bold mb-4 md:mb-0 text-white">Users</h1>
      
      <UserSearch
        searchTerm={searchTerm}
        searchResults={searchResults}
        searchLoading={searchLoading}
        showSuggestions={showSuggestions}
        searchContainerRef={searchContainerRef}
        onSearchChange={onSearchChange}
        onSelectUser={onSelectUser}
      />
    </div>
  );
};

export default UserHeader;
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface MembershipHeaderProps {
  onCreateClick: () => void;
  onRefresh: () => void;
}

const MembershipHeader: React.FC<MembershipHeaderProps> = ({
  onCreateClick,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8 p-2 sm:p-4">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          Membership Plans
        </h1>
        <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2">
          Manage membership plans and pricing for your users
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          onClick={onRefresh}
          variant="outline"
          className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base
          border-[#BBF429] text-[#BBF429] hover:bg-[#BBF429] hover:text-black"
        >
          <RefreshCw size={16} className="mr-2 sm:mr-3" />
          Refresh
        </Button>
        <Button
          onClick={onCreateClick}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base
          bg-[#BBF429] text-black hover:bg-[#9FD92B]"
        >
          <PlusCircle size={16} className="mr-2 sm:mr-3" />
          New Membership
        </Button>
      </div>
    </div>
  );
};

export default MembershipHeader;

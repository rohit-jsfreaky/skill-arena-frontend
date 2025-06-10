import React from "react";
import { Membership } from "@/api/admin/membership";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, Gamepad } from "lucide-react";
import BenefitsList from "./BenefitsList";

interface MembershipCardProps {
  membership: Membership;
  formatPrice: (price: number) => string;
  formatDuration: (duration: string | null) => string;
  onEdit: (membership: Membership) => void;
  onDelete: (id: number) => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  formatPrice,
  formatDuration,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-lg 
      border border-[#BBF429]/20 hover:border-[#BBF429]/40 transition-all
      w-full sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-words flex-1">
            {membership.name}
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-500 border-blue-500 hover:bg-blue-900/20 
                hover:text-blue-400 p-1.5 sm:p-2"
              onClick={() => onEdit(membership)}
            >
              <Edit size={14} className="sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-500 hover:bg-red-900/20 
                hover:text-red-400 p-1.5 sm:p-2"
              onClick={() => onDelete(membership.id as number)}
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex items-baseline flex-wrap gap-1">
          <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#BBF429]">
            {formatPrice(membership.price)}
          </span>
          {membership.duration ? (
            <span className="text-sm sm:text-base text-gray-400 flex items-center">
              <Clock className="inline-block w-3 h-3 mr-1" />
              {formatDuration(membership.duration)}
            </span>
          ) : (
            <span className="text-sm sm:text-base text-purple-400 font-medium">
              Permanent
            </span>
          )}
        </div>

        <div className="mt-3 sm:mt-4 lg:mt-5">
          <h4 className="text-base sm:text-lg font-medium text-white mb-2">
            Benefits
          </h4>
          <BenefitsList benefits={membership.benefits || []} />
        </div>

        {membership.games && membership.games.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <h4 className="text-base sm:text-lg font-medium text-white mb-2 flex items-center">
              <Gamepad className="w-4 h-4 mr-2" />
              Included Games
            </h4>
            <div className="flex flex-wrap gap-1">
              {membership.games.slice(0, 4).map(game => (
                <span 
                  key={game.id}
                  className="bg-[#2A2A2A] text-xs rounded-full px-2 py-1 text-gray-300"
                >
                  {game.name}
                </span>
              ))}
              {membership.games.length > 4 && (
                <span className="bg-[#BBF429]/20 text-[#BBF429] text-xs rounded-full px-2 py-1">
                  +{membership.games.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipCard;
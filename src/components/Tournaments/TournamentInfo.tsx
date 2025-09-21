import React from 'react';
import InfoItem from './InfoItem';
import { Tournament } from "@/interface/tournament";
import { UserContextType } from "@/context/UserContext";
import {
  Users as UsersIcon,
  Trophy as TrophyIcon,
  Users as UserGroupIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon,
} from "lucide-react";

interface TournamentInfoProps {
  tournament: Tournament;
  isFull: boolean;
  formatDate: (dateString: string) => string;
  getEntryFee?: () => string | number;
  myUser?: UserContextType | null;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournament,
  isFull,
  formatDate,
  getEntryFee,
  myUser,
}) => {
  return (
    <>
      {/* Description */}
      {tournament.description && (
        <div className="mb-8">
          <h3 className="text-[#BBF429] text-sm font-medium mb-2">
            ABOUT TOURNAMENT
          </h3>
          <p className="text-gray-300 whitespace-pre-line">
            {tournament.description}
          </p>
        </div>
      )}

      {/* Tournament Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tournament Info */}
        <div className="space-y-6">
          <InfoItem
            label="Team Mode"
            value={tournament.team_mode}
            icon={<UsersIcon className="w-5 h-5" />}
          />
          <InfoItem
            label="Prize Pool"
            value={`₹${tournament.prize_pool}`}
            icon={<TrophyIcon className="w-5 h-5" />}
          />
          <InfoItem
            label="Participants"
            value={`${tournament.current_participants} / ${tournament.max_participants}`}
            status={isFull ? "Full" : undefined}
            icon={<UserGroupIcon className="w-5 h-5" />}
          />
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          <InfoItem
            label="Start Time"
            value={formatDate(tournament.start_time)}
            icon={<CalendarIcon className="w-5 h-5" />}
          />
          <InfoItem
            label="End Time"
            value={formatDate(tournament.end_time)}
            icon={<ClockIcon className="w-5 h-5" />}
          />
        </div>

        {/* Entry Fees & Wallet */}
        <div className="space-y-6">
          <InfoItem
            label="Entry Fee"
            value={
              <>
                {getEntryFee ? (
                  <span>
                    ${getEntryFee()}
                    {myUser?.membership_id && (
                      <span className="ml-2 text-green-400 text-sm">
                        (Pro)
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    <div>Normal: ₹{tournament.entry_fee_normal}</div>
                    <div>Pro: ₹{tournament.entry_fee_pro}</div>
                  </>
                )}
              </>
            }
            icon={<CreditCardIcon className="w-5 h-5" />}
          />
          {myUser && (
            <InfoItem
              label="Your Wallet"
              value={`$${myUser.wallet || 0}`}
              icon={<WalletIcon className="w-5 h-5" />}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TournamentInfo;
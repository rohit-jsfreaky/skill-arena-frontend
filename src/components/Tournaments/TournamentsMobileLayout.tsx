import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Tournament } from "@/interface/tournament";
import { useNavigate } from "react-router";
import ShareButtonSmall from "./ShareButtonSmall";

type TournamentTableProps = {
  formatDate: (dateString: string) => string;
  tournaments: Tournament[];
  editable?: boolean;
  setTournamentId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setAlertOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const TournamentsMobileLayout = ({
  tournaments,
  formatDate,
  editable,
  setAlertOpen,
  setTournamentId,
}: TournamentTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="bg-[#1A1A1A] text-white rounded-lg p-3 sm:p-4 shadow-lg border border-[#BBF429]"
        >
          <div className="flex items-center mb-2 sm:mb-3">
            {tournament.image && (
              <img
                src={tournament.image}
                alt={tournament.name}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full mr-2 sm:mr-3 object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base sm:text-lg truncate">
                  {tournament.name}
                </h3>
                <ShareButtonSmall tournament={tournament} />
              </div>
              <span 
                className={`inline-block mt-0.5 sm:mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  tournament.status === "upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : tournament.status === "ongoing"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm">
            <div className="text-gray-400">Mode:</div>
            <div>
              <span className="bg-[#eaffa9] text-[#1A1A1A] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                {tournament.team_mode}
              </span>
            </div>

            <div className="text-gray-400">Players:</div>
            <div className="truncate">
              {tournament.current_participants} / {tournament.max_participants}
            </div>

            <div className="text-gray-400">Start:</div>
            <div className="truncate">{formatDate(tournament.start_time)}</div>

            <div className="text-gray-400">End:</div>
            <div className="truncate">{formatDate(tournament.end_time)}</div>
          </div>

          {editable && (
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 justify-end">
              <Button
                onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                variant="outline"
                size="sm"
                className="text-black h-8 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">View</span>
              </Button>
              <Button
                onClick={() =>
                  navigate(`/admin/tournaments/edit/${tournament.id}`, {
                    state: { tournament },
                  })
                }
                variant="outline"
                size="sm"
                className="text-blue-400 h-8 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Edit</span>
              </Button>
              <Button
                onClick={() => {
                  if (setAlertOpen) setAlertOpen(true);
                  if (setTournamentId) setTournamentId(tournament.id);
                }}
                variant="outline"
                size="sm"
                className="text-red-400 h-8 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Delete</span>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TournamentsMobileLayout;

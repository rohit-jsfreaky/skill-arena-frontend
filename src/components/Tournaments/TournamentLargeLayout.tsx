import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Tournament } from "@/interface/tournament";
import Table from "@/containers/Table/Table";

type TournamentTableProps = {
  formatDate: (dateString: string) => string;
  tournaments: Tournament[];
  editable?: boolean;
  setTournamentId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setAlertOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const TournamentLargeLayout = ({
  editable,
  tournaments,
  formatDate,
  setAlertOpen,
  setTournamentId,
}: TournamentTableProps) => {
  const navigate = useNavigate();
  
  interface Column<T> {
    key: string;
    label: string;
    render: (item: T) => React.ReactNode;
  }

  const columns: Column<Tournament>[] = [
    {
      key: "tournament",
      label: "Tournament",
      render: (tournament: Tournament) => (
        <div className="flex items-center">
          {tournament.image && (
            <img
              src={tournament.image}
              alt={tournament.name}
              className="h-10 w-10 rounded-full mr-3 object-cover"
            />
          )}
          <span className="font-medium">{tournament.name}</span>
        </div>
      ),
    },
    {
      key: "team_mode",
      label: "Mode",
      render: (tournament: Tournament) => (
        <span className="bg-[#eaffa9] text-[#1A1A1A] px-2 py-1 rounded text-sm">
          {tournament.team_mode}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (tournament: Tournament) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            tournament.status === "upcoming"
              ? "bg-blue-100 text-blue-800"
              : tournament.status === "ongoing"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {tournament.status.charAt(0).toUpperCase() +
            tournament.status.slice(1)}
        </span>
      ),
    },
    {
      key: "participants",
      label: "Participants",
      render: (tournament: Tournament) => (
        `${tournament.current_participants} / ${tournament.max_participants}`
      ),
    },
    {
      key: "start_time",
      label: "Start Date",
      render: (tournament: Tournament) => formatDate(tournament.start_time),
    },
    {
      key: "end_time",
      label: "End Date",
      render: (tournament: Tournament) => formatDate(tournament.end_time),
    },
  ];

  if (editable) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (tournament) => (
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/tournaments/${tournament.id}`);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/tournaments/edit/${tournament.id}`, {
                state: { tournament },
              });
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-400"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (setAlertOpen) setAlertOpen(true);
              if (setTournamentId) setTournamentId(tournament.id);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      data={tournaments.map((tournament) => ({ ...tournament }))}
      onRowClick={editable ? (tournament) => navigate(`/admin/tournaments/${tournament.id}`) : undefined}
    />
  );
};

export default TournamentLargeLayout;

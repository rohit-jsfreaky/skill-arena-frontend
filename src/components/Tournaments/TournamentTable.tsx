import { Tournament } from "@/interface/tournament";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

type TournamentTableProps = {
  formatDate: (dateString: string) => string;
  tournaments: Tournament[];
  editable?: boolean;
  setTournamentId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setAlertOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile:boolean
};

const TournamentTable = ({
  tournaments,
  formatDate,
  editable,
  setTournamentId,
  setAlertOpen,
  isMobile
}: TournamentTableProps) => {

  const navigate = useNavigate();


  useEffect(()=>{
    console.log("isMobile", isMobile)
  },[isMobile])

  // Card view for mobile screens
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-[#1A1A1A] text-white rounded-lg p-4 shadow-lg border border-[#BBF429]"
          >
            <div className="flex items-center mb-3">
              {tournament.image && (
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="h-10 w-10 rounded-full mr-3 object-cover"
                />
              )}
              <h3 className="font-medium text-lg">{tournament.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-400">Mode:</div>
              <div>
                <span className="bg-[#eaffa9] text-[#1A1A1A] px-2 py-1 rounded text-sm">
                  {tournament.team_mode}
                </span>
              </div>

              <div className="text-gray-400">Participants:</div>
              <div>
                {tournament.current_participants} /{" "}
                {tournament.max_participants}
              </div>

              <div className="text-gray-400">Start Date:</div>
              <div>{formatDate(tournament.start_time)}</div>

              <div className="text-gray-400">End Date:</div>
              <div>{formatDate(tournament.end_time)}</div>
            </div>

            {editable && (
              <div className="mt-4 flex gap-2 justify-end">
                <Button
                  onClick={() =>
                    navigate(`/admin/tournaments/${tournament.id}`)
                  }
                  variant="outline"
                  size="sm"
                  className="text-black"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  onClick={() =>
                    navigate(`/admin/tournaments/edit/${tournament.id}`, {
                      state: { tournament },
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="text-blue-400"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    if(setAlertOpen) setAlertOpen(true)
                    if (setTournamentId) setTournamentId(tournament.id);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Table view for larger screens
  return (
    <div>
      <table className="w-full bg-[#1A1A1A] text-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-[#BBF429] text-[#1A1A1A]">
          <tr className="text-left text-sm md:text-base">
            <th className="py-3 px-4">Tournament</th>
            <th className="py-3 px-4">Mode</th>
            <th className="py-3 px-4">Participants</th>
            <th className="py-3 px-4">Start Date</th>
            <th className="py-3 px-4">End Date</th>
            {editable && <th className="py-3 px-4">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#BBF429]">
          {tournaments.map((tournament) => (
            <tr key={tournament.id} className="hover:bg-[#2A2A2A]">
              <td className="py-4 px-4 flex items-center">
                {tournament.image && (
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    className="h-10 w-10 rounded-full mr-3 object-cover"
                  />
                )}
                <span className="font-medium">{tournament.name}</span>
              </td>
              <td className="py-4 px-4">
                <span className="bg-[#eaffa9] text-[#1A1A1A] px-2 py-1 rounded text-sm">
                  {tournament.team_mode}
                </span>
              </td>
              <td className="py-4 px-4">
                {tournament.current_participants} /{" "}
                {tournament.max_participants}
              </td>
              <td className="py-4 px-4">{formatDate(tournament.start_time)}</td>
              <td className="py-4 px-4">{formatDate(tournament.end_time)}</td>
              {editable && (
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        navigate(`/admin/tournaments/${tournament.id}`)
                      }
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() =>
                        navigate(`/admin/tournaments/edit/${tournament.id}`, {
                          state: { tournament },
                        })
                      }
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                       onClick={() => {
                        if(setAlertOpen) setAlertOpen(true)
                        if (setTournamentId) setTournamentId(tournament.id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentTable;

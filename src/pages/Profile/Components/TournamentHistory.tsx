import { useEffect, useState } from "react";
import { getUserTournamentHistory } from "@/api/tournament";
import { formatDate } from "@/utils/formatDate";
import { Loader2 } from "lucide-react";

interface TournamentHistoryProps {
  userId: number;
}

interface TournamentHistoryItem {
  id: number;
  name: string;
  image: string;
  start_time: string;
  end_time: string;
  status: string;
  entry_fee: number;
  winnings: number | null;
  is_winner: boolean;
}

const TournamentHistory = ({ userId }: TournamentHistoryProps) => {
  const [history, setHistory] = useState<TournamentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const response = await getUserTournamentHistory(userId);
      if (response.success) {
        setHistory(response.data);
      }
      setLoading(false);
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  const renderStatus = (status: string) => (
    <span className={`px-2 py-1 rounded-full text-xs ${
      status === 'completed' 
        ? 'bg-blue-900/50 text-blue-400' 
        : status === 'ongoing'
        ? 'bg-green-900/50 text-green-400'
        : 'bg-orange-900/50 text-orange-400'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const renderResult = (tournament: TournamentHistoryItem) => (
    tournament.status === 'completed' ? (
      tournament.is_winner ? (
        <span className="text-green-400 font-bold text-sm">
          Won ₹{tournament.winnings}
        </span>
      ) : (
        <span className="text-red-400">Lost</span>
      )
    ) : (
      <span className="text-gray-400">Pending</span>
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#BBF429]" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-8 text-gray-400">
        <p>You haven't participated in any tournaments yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-2 sm:p-4">
     
      
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {history.map((tournament) => (
          <div 
            key={tournament.id}
            className="bg-black/30 rounded-lg p-4 border border-[#BBF429]/20"
          >
            <div className="flex items-center gap-3 mb-3">
              {tournament.image && (
                <img 
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-white">{tournament.name}</h3>
                <p className="text-sm text-gray-400">{formatDate(tournament.start_time)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry Fee:</span>
                <span className="text-white">₹{tournament.entry_fee}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Status:</span>
                {renderStatus(tournament.status)}
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Result:</span>
                {renderResult(tournament)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse text-white">
          <thead>
            <tr className="bg-black/50 border-b border-[#BBF429]/30">
              <th className="p-2 text-left">Tournament</th>
              <th className="p-2 text-center">Start Date</th>
              <th className="p-2 text-center">Entry Fee</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            {history.map((tournament) => (
              <tr 
                key={tournament.id}
                className="border-b border-[#BBF429]/20 hover:bg-black/30"
              >
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {tournament.image && (
                      <img 
                        src={tournament.image}
                        alt={tournament.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    )}
                    <span className="truncate">{tournament.name}</span>
                  </div>
                </td>
                <td className="p-2 text-center">{formatDate(tournament.start_time)}</td>
                <td className="p-2 text-center">₹{tournament.entry_fee}</td>
                <td className="p-2 text-center">{renderStatus(tournament.status)}</td>
                <td className="p-2 text-center">{renderResult(tournament)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentHistory;
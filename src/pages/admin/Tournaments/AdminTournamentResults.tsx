import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistance } from "date-fns";
import { LoadingSpinner } from "@/components/my-ui/Loader";

interface DisputedTournament {
  id: number;
  name: string;
  prize_pool: number;
  end_time: string;
  disputed_screenshots_count: number;
  resolution_method: string;
}

const AdminTournamentResults = () => {
  const [tournaments, setTournaments] = useState<DisputedTournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDisputedTournaments = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          "/api/admin/tournament-results/disputed-tournaments"
        );
        setTournaments(response.data);
      } catch (error) {
        console.error("Error fetching disputed tournaments:", error);
        toast.error("Failed to load disputed tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchDisputedTournaments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner size={30} color="white" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex-col gap-40 pt-15 bg-black p-4">
      <div className="container mx-auto p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold  sm:text-left mb-4 sm:mb-0">
            Disputed Tournament Results
          </h1>
        </div>

        {tournaments.length === 0 ? (
          <Card className="p-6 bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429]">
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div className="text-gray-400 mb-4">
                <CheckCircle className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Disputed Tournaments
              </h3>
              <p className="text-gray-500 text-center">
                All tournament results have been processed or are awaiting
                participant submissions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="overflow-hidden bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429]"
              >
                <CardHeader className="bg-ybg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] border-b ">
                  <CardTitle className="flex justify-between items-center">
                    <span className="truncate text-white">{tournament.name}</span>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Disputed
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm text-[#eaffa9]">
                        {tournament.disputed_screenshots_count} disputed
                        screenshot
                        {tournament.disputed_screenshots_count !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#eaffa9]">Prize Pool:</span>
                      <span className="font-semibold text-[#eaffa9]">
                        ₹{tournament.prize_pool}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className=" text-[#eaffa9]">Ended:</span>
                      <span className="text-[#eaffa9]">
                        {formatDistance(
                          new Date(tournament.end_time),
                          new Date(),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>

                    <Link
                      to={`/admin/tournament-results/${tournament.id}/review`}
                    >
                      <Button className="w-full">Review Results</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournamentResults;

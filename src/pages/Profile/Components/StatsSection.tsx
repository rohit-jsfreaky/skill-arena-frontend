import StatsArea from "./StatsArea";
import { Trophy, Wallet, Globe, Medal, Clock } from "lucide-react";
import EmailArea from "./EmailArea";
import { UserContextType } from "@/context/UserContext";

interface StatsSectionProps {
  myUser: UserContextType;
}

const StatsSection = ({ myUser }: StatsSectionProps) => {

  const getUserWinRate = () => {
    if ((myUser.total_games_played ?? 0) == 0) return "0.0%";
    const winRate =
      ((myUser.total_wins ?? 0) / (myUser.total_games_played ?? 0)) * 100;
    return `${winRate.toFixed(1)}%`;
  };
  return (
    <div className="px-4 md:px-8 py-6">
      <EmailArea myUser={myUser} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsArea
          title="Win Rate"
          value={getUserWinRate()}
          icon={<Trophy className="h-5 w-5" />}
        />
        {/* <StatsArea
          title="Reviews"
          value="0"
          icon={<Star className="h-5 w-5" />}
        /> */}
        <StatsArea
          title="Balance"
          value={`₹${myUser.wallet || "0"}`}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatsArea
          title="Region"
          value="Asia"
          icon={<Globe className="h-5 w-5" />}
        />
        <StatsArea
          title="Games Played"
          value={String(myUser.total_games_played || "0")}
          icon={<Medal className="h-5 w-5" />}
        />
        <StatsArea
          title="Member Since"
          value={new Date(myUser.created_at).toLocaleDateString()}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default StatsSection;

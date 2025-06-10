import { useEffect, useState } from "react";
import { getUserTournamentFinancials } from "@/api/tournament";
import { formatDate } from "@/utils/formatDate";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { useIsMobile } from "@/hooks/use-mobile"; 

interface TournamentFinancialsProps {
  userId: number;
}

interface FinancialItem {
  id: number;
  name: string;
  amount: number;
  transaction_date: string;
  transaction_type: "entry_fee" | "winnings";
}

const TournamentFinancials = ({ userId }: TournamentFinancialsProps) => {
  const [financials, setFinancials] = useState<FinancialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchFinancials = async () => {
      setLoading(true);
      const response = await getUserTournamentFinancials(userId);
      if (response.success) {
        setFinancials(response.data);

        // Calculate totals
        let spent = 0;
        let won = 0;
        response.data.forEach((item: FinancialItem) => {
          if (item.transaction_type === "entry_fee") {
            spent += Number(item.amount);
          } else {
            won += Number(item.amount);
          }
        });
        setTotalSpent(spent);
        setTotalWon(won);
      }
      setLoading(false);
    };

    if (userId) {
      fetchFinancials();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner color="white" size={30} />
      </div>
    );
  }

  if (financials.length === 0) {
    return (
      <div className="text-center p-8 text-gray-400">
        <p>No tournament financial history available.</p>
      </div>
    );
  }

  const renderFinancialCards = () => (
    <div className="grid grid-cols-1 gap-4">
      {financials.map((item, index) => (
        <div 
          key={`${item.id}-${index}`}
          className="bg-black/30 border border-[#BBF429]/30 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-white">{item.name}</h3>
              <p className="text-sm text-gray-400">{formatDate(item.transaction_date)}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                item.transaction_type === "entry_fee"
                  ? "bg-red-900/50 text-red-400"
                  : "bg-green-900/50 text-green-400"
              }`}
            >
              {item.transaction_type === "entry_fee" ? "Entry Fee" : "Prize Money"}
            </span>
          </div>
          <div className={`text-right font-medium ${
            item.transaction_type === "entry_fee"
              ? "text-red-400"
              : "text-green-400"
          }`}>
            {item.transaction_type === "entry_fee" ? "-" : "+"}$
            {Number(item.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderFinancialTable = () => (
    <div className="overflow-x-auto text-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black/50 border-b border-[#BBF429]/30">
            <th className="p-2 text-left">Tournament</th>
            <th className="p-2 text-center">Date</th>
            <th className="p-2 text-center">Type</th>
            <th className="p-2 text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          {financials.map((item, index) => (
            <tr
              key={`${item.id}-${index}`}
              className="border-b border-[#BBF429]/20 hover:bg-black/30"
            >
              <td className="p-2">{item.name}</td>
              <td className="p-2 text-center">
                {formatDate(item.transaction_date)}
              </td>
              <td className="p-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.transaction_type === "entry_fee"
                      ? "bg-red-900/50 text-red-400"
                      : "bg-green-900/50 text-green-400"
                  }`}
                >
                  {item.transaction_type === "entry_fee" ? "Entry Fee" : "Prize Money"}
                </span>
              </td>
              <td
                className={`p-2 text-center font-medium ${
                  item.transaction_type === "entry_fee"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {item.transaction_type === "entry_fee" ? "-" : "+"}$
                {Number(item.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4 text-[#BBF429]">
        Tournament Finances
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-black/30 border border-[#BBF429]/30 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Total Spent</h3>
          <p className="text-xl font-bold text-red-400">
            -${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="bg-black/30 border border-[#BBF429]/30 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Total Won</h3>
          <p className="text-xl font-bold text-green-400">
            +${totalWon.toFixed(2)}
          </p>
        </div>
        <div className="bg-black/30 border border-[#BBF429]/30 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Net Profit/Loss</h3>
          <p
            className={`text-xl font-bold ${
              totalWon - totalSpent >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ${(totalWon - totalSpent).toFixed(2)}
          </p>
        </div>
      </div>

      {isMobile ? renderFinancialCards() : renderFinancialTable()}
    </div>
  );
};

export default TournamentFinancials;

type TournamentPrizePoolProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  prize_pool: number;
};
const TournamentPrizePool = ({
  prize_pool,
  handleChange,
}: TournamentPrizePoolProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        Prize Pool (USD)*
      </label>
      <input
        type="number"
        name="prize_pool"
        value={prize_pool}
        onChange={handleChange}
        min="0"
        step="1"
        required
        className="w-full text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TournamentPrizePool;

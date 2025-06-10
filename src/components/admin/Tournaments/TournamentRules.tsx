type TournamentRulesProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  rules: string;
};
const TournamentRules = ({ rules, handleChange }: TournamentRulesProps) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-white mb-1">
        Tournament Rules*
      </label>
      <textarea
        name="rules"
        value={rules}
        onChange={handleChange}
        required
        rows={4}
        className="w-full  text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="List the rules and guidelines for this tournament..."
      />
    </div>
  );
};

export default TournamentRules;

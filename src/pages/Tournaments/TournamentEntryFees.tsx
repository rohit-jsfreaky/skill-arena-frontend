type TournamentEntryFeesProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  fees: number;
  name: string;
};

const TournamentEntryFees = ({
  fees,
  handleChange,
  name,
}: TournamentEntryFeesProps) => {
  const getName = () => {
    if (name === "entry_fee_normal") {
      return "entry_fee_normal";
    } else if (name === "entry_fee_pro") {
      return "entry_fee_pro";
    }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        Entry Fee{" "}
        {name === "entry_fee_pro" ? "(Pro Users)*" : "(Normal Users)*"}*
      </label>
      <input
        type="number"
        name={getName()}
        value={fees}
        onChange={handleChange}
        min="0"
        step="1"
        required
        className="w-full text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TournamentEntryFees;

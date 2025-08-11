type TournamentParticipantsProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  max_participants: number;
  disabled?: boolean;
};

const TournamentParticipants = ({
  max_participants,
  handleChange,
  disabled = false,
}: TournamentParticipantsProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        Maximum Participants*
      </label>
      <input
        type="number"
        name="max_participants"
        value={max_participants}
        onChange={handleChange}
        min="2"
        required
        disabled={disabled}
        className={`w-full text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'bg-gray-600 opacity-50 cursor-not-allowed' : ''
        }`}
      />
      {disabled && (
        <p className="text-xs text-gray-400 mt-1">
          Auto-calculated for slot-based tournaments
        </p>
      )}
    </div>
  );
};

export default TournamentParticipants;

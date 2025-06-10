type TournamentParticipantsProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  max_participants: number;
};

const TournamentParticipants = ({
  max_participants,
  handleChange,
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
        className="w-full text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TournamentParticipants;

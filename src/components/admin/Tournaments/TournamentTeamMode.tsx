type TournamentTeamModeProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  team_mode: string;
};

const TournamentTeamMode = ({
  team_mode,
  handleChange,
}: TournamentTeamModeProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1 ">
        Team Mode*
      </label>
      <select
        name="team_mode"
        value={team_mode}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="solo" className="text-black">
          Solo
        </option>
        <option value="duo" className="text-black">
          Duo
        </option>
        <option value="4v4" className="text-black">
          4v4
        </option>
        <option value="6v6" className="text-black">
          6v6
        </option>
        <option value="8v8" className="text-black">
          8v8
        </option>
      </select>
    </div>
  );
};

export default TournamentTeamMode;

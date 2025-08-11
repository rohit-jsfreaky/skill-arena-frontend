import React from 'react';

type TournamentTypeProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  tournament_type: string;
};

const TournamentType = ({
  tournament_type,
  handleChange,
}: TournamentTypeProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        Tournament Type*
      </label>
      <select
        name="tournament_type"
        value={tournament_type}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="regular" className="text-black">
          Regular Tournament
        </option>
        <option value="slot-based" className="text-black">
          Slot-Based Tournament (Groups)
        </option>
      </select>
      <p className="text-xs text-gray-400 mt-1">
        {tournament_type === 'slot-based' 
          ? 'Players join specific groups based on tournament mode'
          : 'Traditional first-come-first-serve tournament'
        }
      </p>
    </div>
  );
};

export default TournamentType;

import React from 'react';

type TournamentMaxGroupsProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  max_groups: number;
  tournament_type: string;
  team_mode: string;
};

const TournamentMaxGroups = ({
  max_groups,
  handleChange,
  tournament_type,
  team_mode,
}: TournamentMaxGroupsProps) => {
  if (tournament_type !== 'slot-based') return null;

  const slotsPerGroup = {
    'solo': 1,
    'duo': 2,
    '4v4': 4,
    '6v6': 6,
    '8v8': 8
  }[team_mode] || 1;

  const totalSlots = max_groups * slotsPerGroup;

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        Number of Groups*
      </label>
      <input
        type="number"
        name="max_groups"
        value={max_groups}
        onChange={handleChange}
        min="1"
        max="50"
        required
        className="w-full px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-400 mt-1">
        {max_groups} groups × {slotsPerGroup} slots = {totalSlots} total players
      </p>
    </div>
  );
};

export default TournamentMaxGroups;

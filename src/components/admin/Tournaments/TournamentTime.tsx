import React from "react";

type TournamentTimeProps = {
  time: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: "start_time" | "end_time";
  minTime: string;
};

const TournamentTime: React.FC<TournamentTimeProps> = ({
  time,
  handleChange,
  label,
  name,
  minTime,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        {label}*
      </label>
      <input
        type="datetime-local"
        name={name}
        value={time}
        onChange={handleChange}
        min={minTime}
        required
        className="w-full text-white px-3 py-2  border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
      />
    </div>
  );
};

export default TournamentTime;
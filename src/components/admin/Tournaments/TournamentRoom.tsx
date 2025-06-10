import React from "react";

type TournamentRoomProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | null | undefined;
  fieldName: "room_id" | "room_password";
  label: string;
  placeholder: string;
};

const TournamentRoom: React.FC<TournamentRoomProps> = ({
  handleChange,
  value,
  fieldName,
  label,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <input
        type={"text"}
        name={fieldName}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
      />
      <p className="text-sm text-gray-300 mt-1">
        {fieldName === "room_id" 
          ? "Game room identifier that players will join" 
          : "Password required to enter the game room"}
      </p>
    </div>
  );
};

export default TournamentRoom;
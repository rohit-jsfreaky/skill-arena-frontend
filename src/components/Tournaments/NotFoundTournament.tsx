import React from "react";
import { NavigateFunction } from "react-router";

interface NotFoundTournamentProps {
  navigate: NavigateFunction;
  name?: string;
}

const NotFoundTournament: React.FC<NotFoundTournamentProps> = ({
  navigate,
  name
}) => {
  const handleNavigation = () => {
    if (name === "admin") {
      navigate("/admin/tournaments");
    } else {
      navigate("/tournaments");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Tournament Not Found
        </h2>
        <p className="mb-4 text-white">
          The tournament you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleNavigation}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
        >
          Back to Tournaments
        </button>
      </div>
    </div>
  );
};

export default NotFoundTournament;

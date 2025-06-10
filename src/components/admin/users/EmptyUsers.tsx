import React from "react";

interface EmptyUsersProps {
  message?: string;
}

const EmptyUsers: React.FC<EmptyUsersProps> = ({
  message = "No users found."
}) => {
  return (
    <div className="flex justify-center p-8 text-white">
      <p>{message}</p>
    </div>
  );
};

export default EmptyUsers;
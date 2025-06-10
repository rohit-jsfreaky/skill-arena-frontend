import React from "react";

interface UserLoadingProps {
  size?: number;
}

const UserLoading: React.FC<UserLoadingProps> = ({ size = 12 }) => {
  return (
    <div className="flex justify-center p-8">
      <div 
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-[#BBF429]`}
      ></div>
    </div>
  );
};

export default UserLoading;
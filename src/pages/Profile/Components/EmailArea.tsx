import { UserContextType } from "@/context/UserContext";
import React from "react";

interface EmailAreaProps {
  myUser: UserContextType;
}

const EmailArea: React.FC<EmailAreaProps> = ({ myUser }) => {
  return (
    <div className="flex flex-col pt-2 lg:flex-row md:items-center px-2 md:px-10 justify-between">
      <div>
        <h1 className="text-sm  md:text-xl text-white py-2">Email Address</h1>
      </div>

      <div>
        {myUser && (
          <h1 className="text-white text-sm md:text-xl">{myUser.email}</h1>
        )}
      </div>
    </div>
  );
};

export default EmailArea;

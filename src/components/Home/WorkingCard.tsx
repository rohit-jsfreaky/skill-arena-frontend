import React from "react";

interface WorkingCardProps {
  title: string;
  description: string;
  image?: string;
}

const WorkingCard: React.FC<WorkingCardProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <div
      className="font-bold min-h-[16rem] sm:min-h-[18rem] hover:shadow-[0_0_10px_#BBF429] hover:scale-105 transition-transform duration-300 ease-in-out w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 py-4 sm:px-6 sm:py-6 items-center text-white justify-between flex flex-col border border-[#BBF429]   rounded-2xl"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        boxShadow: "0 0 10px #BBF429",
      }}
    >
      <h1 className="text-base sm:text-lg lg:text-xl text-center break-words">
        {title}
      </h1>
      <h1 className="text-base sm:text-lg lg:text-xl text-center break-words">
        {description}
      </h1>
    </div>
  );
};

export default WorkingCard;

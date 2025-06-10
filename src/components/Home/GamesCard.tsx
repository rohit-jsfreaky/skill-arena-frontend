import React from "react";

interface GamesCardProps {
  url:string
}

const GamesCard:React.FC<GamesCardProps> = ({url}) => {
    return (
      <div className="bg-white hover:scale-105 transition-transform h-18 w-18 duration-300 ease-in-out rounded-2xl md:h-28 md:w-28 shadow-[0_0_10px_#BBF429]">
        <img
          src={url}
          alt="game"
          className="rounded-2xl object-cover"
        />
      </div>
    );
  };
  
  export default GamesCard;
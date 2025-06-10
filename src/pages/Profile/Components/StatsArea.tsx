import React from "react";

interface StatsAreaProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

const StatsArea: React.FC<StatsAreaProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-[#BBF429]/20 rounded-xl p-4 hover:bg-[#BBF429]/5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-[#BBF429]">{icon}</div>}
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-white text-lg font-bold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsArea;

import React, { useState } from "react";
import { Check } from "lucide-react";

interface BenefitsListProps {
  benefits: string[];
  className?: string;
}

const BenefitsList: React.FC<BenefitsListProps> = ({ benefits, className = "" }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!benefits || benefits.length === 0) {
    return <p className="text-gray-400 italic">No benefits listed</p>;
  }

  const displayedBenefits = showAll ? benefits : benefits.slice(0, 5);
  const hasMore = benefits.length > 5;

  return (
    <div className={className + "text-white"}>
      <ul className="space-y-2">
        {displayedBenefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 mt-1 text-[#BBF429]">
              <Check size={16} />
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      
      {hasMore && (
        <button
          className="mt-2 text-sm text-[#BBF429] hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : `Show all ${benefits.length} benefits`}
        </button>
      )}
    </div>
  );
};

export default BenefitsList;
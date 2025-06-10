import React from "react";
import { LoadingSpinner } from "@/components/my-ui/Loader";

interface TransactionLoaderProps {
  size?: number;
  color?: string;
}

const TransactionLoader: React.FC<TransactionLoaderProps> = ({
  size = 50,
  color = "white"
}) => {
  return (
    <div className="flex justify-center items-center my-auto">
      <LoadingSpinner color={color} size={size} />
    </div>
  );
};

export default TransactionLoader;
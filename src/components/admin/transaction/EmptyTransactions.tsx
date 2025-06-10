import React from "react";

interface EmptyTransactionsProps {
  message?: string;
}

const EmptyTransactions: React.FC<EmptyTransactionsProps> = ({
  message = "No transactions found."
}) => {
  return (
    <div className="flex justify-center p-8 text-white">
      <p>{message}</p>
    </div>
  );
};

export default EmptyTransactions;
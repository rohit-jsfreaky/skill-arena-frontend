import React from 'react';

interface StatusMessagesProps {
  error?: string | null;
  success?: string | null;
}

const StatusMessages: React.FC<StatusMessagesProps> = ({ error, success }) => {
  if (!error && !success) return null;
  
  return (
    <div className="mb-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
};

export default StatusMessages;
import React from 'react';

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  status?: string;
}

const InfoItem = ({ label, value, icon, status }: InfoItemProps) => (
  <div className="flex items-start space-x-3">
    <div className="text-[#BBF429]">{icon}</div>
    <div>
      <p className="text-sm text-[#BBF429] font-medium">{label}</p>
      <div className="text-white mt-1 flex items-center gap-2">
        {value}
        {status && (
          <span className="text-xs text-red-400 font-medium">({status})</span>
        )}
      </div>
    </div>
  </div>
);

export default InfoItem;
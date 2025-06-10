import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-black/40 rounded-lg p-6 border border-[#BBF429]/20 backdrop-blur-sm">
      <h2 className="text-[#BBF429] font-semibold mb-4 text-lg">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
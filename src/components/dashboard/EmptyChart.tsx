import { BarChart3 } from "lucide-react";

interface EmptyChartProps {
  title: string;
  message?: string;
}

const EmptyChart = ({ title, message = "No data available" }: EmptyChartProps) => {
  return (
    <div className="bg-black/70 border border-[#BBF429]/30 rounded-lg p-5 shadow-lg">
      <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
      <div className="h-[300px] flex flex-col items-center justify-center">
        <BarChart3 className="h-12 w-12 text-gray-600 mb-3" />
        <p className="text-gray-400 text-center">{message}</p>
      </div>
    </div>
  );
};

export default EmptyChart;
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#BBF429", "#3182CE", "#F6AD55", "#718096"];

interface ChartData {
  name: string;
  value: number;
}

interface DoughnutChartProps {
  data: ChartData[];
  title: string;
}

const DoughnutChart = ({ data, title }: DoughnutChartProps) => {
  const [dimensions, setDimensions] = useState({
    innerRadius: 60,
    outerRadius: 100,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) { // Mobile
        setDimensions({ innerRadius: 40, outerRadius: 70 });
      } else if (width <= 768) { // Tablet
        setDimensions({ innerRadius: 50, outerRadius: 85 });
      } else { // Desktop
        setDimensions({ innerRadius: 60, outerRadius: 100 });
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-black/70 border border-[#BBF429]/30 rounded-lg p-3 sm:p-4 md:p-5 shadow-lg">
      <h3 className="text-base sm:text-lg font-medium text-white mb-2 sm:mb-4">{title}</h3>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={dimensions.innerRadius}
              outerRadius={dimensions.outerRadius}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => {
                const screenWidth = window.innerWidth;
                if (percent === 0) return null;
                if (screenWidth <= 480) {
                  return `${(percent * 100).toFixed(0)}%`;
                }
                return `${name}: ${(percent * 100).toFixed(0)}%`;
              }}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              labelStyle={{ color: "white" }}
              formatter={(value) => [`${value}`, "Count"]}
              contentStyle={{
                backgroundColor: "#111",
                borderColor: "#BBF429",
                color: "white",
              }}
              itemStyle={{ color: "white" }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: window.innerWidth <= 480 ? '12px' : '14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DoughnutChart;

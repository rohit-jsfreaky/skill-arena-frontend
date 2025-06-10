import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO, isValid, subDays } from "date-fns";

// Improved function to fill missing dates and handle different date formats
const fillMissingDates = (
  data: { date: string; count: number }[],
  days: number = 30
) => {
  const filledData = [];
  const dataMap = new Map();

  // Process and normalize the input data
  data.forEach((item) => {
    // Handle different date formats
    const dateObj = parseISO(item.date);
    if (isValid(dateObj)) {
      const formattedDate = format(dateObj, "yyyy-MM-dd");
      dataMap.set(formattedDate, item.count);
    }
  });

  // Create array of last N days
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    filledData.push({
      date,
      count: dataMap.has(date) ? dataMap.get(date) : 0,
    });
  }

  return filledData;
};

interface LineChartProps {
  data: { date: string; count: number }[];
  title: string;
  color?: string;
  days?: number;
  emptyMessage?: string;
}

const LineChart = ({
  data,
  title,
  color = "#BBF429",
  days = 30,
  emptyMessage = "No data available for this period",
}: LineChartProps) => {
  // Check if data is available
  const hasData = data && data.length > 0;

  // Process data safely
  const chartData = hasData ? fillMissingDates(data, days) : [];

  // Check if there are any non-zero values
  const hasNonZeroData = chartData.some((item) => item.count > 0);

  return (
    <div className="bg-black/70 border border-[#BBF429]/30 rounded-lg p-5 shadow-lg">
      <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
      <div className="h-[300px] flex items-center justify-center">
        {!hasData || !hasNonZeroData ? (
          <div className="text-gray-400 text-center">{emptyMessage}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                stroke="#888"
                tickFormatter={(val) => {
                  try {
                    return format(parseISO(val), "MMM dd");
                  } catch {
                    return val;
                  }
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#888"
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value}`, "Count"]}
                labelFormatter={(label) => {
                  try {
                    return format(parseISO(label as string), "MMM dd, yyyy");
                  } catch {
                    return label;
                  }
                }}
                contentStyle={{
                  backgroundColor: "#111",
                  borderColor: color,
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Count"
                stroke={color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default LineChart;

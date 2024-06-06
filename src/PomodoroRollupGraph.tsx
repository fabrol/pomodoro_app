import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

type RollupGraphProps = {
  data: Array<{ name: string; count: number }>;
  period: string;
};

function getLastDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function customTickFormatter(
  tick: string,
  period: string,
  year: number = new Date().getFullYear()
): string {
  switch (period) {
    case "day":
      if (tick === "0") return "AM";
      if (tick === "6") return "6";
      if (tick === "12") return "PM";
      if (tick === "18") return "6";
      return "";
    case "week":
      const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
      const weekdayIndex = parseInt(tick);
      return weekdays[weekdayIndex] || "";
    case "month":
      const firstDays = ["1", "8", "15", "22"];
      const monthIndex = parseInt(tick) - 1;
      const lastDay = getLastDayOfMonth(monthIndex + 1, year).toString();
      if (firstDays.includes(tick) || tick === lastDay) {
        return tick;
      }
      return "";
    case "year":
      const months = [
        "J",
        "F",
        "M",
        "A",
        "M",
        "J",
        "J",
        "A",
        "S",
        "O",
        "N",
        "D",
      ];
      return months[parseInt(tick) - 1] || "";
    default:
      return tick;
  }
}

const PomodoroRollupGraph: React.FC<RollupGraphProps> = ({ data, period }) => {
  const chartKey = `chart-${period}`;

  return (
    <BarChart
      key={chartKey}
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
      barSize={20}
    >
      <YAxis type="number" domain={[0, "dataMax"]} hide={true} />
      <XAxis
        dataKey="name"
        tickFormatter={(tick) => customTickFormatter(tick, period)}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip />
      {/* Single Bar with conditional Cell coloring */}
      <Bar
        dataKey="count"
        fill="#8884d8"
        background={{ fill: "#ccc" }}
        animationDuration={500}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.count > 0 ? "#8884d8" : "#ccc"} // Only color the cell if there is data
          />
        ))}
      </Bar>
    </BarChart>
  );
};

export default PomodoroRollupGraph;

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
import { useMantineTheme } from "@mantine/core"; // Import useMantineTheme

type RollupGraphProps = {
  data: Array<{ name: string; count: number }>;
  period: string;
};

function customTickFormatter(
  tick: string,
  period: string,
  dataLength: number
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
      if (firstDays.includes(tick) || tick === dataLength.toString()) {
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

// Hooked in if i want to do something with it in the future.
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    //console.log(payload);
  }

  return null;
};

const PomodoroRollupGraph: React.FC<RollupGraphProps> = ({ data, period }) => {
  const theme = useMantineTheme(); // Access the theme

  // Custom label component that only shows labels for non-zero values
  const renderCustomBarLabel = ({ x, y, width, height, value }) => {
    const dy = height < 30 ? -5 : 18;
    const fs =
      value.toString().length > 1
        ? width / (value.toString().length * 0.8)
        : width * 0.9;
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="white"
        textAnchor="middle"
        dy={dy}
        fontSize={fs}
      >
        {value > 0 ? value : ""}
      </text>
    );
  };

  return (
    <BarChart
      key={`chart-${period}`}
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 10,
        left: 10,
        bottom: 5,
      }}
      barSize={20}
    >
      <YAxis type="number" domain={[0, "dataMax"]} hide={true} />
      <XAxis
        dataKey="name"
        tickFormatter={(tick) => customTickFormatter(tick, period, data.length)}
        fontSize={20}
        tickLine={false}
        axisLine={false}
        interval={0}
      />
      <Tooltip
        content={<CustomTooltip active={undefined} payload={undefined} />}
        cursor={false}
      />
      {
        <Bar
          dataKey="count"
          fill={theme.colors.myGreen[8]}
          background={{ fill: "#ccc", radius: 10, fillOpacity: 0.2 }}
          radius={10}
          label={(props) => renderCustomBarLabel(props)}
        ></Bar>
      }
    </BarChart>
  );
};

export default PomodoroRollupGraph;

"use client";

import React, { useState, useEffect } from "react";
import { PomodoroStats, calculatePomodoroStats } from "./HistoryAnalyzer";
import { PomodoroEntry } from "./PomodoroHistory";
import PomodoroRollupGraph from "./PomodoroRollupGraph";
import PomodoroHistoryDisplay from "./PomodoroHistoryDisplay";

type Props = {
  history: PomodoroEntry[];
};

const PomodoroStatsDisplay: React.FC<Props> = ({ history }) => {
  const [period, setPeriod] = useState("day"); // 'day', 'week', 'month', 'year'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<PomodoroStats | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rollupArray, setRollupArray] = useState<
    Array<{ name: string; count: number }>
  >([]);

  useEffect(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (period) {
      case "day":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case "month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(start.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case "year":
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    setStartDate(start);
    setEndDate(end);

    const { stats, rollups } = calculatePomodoroStats(
      history,
      start,
      end,
      period
    );
    setStats(stats);
    const newRollupArray = Array.from(rollups, ([name, count]) => ({
      name,
      count,
    }));
    setRollupArray(newRollupArray);
  }, [period, currentDate, history]);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(event.target.value);
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today to allow navigation within the current day

    switch (period) {
      case "day":
        newDate.setDate(newDate.getDate() + direction);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + direction * 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
    }

    if (newDate <= today) {
      setCurrentDate(newDate);
    }
  };

  const formatDateDisplay = () => {
    if (period === "day") {
      return startDate.toLocaleDateString();
    } else if (period === "week") {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else if (period === "month") {
      return `${startDate.toLocaleString("default", {
        month: "long",
      })} ${startDate.getFullYear()}`;
    } else if (period === "year") {
      return startDate.getFullYear().toString();
    }
  };

  return (
    <div>
      <h3>Pomodoro Statistics</h3>
      <div>
        <select value={period} onChange={handlePeriodChange}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <button onClick={() => navigateDate(-1)}>Previous</button>
        <button onClick={() => navigateDate(1)}>Next</button>
      </div>
      <div>
        <strong>Selected Period:</strong> {formatDateDisplay()}
      </div>
      {stats && (
        <ul>
          <li>
            Total Work Time: {stats.totalWorkTime.minutes} minutes{" "}
            {stats.totalWorkTime.seconds} seconds
          </li>
          <li>
            Actual Work Time: {stats.actualWorkTime.minutes} minutes{" "}
            {stats.actualWorkTime.seconds} seconds
          </li>
          <li>
            Total Break Time: {stats.totalBreakTime.minutes} minutes{" "}
            {stats.totalBreakTime.seconds} seconds
          </li>
          <li>Work Sessions: {stats.workSessions}</li>
          <li>Break Sessions: {stats.breakSessions}</li>
          <li>Total Cycles: {stats.totalCycles}</li>
          <li>Work Interruptions: {stats.workInterruptions}</li>
        </ul>
      )}
      <PomodoroRollupGraph data={rollupArray} period={period} />
      <PomodoroHistoryDisplay history={history} />
    </div>
  );
};

export default PomodoroStatsDisplay;

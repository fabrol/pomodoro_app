"use client";

import React, { useState, useEffect } from "react";
import { PomodoroStats, calculatePomodoroStats } from "./HistoryAnalyzer";
import { PomodoroEntry } from "./PomodoroHistory";
import PomodoroRollupGraph from "./PomodoroRollupGraph";
import PomodoroHistoryDisplay from "./PomodoroHistoryDisplay";
import {
  Text,
  SegmentedControl,
  Button,
  ActionIcon,
  Divider,
} from "@mantine/core";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { useMantineTheme } from "@mantine/core";
import { isTestMode } from "./constants";

type Props = {
  history: PomodoroEntry[];
};

const PomodoroStatsDisplay: React.FC<Props> = ({ history }) => {
  const theme = useMantineTheme();
  const minHeight = theme.fontSizes.lg;

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

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
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

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  };

  return (
    <div
      className="pomodoro-stats"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text fz="sm">Pomodoro Statistics</Text>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <SegmentedControl
          value={period}
          onChange={handlePeriodChange}
          data={["day", "week", "month", "year"].map((value) => ({
            value,
            label: <Text fz="xs">{value}</Text>,
          }))}
          styles={{
            label: {
              padding: "0px 12px",
            },
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            minHeight: minHeight,
          }}
        >
          <ActionIcon
            onClick={() => navigateDate(-1)}
            size="sm"
            style={{ background: "transparent" }}
          >
            <MdChevronLeft />
          </ActionIcon>
          {period === "week" ? (
            <Text fz="xs">{formatDateDisplay()}</Text>
          ) : (
            <Text fz="sm">{formatDateDisplay()}</Text>
          )}
          <ActionIcon
            onClick={() => navigateDate(1)}
            size="sm"
            style={{ background: "transparent" }}
          >
            <MdChevronRight />
          </ActionIcon>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PomodoroRollupGraph data={rollupArray} period={period} />
        {stats && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%", // Ensure the container takes full width
            }}
          >
            <Text fz="sm" style={rowStyle}>
              Flows <span>{stats.workSessions}</span>
            </Text>
            <Text fz="smm" style={rowStyle}>
              Time{" "}
              <span>
                {stats.totalWorkTime.minutes}m {stats.totalWorkTime.seconds}s
              </span>
            </Text>
            <Text fz="smm" style={rowStyle}>
              Tracked Time{" "}
              <span>
                {stats.actualWorkTime.minutes}m {stats.actualWorkTime.seconds}s
              </span>
            </Text>
            <Text fz="smm" style={rowStyle}>
              Cycles<span>{stats.totalCycles}</span>
            </Text>
            <Divider my="sm" />
            <Text fz="sm" style={rowStyle}>
              Breaks<span>{stats.breakSessions}</span>
            </Text>
            <Text fz="smm" style={rowStyle}>
              Time{" "}
              <span>
                {stats.totalBreakTime.minutes}m {stats.totalBreakTime.seconds}s
              </span>
            </Text>
            <Text fz="smm" style={rowStyle}>
              Interruptions<span>{stats.workInterruptions}</span>
            </Text>
          </div>
        )}
      </div>
      {isTestMode && <PomodoroHistoryDisplay history={history} />}
    </div>
  );
};

export default PomodoroStatsDisplay;

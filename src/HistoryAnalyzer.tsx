import { PomodoroEntry } from "./PomodoroHistory";
import { Time } from "./constants";

export interface PomodoroStats {
  totalWorkTime: Time;
  actualWorkTime: Time;
  totalBreakTime: Time;
  workSessions: number;
  breakSessions: number;
  totalCycles: number;
  workInterruptions: number;
}

export type RollupArray = Array<{ name: string; count: number }>;

function getRollupKey(date: Date, period: string): string {
  switch (period) {
    case "day":
      return `${date.getHours()}`;
    case "week":
      return `${date.getDay()}`; // 0 (Sunday) to 6 (Saturday)
    case "month":
      return `${date.getDate()}`; // 1 to 31
    case "year":
      return `${date.getMonth() + 1}`; // 1 (January) to 12 (December)
    default:
      return "";
  }
}

function initializeRollups(period: string): Map<string, number> {
  const rollups = new Map<string, number>();

  switch (period) {
    case "day":
      for (let hour = 0; hour < 24; hour++) {
        rollups.set(`${hour}`, 0);
      }
      break;
    case "week":
      for (let day = 0; day < 7; day++) {
        rollups.set(`${day}`, 0);
      }
      break;
    case "month":
      for (let date = 1; date <= 31; date++) {
        rollups.set(`${date}`, 0);
      }
      break;
    case "year":
      for (let month = 1; month <= 12; month++) {
        rollups.set(`${month}`, 0);
      }
      break;
  }

  return rollups;
}

function formatRollupKeys(
  rollups: Map<string, number>,
  period: string
): Map<string, number> {
  const formattedRollups = new Map<string, number>();
  rollups.forEach((count, key) => {
    let formattedKey = key;
    switch (period) {
      case "day":
        formattedKey = `${key}`; // Format as hour of the day
        break;
      case "week":
        //const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        //formattedKey = weekdays[parseInt(key)]; // Convert day index to weekday name
        formattedKey = `${key}`;
        break;
      case "month":
        formattedKey = `${key}`;
        break;
      case "year":
        formattedKey = `${key}`;
        break;
    }
    formattedRollups.set(formattedKey, count);
  });
  return formattedRollups;
}

export function calculatePomodoroStats(
  history: PomodoroEntry[],
  startDate: Date,
  endDate: Date,
  period: string
): { stats: PomodoroStats; rollups: Map<string, number> } {
  let stats: PomodoroStats = {
    totalWorkTime: { minutes: 0, seconds: 0 },
    actualWorkTime: { minutes: 0, seconds: 0 },
    totalBreakTime: { minutes: 0, seconds: 0 },
    workSessions: 0,
    breakSessions: 0,
    totalCycles: 0,
    workInterruptions: 0,
  };

  const rollups = initializeRollups(period);

  history.forEach((entry) => {
    const entryDate = new Date(entry.ended_at);
    if (entryDate >= startDate && entryDate <= endDate) {
      const rollupKey = getRollupKey(entryDate, period);
      if (entry.pomo_cat === "work") {
        rollups.set(rollupKey, (rollups.get(rollupKey) || 0) + 1);

        const totalWorkTimeInSeconds =
          entry.pomo_duration_min * 60 + (entry.pomo_duration_seconds || 0);
        const timeLeftInSeconds =
          (entry.time_left_minutes || 0) * 60 + (entry.time_left_seconds || 0);
        const actualWorkTimeInSeconds =
          totalWorkTimeInSeconds - timeLeftInSeconds;

        stats.totalWorkTime.seconds += totalWorkTimeInSeconds;
        stats.actualWorkTime.seconds += actualWorkTimeInSeconds;
        stats.workSessions++;

        if (timeLeftInSeconds > 0) {
          stats.workInterruptions++;
        }
      }
    }
  });

  // Normalize seconds to minutes
  stats.totalWorkTime.minutes += Math.floor(stats.totalWorkTime.seconds / 60);
  stats.totalWorkTime.seconds %= 60;
  stats.totalBreakTime.minutes += Math.floor(stats.totalBreakTime.seconds / 60);
  stats.totalBreakTime.seconds %= 60;
  stats.actualWorkTime.minutes += Math.floor(stats.actualWorkTime.seconds / 60);
  stats.actualWorkTime.seconds %= 60;

  stats.totalCycles = Math.floor(stats.workSessions / 4);

  const formattedRollups = formatRollupKeys(rollups, period);

  return { stats, rollups: formattedRollups };
}

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

export function calculatePomodoroStats(
  history: PomodoroEntry[],
  startDate: Date,
  endDate: Date
): PomodoroStats {
  let stats: PomodoroStats = {
    totalWorkTime: { minutes: 0, seconds: 0 },
    actualWorkTime: { minutes: 0, seconds: 0 },
    totalBreakTime: { minutes: 0, seconds: 0 },
    workSessions: 0,
    breakSessions: 0,
    totalCycles: 0,
    workInterruptions: 0,
  };

  history.forEach((entry) => {
    const entryDate = new Date(entry.ended_at);
    if (entryDate >= startDate && entryDate <= endDate) {
      if (entry.pomo_cat === "work") {
        // Convert all times to seconds first
        const totalWorkTimeInSeconds =
          entry.pomo_duration_min * 60 + (entry.pomo_duration_seconds || 0);
        const timeLeftInSeconds =
          (entry.time_left_minutes || 0) * 60 + (entry.time_left_seconds || 0);

        // Calculate the actual work time in seconds
        const actualWorkTimeInSeconds =
          totalWorkTimeInSeconds - timeLeftInSeconds;

        // Update total work time in seconds
        stats.totalWorkTime.seconds += totalWorkTimeInSeconds;
        stats.actualWorkTime.seconds += actualWorkTimeInSeconds;

        // Increment work sessions
        stats.workSessions++;

        // Check for interruptions
        if (timeLeftInSeconds > 0) {
          stats.workInterruptions++;
        }
      } else {
        // Convert all times to seconds first for break entries
        const totalBreakTimeInSeconds =
          entry.pomo_duration_min * 60 + (entry.pomo_duration_seconds || 0);
        const breakTimeLeftInSeconds =
          (entry.time_left_minutes || 0) * 60 + (entry.time_left_seconds || 0);

        // Calculate the actual break time in seconds
        const actualBreakTimeInSeconds =
          totalBreakTimeInSeconds - breakTimeLeftInSeconds;

        // Update total break time in seconds
        stats.totalBreakTime.seconds += actualBreakTimeInSeconds;

        // Increment break sessions
        stats.breakSessions++;
      }
    }
  });

  // Normalize seconds to minutes at the end of processing all entries
  stats.totalWorkTime.minutes += Math.floor(stats.totalWorkTime.seconds / 60);
  stats.totalWorkTime.seconds %= 60;
  stats.totalBreakTime.minutes += Math.floor(stats.totalBreakTime.seconds / 60);
  stats.totalBreakTime.seconds %= 60;
  stats.actualWorkTime.minutes += Math.floor(stats.actualWorkTime.seconds / 60);
  stats.actualWorkTime.seconds %= 60;

  stats.totalCycles = Math.floor(stats.workSessions / 4);

  return stats;
}

import { PomodoroEntry } from "./PomodoroHistory";

export interface PomodoroStats {
  totalWorkTimeMinutes: number;
  totalWorkTimeSeconds: number;
  totalBreakTimeMinutes: number;
  totalBreakTimeSeconds: number;
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
    totalWorkTimeMinutes: 0,
    totalWorkTimeSeconds: 0,
    totalBreakTimeMinutes: 0,
    totalBreakTimeSeconds: 0,
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
        stats.totalWorkTimeSeconds += actualWorkTimeInSeconds;

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
        stats.totalBreakTimeSeconds += actualBreakTimeInSeconds;

        // Increment break sessions
        stats.breakSessions++;
      }
    }
  });

  // Normalize seconds to minutes at the end of processing all entries
  stats.totalWorkTimeMinutes += Math.floor(stats.totalWorkTimeSeconds / 60);
  stats.totalWorkTimeSeconds %= 60;
  stats.totalBreakTimeMinutes += Math.floor(stats.totalBreakTimeSeconds / 60);
  stats.totalBreakTimeSeconds %= 60;

  stats.totalCycles = Math.floor(stats.workSessions / 4);

  return stats;
}

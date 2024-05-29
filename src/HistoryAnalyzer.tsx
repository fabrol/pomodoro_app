import { PomodoroEntry, Time } from "./PomodoroHistory";

interface PomodoroStats {
  totalWorkTime: number;
  totalBreakTime: number;
  workSessions: number;
  breakSessions: number;
  totalCycles: number;
  workInterruptions: number; // Added this line
}

export function calculatePomodoroStats(
  history: PomodoroEntry[],
  startDate: Date,
  endDate: Date
): PomodoroStats {
  let stats: PomodoroStats = {
    totalWorkTime: 0,
    totalBreakTime: 0,
    workSessions: 0,
    breakSessions: 0,
    totalCycles: 0,
    workInterruptions: 0, // Initialize interruptions count
  };

  history.forEach((entry) => {
    const entryDate = new Date(entry.ended_at);
    if (entryDate >= startDate && entryDate <= endDate) {
      const sessionTime =
        entry.pomo_duration_min - (entry.time_left_minutes || 0);
      if (entry.pomo_cat === "work") {
        stats.totalWorkTime += sessionTime;
        stats.workSessions++;
        // Check both minutes and seconds to determine if there was an interruption
        if (
          (entry.time_left_minutes ?? 0) > 0 ||
          (entry.time_left_seconds ?? 0) > 0
        ) {
          stats.workInterruptions++; // Increment interruptions if time was left
        }
      } else {
        stats.totalBreakTime += sessionTime;
        stats.breakSessions++;
      }
    }
  });

  stats.totalCycles = Math.floor(stats.workSessions / 4);

  return stats;
}

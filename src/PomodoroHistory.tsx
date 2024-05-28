export type Time = {
  minutes: number;
  seconds: number;
};

type PomodoroEntry = {
  timestamp: Date;
  pomodoroIndex: number;
  completed: boolean;
  timeLeft: Time;
};

class PomodoroHistory {
  private entries: PomodoroEntry[];

  constructor() {
    this.entries = [];
  }

  addEntry(pomodoroIndex: number, completed: boolean, timeLeft: Time) {
    const entry: PomodoroEntry = {
      timestamp: new Date(),
      pomodoroIndex,
      completed,
      timeLeft,
    };
    console.log(
      `Timestamp=${entry.timestamp.toLocaleString()}, PomodoroIndex=${
        entry.pomodoroIndex
      }, Completed=${entry.completed}, TimeLeft=${entry.timeLeft.minutes}m${
        entry.timeLeft.seconds
      }s`
    );
    this.entries.push(entry);
  }

  getHistory() {
    console.log(JSON.stringify(this.entries));
    return this.entries;
  }
}

export default PomodoroHistory;

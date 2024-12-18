export const isTestMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";
console.log("isTestMode", isTestMode);

export const pomodoroIntervals = isTestMode
  ? [
      { minutes: 3, seconds: 15, type: "work" },
      { minutes: 0, seconds: 5, type: "shortBreak" },
      { minutes: 0, seconds: 5, type: "work" },
      { minutes: 0, seconds: 5, type: "shortBreak" },
      { minutes: 0, seconds: 5, type: "work" },
      { minutes: 0, seconds: 5, type: "shortBreak" },
      { minutes: 0, seconds: 5, type: "work" },
      { minutes: 0, seconds: 5, type: "longBreak" },
    ]
  : [
      { minutes: 25, seconds: 0, type: "work" },
      { minutes: 5, seconds: 0, type: "shortBreak" },
      { minutes: 25, seconds: 0, type: "work" },
      { minutes: 5, seconds: 0, type: "shortBreak" },
      { minutes: 25, seconds: 0, type: "work" },
      { minutes: 5, seconds: 0, type: "shortBreak" },
      { minutes: 25, seconds: 0, type: "work" },
      { minutes: 30, seconds: 0, type: "longBreak" },
    ];

export const pomoDisplayMapping = {
  work: "Flow",
  shortBreak: "Break",
  longBreak: "Break",
};

export const totalPomodoros = 8;

export type Time = {
  minutes: number;
  seconds: number;
};

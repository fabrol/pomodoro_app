import React from "react";
import PomodoroHistory, { PomodoroEntry } from "./PomodoroHistory";

type Props = {
  history: PomodoroEntry[];
};

const PomodoroHistoryDisplay: React.FC<Props> = ({ history }) => {
  return (
    <div>
      <h3>Pomodoro History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index} style={{ fontSize: "small" }}>
            {" "}
            {/* Apply smaller font size here */}
            Timestamp: {entry.ended_at.toLocaleString()}, Pomodoro Index:{" "}
            {entry.pomo_index}, Completed: {entry.completed ? "Yes" : "No"},
            Time Left: {entry.time_left_minutes}m {entry.time_left_seconds}s
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PomodoroHistoryDisplay;

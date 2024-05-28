import React from "react";
import PomodoroHistory, { PomodoroEntry } from "./PomodoroHistory";

type Props = {
  history: PomodoroEntry[];
};

const PomodoroHistoryDisplay: React.FC<Props> = ({ history }) => {
  return (
    <div>
      <h3>Pomodoro History</h3>
      <table style={{ fontSize: "small" }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Pomodoro Index</th>
            <th>Completed</th>
            <th>Time Left</th>
            <th>Pomodoro Category</th>
            <th>Pomodoro Duration</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{entry.ended_at.toLocaleString()}</td>
              <td>{entry.pomo_index}</td>
              <td>{entry.completed ? "Yes" : "No"}</td>
              <td>
                {entry.time_left_minutes}m {entry.time_left_seconds}s
              </td>
              <td>{entry.pomo_cat}</td>
              <td>{entry.pomo_duration_min} minutes</td>
              <td>{entry.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PomodoroHistoryDisplay;

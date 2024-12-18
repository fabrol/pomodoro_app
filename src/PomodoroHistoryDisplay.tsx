import React from "react";
import PomodoroHistory, { PomodoroEntry } from "./PomodoroHistory";

type Props = {
  history: PomodoroEntry[];
};

const PomodoroHistoryDisplay: React.FC<Props> = ({ history }) => {
  return (
    <div style={{ width: "80vw", margin: "0 auto" }}>
      <h3>Pomodoro History</h3>
      <table style={{ fontSize: "small" }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Pomodoro Index</th>
            <th>Time Left</th>
            <th>Pomodoro Category</th>
            <th>Pomodoro Duration (min:sec)</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{entry.ended_at.toLocaleString()}</td>
              <td>{entry.pomo_index}</td>
              <td>
                {entry.time_left_minutes}m {entry.time_left_seconds}s
              </td>
              <td>{entry.pomo_cat}</td>
              <td>
                {entry.pomo_duration_min}m:{entry.pomo_duration_seconds}s
              </td>
              <td>{entry.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PomodoroHistoryDisplay;

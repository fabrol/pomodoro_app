import React from 'react';
import PomodoroHistory from './PomodoroHistory';

type Props = {
  history: PomodoroHistory;
};

const PomodoroHistoryDisplay: React.FC<Props> = ({ history }) => {
  const entries = history.getHistory();

  return (
    <div>
      <h3>Pomodoro History</h3>
      <ul>
        {entries.map((entry, index) => (
          <li key={index} style={{ fontSize: 'small' }}>  {/* Apply smaller font size here */}
            Timestamp: {entry.timestamp.toLocaleString()}, 
            Pomodoro Index: {entry.pomodoroIndex}, 
            Completed: {entry.completed ? 'Yes' : 'No'}, 
            Time Left: {entry.timeLeft.minutes}m {entry.timeLeft.seconds}s
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PomodoroHistoryDisplay;
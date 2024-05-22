import "./App.css";
import React, { useState, useCallback } from "react";
import Timer from "./Timer"; // Import the Timer component
import PomodoroCircles from "./PomodoroCircles"; // Import the PomodoroCircles component

function App() {
  const pomodoroIntervals = [
    { minutes: 25, seconds: 0, type: "work" },
    { minutes: 5, seconds: 0, type: "shortBreak" },
    { minutes: 25, seconds: 0, type: "work" },
    { minutes: 5, seconds: 0, type: "shortBreak" },
    { minutes: 25, seconds: 0, type: "work" },
    { minutes: 5, seconds: 0, type: "shortBreak" },
    { minutes: 25, seconds: 0, type: "work" },
    { minutes: 30, seconds: 0, type: "longBreak" },
  ];

  const [currentPomodoro, setCurrentPomodoro] = useState(0);

  const isTestMode = true; // Set this to false in production

  const advancePomodoro = useCallback(() => {
    setCurrentPomodoro((prev) => (prev + 1) % pomodoroIntervals.length);
  }, [pomodoroIntervals.length]);

  const resetPomodoro = useCallback(() => {
    setCurrentPomodoro(0);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Timer
          key={currentPomodoro} // Change key to reset Timer
          advanceFunc={advancePomodoro}
          initialMinutes={
            isTestMode ? 0 : pomodoroIntervals[currentPomodoro].minutes
          }
          initialSeconds={
            isTestMode ? 5 : pomodoroIntervals[currentPomodoro].seconds
          }
          type={pomodoroIntervals[currentPomodoro].type}
        />{" "}
        {/* Use the Timer component */}
        <div>
          <PomodoroCircles currentPomodoro={Math.floor(currentPomodoro / 2)} />
          <button onClick={advancePomodoro}>Next Pomodoro</button>
          <button onClick={resetPomodoro}>Reset Pomodoro</button>
        </div>
      </header>
    </div>
  );
}

export default App;

import "./App.css";
import React, { useState, useCallback } from "react";
import Timer from "./Timer"; // Import the Timer component
import PomodoroCircles from "./PomodoroCircles"; // Import the PomodoroCircles component
import PomodoroHistory, { Time } from "./PomodoroHistory";

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
  const [history] = useState(new PomodoroHistory());
  const [currentTime, setCurrentTime] = useState<Time>({ minutes: 0, seconds: 0 });

  const isTestMode = true; // Set this to false in production

  const advancePomodoro = useCallback(() => {
    const newPomodoroIndex = (currentPomodoro + 1) % pomodoroIntervals.length;
    setCurrentPomodoro(newPomodoroIndex);
    history.addEntry(currentPomodoro, currentTime.minutes === 0 && currentTime.seconds === 0, currentTime);

  }, [currentPomodoro, pomodoroIntervals.length, history, currentTime]);

  const resetPomodoro = useCallback(() => {
    setCurrentPomodoro(0);
    history.addEntry(currentPomodoro, false, currentTime);
  }, [currentPomodoro, history, currentTime]);

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
          setCurrentTime={setCurrentTime}
          currentTime={currentTime}
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

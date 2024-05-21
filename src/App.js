import "./App.css";
import React, { useState } from "react";
import Timer from "./Timer"; // Import the Timer component
import PomodoroCircles from "./PomodoroCircles"; // Import the PomodoroCircles component

function App() {
  const [currentPomodoro, setCurrentPomodoro] = useState(0);

  // Example of changing the state, could be based on some timer or user actions
  const advancePomodoro = () => {
    setCurrentPomodoro((prev) => (prev + 1) % 4);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Timer initialCount={60} /> {/* Use the Timer component */}
        <div>
          <PomodoroCircles currentPomodoro={currentPomodoro} />
          <button onClick={advancePomodoro}>Next Pomodoro</button>
        </div>
      </header>
    </div>
  );
}

export default App;

import React, { useState, useCallback, useMemo } from "react";
import Timer from "./Timer"; // Import the Timer component
import PomodoroCircles from "./PomodoroCircles"; // Import the PomodoroCircles component
import { pomodoroIntervals, Time } from "./constants";
import { useContext } from "react";
import { SessionContext } from "./StateProvider"; // Import SessionContext

function App() {
  const { session, history, historyManager } = useContext(SessionContext); // Use context to get session and historyManager

  const [currentPomodoro, setCurrentPomodoro] = useState(0);
  const [currentTime, setCurrentTime] = useState<Time>({
    minutes: 0,
    seconds: 0,
  });
  const [isActive, setIsActive] = useState(false);

  // Advance the pomodoro and add an entry to the history
  const advancePomodoro = useCallback(() => {
    const newPomodoroIndex = (currentPomodoro + 1) % pomodoroIntervals.length;
    setIsActive(false);
    setCurrentPomodoro(newPomodoroIndex);
    if (!session?.user?.id) {
      console.log("No user ID found so can't add pomo");
      return;
    }

    historyManager.addEntry({
      pomodoroIndex: currentPomodoro,
      timeLeft: currentTime,
      userId: session?.user?.id,
      pomoCat: pomodoroIntervals[currentPomodoro].type,
      pomoDurationMin: pomodoroIntervals[currentPomodoro].minutes,
      pomoDurationSec: pomodoroIntervals[currentPomodoro].seconds,
    });
  }, [currentPomodoro, currentTime]);

  const resetPomodoro = useCallback(() => {
    setCurrentPomodoro(0);
    //historyManager.addEntry(currentPomodoro, false, currentTime);
  }, [currentPomodoro, historyManager, currentTime]);

  const initialTime = useMemo(
    () => ({
      minutes: pomodoroIntervals[currentPomodoro].minutes,
      seconds: pomodoroIntervals[currentPomodoro].seconds,
    }),
    [currentPomodoro]
  );

  return (
    <div className="App">
      <header className="App-header">
        <Timer
          key={currentPomodoro} // Change key to reset Timer
          advanceFunc={advancePomodoro}
          initialTime={initialTime}
          type={pomodoroIntervals[currentPomodoro].type}
          setCurrentTime={setCurrentTime}
          currentTime={currentTime}
          isActive={isActive}
          setIsActive={setIsActive}
        />
        <div>
          <PomodoroCircles
            currentPomodoro={currentPomodoro}
            isActive={isActive}
          />
          <button onClick={advancePomodoro}>Next Pomodoro</button>
          <button onClick={resetPomodoro}>Reset Pomodoro</button>
        </div>
      </header>
    </div>
  );
}

export default App;

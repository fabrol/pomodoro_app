import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import PomodoroCircles from "./PomodoroCircles"; // Import the PomodoroCircles component
import { pomoDisplayMapping, pomodoroIntervals, Time } from "./constants";
import { useContext } from "react";
import { SessionContext } from "./StateProvider"; // Import SessionContext
import { CiPause1, CiPlay1 } from "react-icons/ci";

function Timer() {
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

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    console.log("isActive", isActive);
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prevTime) => {
          const { minutes, seconds } = prevTime;
          if (seconds > 0) {
            return { minutes, seconds: seconds - 1 };
          } else if (minutes > 0) {
            return { minutes: minutes - 1, seconds: 59 };
          } else {
            clearInterval(intervalRef.current as number);
            console.log("Timer ended");
            return { minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current as number);
    }

    return () => clearInterval(intervalRef.current as number); // Cleanup using ref
  }, [isActive, setCurrentTime]);

  // New useEffect to handle when the timer reaches 0:0
  useEffect(() => {
    if (currentTime.minutes === 0 && currentTime.seconds === 0 && isActive) {
      setIsActive(false);
      advancePomodoro();
    }
  }, [currentTime, isActive, advancePomodoro]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setCurrentTime(initialTime);
    setIsActive(false);
  };

  const formatTime = () => {
    const { minutes, seconds } = currentTime;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="timer">
      <header className="App-header">
        <h4>{pomoDisplayMapping[pomodoroIntervals[currentPomodoro].type]}</h4>
        <h1>{formatTime()}</h1>
        <button
          onClick={toggle}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "var(--color-primary)",
          }}
        >
          {isActive ? <CiPause1 /> : <CiPlay1 />}
        </button>
        <button onClick={reset}>Reset</button>
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

export default Timer;

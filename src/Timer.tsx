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
import { SessionContext } from "./SessionProvider"; // Import SessionContext
import { IoMdPause, IoMdPlay, IoMdSkipForward } from "react-icons/io";
import { BiReset } from "react-icons/bi";
import { MdRestartAlt, MdPlayArrow, MdPause } from "react-icons/md";
import "./Timer.css";

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
    <div
      className="timer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "5vh",
        //height: "100vh",
      }}
    >
      <div style={{ fontSize: "2rem" }}>
        {pomoDisplayMapping[pomodoroIntervals[currentPomodoro].type]}
      </div>
      <div
        style={{
          width: "100%",
          minWidth: "13rem",
        }}
      >
        <div
          style={{
            fontSize: "5rem",
            lineHeight: "4rem",
            paddingBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          {formatTime()}
        </div>
        <PomodoroCircles
          currentPomodoro={currentPomodoro}
          isActive={isActive}
        />
      </div>
      <button onClick={toggle} className="action-button play-button">
        {isActive ? <MdPause /> : <MdPlayArrow />}
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          opacity: isActive ? 0 : 1, // Control visibility based on isActive
          transition: "opacity 0.5s ease-in-out", // Smooth transition for opacity
          pointerEvents: isActive ? "none" : "auto", // Disable interaction when not visible
        }}
      >
        <button onClick={reset} className="action-button" title="Reset Timer">
          <MdRestartAlt />
        </button>
        <button
          onClick={resetPomodoro}
          className="action-button"
          title="Reset Pomodoro"
        >
          <BiReset />
        </button>
        <button
          onClick={advancePomodoro}
          className="action-button"
          title="Next"
        >
          <IoMdSkipForward />
        </button>
      </div>
    </div>
  );
}

export default Timer;

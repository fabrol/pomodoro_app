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
import SessionAnimation from "./SessionAnimation";
import { AnimatePresence, motion } from "framer-motion";

// Add this type definition at the top of your file
type SessionType = "work" | "shortBreak" | "longBreak";

function Timer() {
  const {
    session,
    historyManager,
    currentPomodoro,
    setCurrentPomodoro,
    currentTime,
    setCurrentTime,
    isActive,
    setIsActive,
    animationKey,
    setAnimationKey,
  } = useContext(SessionContext);

  const intervalRef = useRef<number | null>(null);
  const lastTimeRef = useRef(Date.now());

  // Advance the pomodoro and add an entry to the history
  const advancePomodoro = useCallback(() => {
    const newPomodoroIndex = (currentPomodoro + 1) % pomodoroIntervals.length;
    setIsActive(false);
    setCurrentPomodoro(newPomodoroIndex);
    setCurrentTime({
      minutes: pomodoroIntervals[newPomodoroIndex].minutes,
      seconds: pomodoroIntervals[newPomodoroIndex].seconds,
    });
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
    setAnimationKey((prevKey) => prevKey + 1); // Update key to recreate animation
  }, [
    currentPomodoro,
    currentTime,
    session,
    historyManager,
    setCurrentPomodoro,
    setIsActive,
    setAnimationKey,
  ]);

  const resetPomodoro = useCallback(() => {
    setCurrentPomodoro(0);
    setCurrentTime({
      minutes: pomodoroIntervals[0].minutes,
      seconds: pomodoroIntervals[0].seconds,
    });
    setAnimationKey((prevKey) => prevKey + 1); // Update key to recreate animation
  }, [setCurrentPomodoro, setCurrentTime, setAnimationKey]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastTimeRef.current) / 1000);
        console.log(`Tab became visible. Elapsed seconds: ${elapsedSeconds}`);
        console.log(
          `Current pomodoro: ${currentPomodoro}, Is active: ${isActive}`
        );

        if (isActive && elapsedSeconds > 0) {
          setCurrentTime((prevTime) => {
            const totalSeconds =
              prevTime.minutes * 60 + prevTime.seconds - elapsedSeconds;
            console.log(
              `Previous time: ${prevTime.minutes}m ${prevTime.seconds}s`
            );
            console.log(`New total seconds: ${totalSeconds}`);

            if (totalSeconds <= 0) {
              console.log(
                "Timer expired during inactivity. Advancing pomodoro."
              );
              advancePomodoro();
              return pomodoroIntervals[currentPomodoro];
            }

            const newTime = {
              minutes: Math.floor(totalSeconds / 60),
              seconds: totalSeconds % 60,
            };
            console.log(`New time: ${newTime.minutes}m ${newTime.seconds}s`);
            return newTime;
          });
        } else {
          console.log("Timer not active or no time elapsed.");
        }
      } else {
        console.log("Tab became hidden.");
      }
      lastTimeRef.current = Date.now();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, advancePomodoro, currentPomodoro]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        if (!document.hidden) {
          setCurrentTime((prevTime) => {
            const { minutes, seconds } = prevTime;
            if (seconds > 0) {
              return { minutes, seconds: seconds - 1 };
            } else if (minutes > 0) {
              return { minutes: minutes - 1, seconds: 59 };
            } else {
              clearInterval(intervalRef.current!);
              setIsActive(false);
              return { minutes: 0, seconds: 0 };
            }
          });
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setCurrentTime({
      minutes: pomodoroIntervals[currentPomodoro].minutes,
      seconds: pomodoroIntervals[currentPomodoro].seconds,
    });
    setIsActive(false);
    setAnimationKey((prevKey) => prevKey + 1); // Update key to recreate animation
  };

  const formatTime = () => {
    const { minutes, seconds } = currentTime;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        overflowY: "hidden",
      }}
    >
      <div
        className="timer"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "5vh",
          width: "30vw",
        }}
      >
        <div style={{ fontSize: "2rem" }}>
          {pomoDisplayMapping[pomodoroIntervals[currentPomodoro].type]}
          {currentTime.minutes === 0 &&
            currentTime.seconds === 0 &&
            " Complete"}
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
        <button
          onClick={
            currentTime.minutes === 0 && currentTime.seconds === 0
              ? advancePomodoro
              : toggle
          }
          className="action-button play-button"
        >
          {currentTime.minutes === 0 && currentTime.seconds === 0 ? (
            <IoMdSkipForward style={{ fontSize: "2.5rem" }} />
          ) : isActive ? (
            <MdPause />
          ) : (
            <MdPlayArrow />
          )}
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
      <SessionAnimation
        key={animationKey}
        isActive={isActive}
        currentTime={currentTime.minutes * 60 + currentTime.seconds}
        totalTime={
          pomodoroIntervals[currentPomodoro].minutes * 60 +
          pomodoroIntervals[currentPomodoro].seconds
        }
        sessionType={pomodoroIntervals[currentPomodoro].type as SessionType}
      />
    </div>
  );
}

export default Timer;

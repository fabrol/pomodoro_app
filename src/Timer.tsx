import React, { useState, useEffect, useRef } from "react";
import { Time, pomoDisplayMapping } from "./constants";
import { CiPlay1, CiPause1 } from "react-icons/ci";

interface TimerProps {
  initialTime?: Time;
  type?: string;
  advanceFunc: () => void;
  setCurrentTime: React.Dispatch<
    React.SetStateAction<{ minutes: number; seconds: number }>
  >;
  currentTime: { minutes: number; seconds: number };
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}

function Timer({
  initialTime = { minutes: 0, seconds: 4 },
  type = "work",
  advanceFunc,
  setCurrentTime,
  currentTime,
  isActive,
  setIsActive,
}: TimerProps) {
  const intervalRef = useRef<number | null>(null);
  const advancePomodoro = advanceFunc;

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
        justifyContent: "center",
        margin: 0,
      }}
    >
      <h4>{pomoDisplayMapping[type]}</h4>
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
    </div>
  );
}

export default Timer;

import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  type?: string;
  advanceFunc: () => void;
}

function Timer({
  initialMinutes = 1,
  initialSeconds = 0,
  type = "work",
  advanceFunc,
}: TimerProps) {

  const [time, setTime] = useState({
    minutes: initialMinutes,
    seconds: initialSeconds,
  });
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const advancePomodoro = advanceFunc;

  useEffect(() => {
    console.log("isActive", isActive);
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
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
  }, [isActive]);

  // New useEffect to handle when the timer reaches 0:0
  useEffect(() => {
    if (time.minutes === 0 && time.seconds === 0 && isActive) {
      console.log("advancing pomodoro");
      setIsActive(false);
      advancePomodoro();
    }
  }, [time, isActive, advancePomodoro]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setTime({ minutes: initialMinutes, seconds: initialSeconds });
    setIsActive(false);
  };

  const formatTime = () => {
    const { minutes, seconds } = time;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="timer">
      <h1>{formatTime()}</h1>
      <h4>{type}</h4>
      <button onClick={toggle}>{isActive ? "Pause" : "Start"}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Timer;

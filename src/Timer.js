import React, { useState, useEffect, useRef } from "react";

function Timer({ initialMinutes = 25 }) {
  const [time, setTime] = useState({
    minutes: initialMinutes,
    seconds: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null); // Use useRef to persist interval ID

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const { minutes, seconds } = prevTime;
          if (seconds > 0) {
            return { minutes, seconds: seconds - 1 };
          } else if (minutes > 0) {
            return { minutes: minutes - 1, seconds: 59 };
          } else {
            clearInterval(intervalRef.current);
            return { minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // Cleanup using ref
  }, [isActive]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setTime({ minutes: initialMinutes, seconds: 0 });
    setIsActive(false);
  };

  const formatTime = () => {
    const { minutes, seconds } = time;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="timer">
      <h1>{formatTime()}</h1>
      <button onClick={toggle}>{isActive ? "Pause" : "Start"}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Timer;

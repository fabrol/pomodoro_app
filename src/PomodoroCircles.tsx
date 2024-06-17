import React from "react";
import { totalPomodoros, pomodoroIntervals } from "./constants";

function PomodoroCircles({
  currentPomodoro,
  isActive,
}: {
  currentPomodoro: number;
  isActive: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "2rem",
      }}
    >
      {Array.from({ length: totalPomodoros }, (_, index) => (
        <div
          key={index}
          style={{
            width: pomodoroIntervals[index].type === "work" ? "20px" : "15px",
            height: pomodoroIntervals[index].type === "work" ? "20px" : "15px",
            borderRadius:
              index === currentPomodoro && isActive ? "50%, 50%, 0, 0" : "50%",
            backgroundColor:
              index <= currentPomodoro
                ? index == currentPomodoro
                  ? "grey"
                  : "green"
                : "grey",
            borderColor: index == currentPomodoro ? "green" : "transparent",
            borderWidth: index === currentPomodoro ? "1px" : "0px",
            borderStyle: "solid",
            backgroundImage:
              index === currentPomodoro && isActive
                ? "linear-gradient(90deg, #d1d1d1 50%, transparent 50%)"
                : "",
          }}
        />
      ))}
    </div>
  );
}

export default PomodoroCircles;

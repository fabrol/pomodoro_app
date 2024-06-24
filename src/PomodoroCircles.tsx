import React from "react";
import { totalPomodoros, pomodoroIntervals } from "./constants";
import { useMantineTheme } from "@mantine/core";

function PomodoroCircles({
  currentPomodoro,
  isActive,
}: {
  currentPomodoro: number;
  isActive: boolean;
}) {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "2rem",
        width: "100%",
      }}
    >
      {Array.from({ length: totalPomodoros }, (_, index) => (
        <div
          key={index}
          style={{
            width: pomodoroIntervals[index].type === "work" ? "1.5rem" : "1rem",
            height:
              pomodoroIntervals[index].type === "work" ? "1.5rem" : "1rem",
            borderRadius:
              index === currentPomodoro && isActive ? "50%, 50%, 0, 0" : "50%",
            backgroundColor:
              index <= currentPomodoro
                ? index == currentPomodoro
                  ? theme.colors.gray[6]
                  : theme.colors.myGreen[8]
                : theme.colors.gray[6],
            borderColor:
              index == currentPomodoro
                ? theme.colors.myGreen[8]
                : "transparent",
            borderWidth: index === currentPomodoro ? "2px" : "0px",
            borderStyle: "solid",
            backgroundImage:
              index === currentPomodoro && isActive
                ? `linear-gradient(90deg, ${theme.colors.gray[3]} 50%, transparent 50%)`
                : "",
          }}
        />
      ))}
    </div>
  );
}

export default PomodoroCircles;

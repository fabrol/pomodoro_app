import React from "react";

function PomodoroCircles({ currentPomodoro }: { currentPomodoro: number }) {
  const totalPomodoros = 4;

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {Array.from({ length: totalPomodoros }, (_, index) => (
        <div
          key={index}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: index <= currentPomodoro ? "red" : "grey",
          }}
        />
      ))}
    </div>
  );
}

export default PomodoroCircles;

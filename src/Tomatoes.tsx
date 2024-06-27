import React, { useEffect, useState } from "react";
import "./Tomatoes.css";

const TomatoAnimation: React.FC<{
  isActive: boolean;
  currentTime: number;
  totalTime: number;
}> = ({ isActive, currentTime, totalTime }) => {
  const [tomatoes, setTomatoes] = useState<
    { id: number; left: number; top: number }[]
  >([]);
  const [lastActiveTomatoes, setLastActiveTomatoes] = useState(0);

  useEffect(() => {
    if (isActive) {
      const totalTomatoes = 200; // Adjust this number based on how many tomatoes you want to fill the screen
      const percentageTimeLeft = currentTime / totalTime;
      const activeTomatoes = Math.floor(
        totalTomatoes * (1 - percentageTimeLeft)
      );

      setTomatoes((prevTomatoes) => {
        const newTomatoes = Array.from(
          { length: activeTomatoes - lastActiveTomatoes },
          (_, index) => ({
            id: Date.now() + index,
            left: Math.random() * 90,
            top: Math.random() * 50,
          })
        );
        return [...prevTomatoes, ...newTomatoes];
      });

      setLastActiveTomatoes(activeTomatoes);
    }
  }, [isActive, currentTime, totalTime, lastActiveTomatoes]);

  useEffect(() => {
    if (!isActive) {
      setLastActiveTomatoes(tomatoes.length);
    }
  }, [isActive, tomatoes.length]);

  return (
    <div className="tomato-container">
      {tomatoes.map((tomato) => (
        <div
          key={tomato.id}
          className="tomato"
          style={
            {
              left: `${tomato.left}%`,
              top: `${tomato.top}%`,
              "--top-y": `${tomato.top}`,
            } as React.CSSProperties
          }
          onAnimationStart={() =>
            console.log(
              `Animation started for tomato ${tomato.id} with --top-y: ${tomato.top}%`
            )
          }
        />
      ))}
      <div className="bucket" />
    </div>
  );
};

export default TomatoAnimation;

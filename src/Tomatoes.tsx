import React, { createRef, useEffect, useRef, useState } from "react";
import "./Tomatoes.css";

const TomatoAnimation: React.FC<{
  isActive: boolean;
  currentTime: number;
  totalTime: number;
}> = ({ isActive, currentTime, totalTime }) => {
  const [tomatoes, setTomatoes] = useState<
    { id: number; left: number; top: number }[]
  >([]);
  const [vertRow, setVertRow] = useState<{ rowNum: number; rowIdxs: number[] }>(
    {
      rowNum: 0,
      rowIdxs: [],
    }
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    windowHeight: 0,
    windowWidth: 0,
  });

  useEffect(() => {
    console.log(dimensions);
  }, [dimensions]);

  function handleResize() {
    if (parentRef.current) {
      const { current } = parentRef;
      const boundingRect = current.getBoundingClientRect();
      const { width, height } = boundingRect;
      setDimensions({
        width: Math.round(width),
        height: Math.round(height),
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      });
    }
  }

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalTomatoes = 200;

  useEffect(() => {
    if (isActive) {
      const percentageTimeLeft = currentTime / totalTime;
      const activeTomatoes = Math.floor(
        totalTomatoes * (1 - percentageTimeLeft)
      );

      if (vertRow.rowIdxs.length === 0) {
        setVertRow((prev) => ({
          rowNum: prev.rowNum + 1,
          rowIdxs: Array.from({ length: 10 }, (_, index) => index),
        }));
      }
      setTomatoes((prevTomatoes) => {
        const newTomatoes = Array.from(
          { length: activeTomatoes },
          (_, index) => ({
            id: Date.now() + index,
            left: Math.random() * 90,
            top: Math.random() * 50,
          })
        );
        return [...prevTomatoes, ...newTomatoes];
      });
    }
  }, [isActive, currentTime, totalTime]);

  return (
    <div className="tomato-container" ref={parentRef}>
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
    </div>
  );
};

export default TomatoAnimation;

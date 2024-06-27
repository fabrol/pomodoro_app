import React, { createRef, useEffect, useRef, useState } from "react";
import "./Tomatoes.css";

const TOMATO_HEIGHT = 13; // in px, but needs to be translated from VH?

const TomatoAnimation: React.FC<{
  isActive: boolean;
  currentTime: number;
  totalTime: number;
}> = ({ isActive, currentTime, totalTime }) => {
  const [tomatoes, setTomatoes] = useState<
    { id: number; left: number; topPx: number; deltaY: number }[]
  >([]);
  const [vertRow, setVertRow] = useState<{ rowNum: number; rowIdxs: number[] }>(
    {
      rowNum: -1,
      rowIdxs: [],
    }
  );
  const rowTracker = useRef({
    rowNum: 0,
    rowIdxs: [] as number[],
  });

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

  const totalTomatoes = useRef(0);
  const TotalRows = useRef(0);
  const TomatoesPerRow = useRef(0);

  useEffect(() => {
    if (TotalRows.current === 0) {
      TotalRows.current = Math.ceil(dimensions.height / TOMATO_HEIGHT);
      TomatoesPerRow.current = Math.ceil(dimensions.width / TOMATO_HEIGHT);
      totalTomatoes.current = TotalRows.current * TomatoesPerRow.current;
    }
  }, [dimensions]);

  useEffect(() => {
    if (isActive) {
      const percentageTimeLeft = currentTime / totalTime;
      const activeTomatoes = Math.floor(
        totalTomatoes.current * (1 - percentageTimeLeft)
      );

      if (!activeTomatoes) {
        return;
      }

      // if the row is empty, create a new row and shuffle it
      if (rowTracker.current.rowIdxs.length === 0) {
        let newRowIdxs = Array.from(
          { length: TomatoesPerRow.current },
          (_, index) => index
        );
        newRowIdxs.sort(() => 0.5 - Math.random());

        rowTracker.current.rowIdxs = newRowIdxs;
        rowTracker.current.rowNum++;
      }

      const newTomatoesCount = activeTomatoes - tomatoes.length;
      const newIdxs = rowTracker.current.rowIdxs.splice(0, newTomatoesCount);

      const newTomatoes = Array.from(
        { length: newTomatoesCount },
        (_, index) => {
          const left =
            newIdxs[index] * (100 / TomatoesPerRow.current) +
            (0.5 - Math.random()) * 5;
          const top = Math.random() * 50;
          const bottom =
            dimensions.windowHeight - rowTracker.current.rowNum * TOMATO_HEIGHT;
          const topPx = (top * dimensions.windowHeight) / 100;
          const deltaY = bottom - topPx;

          // Debugging lines
          console.log(`Tomato ${index}:`);
          console.log(`  newIdxs: ${newIdxs}`);
          console.log(`  newIdxs[index]: ${newIdxs[index]}`);
          console.log(`  left: ${left}`);
          console.log(`  top: ${top}`);
          console.log(`  bottom: ${bottom}`);

          return {
            id: Date.now() + index,
            left,
            topPx,
            deltaY,
          };
        }
      );

      setTomatoes((prevTomatoes) => {
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
              top: `${tomato.topPx}px`,
              "--row": `${tomato.deltaY}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default TomatoAnimation;

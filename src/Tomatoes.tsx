import { motion, AnimatePresence } from "framer-motion";
import React, { createRef, useEffect, useRef, useState, memo } from "react";
import "./Tomatoes.css";

const TOMATO_HEIGHT = 13; // in px, but needs to be translated from VH?

const TomatoAnimation: React.FC<{
  isActive: boolean;
  currentTime: number;
  totalTime: number;
  key: number;
}> = ({ isActive, currentTime, totalTime, key }) => {
  console.log("TomatoAnimation component created");
  const [tomatoes, setTomatoes] = useState<
    { id: number; left: number; topPx: number; deltaY: number }[]
  >([]);
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
      console.log(`Total rows: ${TotalRows.current}`);
      console.log(`Tomatoes per row: ${TomatoesPerRow.current}`);
      console.log(`Total tomatoes: ${totalTomatoes.current}`);
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

      let newTomatoesCount = activeTomatoes - tomatoes.length;

      while (newTomatoesCount > 0) {
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

        let rowTomatoes = Math.min(newTomatoesCount, TomatoesPerRow.current);
        const newIdxs = rowTracker.current.rowIdxs.splice(0, rowTomatoes);

        const newTomatoes = Array.from({ length: rowTomatoes }, (_, index) => {
          const left = Math.min(
            newIdxs[index] * (100 / TomatoesPerRow.current) +
              (0.5 - Math.random()) * 2,
            98
          );
          const top = Math.random() * 30;
          const bottom =
            dimensions.windowHeight -
            rowTracker.current.rowNum * TOMATO_HEIGHT -
            TOMATO_HEIGHT;
          const topPx = (top * dimensions.windowHeight) / 100;
          const deltaY = bottom - topPx;

          return {
            id: Date.now() + index + rowTracker.current.rowNum,
            left,
            topPx,
            deltaY,
          };
        });

        console.log(
          `Current time: ${currentTime} Active: ${activeTomatoes} New: ${newTomatoesCount} Row: ${rowTracker.current.rowNum} Row Tomatoes: ${rowTomatoes}`
        );

        setTomatoes((prevTomatoes) => {
          return [...prevTomatoes, ...newTomatoes];
        });

        newTomatoesCount -= newTomatoes.length;
      }
    }
  }, [isActive, currentTime, totalTime]);

  return (
    <div className="tomato-container" ref={parentRef}>
      {tomatoes.map((tomato) => (
        <AnimatePresence>
          <motion.div
            key={tomato.id}
            exit={{ opacity: 0, y: 100 }}
            className="tomato"
            style={
              {
                left: `${tomato.left}%`,
                top: `${tomato.topPx}px`,
                "--row": `${tomato.deltaY}px`,
              } as React.CSSProperties
            }
          />
        </AnimatePresence>
      ))}
    </div>
  );
};

export default TomatoAnimation;

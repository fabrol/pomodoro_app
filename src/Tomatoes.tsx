import { motion, AnimatePresence } from "framer-motion";
import React, { createRef, useEffect, useRef, useState, memo } from "react";
import "./Tomatoes.css";

const calculateTomatoHeight = (windowWidth: number) => {
  return (windowWidth * 2) / 100; // 2% of window width (2vw)
};

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

  const [tomatoHeight, setTomatoHeight] = useState(0);

  React.useEffect(() => {
    const handleResizeAndUpdateTomato = () => {
      handleResize();
      setTomatoHeight(calculateTomatoHeight(window.innerWidth));
    };

    handleResizeAndUpdateTomato();
    window.addEventListener("resize", handleResizeAndUpdateTomato);
    return () =>
      window.removeEventListener("resize", handleResizeAndUpdateTomato);
  }, []);

  const totalTomatoes = useRef(0);
  const TotalRows = useRef(0);
  const TomatoesPerRow = useRef(0);

  useEffect(() => {
    if (TotalRows.current === 0 && tomatoHeight > 0) {
      TotalRows.current = Math.ceil(dimensions.height / tomatoHeight);
      TomatoesPerRow.current = Math.ceil(dimensions.width / tomatoHeight);
      totalTomatoes.current = TotalRows.current * TomatoesPerRow.current;
      console.log(`Total rows: ${TotalRows.current}`);
      console.log(`Tomatoes per row: ${TomatoesPerRow.current}`);
      console.log(`Total tomatoes: ${totalTomatoes.current}`);
    }
  }, [dimensions, tomatoHeight]);

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
        // If the row is empty, create a new row and shuffle it
        if (rowTracker.current.rowIdxs.length === 0) {
          let newRowIdxs = Array.from(
            { length: TomatoesPerRow.current },
            (_, index) => index
          );
          newRowIdxs.sort(() => 0.5 - Math.random());

          rowTracker.current.rowIdxs = newRowIdxs;
          rowTracker.current.rowNum++;
          console.log(
            `New row created: ${
              rowTracker.current.rowNum
            }, Indices: ${newRowIdxs.join(",")}`
          );
        }

        let rowTomatoes = Math.min(
          newTomatoesCount,
          rowTracker.current.rowIdxs.length
        );
        console.log(
          `Creating tomatoes: rowTomatoes=${rowTomatoes}, available indices=${rowTracker.current.rowIdxs.length}`
        );

        const newIdxs = rowTracker.current.rowIdxs.splice(0, rowTomatoes);
        console.log(`Spliced indices: ${newIdxs.join(",")}`);

        const newTomatoes = newIdxs.map((newIdx, index) => {
          console.log(
            `Creating tomato ${index}: newIdx=${newIdx}, rowIdxs left=${rowTracker.current.rowIdxs.length}`
          );

          const left = Math.min(newIdx * (100 / TomatoesPerRow.current), 97);

          const initialTopPx = Math.random() * 30;
          const finalTopPx =
            dimensions.windowHeight - rowTracker.current.rowNum * tomatoHeight;
          const deltaY = finalTopPx - initialTopPx;

          return {
            id: Date.now() + index + rowTracker.current.rowNum,
            left,
            topPx: initialTopPx,
            deltaY,
          };
        });

        console.log(`New tomatoes created: ${newTomatoes.length}`);

        setTomatoes((prevTomatoes) => [...prevTomatoes, ...newTomatoes]);

        newTomatoesCount -= newTomatoes.length;
        console.log(`Remaining tomatoes to create: ${newTomatoesCount}`);
      }
    }
  }, [isActive, currentTime, totalTime, dimensions, tomatoHeight]);

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

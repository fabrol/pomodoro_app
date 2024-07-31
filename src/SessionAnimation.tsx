import { motion, AnimatePresence } from "framer-motion";
import React, { createRef, useEffect, useRef, useState, memo } from "react";
import "./Tomatoes.css";

const calculateItemHeight = (windowWidth: number) => {
  return (windowWidth * 2) / 100; // 2% of window width (2vw)
};

const SessionAnimation: React.FC<{
  isActive: boolean;
  currentTime: number;
  totalTime: number;
  key: number;
  sessionType: "work" | "shortBreak" | "longBreak";
}> = ({ isActive, currentTime, totalTime, key, sessionType }) => {
  console.log("SessionAnimation component created");
  const [items, setItems] = useState<
    Array<{
      id: number;
      left: number;
      topPx: number;
      deltaY: number;
      shouldAnimate: boolean;
    }>
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

  const [itemHeight, setItemHeight] = useState(0);

  React.useEffect(() => {
    const handleResizeAndUpdateItem = () => {
      handleResize();
      setItemHeight(calculateItemHeight(window.innerWidth));
    };

    handleResizeAndUpdateItem();
    window.addEventListener("resize", handleResizeAndUpdateItem);
    return () =>
      window.removeEventListener("resize", handleResizeAndUpdateItem);
  }, []);

  const totalItems = useRef(0);
  const TotalRows = useRef(0);
  const ItemsPerRow = useRef(0);

  useEffect(() => {
    if (TotalRows.current === 0 && itemHeight > 0) {
      TotalRows.current = Math.ceil(dimensions.height / itemHeight);
      ItemsPerRow.current = Math.ceil(dimensions.width / itemHeight);
      totalItems.current = TotalRows.current * ItemsPerRow.current;
      console.log(`Total rows: ${TotalRows.current}`);
      console.log(`Items per row: ${ItemsPerRow.current}`);
      console.log(`Total items: ${totalItems.current}`);
    }
  }, [dimensions, itemHeight]);

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const percentageTimeLeft = currentTime / totalTime;
    const activeItems = Math.floor(
      totalItems.current * (1 - percentageTimeLeft)
    );

    if (!activeItems) {
      return;
    }

    let newItemsCount = activeItems - items.length;

    if (newItemsCount > 0) {
      const newItems: Array<{
        id: number;
        left: number;
        topPx: number;
        deltaY: number;
        shouldAnimate: boolean;
      }> = [];
      console.log(
        `Starting item creation loop. Items to create: ${newItemsCount}`
      );
      while (newItemsCount > 0) {
        if (rowTracker.current.rowIdxs.length === 0) {
          let newRowIdxs = Array.from(
            { length: ItemsPerRow.current },
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

        let rowItems = Math.min(
          newItemsCount,
          rowTracker.current.rowIdxs.length
        );
        console.log(
          `Creating items for row ${rowTracker.current.rowNum}: rowItems=${rowItems}, available indices=${rowTracker.current.rowIdxs.length}`
        );

        const newIdxs = rowTracker.current.rowIdxs.splice(0, rowItems);
        console.log(`Spliced indices for this iteration: ${newIdxs.join(",")}`);

        newIdxs.forEach((newIdx, index) => {
          const left = Math.min(newIdx * (100 / ItemsPerRow.current), 97);
          const initialTopPx = Math.random() * 30;
          const finalTopPx =
            dimensions.windowHeight - rowTracker.current.rowNum * itemHeight;
          const deltaY = finalTopPx - initialTopPx;

          const newItem = {
            id: Date.now() + index + rowTracker.current.rowNum + Math.random(),
            left,
            topPx: isInitialRender && !isActive ? finalTopPx : initialTopPx,
            deltaY,
            shouldAnimate: !isInitialRender || isActive,
          };

          console.log(`Created item: ${JSON.stringify(newItem)}`);
          newItems.push(newItem);
        });

        newItemsCount -= newIdxs.length;
        console.log(`Remaining items to create: ${newItemsCount}`);
      }

      console.log(`Total new items created: ${newItems.length}`);
      setItems((prevItems) => {
        const updatedItems = [...prevItems, ...newItems];
        console.log(`Updated items count: ${updatedItems.length}`);
        return updatedItems;
      });

      if (isInitialRender) {
        setIsInitialRender(false);
      }
    }
  }, [
    isActive,
    currentTime,
    totalTime,
    dimensions,
    itemHeight,
    isInitialRender,
  ]);

  return (
    <div className="session-container" ref={parentRef}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`session-item ${sessionType} ${
            item.shouldAnimate ? "animate" : ""
          }`}
          style={
            {
              left: `${item.left}%`,
              top: `${item.topPx}px`,
              "--row": `${item.deltaY}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default SessionAnimation;

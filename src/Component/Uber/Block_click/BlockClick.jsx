import React, { useEffect, useState, useMemo } from "react";
import styles from "./BlockClick.module.css";

/*
question 1 => given an arry display in ui as per this and they should be selectable
question 2 => implement a typehead input and use debounce to optimise api calls
question 3 => Implement a throttler to throttle an array of the task, if passed a limit, execute that many tasks and push the remaining into the queue.
question 4 => custom map and limit function
question 5 => We have to generate a circle on the screen where the user clicks and detect if two circles are overlapping or not. If they collide, change the color of the later circle.
questiok 6=> task scheduling 

*/

// html , js version of below solution is at link
// https://codesandbox.io/p/sandbox/qytnyz
export const BlockClick = () => {
  const [data, setData] = useState([
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ]);

  return (
    <div>
      <div style={{ marginBottom: "50px" }}>
        <a href="https://codesandbox.io/p/sandbox/qytnyz" target="_blank">
          js code
        </a>
      </div>

      {/* <Grid1 gridData={data} /> */}
      <Grid2 gridData={data} />
    </div>
  );
};

const Grid1 = ({ gridData }) => {
  const totalBlocks = gridData.flat().filter((cell) => cell === 1).length;
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [deselecting, setDeselecting] = useState(false);
  const [canSelect, setCanSelect] = useState(true);

  const handleBlockClick = (row, col) => {
    if (!canSelect || deselecting) return;

    const blockId = `${row}-${col}`;
    if (!selectedBlocks.includes(blockId)) {
      setSelectedBlocks((prev) => [...prev, blockId]);
    }
  };

  useEffect(() => {
    if (selectedBlocks.length === totalBlocks && canSelect) {
      setDeselecting(true);
      setCanSelect(false);
    }
  }, [selectedBlocks, totalBlocks, canSelect]);

  useEffect(() => {
    if (deselecting && selectedBlocks.length > 0) {
      const timeout = setTimeout(() => {
        setSelectedBlocks((prev) => prev.slice(1));
      }, 500);
      return () => clearTimeout(timeout);
    } else if (deselecting && selectedBlocks.length === 0) {
      setDeselecting(false);
      setCanSelect(true);
    }
  }, [deselecting, selectedBlocks]);

  // Reset states when gridData changes
  useEffect(() => {
    setSelectedBlocks([]);
    setDeselecting(false);
    setCanSelect(true);
  }, [gridData]);

  return (
    <div className={styles.gridContainer}>
      {gridData.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className={styles.row}>
          {row.map((cell, colIndex) => {
            const blockId = `${rowIndex}-${colIndex}`;
            const isSelected = selectedBlocks.includes(blockId);

            return cell === 1 ? (
              <div
                key={blockId}
                className={`${styles.block} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleBlockClick(rowIndex, colIndex)}
              ></div>
            ) : (
              <div key={blockId} className={styles.empty}></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// below is optimised version of above code
const Grid2 = ({ gridData }) => {
  const totalBlocks = useMemo(
    () => gridData.flat().filter((cell) => cell === 1).length,
    [gridData]
  );

  const [selectedBlocks, setSelectedBlocks] = useState(new Set());
  const [deselecting, setDeselecting] = useState(false);

  const canSelect = !deselecting && selectedBlocks.size < totalBlocks;

  const handleBlockClick = (row, col) => {
    if (!canSelect) return;

    const blockId = `${row}-${col}`;
    setSelectedBlocks((prev) => {
      const newSet = new Set(prev);
      newSet.add(blockId);
      return newSet;
    });
  };

  useEffect(() => {
    if (selectedBlocks.size === totalBlocks && !deselecting) {
      setDeselecting(true);
    }
  }, [selectedBlocks, totalBlocks, deselecting]);

  useEffect(() => {
    if (deselecting && selectedBlocks.size > 0) {
      const timeout = setTimeout(() => {
        setSelectedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete([...newSet][0]);
          return newSet;
        });
      }, 500);
      return () => clearTimeout(timeout);
    } else if (deselecting && selectedBlocks.size === 0) {
      setDeselecting(false);
    }
  }, [deselecting, selectedBlocks]);

  // Reset selected blocks and deselecting when gridData changes
  useEffect(() => {
    setSelectedBlocks(new Set());
    setDeselecting(false);
  }, [gridData]);

  return (
    <div className={styles.gridContainer}>
      {gridData.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className={styles.row}>
          {row.map((cell, colIndex) => {
            const blockId = `${rowIndex}-${colIndex}`;
            const isSelected = selectedBlocks.has(blockId);

            return cell === 1 ? (
              <div
                key={blockId}
                className={`${styles.block} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleBlockClick(rowIndex, colIndex)}
              ></div>
            ) : (
              <div key={blockId} className={styles.empty}></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* question 5
to draw and detect overlap circles 
*/

/*

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Circle Collision Detection</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
    canvas {
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <canvas id="circleCanvas" width="800" height="600"></canvas>
  <script>
    const canvas = document.getElementById("circleCanvas");
    const ctx = canvas.getContext("2d");

    const circles = []; // Array to store all circles

    // Function to detect if two circles overlap
    function isColliding(circle1, circle2) {
      const dx = circle2.x - circle1.x;
      const dy = circle2.y - circle1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < circle1.radius + circle2.radius;
    }

    // Function to draw a circle
    function drawCircle(circle) {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.closePath();
    }

    // Event listener for mouse clicks
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newCircle = {
        x: x,
        y: y,
        radius: 30,
        color: "blue", // Default color
      };

      // Check for collisions with existing circles
      for (const circle of circles) {
        if (isColliding(circle, newCircle)) {
          newCircle.color = "red"; // Change color if colliding
          break;
        }
      }

      circles.push(newCircle); // Add the new circle to the array

      // Redraw all circles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach(drawCircle);
    });
  </script>
</body>
</html>

*/

/* ques 6 
 task scheduling code below 
 the below code is incomplete
 follow link for code 
 https://www.youtube.com/watch?v=WE-h_aGz-dg
*/

/* 
const schedules = [{"id": "a" , "dependencies": ["b", "c"] },
{ "id": "b" , "dependencies": ["d"] },
{ "id": "с" , "dependencies": ["e"] },
{ "id": "d" , "dependencies": [] },
{ "id": "e" , "dependencies": ["c"] },
{ "id": "f" , "dependencies": [] }]

// task scheduling

const totalTasks = schedules. length
let totalTasksExecuted = 0
let currentTask = 0
const removeTaskFromDeps = (id) »> { schedules. forEach ((task) » {
const index = task. dependencies. indexof(id)
if (index !== -1) task.dependencies.splice(index, 1)
})
const executeTasks = () => {
while (totalTasksExecuted < totalTasks) {
const task = schedules [currentTask]
if (Itask denendencies lenath && Itask executed) &

*/

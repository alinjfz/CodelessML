// background: "black",
// backgroundColor: "lightBlue",
// textAlign: "center",
import React, { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { useDrag } from "@use-gesture/react"; //"react-use-gesture";
/*
const nodes = [
  { id: "center", label: "Center", x: 0, y: 0 },
  { id: "a", label: "A", x: 100, y: 0 },
  { id: "b", label: "B", x: 0, y: -100 },
  { id: "c", label: "C", x: -100, y: 0 },
  { id: "d", label: "D", x: 0, y: 100 },
];

const CenteredGraph = () => {
  const [{ x, y }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    config: config.stiff,
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my] }) => {
      set({ x: down ? mx : 0, y: down ? my : 0 });
    },
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
      //   {...bind()}
    >
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {nodes.map(({ id, x, y }) => (
          <line
            key={`line-${id}`}
            x1={x}
            y1={y}
            x2={0}
            y2={0}
            stroke="black"
            strokeWidth="2"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          />
        ))}
      </svg>
      <animated.div {...bind()} style={{ x, y }}>
       //style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}> 
        {nodes.map(({ id, label, x, y }) => (
          <div
            key={id}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "red",
              borderRadius: "50%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            }}
          >
            {label}
          </div>
        ))}
      </animated.div>
    </div>
  );
};

export default CenteredGraph;
*/

const initialNodes = [
  { id: "center", label: "Center", x: 0, y: 0 },
  { id: "a", label: "A", x: 100, y: 0 },
  { id: "b", label: "B", x: 0, y: -100 },
  { id: "c", label: "C", x: -100, y: 0 },
  { id: "d", label: "D", x: 0, y: 100 },
];

const CenteredGraph = () => {
  const [nodes, setNodes] = useState(initialNodes);

  const bind = useDrag(({ args: [id], down, movement: [mx, my] }) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? { ...node, x: down ? mx : node.x, y: down ? my : node.y }
          : node
      )
    );
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {nodes.map(({ id, x, y }) => (
          <line
            key={`line-${id}`}
            x1={nodes[0].x}
            y1={nodes[0].y}
            x2={x}
            y2={y}
            stroke="black"
            strokeWidth="2"
            style={{ transform: "translate(50%, 50%)" }}
          />
        ))}
      </svg>
      {nodes.map(({ id, label, x, y }) => (
        <animated.div
          key={id}
          {...bind(id)}
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "lightBlue",
            borderRadius: "30%",
            position: "absolute",
            top: "50%",
            left: "50%",
            x,
            y,
            // transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            // transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            transform: `translate(-50%, -50%) translate3d(0, 0, 0)`,
            zIndex: id === "center" ? 2 : 1, // Ensure center node is above others
          }}
        >
          {label}
        </animated.div>
      ))}
    </div>
  );
};

export default CenteredGraph;

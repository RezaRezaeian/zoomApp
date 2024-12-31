import React, { useState, useEffect } from "react";

const MovingText = ({ text }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const newTop = Math.random() * window.innerHeight * 0.9;
      const newLeft = Math.random() * window.innerWidth * 0.9;
      setPosition({ top: newTop, left: newLeft });
    };

    const intervalId = setInterval(updatePosition, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const textStyle = {
    position: "absolute",
    top: `${position.top}px`,
    left: `${position.left}px`,
    transition: "all 0.5s ease",
    fontSize: "1.5rem",
    color: "blue",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "5px",
    borderRadius: "5px",
  };

  return <div style={textStyle}>{text}</div>;
};

export default MovingText;

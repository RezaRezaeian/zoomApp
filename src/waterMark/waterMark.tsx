import React, { useState, useEffect, useRef, CSSProperties } from "react";
// import { CSSProperties } from "react";

const MovingText = ({
  text,
  containerRef,
}: {
  text: string,
  containerRef: React.RefObject<HTMLDivElement>,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }
    if (!containerRef.current) return;

    const container = containerRef.current;

    const toggleVisibility = () => {
      if (!visible) {
        const containerRect = container.getBoundingClientRect();
        const newTop = Math.random() * (containerRect.height - size.height);
        const newLeft = Math.random() * (containerRect.width - size.width);

        setPosition({ top: newTop, left: newLeft });
      }
      setVisible((prev) => !prev);
    };

    const visibilityInterval = setInterval(toggleVisibility, 5000);

    return () => {
      clearInterval(visibilityInterval);
    };
  }, [containerRef, visible, size.height, size.width]);

  const textStyle: CSSProperties = {
    position: "absolute",
    top: `${position.top}px`,
    left: `${position.left}px`,
    fontSize: "1.5rem",
    color: "rgba(255, 255, 255, 0.5)",
    zIndex: 9999,
    opacity: visible ? 0.6 : 0,
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <div style={textStyle} ref={textRef}>
      {text}
    </div>
  );
};

export default MovingText;

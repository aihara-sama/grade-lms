"use client";

import ResizeIcon from "@/components/icons/resize-icon";
import type { FunctionComponent, MouseEvent, MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  onResize: (height: number) => void;
  containerRef: MutableRefObject<HTMLElement>;
  minHeight: number;
  initialHeight: number;
}

const ResizeHandler: FunctionComponent<IProps> = ({
  onResize,
  containerRef,
  minHeight,
  initialHeight,
}) => {
  // Refs
  const heightRef = useRef(initialHeight);
  const startResizeYRef = useRef<number>();
  const initialHeightRef = useRef(initialHeight);
  const isResizeHandlerPressedRef = useRef(false);

  // State
  const [height, setHeight] = useState(initialHeightRef.current);

  // Handlers
  const handleMouseDown = (e: MouseEvent) => {
    isResizeHandlerPressedRef.current = true;

    startResizeYRef.current =
      e.clientY - containerRef.current.getBoundingClientRect().top;
  };

  // Effects
  useEffect(() => {
    onResize(height);
  }, [height]);
  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (isResizeHandlerPressedRef.current) {
        const posXOnElement =
          e.clientY - containerRef.current.getBoundingClientRect().top;
        const newHeight = Math.max(
          minHeight,
          initialHeightRef.current - (startResizeYRef.current - posXOnElement)
        );
        heightRef.current = newHeight;
        setHeight(newHeight);
      }
    });
    window.addEventListener("mouseup", () => {
      isResizeHandlerPressedRef.current = false;
      initialHeightRef.current = heightRef.current;
    });
  }, []);

  // View
  return (
    <div className="absolute bottom-6 right-6" onMouseDown={handleMouseDown}>
      <ResizeIcon className="cursor-nw-resize" />
    </div>
  );
};

export default ResizeHandler;

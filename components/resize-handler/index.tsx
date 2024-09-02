"use client";

import ResizeIcon from "@/components/icons/resize-icon";
import type {
  FunctionComponent,
  MutableRefObject,
  MouseEvent as ReactMouseEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onResize: (height: number) => void;
  containerRef: MutableRefObject<HTMLElement>;
  minHeight: number;
  initialHeight: number;
}

const ResizeHandler: FunctionComponent<Props> = ({
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
  const handleMouseDown = (e: ReactMouseEvent) => {
    isResizeHandlerPressedRef.current = true;

    startResizeYRef.current =
      e.clientY - containerRef.current.getBoundingClientRect().top;
  };

  const handleMouseUp = () => {
    isResizeHandlerPressedRef.current = false;
    initialHeightRef.current = heightRef.current;
  };

  const handleMouseMove = (e: MouseEvent) => {
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
  };

  // Effects
  useEffect(() => {
    onResize(height);
  }, [height]);
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // View
  return (
    <div className="absolute bottom-3 right-6" onMouseDown={handleMouseDown}>
      <ResizeIcon className="cursor-nw-resize" size="xs" />
    </div>
  );
};

export default ResizeHandler;

"use client";

import ResizeIcon from "@/components/icons/resize-icon";
import type { FunctionComponent, MouseEvent, MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  onChange: (height: number) => void;
  containerRef: MutableRefObject<HTMLElement>;
  minHeight: number;
  initialHeight: number;
}

const ResizeHandler: FunctionComponent<IProps> = ({
  onChange,
  containerRef,
  minHeight,
  initialHeight,
}) => {
  const isResizeHandlerPressedRef = useRef(false);
  const initialHeightRef = useRef(initialHeight);
  const heightRef = useRef(initialHeight);
  const startResizeYRef = useRef<number>();

  const [height, setHeight] = useState(initialHeightRef.current);

  useEffect(() => {
    onChange(height);
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

  const handleMouseDown = (e: MouseEvent) => {
    isResizeHandlerPressedRef.current = true;

    startResizeYRef.current =
      e.clientY - containerRef.current.getBoundingClientRect().top;
  };
  return (
    <div
      className="absolute bottom-[24px] right-[24px]"
      onMouseDown={handleMouseDown}
    >
      <ResizeIcon className="cursor-nw-resize" />
    </div>
  );
};

export default ResizeHandler;

"use client";

import clsx from "clsx";
import type {
  FunctionComponent,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
} from "react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  trigger: ReactNode;
  width?: "sm" | "md" | "lg" | "full";
}

const BasePopper: FunctionComponent<PropsWithChildren<IProps>> = ({
  // isOpen,
  // setIsOpen,
  children,
  trigger,
  width = "full",
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [triggerWrapperRect, setTriggerWrapperRect] = useState<DOMRect>();
  const [childrenWrapperWidth, setChlidrenWrapperWidth] = useState(0);

  // Refs
  const rootRef = useRef<HTMLDivElement>(null);
  const childrenWrapperRef = useRef<HTMLDivElement>(null);
  const triggerWrapperRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleClickOutside = (event: Event) => {
    if (!rootRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  const handleChildrenClick = (e: MouseEvent) => {
    const { tagName } = e.target as Element;
    if (tagName === "LI" || tagName === "A") {
      setIsOpen(false);
    }
  };

  // Effects
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    setTriggerWrapperRect(triggerWrapperRef.current.getBoundingClientRect());
    setChlidrenWrapperWidth(childrenWrapperRef?.current.clientWidth);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <div
        onClick={() => {
          setTriggerWrapperRect(
            triggerWrapperRef.current.getBoundingClientRect()
          );
          setIsOpen((prev) => !prev);
        }}
        ref={triggerWrapperRef}
      >
        {trigger}
      </div>
      <div
        style={{
          top: `${triggerWrapperRect?.bottom}px`,
          // eslint-disable-next-line
          left: `${triggerWrapperRect?.right - childrenWrapperWidth}px`,
          transitionProperty: "transform, opacity, visibility",
        }}
        className={`mt-2 ${clsx({
          "w-44": width === "sm",
          "w-60": width === "md",
          "w-full": width === "full",
        })} bg-white shadow-md fixed py-[14px] rounded-[3px] z-[999] duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "invisible opacity-0 translate-y-3"
        }`}
        onClick={handleChildrenClick}
        ref={childrenWrapperRef}
      >
        {children}
      </div>
    </div>
  );
};

export default BasePopper;

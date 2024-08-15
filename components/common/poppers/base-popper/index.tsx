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
  const [isVisible, setIsVisible] = useState(false);
  const [isAnim, setIsAnim] = useState(false);

  // Refs
  const rootRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleClickOutside = (event: Event) => {
    if (!rootRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  const handleTransitionEnd = () => {
    if (!isAnim) {
      setIsVisible(false);
    }
  };

  // Effects
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // To avoid rendering children when not open
  useEffect(() => {
    if (isOpen) {
      setIsAnim(true);
      setIsVisible(true);
    }
    if (!isOpen) {
      setIsAnim(false);
    }
  }, [isOpen]);

  const handleChildrenClick = (e: MouseEvent) => {
    const { tagName } = e.target as Element;
    if (tagName === "LI" || tagName === "A") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      <div
        className={`mt-2 ${clsx({
          "w-44": width === "sm",
          "w-60": width === "md",
          "w-full": width === "full",
        })} bg-white shadow-md absolute right-0 ${isVisible ? "py-[14px]" : ""} rounded-[3px] z-[999] transition-fade duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "invisible opacity-0 translate-y-3"
        }`}
        onClick={handleChildrenClick}
        onTransitionEnd={handleTransitionEnd}
      >
        {isVisible && children}
      </div>
    </div>
  );
};

export default BasePopper;

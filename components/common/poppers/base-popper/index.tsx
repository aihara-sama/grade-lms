"use client";

import clsx from "clsx";
import type {
  Dispatch,
  FunctionComponent,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
} from "react";
import { useEffect, useRef } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  anchorEl: MutableRefObject<HTMLElement>;
  width?: "sm" | "md" | "lg" | "full";
}

const BasePopper: FunctionComponent<PropsWithChildren<IProps>> = ({
  isOpen,
  setIsOpen,
  children,
  anchorEl,
  width = "full",
}) => {
  // Refs
  const rootRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleClickOutside = (event: MouseEvent) => {
    if (
      !rootRef.current?.contains(event.target as Node) &&
      !anchorEl.current?.contains(event.target as Node) &&
      anchorEl.current !== (event.target as Node)
    ) {
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

  return (
    <div
      className={`relative ${isOpen ? "visible" : "invisible"}`}
      ref={rootRef}
    >
      <div
        className={`mt-2 ${clsx({
          "w-60": width === "md",
          "w-full": width === "full",
        })} bg-white shadow-md absolute right-0 py-[14px] rounded-[3px] z-[999] transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "invisible opacity-0 translate-y-3"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default BasePopper;

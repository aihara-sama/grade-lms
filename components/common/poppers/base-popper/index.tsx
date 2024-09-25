"use client";

import type { PropsWithClassName } from "@/types/props.type";
import clsx from "clsx";
import type {
  ForwardRefRenderFunction,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
} from "react";
import { forwardRef, useEffect, useRef, useState } from "react";

interface Props {
  trigger: ReactNode;
  width?: "sm" | "md" | "lg" | "full";
  popperClassName?: string;
  placement?: "bottom" | "top";
}

const BasePopper: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<PropsWithClassName<Props>>
> = (
  {
    children,
    trigger,
    placement = "bottom",
    className = "",
    popperClassName = "",
    width = "full",
  },
  ref
) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnim, setIsAnim] = useState(false);

  // Refs
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

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
    if (tagName === "LI" || tagName === "A" || tagName === "BUTTON") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <div ref={triggerRef} onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>
      <div
        id="actual-popper"
        className={`border overflow-auto bg-white max-h-[calc(100vh-70px)] shadow-md absolute right-0 rounded-[3px] z-[999] transition-fade duration-300 ease-in-out ${clsx(
          {
            "opacity-100 translate-y-0 visible": isOpen,
            "invisible opacity-0 translate-y-3": !isOpen,
            "py-[14px]": isVisible,
            "w-44": width === "sm",
            "w-60": width === "md",
            "w-full": width === "full",
            "mt-2": placement === "bottom",
            "mb-2": placement === "top",
          }
        )} ${popperClassName}`}
        style={{
          bottom:
            placement === "top"
              ? `${triggerRef.current?.getBoundingClientRect?.()?.height}px`
              : "auto",
        }}
        onClick={handleChildrenClick}
        onTransitionEnd={handleTransitionEnd}
        ref={ref} // Pass the ref here
      >
        {isVisible && children}
      </div>
    </div>
  );
};

export default forwardRef(BasePopper);

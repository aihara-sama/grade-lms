"use client";

import CloseIcon from "@/components/icons/close-icon";
import clsx from "clsx";
import {
  useEffect,
  type Dispatch,
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  placement: "left" | "right";
  header: ReactNode;
}

const BaseDrawer: FunctionComponent<PropsWithChildren<IProps>> = ({
  isOpen,
  placement,
  setIsOpen,
  children,
  header,
}) => {
  // Effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "4px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
  }, [isOpen]);

  // View
  return (
    <>
      {/* Mask ↴ */}
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 backdrop-filter z-[99]  transition-all ${isOpen ? "backdrop-blur-[2px] bg-mask visible" : "invisible bg-transparent backdrop-blur-0"}`}
        onClick={() => setIsOpen(false)}
      ></div>
      {/* ^ Mask ^ */}

      {/* Actual Drawer */}
      <div
        className={clsx(
          "bg-white w-full sm:w-[450px] transition-all ease-in duration-200 absolute z-[999] inset-y-0",
          {
            "translate-x-0 opacity-100": placement === "left" && isOpen,
            "-translate-x-[450px] ": placement === "left" && !isOpen,
            "translate-x-[0] opacity-100": placement === "right" && isOpen,
            "translate-x-full sm:translate-x-[450px] ":
              placement === "right" && !isOpen,
            "left-0": placement === "left",
            "right-0": placement === "right",
          }
        )}
      >
        <div className="shadow-lg py-4 pl-7 pr-3 flex justify-between">
          {header}
          <button onClick={() => setIsOpen(false)} className="icon-button">
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </>
  );
};

export default BaseDrawer;

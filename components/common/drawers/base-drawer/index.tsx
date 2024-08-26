"use client";

import Mask from "@/components/common/mask";
import CloseIcon from "@/components/icons/close-icon";
import { hasVerticalScrollbar } from "@/utils/has-vertical-scrollbar";
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
      document.body.style.overflowY = "hidden";

      if (hasVerticalScrollbar()) {
        document.body.style.paddingRight = "4px";
      }
    } else {
      document.body.style.overflowY = "unset";
      document.body.style.paddingRight = "0px";
    }
  }, [isOpen]);

  // View
  return (
    <>
      <Mask isOpen={isOpen} onClick={() => setIsOpen(false)} />
      {/* Actual Drawer */}
      <div
        className={clsx(
          "bg-white transition-transform ease-in duration-200 fixed z-[999] inset-y-0",
          {
            "w-full sm:w-[450px]":
              placement === "left" || placement === "right",
            "left-0": placement === "left",
            "right-0": placement === "right",
            "transform translate-x-0": placement === "left" && isOpen,
            "-translate-x-full": placement === "left" && !isOpen,
            "translate-x-0": placement === "right" && isOpen,
            "translate-x-full": placement === "right" && !isOpen,
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

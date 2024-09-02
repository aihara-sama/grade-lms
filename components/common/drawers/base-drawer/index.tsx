"use client";

import Mask from "@/components/common/mask";
import CloseIcon from "@/components/icons/close-icon";
import { hasVerticalScrollbar } from "@/utils/has-vertical-scrollbar";
import clsx from "clsx";
import {
  useEffect,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
} from "react";

interface Props {
  onClose: (mutated?: boolean) => void;
  placement: "left" | "right";
  header: ReactNode;
}

const BaseDrawer: FunctionComponent<PropsWithChildren<Props>> = ({
  placement,
  children,
  header,
  onClose,
}) => {
  const [hasRendered, setHasRendered] = useState(false);
  // Effects
  useEffect(() => {
    document.body.style.overflowY = "hidden";

    if (hasVerticalScrollbar()) {
      document.body.style.paddingRight = "4px";
    }

    setHasRendered(true);

    return () => {
      document.body.style.overflowY = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, []);

  // View
  return (
    <>
      <Mask onClick={onClose} />
      {/* Actual Drawer */}
      <div
        className={clsx(
          "bg-white transition-transform ease-in duration-200 fixed z-[999] inset-y-0",
          {
            "w-full sm:w-[450px]":
              placement === "left" || placement === "right",
            "left-0": placement === "left",
            "right-0": placement === "right",
            "transform translate-x-0": placement === "left" && hasRendered,
            "-translate-x-full": placement === "left" && !hasRendered,
            "translate-x-0": placement === "right" && hasRendered,
            "translate-x-full": placement === "right" && !hasRendered,
          }
        )}
      >
        <div className="shadow-lg py-4 pl-7 pr-3 flex justify-between">
          {header}
          <button onClick={() => onClose()} className="icon-button">
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </>
  );
};

export default BaseDrawer;

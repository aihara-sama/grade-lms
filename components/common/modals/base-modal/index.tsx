import Mask from "@/components/common/mask";
import CloseIcon from "@/components/icons/close-icon";
import { hasVerticalScrollbar } from "@/utils/has-vertical-scrollbar";
import clsx from "clsx";
import type { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  onClose: () => void;
  width?: "md" | "lg";
  title: string;
  headerButtons?: ReactNode;
  isExpanded?: boolean;
  isInsideModal?: boolean;
}

const BaseModal: FunctionComponent<PropsWithChildren<Props>> = ({
  title,
  children,
  headerButtons,
  isInsideModal,
  onClose,
  isExpanded = true,
  width = "md",
}) => {
  // State
  const [hasRendered, setHasRendered] = useState(false);

  // Handlers

  // Effects
  useEffect(() => {
    document.body.style.overflowY = "hidden";

    if (hasVerticalScrollbar()) {
      document.body.style.paddingRight = "4px";
    }

    setHasRendered(true);

    return () => {
      if (!isInsideModal) {
        document.body.style.overflowY = "unset";
        document.body.style.paddingRight = "0px";
      }
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-3 z-[999] ${clsx(hasRendered && "visible overflow-visible")}`}
    >
      <Mask onClick={onClose} />
      <div
        className={`flex flex-col relative top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 z-[999] w-full
        ${clsx({
          "h-[min(500px,100%)]": isExpanded,
          "max-h-[90vh]": !isExpanded,
          "sm:w-[400px]": width === "md",
          "sm:w-[680px]": width === "lg",
        })}
        `}
      >
        <div
          className={`${isExpanded ? "h-[min(500px,100%)]" : "max-h-[90vh]"} pb-3 overflow-auto transition-fade flex items-center flex-col rounded-md shadow-md bg-white -translate-y-10 opacity-0 ${clsx(
            hasRendered && "opacity-100 translate-y-0"
          )}`}
        >
          <div className="w-full px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="font-bold text-neutral-600">{title}</div>
            <div className="flex items-center">
              {headerButtons}
              <button className="icon-button" onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
          </div>
          <div
            className={`overflow-auto w-full px-6 pt-3 flex flex-col ${isExpanded ? "h-[min(500px,100%)]" : "max-h-[90vh]"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BaseModal;

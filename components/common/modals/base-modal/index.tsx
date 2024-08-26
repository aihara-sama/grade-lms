import Mask from "@/components/common/mask";
import CloseIcon from "@/components/icons/close-icon";
import { hasVerticalScrollbar } from "@/utils/has-vertical-scrollbar";
import type {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  width?: "md" | "lg";
  title: string;
  headerButtons?: ReactNode;
  isExpanded?: boolean;
  isInsideModal?: boolean;
}

const BaseModal: FunctionComponent<PropsWithChildren<IProps>> = ({
  title,
  children,
  headerButtons,
  isOpen,
  setIsOpen,
  isInsideModal,
  isExpanded = true,
  width = "md",
}) => {
  // State
  const [isVisible, setIsVisible] = useState(false);
  const [isAnim, setIsAnim] = useState(false);

  // Handlers
  const handleTransitionEnd = () => {
    // On closing modal
    if (!isAnim) {
      setIsVisible(false);
      // Restore scrollbar
      if (!isInsideModal) {
        document.body.style.overflowY = "unset";
        document.body.style.paddingRight = "0px";
      }
    }
  };

  const handleMaskClick = () => setIsOpen(false);

  // Effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
      if (hasVerticalScrollbar()) {
        document.body.style.paddingRight = "4px";
      }
    }
  }, [isOpen]);

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

  return createPortal(
    <div
      className={`fixed inset-3 z-[999] ${isOpen ? "visible overflow-visible" : "invisible overflow-hidden"}`}
    >
      <Mask isOpen={isOpen} onClick={handleMaskClick} />
      <div
        className={`${isExpanded ? "h-[min(500px,100%)]" : "max-h-[90vh]"} flex flex-col relative top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 z-[999] w-full ${width === "md" ? "sm:w-[400px]" : "sm:w-[680px]"}`}
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`${isExpanded ? "h-[min(500px,100%)]" : "max-h-[90vh]"} pb-3 overflow-auto transition-fade flex items-center flex-col rounded-md shadow-md bg-white ${
            isOpen ? "opacity-100 translate-y-0" : " opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="font-bold text-neutral-600">{title}</div>
            <div className="flex items-center">
              {headerButtons}
              <button className="icon-button" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </button>
            </div>
          </div>
          <div
            className={`overflow-auto w-full px-6 pt-3 flex flex-col ${isExpanded ? "h-[min(500px,100%)]" : "max-h-[90vh]"}`}
          >
            {isVisible && children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BaseModal;

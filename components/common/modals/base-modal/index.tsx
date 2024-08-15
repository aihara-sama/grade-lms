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

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  width?: "md" | "lg";
  title: string;
  headerButtons?: ReactNode;
}

const BaseModal: FunctionComponent<PropsWithChildren<IProps>> = ({
  title,
  children,
  headerButtons,
  isOpen,
  setIsOpen,
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
      document.body.style.overflowY = "unset";
      document.body.style.paddingRight = "0px";
    }
  };

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

  return (
    <div
      className={`fixed inset-5 z-[999] ${isOpen ? "visible" : "invisible"}`}
    >
      {/* Mask ↴ */}
      <div
        className={`fixed inset-0 backdrop-filter z-[99]  transition-all ${isOpen ? "backdrop-blur-[2px] bg-mask visible" : "invisible bg-transparent backdrop-blur-0"}`}
        onClick={() => setIsOpen(false)}
      ></div>
      {/* ^ Mask ^ */}
      <div
        className={`flex flex-col relative top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 sm-h:h-auto h-full z-[999] w-full ${width === "md" ? "sm:w-[400px]" : "sm:w-[680px]"}`}
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`pb-3 overflow-auto transition-fade flex items-center flex-col rounded-md shadow-md bg-white ${
            isOpen ? "opacity-100 translate-y-0 " : " opacity-0 translate-y-10"
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
          <div className="overflow-auto w-full px-6 pt-3">
            {isVisible && children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;

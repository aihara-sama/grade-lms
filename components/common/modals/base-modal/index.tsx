import CloseIcon from "@/components/icons/close-icon";
import { hasVerticalScrollbar } from "@/utils/has-vertical-scrollbar";
import type {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from "react";
import { useEffect } from "react";

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

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-[999] ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Mask ↴ */}
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 backdrop-filter z-[99]  transition-all ${isOpen ? "backdrop-blur-[2px] bg-mask visible" : "invisible bg-transparent backdrop-blur-0"}`}
        onClick={() => setIsOpen(false)}
      ></div>
      {/* ^ Mask ^ */}
      <div
        className={`transition-all items-center flex-col z-[999] rounded-md shadow-md bg-white ${width === "md" ? "w-[400px]" : "w-[680px]"} ${
          isOpen ? "opacity-100 translate-y-0 " : " opacity-0 translate-y-10"
        }`}
      >
        <div className="px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="font-bold text-neutral-600">{title}</div>
          <div className="flex items-center">
            {headerButtons}
            <button className="icon-button" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="px-6 py-3">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;

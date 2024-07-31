import CloseIcon from "@/components/icons/close-icon";
import type { FunctionComponent, ReactNode } from "react";
import { useEffect } from "react";

interface IProps {
  close: () => void;
  title: string;
  content: JSX.Element;
  width?: number;
  buttons?: ReactNode;
}

const Modal: FunctionComponent<IProps> = ({
  title,
  content,
  close,
  buttons,
  width = 400,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="fixed top-[0] bottom-[0] left-[0] right-[0] flex items-center justify-center z-[999]">
      <div
        className="fixed top-[0] bottom-[0] left-[0] right-[0] backdrop-filter backdrop-blur-[2px] z-[99] bg-mask"
        onClick={close}
      ></div>
      <div
        className={`items-center flex-col z-[999] rounded-[5px] w-[${width}px] shadow-md bg-white`}
      >
        <div className="px-[24px] py-[14px] flex items-center justify-between shadow-sm">
          <p className="font-bold">{title}</p>
          <div className="flex items-center">
            {buttons}
            <button
              className="icon-button hover:bg-gray-100 active:bg-gray-200"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="px-[24px] py-[12px]">{content}</div>
      </div>
    </div>
  );
};

export default Modal;

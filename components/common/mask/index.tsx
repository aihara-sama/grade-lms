import type { FunctionComponent } from "react";

interface IProps {
  isOpen: boolean;
  onClick: () => void;
}

const Mask: FunctionComponent<IProps> = ({ isOpen, onClick }) => {
  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 backdrop-filter z-[99]  transition-all ${isOpen ? "backdrop-blur-[2px] bg-mask visible" : "invisible bg-transparent backdrop-blur-0"}`}
      onClick={onClick}
    ></div>
  );
};

export default Mask;

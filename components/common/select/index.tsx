import BasePopper from "@/components/common/poppers/base-popper";
import ArrowIcon from "@/components/icons/arrow-icon";
import type { ISelectItem } from "@/interfaces/menu.interface";
import type { FunctionComponent } from "react";
import { useRef, useState } from "react";

interface IProps {
  label: string;
  options: ISelectItem[];
  useUnselect?: boolean;
  defaultValue: ISelectItem;
  onChange: (option: ISelectItem) => void;
}

const Select: FunctionComponent<IProps> = ({
  label,
  options,
  defaultValue,
  useUnselect,
  onChange,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // Refs
  const anchorEl = useRef<HTMLDivElement>();

  return (
    <div>
      <div
        className="relative border-[1px] border-solid flex items-center justify-between px-3 py-2 rounded-[5px] cursor-pointer bg-white hover:bg-gray-100 active:bg-gray-200 gap-3 w-40"
        onClick={() => setIsOpen((prev) => !prev)}
        ref={anchorEl}
      >
        <div className="absolute -top-3.5 left-1 px-1 text-neutral-500 font-bold">
          {label}
        </div>
        <div>{defaultValue?.title || "All"}</div>
        <ArrowIcon direction={isOpen ? "top" : "bottom"} />
      </div>
      <BasePopper isOpen={isOpen} setIsOpen={setIsOpen} anchorEl={anchorEl}>
        {useUnselect && (
          <div
            className="px-[14px] py-[10px] rounded-[3px] cursor-pointer font-bold hover:bg-gray-100"
            onClick={() => {
              onChange(undefined);
              setIsOpen(false);
            }}
          >
            All
          </div>
        )}
        {options.map((option, idx) => (
          <div
            className="px-[14px] py-[10px] rounded-[3px] cursor-pointer font-bold hover:bg-gray-100"
            onClick={() => {
              onChange(option);
              setIsOpen(false);
            }}
            key={idx}
          >
            {option.title}
          </div>
        ))}
      </BasePopper>
    </div>
  );
};

export default Select;

import BasePopper from "@/components/common/poppers/base-popper";
import ArrowIcon from "@/components/icons/arrow-icon";
import type { ISelectItem } from "@/interfaces/menu.interface";
import clsx from "clsx";
import type { FunctionComponent } from "react";
import { useState } from "react";

interface IProps {
  label: string;
  options: ISelectItem[];
  useUnselect?: boolean;
  defaultValue: ISelectItem;
  onChange: (option: ISelectItem) => void;
  popperClassName?: string;
  fullWidth?: boolean;
}

const Select: FunctionComponent<IProps> = ({
  label,
  options,
  defaultValue,
  useUnselect,
  onChange,
  popperClassName = "",
  fullWidth,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <BasePopper
        popperClassName={popperClassName}
        trigger={
          <div
            className={`relative border-[1px] border-solid flex items-center justify-between px-3 py-2 rounded-[5px] cursor-pointer bg-white hover:bg-gray-100 active:bg-gray-200 gap-3 ${clsx(fullWidth ? "w-full" : "w-40")}`}
          >
            <div className="absolute -top-3.5 left-1 px-1 text-neutral-500 font-bold">
              {label}
            </div>
            <div>{defaultValue?.title || "All"}</div>
            <ArrowIcon direction={isOpen ? "top" : "bottom"} />
          </div>
        }
      >
        <ul>
          {useUnselect && (
            <li
              className="px-[14px] py-[10px] rounded-[3px] cursor-pointer font-bold hover:bg-gray-100"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
            >
              All
            </li>
          )}
          {options.map((option, idx) => (
            <li
              className="px-[14px] py-[10px] rounded-[3px] cursor-pointer font-bold hover:bg-gray-100"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              key={idx}
            >
              {option.title}
            </li>
          ))}
        </ul>
      </BasePopper>
    </div>
  );
};

export default Select;

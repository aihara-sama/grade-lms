import BasePopper from "@/components/common/poppers/base-popper";
import ArrowIcon from "@/components/icons/arrow-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import type { SelectItem } from "@/interfaces/menu.interface";
import clsx from "clsx";
import type { ChangeEvent, ComponentProps, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  options: SelectItem[];
  useUnselect?: boolean;
  defaultValue: SelectItem;
  onChange: (option: SelectItem) => void;
  fullWidth?: boolean;
  popperProps?: Partial<ComponentProps<typeof BasePopper>>;
}

const Select: FunctionComponent<Props> = ({
  label,
  options,
  defaultValue,
  useUnselect,
  onChange,
  popperProps,
  fullWidth,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<SelectItem[]>(options);
  const [searchText, setSearchText] = useState("");
  const [popperHeight, setPopperHeight] = useState(0);

  const popperRef = useRef<HTMLDivElement>();

  const onSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    setFilteredOptions(
      options.filter(({ title }) => title.includes(searchText))
    );
  }, [searchText]);

  const onResize = () => {
    setPopperHeight(popperRef.current?.getBoundingClientRect?.()?.height);
  };

  useEffect(onResize, []);
  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <BasePopper
      ref={popperRef}
      trigger={
        <div
          className={`relative border-[1px] border-solid flex items-center justify-between px-3 py-2 rounded-[5px] cursor-pointer bg-white hover:bg-gray-100 active:bg-gray-200 gap-3 ${clsx(fullWidth ? "w-full" : "w-52")}`}
        >
          <div className="absolute -top-3.5 left-1 px-1 text-neutral-500 font-bold">
            {label}
          </div>
          <div>{defaultValue?.title || (useUnselect ? "All" : "Choose")}</div>
          <ArrowIcon direction={isOpen ? "top" : "bottom"} />
        </div>
      }
      {...popperProps}
    >
      <div className="relative">
        <Input
          value={searchText}
          onChange={onSearchTextChange}
          Icon={<SearchIcon />}
          fullWIdth
          className="px-[14px]"
          autoFocus
        />
        <ul
          className="overflow-auto"
          style={{
            maxHeight: `${popperHeight - 80}px`,
          }}
        >
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
          {filteredOptions.map((option, idx) => (
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
      </div>
    </BasePopper>
  );
};

export default Select;

import type {
  Dispatch,
  FunctionComponent,
  MutableRefObject,
  SetStateAction,
} from "react";
import { useEffect, useRef } from "react";

interface IItem {
  title: string;
  id: string;
}
interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  anhrolElRef: MutableRefObject<HTMLElement>;
  items: IItem[];
  onChange: (item: IItem) => void;
}

const SelectPopper: FunctionComponent<IProps> = ({
  isOpen,
  setIsOpen,
  anhrolElRef,
  items,
  onChange,
}) => {
  const popperRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !popperRef.current?.contains(event.target as Node) &&
        !anhrolElRef.current?.contains(event.target as Node) &&
        anhrolElRef.current !== (event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div
      className={`absolute left-[0] top-[40px] z-[1] w-full px-[0] py-[14px] rounded-[3px] flex-col max-h-[300px] overflow-auto border-[1px] border-solid border-slate-100 ${isOpen ? "flex" : "hidden"} bg-white shadow-md`}
      ref={popperRef}
    >
      {items.map((item, idx) => (
        <div
          className="px-[14px] py-[10px] rounded-[3px] cursor-pointer font-bold hover:bg-gray-100"
          onClick={() => onChange(item)}
          key={idx}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
};

export default SelectPopper;

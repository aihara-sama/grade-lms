import type {
  Dispatch,
  FunctionComponent,
  MutableRefObject,
  SetStateAction,
} from "react";
import { useEffect, useRef } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  anhrolElRef: MutableRefObject<HTMLButtonElement>;
  setTime: (time: string) => void;
}

const ChooseTimePopper: FunctionComponent<IProps> = ({
  isOpen,
  setIsOpen,
  anhrolElRef,
  setTime,
}) => {
  const popperRef = useRef<HTMLDivElement>();

  const handleTimeClick = (time: string) => {
    setTime(time);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !(
          popperRef.current?.contains(event.target as Node) ||
          anhrolElRef.current === (event.target as Node)
        )
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
      className={`absolute left-[0] top-[64px] z-[1] w-full px-[0] py-[14px] rounded-[3px] flex-col max-h-[300px] overflow-auto ${isOpen ? "flex" : "hidden"} bg-white shadow-md`}
      ref={popperRef}
    >
      {[
        "08:00 AM",
        "08:15 AM",
        "08:30 AM",
        "08:45 AM",
        "09:00 AM",
        "09:15 AM",
        "09:30 AM",
        "09:45 AM",
        "10:00 AM",
        "10:15 AM",
        "10:30 AM",
        "10:45 AM",
        "11:00 AM",
        "11:15 AM",
        "11:30 AM",
        "11:45 AM",
        "12:00 PM",
        "12:15 PM",
        "12:30 PM",
        "12:45 PM",
        "01:00 PM",
        "01:15 PM",
        "01:30 PM",
        "01:45 PM",
        "02:00 PM",
        "02:15 PM",
        "02:30 PM",
        "02:45 PM",
        "03:00 PM",
        "03:15 PM",
        "03:30 PM",
        "03:45 PM",
        "04:00 PM",
        "04:15 PM",
        "04:30 PM",
        "04:45 PM",
        "05:00 PM",
        "05:15 PM",
        "05:30 PM",
        "05:45 PM",
        "06:00 PM",
        "06:15 PM",
        "06:30 PM",
        "06:45 PM",
        "07:00 PM",
        "07:15 PM",
        "07:30 PM",
        "07:45 PM",
        "08:00 PM",
        "08:15 PM",
        "08:30 PM",
        "08:45 PM",
        "09:00 PM",
        "09:15 PM",
        "09:30 PM",
        "09:45 PM",
        "10:00 PM",
      ].map((time) => (
        <div
          key={time}
          onClick={() => handleTimeClick(time)}
          className="px-[14px] py-[10px] rounded-[3px] text-center cursor-pointer hover:bg-gray-100"
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default ChooseTimePopper;

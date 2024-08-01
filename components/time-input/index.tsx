"use client";

import ChooseTimePopper from "@/components/poppers/choose-time-popper";
import { useRef, useState, type FunctionComponent } from "react";

interface IProps {
  label: string;
  time: string;
  onChange: (time: string) => void;
}

const TimeInput: FunctionComponent<IProps> = ({ label, onChange, time }) => {
  const [isChooseTimePopperOpen, setIsChooseTimePopperOpen] = useState(false);
  const anhrolElRef = useRef<HTMLButtonElement>();

  return (
    <div className="mb-3 relative mt-3">
      <p className="absolute -top-[11px] left-[9px] text-sm font-bold z-[1]">
        {label}
      </p>
      <button
        className="outline-button w-full"
        ref={anhrolElRef}
        onClick={() => setIsChooseTimePopperOpen((prev) => !prev)}
      >
        {time}
      </button>
      <ChooseTimePopper
        setTime={onChange}
        anhrolElRef={anhrolElRef}
        setIsOpen={setIsChooseTimePopperOpen}
        isOpen={isChooseTimePopperOpen}
      />
    </div>
  );
};

export default TimeInput;

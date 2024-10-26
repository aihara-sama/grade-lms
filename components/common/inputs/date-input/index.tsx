"use client";

import CalendarIcon from "@/components/icons/calendar-icon";
import { format } from "date-fns";

import ReactDatePicker from "react-datepicker";

import "@/styles/datepicker.css";
import "react-datepicker/dist/react-datepicker.css";

import type { Placement } from "@floating-ui/utils/dist/floating-ui.utils";
import type { FunctionComponent } from "react";
import { forwardRef, memo, useState } from "react";
import { createPortal } from "react-dom";

const CustomInput = forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    label: string;
    date: string;
  }
>(({ date, onClick, label, disabled }, ref) => (
  <button
    className="outline-button w-full font-bold"
    onClick={onClick}
    ref={ref}
    type="button"
    disabled={disabled}
  >
    <p className="absolute -top-3 left-2 text-sm">{label}</p>
    <CalendarIcon />
    {date}
  </button>
));
CustomInput.displayName = "CustomInput";

interface Props {
  date: Date;
  label: string;
  onChange: (date: Date) => void;
  popperPlacement?: Placement;
  disabled?: boolean;
}

const DateInput: FunctionComponent<Props> = memo(function DateInput({
  date,
  label,
  onChange,
  popperPlacement,
  disabled,
}) {
  const [selectedDate, setSelectedDate] = useState(date);

  return (
    <div>
      <ReactDatePicker
        popperProps={{ strategy: "fixed" }}
        popperClassName="z-[10]"
        popperContainer={({ children }) =>
          createPortal(children, document.body)
        }
        popperPlacement={popperPlacement}
        selected={selectedDate}
        onChange={(d, e) => {
          setSelectedDate(d);
          // e is undefined if clicked on time slot
          if (!e) {
            onChange(d);
          }
        }}
        customInput={
          <CustomInput
            date={format(date, "EEEE, MMM d | h:mm a")}
            label={label}
            disabled={disabled}
          />
        }
        dateFormat="EEEE, MMM d | h:mm a"
        showTimeSelect
        timeIntervals={15}
        minDate={new Date()}
        showPopperArrow={false}
        onCalendarClose={() => setSelectedDate(date)}
        disabled={disabled}
      />
    </div>
  );
});
export default DateInput;

"use client";

import CalendarIcon from "@/components/icons/calendar-icon";
import { format } from "date-fns";
import { forwardRef, useState, type FunctionComponent } from "react";
import ReactDatePicker from "react-datepicker";

import type { Placement } from "@floating-ui/utils/dist/floating-ui.utils";

import "react-datepicker/dist/react-datepicker.css";

const CustomInput = forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    label: string;
    date: string;
  }
>(({ date, onClick, label }, ref) => (
  <button
    className="outline-button w-full font-bold"
    onClick={onClick}
    ref={ref}
    type="button"
  >
    <p className="absolute -top-3 left-2 text-sm">{label}</p>
    <CalendarIcon />
    {date}
  </button>
));
CustomInput.displayName = "CustomInput";

interface IProps {
  date: Date;
  label: string;
  onChange: (date: Date) => void;
  popperPlacement?: Placement;
}

const DateInput: FunctionComponent<IProps> = ({
  date,
  label,
  onChange,
  popperPlacement,
}) => {
  const [selectedDate, setSelectedDate] = useState(date);
  return (
    <div>
      <ReactDatePicker
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
          />
        }
        dateFormat="EEEE, MMM d | h:mm a"
        showTimeSelect
        timeIntervals={15}
        minDate={new Date()}
        showPopperArrow={false}
        onCalendarClose={() => setSelectedDate(date)}
      />
    </div>
  );
};

export default DateInput;

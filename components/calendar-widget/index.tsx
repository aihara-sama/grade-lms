import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useState } from "react";

interface IProps {
  onChange: (date: Date) => void;
}

const CalendarWidget: React.FC<IProps> = ({ onChange }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const startWeek = startOfWeek(startMonth);

  // Calculate the end date to include exactly 6 weeks
  const endSixWeeks = endOfWeek(addDays(startWeek, 35));

  // Function to get days needed to fill exactly 6 weeks
  const getDaysForDisplay = () => {
    const days: Date[] = [];
    let day = startWeek;

    // Add days from the current month and next month until we fill exactly 6 weeks
    while (day <= endSixWeeks) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: Date) => {
    if (day < startMonth) {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (day > endMonth) {
      setCurrentDate(addMonths(currentDate, 1));
    }

    setSelectedDate(day);
    onChange(day); // Pass the selected date up
  };

  const getDayStyle = (day: Date) => {
    if (!isSameMonth(day, currentDate)) {
      return "text-gray-400 hover:bg-gray-100 active:bg-gray-200"; // Light color for days not in the current month
    }
    if (selectedDate && isSameDay(day, selectedDate)) {
      return "bg-blue-100 text-white  hover:bg-blue-200 active:bg-blue-300";
    }
    return "text-gray-800 hover:bg-gray-100 active:bg-gray-200";
  };

  const daysForDisplay = getDaysForDisplay();

  return (
    <div className="w-[300px] p-4 bg-white shadow-md rounded-lg text-sm">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="icon-button">
          <ArrowLeftIcon />
        </button>
        <h2 className="text-base font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button onClick={handleNextMonth} className="icon-button">
          <ArrowRightIcon />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-extrabold text-neutral-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center gap-y-2">
        {daysForDisplay.map((day, index) => (
          <div
            key={index}
            className={`transition-colors font-bold h-[36px] flex items-center justify-center rounded cursor-pointer ${getDayStyle(day)}`}
            onClick={() => handleDayClick(day)}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;

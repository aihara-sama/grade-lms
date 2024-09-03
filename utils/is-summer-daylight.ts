import { addHours, subHours } from "date-fns";

export const isSummerDaylight = (date1: Date, date2: Date) => {
  if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) {
    throw new Error("Invalid date");
  }

  return (
    new Date(+date1).getTimezoneOffset() !==
    new Date(+date2).getTimezoneOffset()
  );
};

export const getStdTimezoneOffset = (date: Date) => {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

export const isDstObserved = (date: Date) =>
  date.getTimezoneOffset() < getStdTimezoneOffset(date);

export const isStartDST = (date: Date) =>
  isDstObserved(date) && !isDstObserved(subHours(date, 1));
export const isEndDST = (date: Date) =>
  isDstObserved(date) && !isDstObserved(addHours(date, 1));

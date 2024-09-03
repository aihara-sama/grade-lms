import { addDays, format } from "date-fns";

export const getWeekDays = (start = new Date("2024-10-22T00:00:00")) => {
  return [
    format(addDays(start, 0), "MM/dd/yyyy"),
    format(addDays(start, 1), "MM/dd/yyyy"),
    format(addDays(start, 2), "MM/dd/yyyy"),
    format(addDays(start, 3), "MM/dd/yyyy"),
    format(addDays(start, 4), "MM/dd/yyyy"),
    format(addDays(start, 5), "MM/dd/yyyy"),
    format(addDays(start, 6), "MM/dd/yyyy"),
  ];
};

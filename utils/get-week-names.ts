import { getWeekDays } from "@/utils/get-week-days";
import { addDays, format, subWeeks } from "date-fns";

export const getWeekNames = () => {
  return getWeekDays(addDays(subWeeks(new Date(), 1), 1)).map((day) =>
    format(new Date(day), "EE")
  );
};

import { addDays, setHours, setMinutes, setSeconds } from "date-fns";

export const getNextMorning = () =>
  addDays(setSeconds(setMinutes(setHours(new Date(), 8), 0), 0), 1);

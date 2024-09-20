import {
  addDays,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";

export const getNextMorning = () => {
  return addDays(
    setMilliseconds(setSeconds(setMinutes(setHours(new Date(), 8), 0), 0), 0),
    1
  );
};

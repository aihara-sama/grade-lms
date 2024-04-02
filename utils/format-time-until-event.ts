import { differenceInMinutes } from "date-fns";

export const formatTimeUntilEvent = (eventTime: Date) => {
  const currentTime = new Date();
  const timeDifferenceMinutes = differenceInMinutes(eventTime, currentTime);

  if (timeDifferenceMinutes < 60) {
    return `${timeDifferenceMinutes}min`;
  }
  const hours = Math.floor(timeDifferenceMinutes / 60);
  const minutes = timeDifferenceMinutes % 60;
  return `${hours}h ${minutes}min`;
};

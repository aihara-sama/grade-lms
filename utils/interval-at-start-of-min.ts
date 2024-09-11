import { addMinutes, differenceInMilliseconds, startOfMinute } from "date-fns";

type ExecuteEveryMinute = (fn: (stop: () => void) => void) => () => void;

export const execAtStartOfMin: ExecuteEveryMinute = (fn) => {
  let shouldExec = true;

  const stop = () => {
    shouldExec = false;
  };

  if (shouldExec) {
    // Execute the function immediately
    fn(stop);

    // Calculate the time until the start of the next minute
    const now = new Date();
    const nextMinuteStart = startOfMinute(addMinutes(now, 1));
    const timeUntilNextMinute = differenceInMilliseconds(nextMinuteStart, now);

    // Set a timeout to run the function at the start of the next minute
    setTimeout(() => {
      fn(stop);

      // After the first timed execution, continue running the function every minute
      setInterval(fn, 60 * 1000);
    }, timeUntilNextMinute);
  }

  return stop;
};

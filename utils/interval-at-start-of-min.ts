import { addMinutes, differenceInMilliseconds, startOfMinute } from "date-fns";

type ExecuteEveryMinute = (fn: (stop: () => void) => void) => () => void;

export const execAtStartOfMin: ExecuteEveryMinute = (fn) => {
  let shouldExec = true;
  let intervalId: NodeJS.Timeout | null = null;

  const stop = () => {
    shouldExec = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const executeFunction = () => {
    if (shouldExec) {
      fn(stop);
    }
  };

  // Execute the function immediately
  executeFunction();

  // Calculate the time until the start of the next minute
  const now = new Date();
  const nextMinuteStart = startOfMinute(addMinutes(now, 1));
  const timeUntilNextMinute = differenceInMilliseconds(nextMinuteStart, now);

  // Set a timeout to run the function at the start of the next minute
  const timeoutId = setTimeout(() => {
    executeFunction();

    // After the first timed execution, continue running the function every minute
    intervalId = setInterval(() => {
      executeFunction();
    }, 60 * 1000);
  }, timeUntilNextMinute);

  return () => {
    stop();
    clearTimeout(timeoutId);
  };
};

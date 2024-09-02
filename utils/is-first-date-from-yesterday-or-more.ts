export const isFirstDateFromYesterdayOrMore = (
  firstDateStr: string,
  secondDateStr: string
) => {
  const first = new Date(firstDateStr);
  const second = new Date(secondDateStr);

  // Ensure both dates are valid
  if (Number.isNaN(first.getTime()) || Number.isNaN(second.getTime())) {
    throw new Error("Invalid date format");
  }

  // Get the start of the day for both dates
  const startOfFirst = new Date(first);
  startOfFirst.setHours(0, 0, 0, 0);

  const startOfSecond = new Date(second);
  startOfSecond.setHours(0, 0, 0, 0);

  // Get the start of the day for the day before the second date
  const startOfYesterday = new Date(startOfSecond);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  // Check if the first date is from the day before or earlier than the second date
  return startOfFirst <= startOfYesterday;
};

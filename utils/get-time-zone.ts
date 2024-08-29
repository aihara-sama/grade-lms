export const getTimeZone = (date = new Date()) => {
  // Get the user's current timezone offset in minutes
  const timezoneOffset = date.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
  const offsetMinutes = Math.abs(timezoneOffset % 60);
  const sign = timezoneOffset <= 0 ? "+" : "-";

  // Format the offset as (GMT+HH:mm)
  const formattedOffset = `GMT${sign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

  // Get the user's timezone name
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Return the formatted timezone string
  return `${timezoneName} (${formattedOffset})`;
};

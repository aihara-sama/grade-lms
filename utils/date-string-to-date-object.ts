// Converts a date-time string in the format yyyy-MM-dd'T'HH:mm:ss into a JavaScript Date object
export const dateStringToDateObject = (dateString: string) => {
  // Split the date and time parts
  const [datePart, timePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Create a new Date object with the parsed values
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

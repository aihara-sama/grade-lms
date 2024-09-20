export const isSummerDaylight = (date1: Date, date2: Date) =>
  new Date(+date1).getTimezoneOffset() !== new Date(+date2).getTimezoneOffset();

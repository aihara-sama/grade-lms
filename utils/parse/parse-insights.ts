import { getWeekNames } from "@/utils/date/get-week-names";
import { format } from "date-fns";

export const parseInsights = (arr: { timestamp: string }[]) => {
  const weekNamesRec: Record<string, number> = {};

  getWeekNames().forEach((name) => {
    weekNamesRec[name] = 0;
  });

  const dayCounts = arr.reduce((acc, { timestamp }) => {
    const day = format(new Date(timestamp), "EE");

    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, weekNamesRec);

  const parsedInsights = Object.values(dayCounts);

  // If theres any data
  if (parsedInsights.some((el) => el !== 0)) return parsedInsights;

  return [];
};

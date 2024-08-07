import { getWeekNames } from "@/utils/get-week-names";
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

  return dayCounts;
};

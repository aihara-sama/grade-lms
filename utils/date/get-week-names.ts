import type { Locale } from "@/i18n/routing";
import { getDateLocale } from "@/utils/date/get-date-locale";
import { getWeekDays } from "@/utils/date/get-week-days";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { addDays, format, subWeeks } from "date-fns";

export const getWeekNames = (locale: Locale = "en") => {
  return getWeekDays(addDays(subWeeks(new Date(), 1), 1)).map((day) =>
    toCapitalCase(format(day, "EE", { locale: getDateLocale(locale) }))
  );
};

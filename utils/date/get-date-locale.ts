import type { Locale } from "@/i18n/routing";
import type { Locale as ILocale } from "date-fns/locale";

import { enUS, ru } from "date-fns/locale";

const locales: Record<Locale, ILocale> = {
  en: enUS,
  ru,
};

export const getDateLocale = (locale: Locale = "en") => locales[locale];

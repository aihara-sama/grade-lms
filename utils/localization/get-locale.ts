import { DEFAULT_LOCALE, locales } from "@/i18n/routing";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";

export const getLocale = (request: NextRequest): string | undefined => {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    // @ts-ignore locales are readonly
    locales
  );

  // @ts-ignore locales are readonly
  const locale = matchLocale(languages, locales, DEFAULT_LOCALE);

  return locale;
};

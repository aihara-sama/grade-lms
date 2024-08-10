import { i18n } from "@/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";

export const getLocale = (request: NextRequest): string | undefined => {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  // @ts-ignore locales are readonly
  const { locales } = i18n;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    // @ts-ignore locales are readonly
    locales
  );

  // @ts-ignore locales are readonly
  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
};

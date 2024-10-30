import type { Locale } from "@/i18n/routing";
import { DEFAULT_LOCALE, locales } from "@/i18n/routing";
import { createTranslator } from "next-intl";

export const loadMessages = async () => {
  const parts = window.location.pathname.split("/");

  // The locale will be the second element after the domain
  const locale = locales.includes(parts[1] as Locale)
    ? parts[1]
    : DEFAULT_LOCALE;

  const messages = await import(`@/public/messages/${locale}.json`);

  return createTranslator({ locale, messages });
};

import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export const locales = ["en", "ru"] as const;
export const DEFAULT_LOCALE = "en";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`@/public/messages/${locale}.json`)).default,
  };
});
export type Locale = (typeof locales)[number];

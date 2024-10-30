import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const DEFAULT_LOCALE = "en";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: {
    mode: "never",
  },
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);

export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];

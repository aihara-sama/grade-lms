import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: {
    mode: "never",
  },
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);

export const locales = ["en", "ru"] as const;
export const DEFAULT_LOCALE = "en";
export type Locale = (typeof locales)[number];

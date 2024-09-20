import { DEFAULT_LOCALE, locales } from "@/i18n";
import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";

const publicPages = [
  /\//,
  /\/sign-in/,
  /\/sign-up/,
  /\/subscription/,
  /\/dashboard\/lessons\/[\w-]+/,
];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "never",
});

export async function middleware(request: NextRequest) {
  const publicPathnameRegex = new RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.map((page) => page.source).join("|")})$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(request.nextUrl.pathname);

  // Run the intlMiddleware first to ensure locale is set
  const response = intlMiddleware(request);

  if (isPublicPage) {
    return response;
  }
  return updateSession(request, response);

  // Update session with the response from intlMiddleware
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

import { DEFAULT_LOCALE, locales } from "@/i18n";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";

const publicPages = [
  "/",
  "/sign-in",
  "/sign-up",
  "/subscription",
  "/dashboard/lessons/:*",
];

const intlMiddleware = createMiddleware({
  locales,
  localePrefix: "as-needed",
  defaultLocale: DEFAULT_LOCALE,
});

export async function middleware(request: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})?/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(request.nextUrl.pathname);
  console.log({
    isPublicPage,
  });

  if (isPublicPage) {
    return intlMiddleware(request);
  }

  const res = intlMiddleware(request);
  return updateSession(request, res);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next|.*\\..*).*)",
  ],
};

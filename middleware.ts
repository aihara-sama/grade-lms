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
  defaultLocale: DEFAULT_LOCALE,
});

export async function middleware(request: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})?/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(request.nextUrl.pathname);

  // Run the intlMiddleware first
  const intlResponse = intlMiddleware(request);

  if (isPublicPage) {
    return intlResponse;
  }

  // Update session after handling locale
  return updateSession(request, intlResponse);
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
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)",
  ],
};

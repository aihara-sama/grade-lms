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

  // Run the intlMiddleware first to ensure locale is set
  const response = intlMiddleware(request);

  if (isPublicPage) {
    return response;
  }

  // Update session with the response from intlMiddleware
  return updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)",
  ],
};

import { DEFAULT_LOCALE, locales } from "@/i18n";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix: "as-needed",
  defaultLocale: DEFAULT_LOCALE,
});

export async function middleware(request: NextRequest) {
  return updateSession(request, intlMiddleware(request));
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
    "/((?!api/send-notification|[a-zA-Z]{2}/sign-up|[a-zA-Z]{2}/sign-in|[a-zA-Z]{2}/dashboard/lessons/:*|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

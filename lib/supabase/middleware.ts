import { getLocale } from "@/utils/get-locale";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie in request and response to ensure consistency
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string) {
          // Remove cookie in request and response to ensure consistency
          request.cookies.delete(name);
          response.cookies.delete(name);
        },
      },
    }
  );

  const { error, data } = await supabase.auth.getUser();

  if (data.user) {
    response.cookies.set(
      "NEXT_LOCALE",
      data.user.user_metadata.preferred_locale
    );
  }

  const locale = getLocale(request);

  if (error)
    return NextResponse.redirect(
      new URL(
        `/${locale}/sign-up?redirect=${encodeURIComponent(request.url)}`,
        request.url
      )
    );

  return response;
}

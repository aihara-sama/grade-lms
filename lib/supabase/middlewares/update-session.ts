import { getLocale } from "@/utils/localization/get-locale";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const updateSession = async (
  request: NextRequest,
  response: NextResponse
) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("users")
      .select("preferred_locale")
      .eq("id", user.id)
      .maybeSingle();

    if (!data)
      return NextResponse.redirect(
        new URL(
          `/sign-in?redirect=${encodeURIComponent(request.url)}`,
          request.url
        )
      );

    response.cookies.set("NEXT_LOCALE", data.preferred_locale);
  }

  const locale = getLocale(request);

  if (error)
    return NextResponse.redirect(
      new URL(
        `/${locale}/sign-in?redirect=${encodeURIComponent(request.url)}`,
        request.url
      )
    );

  return response;
};

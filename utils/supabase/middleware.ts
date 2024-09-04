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

  const { error } = await supabase.auth.getUser();
  const locale = getLocale(request);

  console.log({ error });

  if (error)
    return NextResponse.redirect(new URL(`/${locale}/sign-up`, request.url));

  return response;
}

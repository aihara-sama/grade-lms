// Users
import { Role, type IUserMetadata } from "@/interfaces/user.interface";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  const amount = +req.nextUrl.searchParams.get("amount");
  const result = [];
  let i = 0;

  for await (const password of new Array(amount).fill("1111111")) {
    const newUser = {
      email: `${i + 1}@mail.ru`,
      password,
      user_metadata: {
        name: `${i + 1}`,
        creator_id: user.id,
        role: Role.Student,
        avatar: "default-avatar.jpg",
        preferred_locale: "en",
        timezone: "Europe/Chisinau",
        is_emails_on: true,
        is_push_notifications_on: true,
      } as IUserMetadata,
      email_confirm: true,
    };
    result.push(await supabaseAdmin.auth.admin.createUser(newUser));
    i += 1;
  }

  return Response.json({ errors: result.map(({ error }) => error?.message) });
}

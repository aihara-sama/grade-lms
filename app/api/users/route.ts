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

  const result = await Promise.all(
    new Array(amount).fill("0").map((_, idx) => {
      const newUser = {
        email: `${idx + 1}@mail.ru`,
        password: "1111111",
        user_metadata: {
          name: `${idx + 1}`,
          creator_id: user.id,
          role: Role.Student,
          avatar: "default-avatar.jpg",
          preferred_locale: "en",
          timezone: "Europe/Chisinau",
        } as IUserMetadata,
        email_confirm: true,
      };
      return supabaseAdmin.auth.admin.createUser(newUser);
    })
  );

  return Response.json({ errors: result.map(({ error }) => error?.message) });
}

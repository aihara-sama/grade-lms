// Users
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const amount = +req.nextUrl.searchParams.get("amount");
  const result = [];

  let i = +req.nextUrl.searchParams.get("from") || 0;

  for await (const title of new Array(amount).fill("title")) {
    result.push(
      await createClient()
        .from("courses")
        .insert({
          title: `${title}${i}`,
        })
    );
    i += 1;
  }

  return Response.json({ errors: result.map(({ error }) => error?.message) });
}

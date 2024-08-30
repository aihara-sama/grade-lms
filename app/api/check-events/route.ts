import { db } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: users, error: usersError } = await db.rpc(
    "get_upcoming_lessons_users"
  );

  if (usersError) throw new Error("Failed to get lessons' users");

  fetch(process.env.SUPABASE_SEND_EMAIL_LAMBDA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ users }),
  });

  return NextResponse.json({
    status: "OK",
    users,
  });
}

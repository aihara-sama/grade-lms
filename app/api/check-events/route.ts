import { db } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: users, error: usersError } = await db.rpc(
    "get_upcoming_lessons_users"
  );

  if (usersError) throw new Error("Failed to get lessons' users");

  return NextResponse.json({
    status: "OK",
    users,
  });
}

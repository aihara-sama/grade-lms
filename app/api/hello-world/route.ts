import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Hellow world");

  console.log();

  const { data } = await createClient()
    .from("users")
    .select("*")
    .eq("id", "5c24014f-d3a5-4943-8e7e-d6f5d1cb29d8");

  return NextResponse.json({
    status: "ok",
    data: JSON.stringify(data),
    session: JSON.stringify(await createClient().auth.getSession()),
  });
}

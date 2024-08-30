import { NextResponse } from "next/server";

export async function GET() {
  console.log("Hellow world");

  return NextResponse.json({
    status: "ok",
  });
}

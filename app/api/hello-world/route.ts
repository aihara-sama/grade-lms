import { NextResponse } from "next/server";

export async function GET() {
  console.log("Hello World");
  return NextResponse.json({
    status: "ok",
  });
}
